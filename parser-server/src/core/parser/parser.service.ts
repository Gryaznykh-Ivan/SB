import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BotAction, BotStatus, ProductStatus } from '@prisma-parser';
import { PriceService } from 'src/utils/price/price.service';
import { ParserDBService } from '../../db/parser/parser.service';
import { ShopService } from '../shop/shop.service';
import { RequestService } from 'src/utils/request/request.service';


@Injectable()
export class ParserService {
    constructor(
        private parser: ParserDBService,
        private shop: ShopService,
        private shopPrice: PriceService,
        private request: RequestService
    ) { }

    async getBotById(botId: string) {
        const bot = await this.parser.bot.findUnique({
            where: { id: botId }
        })

        if (bot === null) {
            throw new HttpException("Бот не найден", HttpStatus.BAD_REQUEST)
        }

        return {
            success: true,
            data: bot
        }
    }

    async start() {
        const bot = await this.parser.bot.findUnique({
            where: { id: process.env.BOT_ID },
            select: {
                status: true
            }
        })

        if (bot.status === BotStatus.ACTIVE) {
            throw new HttpException("Бот уже запущен", HttpStatus.BAD_REQUEST)
        }

        this.parse()

        return {
            success: true
        }
    }

    async complete() {
        const bot = await this.parser.bot.findUnique({
            where: { id: process.env.BOT_ID },
            select: {
                status: true
            }
        })

        if (bot.status === BotStatus.ACTIVE) {
            throw new HttpException("Бот уже запущен", HttpStatus.BAD_REQUEST)
        }

        this.parseRestProducts()

        return {
            success: true
        }
    }

    private async parseRestProducts() {
        try {
            const provider = await this.shop.getStockxProvider()
            const deliveryProfile = await this.shop.getDefaultDeliveryProfile()

            await this.parser.bot.update({
                where: { id: process.env.BOT_ID },
                data: {
                    status: BotStatus.ACTIVE,
                    action: BotAction.RECEIVING_PRODUCTS_FROM_STOCKX
                }
            })

            await this.getStockxProducts();

            await this.parser.bot.update({
                where: { id: process.env.BOT_ID },
                data: {
                    status: BotStatus.ACTIVE,
                    action: BotAction.UPDATEING_PRODUCTS
                }
            })

            await this.updateShopProducts(provider, deliveryProfile);
        } catch (e) {
            
        }

        await this.parser.bot.update({
            where: { id: process.env.BOT_ID },
            data: {
                status: BotStatus.INACTIVE,
                action: BotAction.REST
            }
        })
    }

    @Cron('0 0 */3 * *')
    private async parse() {
        try {
            const provider = await this.shop.getStockxProvider()
            const deliveryProfile = await this.shop.getDefaultDeliveryProfile()

            await this.parser.bot.update({
                where: { id: process.env.BOT_ID },
                data: {
                    status: BotStatus.ACTIVE,
                    action: BotAction.RECEIVING_PRODUCTS_FROM_SHOP
                }
            })

            await this.getShopProducts(provider);

            await this.parser.bot.update({
                where: { id: process.env.BOT_ID },
                data: {
                    status: BotStatus.ACTIVE,
                    action: BotAction.RECEIVING_PRODUCTS_FROM_STOCKX
                }
            })

            await this.getStockxProducts();

            await this.parser.bot.update({
                where: { id: process.env.BOT_ID },
                data: {
                    status: BotStatus.ACTIVE,
                    action: BotAction.UPDATEING_PRODUCTS
                }
            })

            await this.updateShopProducts(provider, deliveryProfile);
        } catch (e) {
            
        }

        await this.parser.bot.update({
            where: { id: process.env.BOT_ID },
            data: {
                status: BotStatus.INACTIVE,
                action: BotAction.REST
            }
        })
    }

    private async getStockxProducts() {
        let fetcher = await this.request.getFetcher()

        const limit = 10;
        let hasNextPage = true

        do {
            const products = await this.parser.product.findMany({
                where: {
                    status: ProductStatus.WAITING_STOCKX_DATA
                },
                select: {
                    id: true,
                    stockx: true,
                },
                skip: 0,
                take: limit,
                orderBy: {
                    updatedAt: 'asc'
                }
            })

            for (const product of products) {
                const data: any = await this.getStockxProduct(fetcher, product.stockx).catch(async () => {
                    await this.parser.product.update({
                        where: { id: product.id },
                        data: {
                            status: ProductStatus.ERROR
                        }
                    })

                    fetcher = await this.request.getFetcher()
                    return null
                })

                if (data === null) continue

                try {
                    await this.parser.$transaction(async tx => {
                        await tx.product.update({
                            where: { id: product.id },
                            data: {
                                status: ProductStatus.WAITING_SHOP_UPDATE
                            }
                        })

                        const variants = Object.values(data.Product.children) as any
                        for (const variant of variants) {
                            const price = variant.market.lowestAsk
                            let size = variant.market.lowestAskSize

                            if (size === null) continue
                            if (price === 0) continue

                            size = size.replace(/[^0-9.]/gi, "") || size

                            await tx.variant.updateMany({
                                where: {
                                    productId: product.id,
                                    searchTitle: size
                                },
                                data: {
                                    price: price
                                }
                            })
                        }
                    })
                } catch (e) {
                    await this.parser.product.update({
                        where: { id: product.id },
                        data: {
                            status: ProductStatus.ERROR
                        }
                    })
                }
            }

            hasNextPage = products.length === limit
        } while (hasNextPage === true)
    }

    private async getShopProducts({ id: providerId }: { id: number }) {
        await this.parser.product.deleteMany({})

        const limit = 250;
        let skip = 0;
        let hasNextPage = true

        do {
            const products = await this.shop.getProducts({ skip, limit, providerId })

            for (const product of products) {
                if (product.stockx === undefined) continue;

                await this.parser.product.create({
                    data: {
                        id: product.id,
                        title: product.title,
                        pfactor: isNaN(+product.pfactor) === false ? product.pfactor : "1",
                        pamount: isNaN(+product.pamount) === false ? Math.floor(Number(product.pamount) > 10 ? 10 : Number(product.pamount)) : 3,
                        stockx: product.stockx,
                        status: ProductStatus.WAITING_STOCKX_DATA,
                        variants: {
                            createMany: {
                                data: product.variants.map(variant => ({
                                    id: variant.id,
                                    title: variant.title,
                                    searchTitle: variant.title.replace(/[^0-9.]/gi, "") || variant.title,
                                    shopPrice: variant.shopPrice,
                                    shopAmount: variant.shopAmount,
                                }))
                            }
                        }
                    }
                })
            }

            hasNextPage = products.length === limit
            skip += limit
        } while (hasNextPage === true)
    }


    private async updateShopProducts(provider: { id: number }, deliveryProfile: { id: number }) {
        const setting = await this.parser.settings.findUnique({ where: { id: process.env.BOT_ID } })

        const limit = 10;
        let hasNextPage = true

        do {
            const products = await this.parser.product.findMany({
                where: {
                    status: ProductStatus.WAITING_SHOP_UPDATE
                },
                select: {
                    id: true,
                    pfactor: true,
                    pamount: true,
                    variants: {
                        select: {
                            id: true,
                            price: true,
                            shopPrice: true,
                            shopAmount: true
                        }
                    }
                },
                skip: 0,
                take: limit,
                orderBy: {
                    updatedAt: 'asc'
                }
            })

            if (products.length === 0) break;

            for (const product of products) {
                try {
                    let sum = 0, count = 0;
                    for (const variant of product.variants) {
                        if (variant.price !== null && variant.price < 5000) {
                            sum += variant.price;
                            count++;
                        }
                    }

                    const averagePrice = count ? Number((sum / count).toFixed(2)) : 0

                    for (const variant of product.variants) {
                        if (variant.price !== null && variant.price < averagePrice * 4) {
                            const price = this.shopPrice.getShopPrice(variant.price, Number(product.pfactor), setting)
                            const offerPrice = this.shopPrice.getPrice(variant.price, setting)

                            if (Number(price) === Number(variant.shopPrice) && variant.shopAmount === product.pamount) continue;

                            await this.shop.upsertOffers({
                                variantId: variant.id,
                                userId: provider.id,
                                deliveryProfileId: deliveryProfile.id,
                                price: price,
                                offerPrice: offerPrice,
                                amount: product.pamount
                            })
                        }
                    }
                } catch (e) {
                    await this.parser.product.update({
                        where: { id: product.id },
                        data: {
                            status: ProductStatus.ERROR
                        }
                    })
                }

                await this.parser.product.update({
                    where: { id: product.id },
                    data: {
                        status: ProductStatus.DONE
                    }
                })
            }

            hasNextPage = products.length === limit
        } while (hasNextPage === true)
    }


    private getStockxProduct = async (fetcher, handle: string) => {
        return new Promise(async (resolve, reject) => {
            try {
                await new Promise<void>((res) => setTimeout(() => res(), 5000)) // Ожидание 5 секунд

                const response = await fetcher(`https://stockx.com/api/products/${handle}?includes=market,360&currency=USD&country=PL`);
                const result = await response.json()
                
                return resolve(result)
            } catch (e) {
                
                return reject(null)
            }
        })
    }
}