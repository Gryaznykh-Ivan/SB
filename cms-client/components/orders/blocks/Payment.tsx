/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useMemo, useState } from 'react'
import { CollectionCreateRequest, CollectionUpdateRequest, ICollectionProduct, IErrorResponse, IOfferSearch, IOrderProduct, IProduct } from '@/types/api';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useConfirmPaymentMutation } from '@/services/orderService';
import { Service } from '@/types/store';


interface IProps {
    orderId: number | null;
    offers: IOrderProduct[];
    priceDiffrence: number;
}

export default function Payment({ orderId, offers, priceDiffrence }: IProps) {
    const [confirmPayment, { isSuccess, isError, error }] = useConfirmPaymentMutation()

    useEffect(() => {
        if (isSuccess) {
            toast.success("Счет закрыт")
        }

        if (isError) {
            if (error && "status" in error) {
                toast.error((error.data as IErrorResponse)?.message)
            } else {
                toast.error("Произошла неизвесная ошибка")
            }
        }
    }, [isSuccess, isError])

    const onConfirmPayment = () => {
        if (orderId !== null) {
            confirmPayment({ orderId })
        }
    }

    return (
        <div className="rounded-md bg-white shadow-sm">
            <div className="p-5 border-b-[1px] flex justify-between items-center">
                <h2 className="font-semibold">Оплата</h2>
            </div>
            <div className="p-5 space-y-1">
                <div className="grid grid-cols-4 gap-5 text-gray-600 text-sm">
                    <div className="">Подытог</div>
                    <div className="col-span-3 flex justify-between">
                        <div className=""></div>
                        <div className="">2000₽</div>
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-4 text-gray-600 text-sm">
                    <div className="cursor-pointer hover:underline hover:text-black">Выбрать доставку</div>
                    <div className="col-span-3 flex justify-between">
                        <div className=""></div>
                        <div className="">0₽</div>
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-4 text-gray-600 text-sm">
                    <div className="cursor-pointer hover:underline hover:text-black">Изменить доставку</div>
                    <div className="col-span-3 flex justify-between">
                        <div className="">СДЭК быстро 3 дня</div>
                        <div className="">2000₽</div>
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-4 text-gray-600 text-sm">
                    <div className="cursor-pointer hover:underline hover:text-black">Выбрать скидку</div>
                    <div className="col-span-3 flex justify-between">
                        <div className=""></div>
                        <div className="">2000₽</div>
                    </div>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                    <div className="">Итог</div>
                    <div className="">1000₽</div>
                </div>
            </div>
            {orderId !== null && priceDiffrence !== 0 &&
                <>
                    <div className="p-5 border-t-[1px]">
                        <div className="flex justify-between">
                            <div className="">
                                <div className="text-sm text-gray-500">{priceDiffrence > 0 ? "Покупатель должен оплатить:" : "Магазин должн закрыть задолжность:"}</div>
                                <div className="">{Math.abs(priceDiffrence)}₽</div>
                            </div>
                            <button className="border-gray-400 border-[1px] px-4 py-2 font-medium rounded-md text-sm" onClick={onConfirmPayment}>Закрыть счет</button>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}
