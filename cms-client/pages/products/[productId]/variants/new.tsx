import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import MainLayout from '@/components/layouts/Main'
import GeneralInfo from '@/components/variants/blocks/GeneralInfo'
import VariantList from '@/components/variants/blocks/VariantList'
import { useCreateVariantMutation } from '@/services/variantService'
import { IErrorResponse, VariantCreateRequest, VariantUpdateRequest } from '@/types/api'

function New() {
    const router = useRouter()

    const [createVariant, { isSuccess: isCreateVariantSuccess, isError: isCreateVariantError, error: createVariantError }] = useCreateVariantMutation()

    const [changes, setChanges] = useState<VariantCreateRequest | VariantUpdateRequest>({})
    const onCollectChanges = (obj: VariantCreateRequest | VariantUpdateRequest) => {
        setChanges(prev => ({ ...prev, ...obj }))
    }

    useEffect(() => {
        if (isCreateVariantSuccess) {
            setTimeout(() => toast.success("Вариант создан"), 100)
        }

        if (isCreateVariantError) {
            if (createVariantError && "status" in createVariantError) {
                toast.error((createVariantError.data as IErrorResponse)?.message)
            } else {
                toast.error("Произошла неизвесная ошибка")
            }
        }
    }, [isCreateVariantSuccess, isCreateVariantError])

    const onSaveChanges = async () => {
        const result = await createVariant({ ...changes, productId: Number(router.query.productId) }).unwrap()
        if (result.success === true) {
            setChanges({})
            router.push(`/products/${router.query.productId}/variants/${result.data}`)
        }
    }

    const mustBeSaved = useMemo(() => {
        return Object.values(changes).some(c => c !== undefined)
    }, [changes])

    return (
        <MainLayout>
            <div className="relative px-6 my-4 max-w-5xl mx-auto">
                <div className="flex items-center space-x-4">
                    <Link href={`/products/${router.query.productId}`} className="p-2 font-bold border-[1px] border-gray-400 rounded-md">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 19L3 12M3 12L10 5M3 12H21" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>
                    <h1 className="text-xl font-medium">Создание варианта</h1>
                </div>
                <div className="my-4 flex flex-col space-y-4 pb-4 border-b-[1px] lg:flex-row lg:space-x-4 lg:space-y-0">
                    <div className="space-y-4 lg:w-80">
                        <VariantList
                            productId={Number(router.query.productId)}
                            createNewVariant={false}
                        />
                    </div>
                    <div className="flex-1 space-y-4">
                        <GeneralInfo
                            title={null}
                            barcode={null}
                            sku={null}
                            onChange={onCollectChanges}
                        />
                    </div>
                </div>
                <div className="flex justify-between">
                    <div className=""></div>
                    <div className="flex justify-end">
                        <button className={`${mustBeSaved ? "bg-green-600" : "bg-gray-300"} px-4 py-2 text-white font-medium rounded-md`} disabled={!mustBeSaved} onClick={onSaveChanges}>Создать</button>
                    </div>
                </div>
            </div>
        </MainLayout >
    )
}

export default New
