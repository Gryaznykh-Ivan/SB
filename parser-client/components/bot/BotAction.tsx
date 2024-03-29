import React from 'react'

const actions = {
    REST: {
        text: "Отдыхаем",
        style: "text-gray-500"
    },
    RECEIVING_PRODUCTS_FROM_SHOP: {
        text: "Получаем список товаров магазина",
        style: "text-gray-500"
    },
    RECEIVING_PRODUCTS_FROM_STOCKX: {
        text: "Получаем цены товаров Stockx",
        style: "text-gray-500"
    },
    UPDATEING_PRODUCTS: {
        text: "Загружаем актуальные данные",
        style: "text-gray-500"
    }
}

interface IProps {
    action: string;
}

export default function BotAction({ action }: IProps) {
    return (
        <div className={actions[action as keyof typeof actions].style}>{actions[action as keyof typeof actions].text}</div>
    )
}
