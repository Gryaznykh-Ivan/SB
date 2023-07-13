import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OfferStatus, Prisma } from '@prisma/client';
import { PrismaService } from '@prisma-module/prisma.service';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateImageDto } from './dto/updateImage.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { CreateFeatureDto, UpdateFeatureDto } from './dto/features.dto';
import { UrlService } from 'src/utils/urls/urls.service';
import { SearchProductDto } from './dto/searchProduct.dto';
import { FilesService } from 'src/utils/files/files.service';

@Injectable()
export class ProductService {
    constructor(
        private prisma: PrismaService,
        private url: UrlService,
        private files: FilesService
    ) { }

    async getProductById(productId: number) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            select: {
                id: true,
                title: true,
                description: true,
                available: true,
                handle: true,
                metaTitle: true,
                metaDescription: true,
                vendor: true,
                type: true,
                sku: true,
                barcode: true,
                metafields: {
                    select: {
                        id: true,
                        key: true,
                        value: true
                    },
                    orderBy: {
                        id: 'asc'
                    }
                },
                tags: {
                    select: {
                        id: true,
                        title: true
                    }
                },
                images: {
                    select: {
                        id: true,
                        src: true,
                        alt: true,
                        position: true,
                    },
                    orderBy: {
                        position: 'asc'
                    }
                },
                collections: {
                    select: {
                        id: true,
                        title: true
                    },
                    orderBy: {
                        products: {
                            _count: 'desc'
                        }
                    }
                },
                features: {
                    select: {
                        id: true,
                        title: true,
                        position: true,
                        values: {
                            select: {
                                id: true,
                                position: true,
                                key: true,
                                value: true
                            },
                            orderBy: {
                                position: 'asc'
                            }
                        }
                    },
                    orderBy: {
                        position: 'asc'
                    }
                }
            }
        })

        if (product === null) {
            throw new HttpException("Товар не найден", HttpStatus.BAD_REQUEST)
        }

        return {
            success: true,
            data: product
        }
    }


    async getProductsBySearch(data: SearchProductDto) {
        const fulltextSearch = data.q ? data.q.replace(/[+\-<>()~*\"@]+/g, " ").replace(/\s+/g, " ").trim().split(" ").filter(word => word.length > 2).map(word => `+${word}*`).join(" ") : undefined
        const whereQuery = {
            AND: [{
                OR: [
                    {
                        title: {
                            search: fulltextSearch ? fulltextSearch : undefined,
                        },
                        vendor: {
                            search: fulltextSearch ? fulltextSearch : undefined,
                        },
                    }
                ]
            }, {
                available: data.available,
            }]
        }

        if (data.notInCollectionId !== undefined) {
            Object.assign(whereQuery, {
                collections: {
                    none: {
                        id: data.notInCollectionId
                    }
                }
            })
        }

        const products = await this.prisma.product.findMany({
            where: whereQuery,
            select: {
                id: true,
                images: {
                    select: {
                        id: true,
                        alt: true,
                        src: true,
                        position: true
                    },
                    orderBy: {
                        position: 'asc'
                    },
                    take: 1
                },
                title: true,
                available: true,
                vendor: true,
                type: true,
                variants: {
                    select: {
                        _count: {
                            select: {
                                offers: {
                                    where: {
                                        status: OfferStatus.ACTIVE
                                    }
                                }
                            }
                        }
                    }
                }
            },
            skip: data.skip,
            take: data.limit,
            orderBy: [{
                createdAt: 'desc'
            }]
        })

        const result = products.map(product => ({
            id: product.id,
            image: product.images[0] ?? null,
            title: product.title,
            available: product.available,
            vendor: product.vendor,
            offersCount: product.variants.reduce((a, c) => {
                return a + c._count.offers
            }, 0)
        }))

        return {
            success: true,
            data: result
        }
    }

    async createProduct(data: CreateProductDto) {
        const createProductQuery = {
            title: data.title,
            description: data.description,
            available: data.available,
            vendor: data.vendor,
            type: data.type,
            handle: this.url.getSlug(data.handle),
            metaTitle: data.metaTitle,
            metaDescription: data.metaDescription,
            sku: data.sku,
            barcode: data.barcode
        }

        if (data.connectCollections !== undefined) {
            Object.assign(createProductQuery, {
                collections: {
                    connect: data.connectCollections
                }
            })
        }

        if (data.createTags !== undefined) {
            Object.assign(createProductQuery, {
                tags: {
                    createMany: {
                        data: data.createTags ?? []
                    },
                }
            })
        }

        try {
            const product = await this.prisma.$transaction(async tx => {
                const product = await tx.product.create({
                    select: { id: true },
                    data: createProductQuery
                })

                if (data.createFeatures !== undefined) {
                    const lastFeature = await tx.feature.findFirst({
                        where: { productId: product.id },
                        select: { position: true },
                        orderBy: { position: 'desc' }
                    })

                    const startPosition = lastFeature !== null ? lastFeature.position + 1 : 0

                    for (const [index, feature] of data.createFeatures.entries()) {
                        await tx.feature.create({
                            data: {
                                title: feature.title,
                                position: startPosition + index,
                                productId: product.id,
                                values: {
                                    createMany: {
                                        data: feature.values.map((c, i) => ({ key: c.key, value: c.value, position: i, productId: product.id }))
                                    }
                                }
                            }
                        })
                    }
                }

                return product
            })

            return {
                success: true,
                data: product.id
            }
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    if (e.meta?.target === "feature_productId_title_key") {
                        throw new HttpException("Заголовок характеристик должен быть уникальным", HttpStatus.BAD_REQUEST)
                    } else {
                        throw new HttpException("Товар с таким handle уже существует", HttpStatus.BAD_REQUEST)
                    }
                }
            }

            throw new HttpException("Произошла ошибка на стороне сервера", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    async uploadImages(productId: number, images: Express.Multer.File[]) {
        const product = await this.prisma.product.findFirst({
            where: { id: productId },
            select: {
                title: true
            }
        })

        if (product === null) {
            throw new HttpException("Товар не найден", HttpStatus.BAD_REQUEST)
        }

        try {
            const result = await this.files.upload(images, 100);
            if (result.success !== true) {
                throw new HttpException("Загрузить картинки не удалось", HttpStatus.INTERNAL_SERVER_ERROR)
            }

            await this.prisma.$transaction(async tx => {
                const lastImage = await tx.image.findFirst({
                    where: { productId: productId },
                    select: { position: true },
                    orderBy: [{ position: 'desc' }]
                })

                const startPosition = lastImage !== null ? lastImage.position + 1 : 0
                const createImagesQuery = result.data.map((image, index) => ({
                    path: image.path,
                    src: image.src,
                    blurhash: image.blurhash,
                    alt: product.title,
                    position: startPosition + index,
                    productId: productId
                }))

                await tx.image.createMany({
                    data: createImagesQuery
                })
            })

            return {
                success: true
            }
        } catch (e) {

            throw new HttpException("Произошла ошибка на стороне сервера", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    async updateImage(productId: number, imageId: number, data: UpdateImageDto) {
        try {
            await this.prisma.$transaction(async tx => {
                if (data.src !== undefined || data.alt !== undefined) {
                    await tx.image.update({
                        where: { id: imageId },
                        data: {
                            src: data.src,
                            alt: data.alt
                        }
                    })
                }

                if (data.position !== undefined) {
                    const current = await tx.image.findFirst({
                        where: {
                            id: imageId
                        },
                        select: {
                            id: true,
                            position: true
                        }
                    })

                    await tx.image.updateMany({
                        where: {
                            productId,
                            position: data.position
                        },
                        data: {
                            position: current.position
                        }
                    })

                    await tx.image.update({
                        where: {
                            id: imageId
                        },
                        data: {
                            position: data.position
                        }
                    })
                }
            })

            return {
                success: true,
            }
        } catch (e) {
            throw new HttpException("Произошла ошибка на стороне сервера", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async removeImage(productId: number, imageId: number) {
        try {
            await this.prisma.$transaction(async tx => {
                await tx.image.update({
                    where: { id: imageId },
                    data: {
                        productId: null
                    }
                })

                const images = await tx.image.findMany({
                    where: { productId },
                    select: { id: true },
                    orderBy: { position: 'asc' }
                })

                for (const [index, image] of images.entries()) {
                    await tx.image.update({
                        where: {
                            id: image.id
                        },
                        data: {
                            position: +index
                        }
                    })
                }
            })

            return {
                success: true,
            }
        } catch (e) {

            throw new HttpException("Произошла ошибка на стороне сервера", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async updateProduct(productId: number, data: UpdateProductDto) {
        const updateProductQuery = {
            title: data.title,
            description: data.description,
            available: data.available,
            vendor: data.vendor,
            type: data.type,
            handle: this.url.getSlug(data.handle),
            metaTitle: data.metaTitle,
            metaDescription: data.metaDescription,
            sku: data.sku,
            barcode: data.barcode
        }


        if (data.connectCollections !== undefined || data.disconnectCollections !== undefined) {
            Object.assign(updateProductQuery, {
                collections: {
                    disconnect: data.disconnectCollections ?? [],
                    connect: data.connectCollections ?? [],
                }
            })
        }

        if (data.createMetafields !== undefined || data.deleteMetafields !== undefined) {
            Object.assign(updateProductQuery, {
                metafields: {
                    deleteMany: data.deleteMetafields ?? [],
                    createMany: {
                        data: data.createMetafields ?? []
                    },
                }
            })
        }

        if (data.createTags !== undefined || data.deleteTags !== undefined) {
            Object.assign(updateProductQuery, {
                tags: {
                    deleteMany: data.deleteTags ?? [],
                    createMany: {
                        data: data.createTags ?? []
                    },
                }
            })
        }

        try {
            await this.prisma.$transaction(async tx => {

                // Oбновляем метаполя
                if (data.updateMetafields !== undefined) {
                    for (const metafield of data.updateMetafields) {
                        await tx.metafield.update({
                            where: {
                                id: metafield.id
                            },
                            data: {
                                key: metafield.key,
                                value: metafield.value,
                            }
                        })
                    }
                }

                if (data.reorderFeatures !== undefined) {
                    for (const [index, feature] of data.reorderFeatures.entries()) {
                        await tx.feature.update({
                            where: {
                                id: feature.id
                            },
                            data: {
                                position: +index
                            }
                        })
                    }
                }

                if (data.createFeatures !== undefined) {
                    const lastFeature = await tx.feature.findFirst({
                        where: { productId: productId },
                        select: { position: true },
                        orderBy: { position: 'desc' }
                    })

                    const startPosition = lastFeature !== null ? lastFeature.position + 1 : 0

                    for (const [index, feature] of data.createFeatures.entries()) {
                        await tx.feature.create({
                            data: {
                                title: feature.title,
                                position: startPosition + index,
                                productId: productId,
                                values: {
                                    createMany: {
                                        data: feature.values.map((c, i) => ({ key: c.key, value: c.value, position: i, productId: productId }))
                                    }
                                }
                            }
                        })
                    }
                }

                if (data.deleteFeatures !== undefined) {
                    await tx.feature.deleteMany({
                        where: {
                            id: {
                                in: data.deleteFeatures.map(feature => feature.id)
                            }
                        }
                    })

                    const features = await tx.feature.findMany({
                        where: { productId: productId },
                        select: { id: true },
                        orderBy: { position: 'asc' }
                    })

                    for (const [index, feature] of features.entries()) {
                        await tx.feature.update({
                            where: {
                                id: feature.id
                            },
                            data: {
                                position: +index
                            }
                        })
                    }
                }

                if (data.updateFeatures !== undefined) {
                    for (const feature of data.updateFeatures) {

                        // Обновляем название
                        if (feature.title !== undefined) {
                            await tx.feature.update({
                                where: { id: feature.id },
                                data: { title: feature.title }
                            })
                        }

                        // определение другого порядка характеристик
                        if (feature.reorderValues !== undefined) {
                            for (const [index, value] of feature.reorderValues.entries()) {
                                await tx.featureValue.update({
                                    where: {
                                        id: value.id
                                    },
                                    data: {
                                        position: +index
                                    }
                                })
                            }
                        }

                        if (feature.createValues !== undefined) {
                            const lastFeatureValue = await tx.featureValue.findFirst({
                                where: { featureId: feature.id },
                                select: { position: true },
                                orderBy: [{ position: 'desc' }]
                            })

                            const startPosition = lastFeatureValue !== null ? lastFeatureValue.position + 1 : 0

                            await tx.feature.update({
                                where: { id: feature.id },
                                data: {
                                    values: {
                                        createMany: {
                                            data: feature.createValues.map((feature, index) => ({ key: feature.key, value: feature.value, position: startPosition + index, productId }))
                                        }
                                    }
                                }
                            })
                        }

                        // обновление характеристик
                        if (feature.updateValues !== undefined) {
                            for (const { id, key, value } of feature.updateValues) {
                                await tx.featureValue.update({
                                    where: { id },
                                    data: {
                                        key,
                                        value
                                    }
                                })

                            }
                        }

                        // удаление характеристик
                        if (feature.deleteValues !== undefined) {
                            await tx.featureValue.deleteMany({
                                where: {
                                    id: {
                                        in: feature.deleteValues.map(feature => feature.id)
                                    }
                                },
                            })

                            const featureValues = await tx.featureValue.findMany({
                                where: { featureId: feature.id },
                                select: { id: true },
                                orderBy: [{ position: 'asc' }]
                            })

                            for (const [index, value] of featureValues.entries()) {
                                await tx.featureValue.update({
                                    where: {
                                        id: value.id
                                    },
                                    data: {
                                        position: +index
                                    }
                                })
                            }
                        }
                    }
                }

                await tx.product.update({
                    where: {
                        id: productId
                    },
                    data: updateProductQuery
                })
            })

            return {
                success: true
            }
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    if (e.meta?.target === "feature_productId_title_key") {
                        throw new HttpException("Заголовок характеристик должен быть уникальным", HttpStatus.BAD_REQUEST)
                    } else if (e.meta?.target === "Metafield_productId_key_key") {
                        throw new HttpException("Ключи у метаполей должны быть уникальными", HttpStatus.BAD_REQUEST)
                    } else {
                        throw new HttpException("Товар с таким handle уже существует", HttpStatus.BAD_REQUEST)
                    }
                }
            }

            throw new HttpException("Произошла ошибка на стороне сервера", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async removeProduct(productId: number) {
        try {
            await this.prisma.$transaction(async tx => {
                await tx.product.delete({
                    where: { id: productId }
                })

                await tx.offer.updateMany({
                    where: {
                        status: {
                            notIn: [OfferStatus.SOLD, OfferStatus.NO_MATCH, OfferStatus.RETURNING]
                        },
                        variantId: null
                    },
                    data: {
                        status: OfferStatus.NO_MATCH
                    }
                })
            })

            return {
                success: true
            }
        } catch (e) {

            throw new HttpException("Произошла ошибка на стороне сервера", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}