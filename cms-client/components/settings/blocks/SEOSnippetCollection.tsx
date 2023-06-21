import React, { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify';
import { productService } from '@/services/productService';
import { useGetVariablesByGroupQuery, useUpdateVariableMutation } from '@/services/variableService';
import { IErrorResponse } from '@/types/api';
import Input from '../../inputs/Input'
import TextArea from '../../inputs/TextArea'


export default function SEOSnippetCollection() {
    const { data, isLoading } = useGetVariablesByGroupQuery({ group: "SEO_SNIPPET_COLLECTION" })
    
    const [updateVariable, { isSuccess, isError, error }] = useUpdateVariableMutation()

    const [state, setState] = useState({
        title: "",
        description: ""
    })

    useEffect(() => {
        if (data?.data !== undefined) {
            const title = getVariableByKey("title")
            const description = getVariableByKey("description")

            setState(prev => ({
                ...prev,
                title: title,
                description: description,
            }))
        }
    }, [data])

    useEffect(() => {
        if (isSuccess) {
            toast.success("Шаблон снипета товара обновлен")
        }

        if (isError) {
            if (error && "status" in error) {
                toast.error((error.data as IErrorResponse)?.message)
            } else {
                toast.error("Произошла неизвесная ошибка")
            }
        }
    }, [isSuccess, isError])

    const getVariableByKey = (key: string) => {
        return data?.data.find(c => c.key === key)?.value ?? ""
    }

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const onSave = async () => {
        const updateVariables = Object.entries(state).filter(a => getVariableByKey(a[0]) !== a[1]).map(variable => ({
            group: "SEO_SNIPPET_COLLECTION",
            key: variable[0],
            value: variable[1]
        }))

        await updateVariable({ updateVariables }).unwrap()
    }

    const mustBeSaved = useMemo(() => {
        return Object.entries(state).some(a => getVariableByKey(a[0]) !== a[1])
    }, [state])

    return (
        <div className="rounded-md bg-white shadow-sm">
            <h2 className="font-semibold p-5 border-b-[1px]">SEO шаблон коллекции</h2>
            <div className="space-y-4 p-5">
                <div className="flex flex-col">
                    <div className="flex justify-between mb-1">
                        <label htmlFor="title" className="text-sm text-gray-600">Мета название</label>
                        <div className="text-gray-500 text-sm">{state.title.length} символов</div>
                    </div>
                    <Input type="text" id="title" placeholder="Мета название" name="title" value={state.title} onChange={onInputChange} />
                    <div className="text-gray-400 text-sm mt-1">Пример: Коллекция [title] | EXAMPLE</div>
                </div>
                <div className="flex flex-col">
                    <div className="flex justify-between mb-1">
                        <label htmlFor="description" className="text-sm text-gray-600">Мета описание</label>
                        <div className="text-gray-500 text-sm">{state.description.length} символов</div>
                    </div>
                    <TextArea id="description" placeholder="Mета описание" name="description" value={state.description} onChange={onInputChange} />
                    <div className="mt-1 text-sm text-gray-400">
                        <div className="">Пример: Новая коллекция [title] в магазине EXAMPLE</div>
                        <div className="">Переменные: [title]</div>
                    </div>
                </div>
            </div>
            {isLoading === false && mustBeSaved === true &&
                <div className="flex">
                    <button className="flex-1 border-t-[1px] font-medium bg-green-600 rounded-b-md text-white py-3" onClick={onSave}>Сохранить</button>
                </div>
            }
        </div>
    )
}
