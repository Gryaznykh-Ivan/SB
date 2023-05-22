/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import MainLayout from '@/components/layouts/Main'
import GeneralInfo from '@/components/variants/blocks/GeneralInfo'
import Media from '@/components/variants/blocks/Media'
import VariantList from '@/components/variants/blocks/VariantList'
import { useDeleteVariantMutation, useGetVariantByIdQuery, useUpdateVariantMutation } from '@/services/variantService'
import { IErrorResponse, VariantCreateRequest, VariantUpdateRequest } from '@/types/api'


function Variant() {
    const router = useRouter()

    const { isError, error, isLoading, data } = useGetVariantByIdQuery({ variantId: Number(router.query.variantId) }, { skip: router.query.variantId === undefined })
    const [updateVariant, { isSuccess: isUpdateVariantSuccess, isError: isUpdateVariantError, error: updateVariantError }] = useUpdateVariantMutation()
    const [deleteVariant, { isSuccess: isDeleteVariantSuccess, isError: isDeleteVariantError, error: deleteVariantError }] = useDeleteVariantMutation()

    const [changes, setChanges] = useState<VariantCreateRequest | VariantUpdateRequest>({})
    const onCollectChanges = (obj: VariantCreateRequest | VariantUpdateRequest) => {
        setChanges(prev => ({ ...prev, ...obj }))
    }

    useEffect(() => {
        if (isUpdateVariantSuccess) {
            setTimeout(() => toast.success("Вариант обновлен"), 100)
        }

        if (isUpdateVariantError) {
            if (updateVariantError && "status" in updateVariantError) {
                toast.error((updateVariantError.data as IErrorResponse)?.message)
            } else {
                toast.error("Произошла неизвесная ошибка")
            }
        }
    }, [isUpdateVariantSuccess, isUpdateVariantError])

    useEffect(() => {
        if (isDeleteVariantSuccess) {
            setTimeout(() => toast.success("Вариант удален"), 100)
        }

        if (isDeleteVariantError) {
            if (deleteVariantError && "status" in deleteVariantError) {
                toast.error((deleteVariantError.data as IErrorResponse)?.message)
            } else {
                toast.error("Произошла неизвесная ошибка")
            }
        }
    }, [isDeleteVariantSuccess, isDeleteVariantError])

    const onSaveChanges = async () => {
        const result = await updateVariant({ ...changes, variantId: Number(router.query.variantId) }).unwrap()
        if (result.success === true) {
            setChanges({})
        }
    }

    const onVariantDelete = async () => {
        const result = await deleteVariant({ variantId: Number(router.query.variantId) }).unwrap();
        if (result.success === true) {
            setChanges({})
            router.push(`/products/${router.query.productId}`)
        }
    }

    const mustBeSaved = useMemo(() => {
        return Object.values(changes).some(c => c !== undefined)
    }, [changes])


    return (
        <MainLayout>
            <div className="relative px-6 my-4 max-w-5xl mx-auto">
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
                    <div className="flex justify-center absolute bg-white border-gray-100 border-2 inset-x-0 p-5 shadow-md z-10 rounded-md ">
                        <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 3.99999V8.99999H4.582M4.582 8.99999C5.24585 7.35812 6.43568 5.9829 7.96503 5.08985C9.49438 4.1968 11.2768 3.8364 13.033 4.06513C14.7891 4.29386 16.4198 5.09878 17.6694 6.35377C18.919 7.60875 19.7168 9.24285 19.938 11M4.582 8.99999H9M20 20V15H19.419M19.419 15C18.7542 16.6409 17.564 18.015 16.0348 18.9073C14.5056 19.7995 12.7237 20.1595 10.9681 19.9309C9.21246 19.7022 7.5822 18.8979 6.33253 17.6437C5.08287 16.3896 4.28435 14.7564 4.062 13M19.419 15H15" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                }
                {!isLoading && data?.data &&
                    <>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Link href={`/products/${router.query.productId}`} className="p-2 font-bold border-[1px] border-gray-400 rounded-md">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10 19L3 12M3 12L10 5M3 12H21" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </Link>
                                <h1 className="text-xl font-medium">{data.data.options.map(({ option }) => data.data[`option${option}` as keyof typeof data.data]).join(" | ")}</h1>
                            </div>
                            <div className="flex justify-end">
                                <Link href={`/offers?q=${router.query.variantId}`} className="flex space-x-2 hover:bg-gray-300 p-2 text-gray-700 font-medium rounded-md">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 5H7C6.46957 5 5.96086 5.21071 5.58579 5.58579C5.21071 5.96086 5 6.46957 5 7V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V7C19 6.46957 18.7893 5.96086 18.4142 5.58579C18.0391 5.21071 17.5304 5 17 5H15M9 5C9 5.53043 9.21071 6.03914 9.58579 6.41421C9.96086 6.78929 10.4696 7 11 7H13C13.5304 7 14.0391 6.78929 14.4142 6.41421C14.7893 6.03914 15 5.53043 15 5M9 5C9 4.46957 9.21071 3.96086 9.58579 3.58579C9.96086 3.21071 10.4696 3 11 3H13C13.5304 3 14.0391 3.21071 14.4142 3.58579C14.7893 3.96086 15 4.46957 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                        <div className="my-4 flex flex-col space-y-4 pb-4 border-b-[1px] lg:flex-row lg:space-x-4 lg:space-y-0">
                            <div className="space-y-4 lg:w-80">
                                <VariantList
                                    productId={Number(router.query.productId)}
                                />
                            </div>
                            <div className="flex-1 space-y-4">
                                <GeneralInfo
                                    options={data.data.options}
                                    option0={data.data.option0}
                                    option1={data.data.option1}
                                    option2={data.data.option2}
                                    barcode={data.data.barcode}
                                    SKU={data.data.SKU}
                                    onChange={onCollectChanges}
                                />
                                <Media
                                    variantId={data.data.id}
                                    images={data.data.images}
                                />
                            </div>
                        </div>
                        <div className={`flex justify-between rounded-md ${mustBeSaved && "sticky left-10 right-0 bottom-4 bg-gray-800 p-4 transition-colors duration-200"}`}>
                            <div className="">
                                {mustBeSaved ?
                                    <button className="border-red-600 border-[1px] text-red-600 px-4 py-2 font-medium rounded-md hover:bg-red-700 hover:text-white" onClick={() => router.reload()}>Отменить</button>
                                    :
                                    <button className="border-red-600 border-[1px] text-red-600 px-4 py-2 font-medium rounded-md hover:bg-red-700 hover:text-white" onClick={onVariantDelete}>Удалить</button>
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

export default Variant
