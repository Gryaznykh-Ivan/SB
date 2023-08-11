import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router';
import React from 'react'
import { useGetVariantsQuery } from '@/services/variantService';
import { IErrorResponse, IVariantSearch } from '@/types/api';
import ImageLoader from '../../image/ImageLoader';

interface IProps {
    productId: number;
    createNewVariant?: boolean;
}

export default function VariantList({ productId, createNewVariant = true }: IProps) {
    const router = useRouter()

    const { isError, error, isLoading, data } = useGetVariantsQuery({ productId })

    return (
        <div className="rounded-md bg-white shadow-sm overflow-hidden">
            <h2 className="font-semibold p-5 border-b-[1px]">Варианты</h2>
            <div className="divide-y-[1px] max-h-[392px] overflow-auto">
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
                {createNewVariant === false && isLoading === false && data?.data.length === 0 &&
                    <div className="flex justify-center bg-white p-5">
                        Вариантов пока нет
                    </div>
                }
                {isLoading === false && data?.data &&
                    <>
                        {
                            data.data.map(variant => (
                                <Link key={variant.id} href={`/products/${productId}/variants/${variant.id}`} className="flex justify-between pl-2 pr-4 py-3 hover:bg-gray-200">
                                    <div className="font-medium">{variant.title}</div>
                                    <div className="text-end text-gray-500">
                                        <div className="">{Number(variant.price) === 0 ? "Пусто" : `от ${variant.price}`}</div>
                                    </div>
                                </Link>
                            ))
                        }
                    </>
                }
                <div className=""></div>
            </div>
            {
                createNewVariant &&
                <div className="space-y-4 p-2">
                    <Link href={`/products/${productId}/variants/new`} className="flex p-2 text-blue-800 rounded-md">
                        <svg className="stroke-blue-800" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 9V12M12 12V15M12 12H15M12 12H9M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12Z" stroke="inherit" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="ml-2">Добавить вариант</span>
                    </Link>
                </div>
            }
        </div >
    )
}
