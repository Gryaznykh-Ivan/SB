import * as FormData from 'form-data';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OfferStatus, Prisma } from '@prisma/client';
import { PrismaService } from '@prisma-module/prisma.service';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateImageDto } from './dto/updateImage.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { firstValueFrom } from 'rxjs';
import { CreateOptionDto, UpdateOptionDto } from './dto/options.dto';
import { UrlService } from 'src/utils/urls/urls.service';
import { SearchProductDto } from './dto/searchProduct.dto';
import { FilesService } from 'src/utils/files/files.service';
import { Console } from 'console';

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
                SKU: true,
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
                options: {
                    select: {
                        id: true,
                        title: true,
                        position: true,
                        values: {
                            select: {
                                id: true,
                                position: true,
                                title: true,
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
            SKU: data.SKU,
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
            const product = await this.prisma.product.create({
                data: createProductQuery
            })

            return {
                success: true,
                data: product.id
            }
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    throw new HttpException("Товар с таким handle уже существует", HttpStatus.BAD_REQUEST)
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

                for (const [index, image] of Object.entries(images)) {
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


    async createOption(productId: number, data: CreateOptionDto) {
        const cOptions = await this.prisma.option.findMany({
            where: { productId },
            select: { option: true },
            orderBy: [{ option: 'asc' }]
        })

        if (cOptions.length >= 3) {
            throw new HttpException("Более 3 опций создать невозможно", HttpStatus.BAD_REQUEST)
        }

        let optionNumber = 0
        for (let i = 0; i < 3; i++) {
            if (cOptions[i] !== undefined && cOptions[i].option === i) continue

            optionNumber = i
            break
        }

        try {
            await this.prisma.$transaction(async tx => {
                const option = await tx.option.create({
                    data: {
                        title: data.title,
                        option: optionNumber,
                        position: cOptions.length,
                        productId: productId,
                        values: {
                            createMany: {
                                data: data.createOptionValues.map((option, i) => ({ title: option, position: i }))
                            }
                        }
                    },
                    select: {
                        productId: true,
                        product: {
                            select: {
                                SKU: true
                            }
                        }
                    }
                })


                // Получаем список оставшихся опций
                const options = await tx.option.findMany({
                    where: { productId: option.productId },
                    select: {
                        id: true,
                        option: true,
                        values: {
                            select: {
                                id: true,
                                title: true
                            },
                            orderBy: {
                                position: 'asc'
                            }
                        }
                    },
                    orderBy: { position: 'asc' }
                })


                // Удаляем все варианты, так как старых вариантов больше нет
                await tx.variant.deleteMany({
                    where: { productId: option.productId },
                })

                // Если остались какие то опции - создаем варианты на основе оставшихся опций
                if (options.length !== 0) {
                    const values = options.map(option => option.values.map(value => ({ ...value, option: option.option })))
                    const combinations = this.getCombinations(values)

                    await tx.variant.createMany({
                        data: combinations.map(combination => ({
                            productId: option.productId,
                            option0: combination.find(c => c.option === 0)?.title ?? null,
                            option1: combination.find(c => c.option === 1)?.title ?? null,
                            option2: combination.find(c => c.option === 2)?.title ?? null,
                            SKU: option.product.SKU
                        }))
                    })
                }

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

            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    throw new HttpException("Опции и знначения опций должны быть унимальными", HttpStatus.BAD_REQUEST)
                }
            }

            throw new HttpException("Произошла ошибка на стороне сервера", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async updateOption(productId: number, optionId: number, data: UpdateOptionDto) {
        const OptionUpdateQuery = {
            title: data.title
        }

        try {
            await this.prisma.$transaction(async tx => {
                if (data.createOptionValues !== undefined) {
                    const lastOptionValue = await tx.optionValue.findFirst({
                        where: { optionId },
                        select: { position: true },
                        orderBy: [{ position: 'desc' }]
                    })

                    const startPosition = lastOptionValue !== null ? lastOptionValue.position + 1 : 0

                    Object.assign(OptionUpdateQuery, {
                        values: {
                            createMany: {
                                data: data.createOptionValues.map((value, index) => ({ title: value.title, position: startPosition + index }))
                            }
                        }
                    })
                }

                // Обновляем опцию и сразу создаем значения у опции
                await tx.option.update({
                    where: { id: optionId },
                    data: OptionUpdateQuery
                })

                // обновление названий значений опций
                for (const { id, title } of data.updateOptionValues ?? []) {
                    const optionValue = await tx.optionValue.findFirst({
                        where: { id },
                        select: {
                            title: true,
                            option: {
                                select: {
                                    option: true
                                }
                            }
                        }
                    })

                    await tx.optionValue.update({
                        where: { id },
                        data: {
                            title
                        }
                    })

                    await tx.variant.updateMany({
                        where: { [`option${optionValue.option.option}`]: optionValue.title, productId },
                        data: {
                            [`option${optionValue.option.option}`]: title,
                        }
                    })

                    // Меняем название варианта у офферов
                    const offers = await tx.offer.findMany({
                        where: {
                            status: {
                                notIn: [OfferStatus.SOLD, OfferStatus.NO_MATCH, OfferStatus.RETURNING]
                            },
                            variant: {
                                productId: productId,
                            },
                            variantTitle: {
                                contains: optionValue.title,
                            }
                        },
                        select: {
                            id: true,
                            variantTitle: true,
                            variant: {
                                select: {
                                    option0: true,
                                    option1: true,
                                    option2: true,
                                    product: {
                                        select: {
                                            options: {
                                                select: {
                                                    title: true,
                                                    option: true,
                                                },
                                                orderBy: [{ position: 'asc' }]
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    })

                    for (const offer of offers) {
                        await tx.offer.update({
                            where: { id: offer.id },
                            data: {
                                variantTitle: offer.variant.product.options.map((option) => offer.variant[`option${option.option}`]).join(' | ')
                            }
                        })
                    }
                }

                if (data.reorderOptionValue !== undefined) {
                    const current = await tx.optionValue.findFirst({
                        where: {
                            id: data.reorderOptionValue.id
                        },
                        select: {
                            id: true,
                            position: true
                        }
                    })

                    await tx.optionValue.updateMany({
                        where: {
                            optionId,
                            position: data.reorderOptionValue.position
                        },
                        data: {
                            position: current.position
                        }
                    })

                    await tx.optionValue.update({
                        where: {
                            id: data.reorderOptionValue.id
                        },
                        data: {
                            position: data.reorderOptionValue.position
                        }
                    })
                }

                // удаление значений опций
                if (data.deleteOptionValues !== undefined) {
                    for (const id of data.deleteOptionValues ?? []) {
                        const deletedOptionValue = await tx.optionValue.delete({
                            where: { id },
                            select: {
                                title: true,
                                option: {
                                    select: {
                                        option: true
                                    }
                                }
                            }
                        })

                        await tx.variant.deleteMany({
                            where: { [`option${deletedOptionValue.option.option}`]: deletedOptionValue.title, productId },
                        })
                    }

                    // Убираем пустоту между positon, если она образовалась
                    const optionValues = await tx.optionValue.findMany({
                        where: { optionId },
                        select: { id: true },
                        orderBy: [{ position: 'asc' }]
                    })

                    for (const [index, value] of Object.entries(optionValues)) {
                        await tx.optionValue.update({
                            where: {
                                id: value.id
                            },
                            data: {
                                position: +index
                            }
                        })
                    }
                }

                // swap позиции у опций
                if (data.position !== undefined) {
                    const current = await tx.option.findFirst({
                        where: {
                            id: optionId
                        },
                        select: {
                            id: true,
                            position: true
                        }
                    })

                    await tx.option.updateMany({
                        where: {
                            productId,
                            position: data.position
                        },
                        data: {
                            position: current.position
                        }
                    })

                    await tx.option.update({
                        where: {
                            id: optionId
                        },
                        data: {
                            position: data.position
                        }
                    })
                }


                // Далее синхронизация опций и вариантов. Создаем варианты в соответствии с опциями
                const product = await tx.product.findUnique({
                    where: { id: productId },
                    select: {
                        SKU: true,
                        options: {
                            select: {
                                option: true,
                                values: {
                                    select: {
                                        id: true,
                                        title: true
                                    },
                                    orderBy: {
                                        position: 'asc'
                                    }
                                }
                            },
                            orderBy: { position: 'asc' }
                        }
                    }
                })

                const variantToCreate = []
                const values = product.options.map(option => option.values.map(value => ({ ...value, option: option.option })))
                const combinations = this.getCombinations(values)
                const allProductVariants = await tx.variant.findMany({
                    where: {
                        productId: productId
                    },
                    select: {
                        option0: true,
                        option1: true,
                        option2: true
                    }
                })

                for (const combination of combinations) {
                    const variant = allProductVariants.find(variant =>
                        variant.option0 === (combination.find(c => c.option === 0)?.title ?? null) &&
                        variant.option1 === (combination.find(c => c.option === 1)?.title ?? null) &&
                        variant.option2 === (combination.find(c => c.option === 2)?.title ?? null)
                    )

                    if (variant !== undefined) continue

                    variantToCreate.push({
                        productId: productId,
                        option0: combination.find(c => c.option === 0)?.title ?? null,
                        option1: combination.find(c => c.option === 1)?.title ?? null,
                        option2: combination.find(c => c.option === 2)?.title ?? null,
                        SKU: product.SKU
                    })
                }

                await tx.variant.createMany({
                    data: variantToCreate
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
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    throw new HttpException("Опции и знначения опций должны быть унимальными", HttpStatus.BAD_REQUEST)
                }
            }

            throw new HttpException("Произошла ошибка на стороне сервера", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async removeOption(optionId: number) {
        try {
            await this.prisma.$transaction(async tx => {
                // Удаление опции
                const option = await tx.option.delete({
                    where: { id: optionId },
                    select: {
                        productId: true,
                        option: true,
                        values: {
                            select: {
                                id: true,
                                title: true
                            }
                        },
                        product: {
                            select: {
                                SKU: true
                            }
                        }
                    }
                })

                // Получаем список оставшихся опций
                const options = await tx.option.findMany({
                    where: { productId: option.productId },
                    select: {
                        id: true,
                        option: true,
                        values: {
                            select: {
                                id: true,
                                title: true
                            },
                            orderBy: {
                                position: 'asc'
                            }
                        }
                    },
                    orderBy: { position: 'asc' }
                })

                // Меняем позиции. Tеперь они начинаются с 0
                for (const [index, option] of Object.entries(options)) {
                    await tx.option.update({
                        where: {
                            id: option.id
                        },
                        data: {
                            position: +index
                        }
                    })
                }

                // Удаляем все варианты, так как старых вариантов больше нет
                await tx.variant.deleteMany({
                    where: { productId: option.productId },
                })

                // Если остались какие то опции - создаем варианты на основе оставшихся опций
                if (options.length !== 0) {
                    const values = options.map(option => option.values.map(value => ({ ...value, option: option.option })))
                    const combinations = this.getCombinations(values)

                    await tx.variant.createMany({
                        data: combinations.map(combination => ({
                            productId: option.productId,
                            option0: combination.find(c => c.option === 0)?.title ?? null,
                            option1: combination.find(c => c.option === 1)?.title ?? null,
                            option2: combination.find(c => c.option === 2)?.title ?? null,
                            SKU: option.product.SKU
                        }))
                    })
                }

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
            SKU: data.SKU,
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

                // Обновляем название офферов
                if (data.title !== undefined) {
                    await tx.offer.updateMany({
                        where: {
                            status: {
                                notIn: [OfferStatus.SOLD, OfferStatus.NO_MATCH, OfferStatus.RETURNING]
                            },
                            variant: {
                                productId
                            }
                        },
                        data: {
                            productTitle: data.title
                        }
                    })
                }

                // Oбновляем метаполя
                for (const metafield of data.updateMetafields ?? []) {
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
                    if (e.meta?.target === "Metafield_productId_key_key") {
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

    private getCombinations = (arrays: { option: number; id: number; title: string; }[][]) => {
        return arrays.reduce((result: { option: number; id: number; title: string; }[][], array: { option: number; id: number; title: string; }[]) => {
            return result.reduce((newResult: { option: number; id: number; title: string; }[][], combination: { option: number; id: number; title: string; }[]) => {
                return newResult.concat(array.map((num: { option: number; id: number; title: string; }) => [...combination, num]));
            }, []);
        }, [[]]);
    }
}