import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OfferStatus, Prisma } from '@prisma/client';
import { PrismaService } from '@prisma-module/prisma.service';
import { CreateVariantDto } from './dto/createVariant.dto';
import { UpdateVariantDto } from './dto/updateVariant.dto';
import { SearchVariantDto } from './dto/searchVariant.dto';
import { FilesService } from 'src/utils/files/files.service';


@Injectable()
export class VariantService {
    constructor(
        private prisma: PrismaService,
        private files: FilesService,
    ) { }


    async getVariantsBySearch(data: SearchVariantDto) {
        const fulltextSearch = data.q ? data.q.replace(/[+\-<>()~*\"@]+/g, " ").replace(/\s+/g, " ").trim().split(" ").filter(word => word.length > 2).map(word => `+${word}*`).join(" ") : undefined
        const variants = await this.prisma.product.findMany({
            where: {
                title: {
                    search: fulltextSearch ? fulltextSearch : undefined,
                },
                vendor: {
                    search: fulltextSearch ? fulltextSearch : undefined,
                },
                variants: {
                    some: {}
                }
            },
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
                variants: {
                    select: {
                        id: true,
                        title: true
                    }
                },
            },
            skip: data.skip,
            take: data.limit,
            orderBy: [{
                createdAt: 'desc'
            }],
        })

        const result = variants.map(product => ({
            id: product.id,
            image: product.images[0] ?? null,
            title: product.title,
            variants: product.variants.map(variant => ({
                id: variant.id,
                title: variant.title
            }))
        }))

        return {
            success: true,
            data: result
        }
    }

    async getVariants(productId: number) {
        const variants = await this.prisma.variant.findMany({
            where: {
                productId
            },
            select: {
                id: true,
                title: true,
                offers: {
                    where: {
                        status: OfferStatus.ACTIVE
                    },
                    select: {
                        price: true
                    },
                    orderBy: [{ price: 'asc' }],
                    take: 1
                }
            }
        })

        const result = variants.map(variant => ({
            id: variant.id,
            title: variant.title,
            price: variant.offers[0]?.price ?? 0
        }))

        return {
            success: true,
            data: result
        }
    }

    async getPreview(variantId: number) {
        const variant = await this.prisma.variant.findUnique({
            where: { id: variantId },
            select: {
                id: true,
                title: true,
                product: {
                    select: {
                        id: true,
                        images: {
                            select: {
                                id: true,
                                src: true,
                                alt: true,
                                position: true,
                            },
                            orderBy: {
                                position: 'asc'
                            },
                            take: 1
                        },
                        title: true,
                    }
                }
            }
        })

        if (variant === null) {
            throw new HttpException("Вариант не найден", HttpStatus.BAD_REQUEST)
        }

        const result = {
            id: variant.id,
            product: variant.product.title,
            productId: variant.product.id,
            image: variant.product.images[0] ?? null,
            variant: variant.title,
        }

        return {
            success: true,
            data: result
        }
    }

    async getVariantById(variantId: number) {
        const variant = await this.prisma.variant.findUnique({
            where: { id: variantId },
            select: {
                id: true,
                title: true,
                barcode: true,
                sku: true
            }
        })

        if (variant === null) {
            throw new HttpException("Вариант не найден", HttpStatus.BAD_REQUEST)
        }

        const result = {
            id: variant.id,
            title: variant.title,
            barcode: variant.barcode,
            sku: variant.sku,
        }

        return {
            success: true,
            data: result
        }
    }

    async createVariant(data: CreateVariantDto) {
        const product = await this.prisma.product.findUnique({
            where: {
                id: data.productId,
            },
            select: {
                sku: true,
                barcode: true,
                variants: {
                    where: {
                        title: data.title,
                    },
                    take: 1
                }
            }
        })

        if (product === null) {
            throw new HttpException("Товар не найден", HttpStatus.BAD_REQUEST)
        }

        if (product.variants.length !== 0) {
            throw new HttpException("Вариант должен быть уникальным", HttpStatus.BAD_REQUEST)
        }

        const createVariantQuery = {
            title: data.title,
            sku: data.sku || product.sku,
            barcode: data.barcode || product.barcode,
            productId: data.productId
        }

        try {
            const variant = await this.prisma.variant.create({
                data: createVariantQuery
            })

            return {
                success: true,
                data: variant.id
            }
        } catch (e) {
            throw new HttpException("Произошла ошибка на стороне сервера", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    async updateVariant(variantId: number, data: UpdateVariantDto) {
        const updateVariantQuery = {
            title: data.title,
            sku: data.sku,
            barcode: data.barcode,
        }

        try {
            
            await this.prisma.variant.update({
                where: {
                    id: variantId
                },
                data: updateVariantQuery,
                select: {
                    title: true
                }
            })

            return {
                success: true
            }
        } catch (e) {
            if (e.name === HttpException.name) {
                throw new HttpException(e.message, e.status)
            }

            throw new HttpException("Произошла ошибка на стороне сервера", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async removeVariant(variantId: number) {
        try {
            await this.prisma.$transaction(async tx => {
                await tx.variant.delete({
                    where: { id: variantId }
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