import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'

import MainLayout from '@/components/layouts/Main'
import OrganizationInfo from '@/components/products/blocks/OrganizationInfo'
import GeneralInfo from '@/components/products/blocks/GeneralInfo'
import CreateSeoSearch from '@/components/products/blocks/CreateSeoSearch'
import Status from '@/components/products/blocks/Status'
import { useRouter } from 'next/router'
import { useCreateProductMutation } from '@/services/productService'
import { toast } from 'react-toastify'
import { IErrorResponse, ProductCreateRequest, ProductUpdateRequest } from '@/types/api'
import { useGetVariablesByGroupQuery } from '@/services/variableService'
import url from '@/utils/url'

function New() {
    const router = useRouter()

    const { data: seoSnippetProductData, isLoading: isSeoSnippetProductLoading } = useGetVariablesByGroupQuery({ group: "SEO_SNIPPET_PRODUCT" })

    const [createProduct, { isSuccess: isCreateProductSuccess, isError: isCreateProductError, error: createProductError, data }] = useCreateProductMutation()

    const [changes, setChanges] = useState<ProductCreateRequest>({})
    const onCollectChanges = (obj: ProductCreateRequest) => {
        setChanges(prev => ({ ...prev, ...obj }))
    }

    useEffect(() => {
        if (isCreateProductSuccess) {
            setTimeout(() => toast.success("Товар создан"), 100)
        }

        if (isCreateProductError) {
            if (createProductError && "status" in createProductError) {
                toast.error((createProductError.data as IErrorResponse)?.message)
            } else {
                toast.error("Произошла неизвесная ошибка")
            }
        }
    }, [isCreateProductSuccess, isCreateProductError])

    const getSnippetVariableByKey = (key: string) => {
        return seoSnippetProductData?.data.find(c => c.key === key)?.value ?? ""
    }

    const applySnippetFormat = (snippet: string, title: string, vendor: string, sku: string) => {
        if (title === "" && vendor === "" && sku === "") return ""

        return snippet.replaceAll("[title]", title.replace(/[^a-zA-Zа-яА-Я0-9 ]/gi, ""))
            .replaceAll("[vendor]", vendor)
            .replaceAll("[sku]", sku)
            .replace(/\s+/g, " ")
            .trim();
    }

    const onSaveChanges = async () => {
        const createProductData = changes

        const result = await createProduct(createProductData).unwrap()
        if (result.success === true) {
            setChanges({})
            router.push('/products/' + result.data)
        }
    }

    const mustBeSaved = useMemo(() => {
        return Object.values(changes).some(c => c !== undefined)
            && changes.title !== undefined
            && changes.handle !== undefined
            && changes.metaTitle !== undefined
            && changes.metaDescription !== undefined
    }, [changes])

    return (
        <MainLayout>
            <div className="px-6 my-4 max-w-5xl mx-auto">
                <div className="flex items-center space-x-4">
                    <Link href="/products" className="p-2 font-bold border-[1px] border-gray-400 rounded-md">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 19L3 12M3 12L10 5M3 12H21" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>
                    <h1 className="text-xl font-medium">Создание товара</h1>
                </div>
                <div className="my-4 flex flex-col space-y-4 pb-4 border-b-[1px] lg:flex-row lg:space-x-4 lg:space-y-0">
                    <div className="flex-1 space-y-4">
                        <GeneralInfo
                            title={null}
                            description={null}
                            onChange={onCollectChanges}
                        />
                        <CreateSeoSearch
                            metaTitle={applySnippetFormat(getSnippetVariableByKey("title"), changes.title ?? "", changes.vendor ?? "", changes.sku ?? "")}
                            metaDescription={applySnippetFormat(getSnippetVariableByKey("description"), changes.title ?? "", changes.vendor ?? "", changes.sku ?? "")}
                            handle={url.getSlug(changes.title)}
                            onChange={onCollectChanges}
                        />
                    </div>
                    <div className="space-y-4 lg:w-80">
                        <Status
                            available={false}
                            onChange={onCollectChanges}
                        />
                        <OrganizationInfo
                            sku={null}
                            type={null}
                            vendor={null}
                            collections={[]}
                            tags={[]}
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
        </MainLayout>
    )
}

export default New
