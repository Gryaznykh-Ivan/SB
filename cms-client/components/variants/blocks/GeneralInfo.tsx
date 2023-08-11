import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { VariantCreateRequest, VariantUpdateRequest } from '@/types/api';
import Input from '../../inputs/Input'

interface IProps {
    title: string | null;
    barcode: string | null;
    sku: string | null;
    onChange: (obj: VariantCreateRequest | VariantUpdateRequest) => void;
}

export default function GeneralInfo({ onChange, ...data }: IProps) {
    const [state, setState] = useState({
        title: data.title ?? "",
        barcode: data.barcode ?? "",
        sku: data.sku ?? "",
    })

    useEffect(() => {
        setState({
            title: data.title ?? "",
            barcode: data.barcode ?? "",
            sku: data.sku ?? "",
        })
    }, [data.sku, data.barcode, data.title])

    useEffect(() => {
        const localState = Object.entries(state)
        const changes = localState.map(([key, value]) => {
            if (data[key as keyof typeof data] === null && value === "") {
                return [key, undefined]
            }

            if (data[key as keyof typeof data] !== null && value === "") {
                return [key, null]
            }

            if (data[key as keyof typeof data] === value) {
                return [key, undefined]
            }

            return [key, value]
        })


        onChange(Object.fromEntries(changes))
    }, [state])

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    return (
        <div className="rounded-md bg-white shadow-sm">
            <div className="p-5 border-b-[1px]">
                <h2 className="font-medium">Основное</h2>
            </div>
            <div className="p-5">
                <div className="space-y-4">
                    <div className="flex flex-col">
                        <label htmlFor="title" className="text-sm text-gray-600 mb-1">Название</label>
                        <Input type="text" id="title" placeholder="Название" name="title" value={data.title} onChange={onInputChange} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label htmlFor="sku" className="text-sm text-gray-600 mb-1">Артикул</label>
                            <Input type="text" id="sku" placeholder="Артикул" name="sku" value={state.sku} onChange={onInputChange} />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="barcode" className="text-sm text-gray-600 mb-1">Штрих-код</label>
                            <Input type="text" id="barcode" placeholder="Штрих-код" name="barcode" value={state.barcode} onChange={onInputChange} />
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}
