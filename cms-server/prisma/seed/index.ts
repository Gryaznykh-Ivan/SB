import { readFileSync } from 'fs'
import { resolve } from 'path'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const seed = async () => {
    // console.log("1) Managers data filling")
    // await managers()

    // console.log("2) Countries data filling")
    // await countries()


    // console.log("3) DeliveryProfiles data filling")
    // await deliveryProfiles()

    console.log("4) Settings data filling")
    await settings()
}

const settings = async () => {
    await prisma.variable.createMany({
        data: [
            {
                group: "SEO-SNIPPET",
                key: "title",
                value: "[vendor] [title] | brandname"
            },
            {
                group: "SEO-SNIPPET",
                key: "description",
                value: "Покупай кроссовки [title] в магазине brandname. Большой выбор оригинальной обуви [vendor]. Быстрая доставка по всей России."
            }
        ]
    })
}

const managers = async () => {
    await prisma.user.create({
        data: {
            id: 1,
            role: "ADMIN",
            firstName: "Stockx",
            lastName: "Provider",
            fullName: "Stockx Provider"
        }
    })

    await prisma.user.create({
        data: {
            id: 2,
            email: "gryaznykh.ivan@gmail.com",
            role: "ADMIN",
            firstName: "Иван",
            lastName: "Грязных",
            fullName: "Иван Грязных",
            permissions: {
                createMany: {
                    data: [
                        { right: "ORDER_READ" },
                        { right: "ORDER_UPDATE" },
                        { right: "PRODUCT_READ" },
                        { right: "PRODUCT_UPDATE" },
                        { right: "COLLECTION_READ" },
                        { right: "COLLECTION_UPDATE" },
                        { right: "OFFER_READ" },
                        { right: "OFFER_UPDATE" },
                        { right: "USER_READ" },
                        { right: "USER_UPDATE" },
                        { right: "SHIPPING_READ" },
                        { right: "SHIPPING_UPDATE" },
                        { right: "MEDIA_UPLOAD" },
                        { right: "MEDIA_DELETE" },
                        { right: "PAGE_READ" },
                        { right: "PAGE_UPDATE" },
                    ]
                }
            }
        }
    })
}

const countries = async () => {
    const data = JSON.parse(readFileSync(resolve(__dirname, "russia.json"), "utf-8"))

    const country = await prisma.country.create({
        data: {
            title: "Россия"
        },
        select: {
            id: true
        }
    })

    for (const region of Object.keys(data)) {
        await prisma.region.create({
            data: {
                title: region,
                countryId: country.id,
                cities: {
                    createMany: {
                        data: data[region].map(city => ({ title: city }))
                    }
                }
            }
        })
    }
}

const deliveryProfiles = async () => {
    const data = JSON.parse(readFileSync(resolve(__dirname, "profiles.json"), "utf-8"))

    for (const profile of data) {
        const createdProfile = await prisma.deliveryProfile.create({
            data: {
                title: profile.title
            },
            select: {
                id: true
            }
        })

        for (const zone of profile.zones) {
            await prisma.deliveryZone.create({
                data: {
                    deliveryProfileId: createdProfile.id,
                    country: zone.country,
                    region: zone.region,
                    options: {
                        createMany: {
                            data: zone.options.map(option => ({
                                title: option.title,
                                duration: option.duration,
                                price: option.price
                            }))
                        }
                    }
                }
            })
        }
    }
}

seed().then(async () => {
    await prisma.$disconnect()
}).catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
})