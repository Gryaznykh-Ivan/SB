import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'


import { useRouter } from 'next/router'
import MainLayout from '@/components/layouts/Main'
import Return from '@/components/orders/blocks/Return'
import TrackingInformation from '@/components/orders/blocks/TrackingInformation'
import ReturnStatus from '@/components/orders/blocks/ReturnPickStatus'
import { useDeleteReturnMutation, useGetReturnByIdQuery, useUpdateReturnMutation } from '@/services/orderService'
import { toast } from 'react-toastify'
import { OrderReturnUpdateRequest, IErrorResponse } from '@/types/api'



function Index() {
    const router = useRouter()

    const { isError, error, isLoading, data } = useGetReturnByIdQuery({ orderId: Number(router.query.orderId), returnId: Number(router.query.returnId) })

    const [updateReturn, { isSuccess: isUpdateReturnSuccess, isError: isUpdateReturnError, error: updateReturnError }] = useUpdateReturnMutation()
    const [deleteReturn, { isSuccess: isDeleteReturnSuccess, isError: isDeleteReturnError, error: deleteReturnError }] = useDeleteReturnMutation()

    const [changes, setChanges] = useState<OrderReturnUpdateRequest>({})
    const onCollectChanges = (obj: OrderReturnUpdateRequest) => {
        setChanges(prev => ({ ...prev, ...obj }))
    }

    useEffect(() => {
        if (isUpdateReturnSuccess) {
            setTimeout(() => toast.success("Возврат обновлен"), 100)
        }

        if (isUpdateReturnError) {
            if (updateReturnError && "status" in updateReturnError) {
                toast.error((updateReturnError.data as IErrorResponse)?.message)
            } else {
                toast.error("Произошла неизвесная ошибка")
            }
        }
    }, [isUpdateReturnSuccess, isUpdateReturnError])

    useEffect(() => {
        if (isDeleteReturnSuccess) {
            setTimeout(() => toast.success("Возврат удален"), 100)
        }

        if (isDeleteReturnError) {
            if (deleteReturnError && "status" in deleteReturnError) {
                toast.error((deleteReturnError.data as IErrorResponse)?.message)
            } else {
                toast.error("Произошла неизвесная ошибка")
            }
        }
    }, [isDeleteReturnSuccess, isDeleteReturnError])

    const onSaveChanges = async () => {
        const result = await updateReturn({
            orderId: Number(router.query.orderId),
            returnId: Number(router.query.returnId),
            ...changes
        }).unwrap()
        if (result.success === true) {
            setChanges({})

            if (changes.status === 'RETURNED') {
                router.push(`/orders/${router.query.orderId}`)
            }
        }
    }

    const mustBeSaved = useMemo(() => {
        return Object.values(changes).some(c => c !== undefined)
    }, [changes])

    const onReturnDelete = async () => {
        const result = await deleteReturn({
            returnId: Number(router.query.returnId),
            orderId: Number(router.query.orderId)
        }).unwrap();
        
        if (result.success === true) {
            setChanges({})
            router.push(`/orders/${router.query.orderId}`)
        }
    }


    return (
        <MainLayout>
            <div className="px-6 my-4 max-w-5xl mx-auto">
                {isError &&
                    <div className="flex flex-col items-center py-5">
                        <div className="text-2xl font-bold text-red-600">Что-то пошло не так</div>
                        {(error && "status" in error) &&
                            <div className="text-gray-500">{(error.data as IErrorResponse)?.message}</div>
                        }
                        <button className="text-blue-500 underline text-sm mt-4" onClick={() => router.back()}>Вернуться назад</button>
                    </div>
                }
                {isLoading &&
                    <div className="flex justify-center bg-white border-gray-100 border-2 p-5 shadow-md z-10 rounded-md ">
                        <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 3.99999V8.99999H4.582M4.582 8.99999C5.24585 7.35812 6.43568 5.9829 7.96503 5.08985C9.49438 4.1968 11.2768 3.8364 13.033 4.06513C14.7891 4.29386 16.4198 5.09878 17.6694 6.35377C18.919 7.60875 19.7168 9.24285 19.938 11M4.582 8.99999H9M20 20V15H19.419M19.419 15C18.7542 16.6409 17.564 18.015 16.0348 18.9073C14.5056 19.7995 12.7237 20.1595 10.9681 19.9309C9.21246 19.7022 7.5822 18.8979 6.33253 17.6437C5.08287 16.3896 4.28435 14.7564 4.062 13M19.419 15H15" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                }
                {!isLoading && data?.data &&
                    <>
                        <div className="flex items-center space-x-4">
                            <Link href={`/orders/${router.query.orderId}`} className="p-2 font-bold border-[1px] border-gray-400 rounded-md">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 19L3 12M3 12L10 5M3 12H21" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>
                            <h1 className="flex-1 text-xl font-medium">Возврат</h1>
                            <div className="flex items-center"></div>
                        </div>
                        <div className="my-4 flex flex-col space-y-4 pb-4 border-b-[1px] lg:flex-row lg:space-x-4 lg:space-y-0">
                            <div className="flex-1 space-y-4">
                                <Return
                                    id={data.data.id}
                                    offers={data.data.offers}
                                    status={data.data.status}
                                    hideEdit={true}
                                />
                                <TrackingInformation
                                    tracking={data.data.tracking}
                                    carrier={data.data.carrier}
                                    onChange={onCollectChanges}
                                />
                            </div>
                            <div className="space-y-4 lg:w-80">
                                <ReturnStatus
                                    status={data.data.status}
                                    onChange={onCollectChanges}
                                />
                            </div>
                        </div>
                        <div className={`flex justify-between rounded-md ${mustBeSaved && "sticky left-10 right-0 bottom-4 bg-gray-800 p-4 transition-colors duration-200"}`}>
                            <div className="">
                                {mustBeSaved ?
                                    <button className="border-red-600 border-[1px] text-red-600 px-4 py-2 font-medium rounded-md hover:bg-red-700 hover:text-white" onClick={() => router.reload()}>Отменить</button>
                                    :
                                    <button className="border-red-600 border-[1px] text-red-600 px-4 py-2 font-medium rounded-md hover:bg-red-700 hover:text-white" onClick={onReturnDelete}>Отменить</button>
                                }
                            </div>
                            <div className="flex justify-end">
                                <button className={`${mustBeSaved ? "bg-green-600" : "bg-gray-300"} px-4 py-2 text-white font-medium rounded-md`} disabled={!mustBeSaved} onClick={onSaveChanges}>Сохранить</button>
                            </div>
                        </div>
                    </>
                }
            </div>
        </MainLayout>
    )
}

export default Index
