import Link from 'next/link'
import { Router, useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import RouterSearchInput from '@/components/inputs/RouterSearchInput'
import SearchInput from '@/components/inputs/SearchInput'
import MainLayout from '@/components/layouts/Main'
import NavLink from '@/components/navigation/NavLink'
import OrderReturnStatus from '@/components/orders/cards/OrderReturnStatus'
import OrderStatus from '@/components/orders/cards/OrderStatus'
import PaymentStatus from '@/components/orders/cards/PaymentStatus'
import useDidMount from '@/hooks/useDidMount'
import { useLazyGetOrdersBySearchQuery } from '@/services/orderService'
import { IErrorResponse } from '@/types/api'


function Index() {
    const router = useRouter()
    const didMount = useDidMount()
    const itemPerPage = 20

    const [getOrdersBySearch, { isError, isFetching, data, error }] = useLazyGetOrdersBySearchQuery();
    const [query, setQuery] = useState({
        q: "",
        limit: itemPerPage,
        skip: 0,
        paymentStatus: router.query.paymentStatus as string ?? undefined,
        orderStatus: router.query.orderStatus as string ?? undefined,
    })

    useEffect(() => {
        setQuery(prev => ({ ...prev, limit: itemPerPage, skip: 0, q: router.query.q as string ?? undefined, paymentStatus: router.query.paymentStatus as string ?? undefined, orderStatus: router.query.orderStatus as string ?? undefined }))
    }, [router.query.q, router.query.paymentStatus, router.query.orderStatus])

    useEffect(() => {
        if (didMount === true) {
            getOrdersBySearch(query)
        }
    }, [query])

    const onNextPage = () => {
        if (data?.data.length !== itemPerPage) return

        setQuery(prev => ({ ...prev, skip: prev.skip + prev.limit }))
    }

    const onPrevPage = () => {
        if (query.skip === 0) return

        setQuery(prev => ({ ...prev, skip: prev.skip - prev.limit }))
    }


    return (
        <MainLayout>
            <div className="px-6 my-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-medium">Заказы</h1>
                    <div className="">
                        <Link href="/orders/new" className="block bg-green-700 px-4 py-2 text-white font-medium rounded-md">Создать</Link>
                    </div>
                </div>
                <div className="mt-4 px-4 bg-white rounded-md">
                    <div className="relative flex h-16 py-3 overflow-x-auto overflow-y-hidden pb-[17px] mb-[-17px]">
                        <div className="absolute whitespace-nowrap space-x-2 pb-2 border-b-[1px] md:left-0 md:right-0">
                            <NavLink href="/orders" query={{ paymentStatus: undefined, orderStatus: undefined }} className={({ isActive }) => `relative p-3 ${isActive ? "before:absolute" : "text-gray-400"} hover:before:absolute hover:before:bg-gray-500 before:left-0 before:bottom-0 before:rounded-lg before:bg-green-700 before:w-full before:h-[3px]`}>Все</NavLink>
                            <NavLink href="/orders" query={{ paymentStatus: "UNPAID", orderStatus: undefined }} className={({ isActive }) => `relative p-3 ${isActive ? "before:absolute" : "text-gray-400"} hover:before:absolute hover:before:bg-gray-500 before:left-0 before:bottom-0 before:rounded-lg before:bg-green-700 before:w-full before:h-[3px]`}>Не оплачено</NavLink>
                            <NavLink href="/orders" query={{ paymentStatus: undefined, orderStatus: "UNFULFILLED" }} className={({ isActive }) => `relative p-3 ${isActive ? "before:absolute" : "text-gray-400"} hover:before:absolute hover:before:bg-gray-500 before:left-0 before:bottom-0 before:rounded-lg before:bg-green-700 before:w-full before:h-[3px]`}>Не исполнено</NavLink>
                            <NavLink href="/orders" query={{ paymentStatus: undefined, orderStatus: "CANCELED" }} className={({ isActive }) => `relative p-3 ${isActive ? "before:absolute" : "text-gray-400"} hover:before:absolute hover:before:bg-gray-500 before:left-0 before:bottom-0 before:rounded-lg before:bg-green-700 before:w-full before:h-[3px]`}>Отменено</NavLink>
                            <NavLink href="/orders" query={{ paymentStatus: "NEED_TO_RETURN", orderStatus: undefined }} className={({ isActive }) => `relative p-3 ${isActive ? "before:absolute" : "text-gray-400"} hover:before:absolute hover:before:bg-gray-500 before:left-0 before:bottom-0 before:rounded-lg before:bg-green-700 before:w-full before:h-[3px]`}>Долги</NavLink>
                        </div>
                    </div>
                    <div className="pb-4 space-y-4 mt-4">
                        <div className="">
                            <RouterSearchInput placeholder="Поиск" />
                        </div>
                        <div className="relative block overflow-x-auto min-h-[68px]">
                            {isError &&
                                <div className="flex flex-col items-center py-5">
                                    <div className="text-2xl font-bold text-red-600">Что-то пошло не так</div>
                                    {(error && "status" in error) &&
                                        <div className="text-gray-500">{(error.data as IErrorResponse)?.message}</div>
                                    }
                                </div>
                            }
                            {isFetching &&
                                <div className="flex justify-center absolute bg-white border-gray-100 border-2 inset-x-0 p-5 shadow-md z-10 rounded-md ">
                                    <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 3.99999V8.99999H4.582M4.582 8.99999C5.24585 7.35812 6.43568 5.9829 7.96503 5.08985C9.49438 4.1968 11.2768 3.8364 13.033 4.06513C14.7891 4.29386 16.4198 5.09878 17.6694 6.35377C18.919 7.60875 19.7168 9.24285 19.938 11M4.582 8.99999H9M20 20V15H19.419M19.419 15C18.7542 16.6409 17.564 18.015 16.0348 18.9073C14.5056 19.7995 12.7237 20.1595 10.9681 19.9309C9.21246 19.7022 7.5822 18.8979 6.33253 17.6437C5.08287 16.3896 4.28435 14.7564 4.062 13M19.419 15H15" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            }
                            {data?.data &&
                                <table className="table-auto block max-w-0 lg:table lg:w-full lg:max-w-none">
                                    <thead>
                                        <tr className="border-b-[1px] text-sm">
                                            <th className="font-medium text-gray-500 text-start px-3 py-2">Заказ</th>
                                            <th className="font-medium text-gray-500 text-start px-3 py-2">Дата</th>
                                            <th className="font-medium text-gray-500 text-start px-3 py-2">Покупатель</th>
                                            <th className="font-medium text-gray-500 text-start px-3 py-2">Итог</th>
                                            <th className="font-medium text-gray-500 text-start px-3 py-2">Статус оплаты</th>
                                            <th className="font-medium text-gray-500 text-start px-3 py-2">Статус исполнения</th>
                                            <th className="font-medium text-gray-500 text-start px-3 py-2">Товары</th>
                                            <th className="font-medium text-gray-500 text-start px-3 py-2">Услуги</th>
                                            <th className="font-medium text-gray-500 text-start px-3 py-2 w-36">Статус возврата</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.data.map(order => (
                                            <tr
                                                key={order.id}
                                                className="border-b-[1px] hover:bg-gray-50 cursor-pointer"
                                                onClick={() => router.push(`/orders/${order.id}`)}
                                            >
                                                <td className="px-3 py-2 font-medium">№{order.id}</td>
                                                <td className="px-3 py-2">{new Date(order.createdAt).toLocaleString("ru-RU", { dateStyle: "short", timeStyle: "short" })}</td>
                                                <td className="px-3 py-2">{order.user}</td>
                                                <td className="px-3 py-2">{order.totalPrice}₽</td>
                                                <td className="px-3 py-2"><PaymentStatus status={order.paymentStatus} /></td>
                                                <td className="px-3 py-2"><OrderStatus status={order.orderStatus} /></td>
                                                <td className="px-3 py-2">{order.offersCount}</td>
                                                <td className="px-3 py-2">{order.servicesCount}</td>
                                                <td className="px-3 py-2"><OrderReturnStatus status={order.returnStatus} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            }
                        </div>
                        {(query.skip !== 0 || data?.data.length === itemPerPage) &&
                            <div className="flex justify-center mt-4 space-x-1">
                                <button className={`p-2 font-bold border-[1px] rounded-md ${query.skip === 0 && "bg-gray-100 cursor-not-allowed"}`} onClick={onPrevPage} disabled={query.skip === 0 || isFetching === true}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10 19L3 12M3 12L10 5M3 12H21" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                                <button className={`p-2 font-bold border-[1px] rounded-md ${data?.data.length !== itemPerPage && "bg-gray-100 cursor-not-allowed"}`} onClick={onNextPage} disabled={data?.data.length !== itemPerPage || isFetching === true}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14 5L21 12M21 12L14 19M21 12H3" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

export default Index