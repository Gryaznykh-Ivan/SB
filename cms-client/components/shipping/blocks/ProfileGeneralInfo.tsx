import React, { useEffect, useState } from 'react'
import { DeliveryProfileUpdateRequest } from '@/types/api';
import CountriesSmartInput from '../../inputs/CountriesSmartInput';
import Input from '../../inputs/Input'
import Select from '../../inputs/Select';
import TextArea from '../../inputs/TextArea'

interface IProps {
    title: string | null;
    isDefault: boolean | null;
    onChange: (obj: DeliveryProfileUpdateRequest) => void;
}

export default function ProfileGeneralInfo({ onChange, ...data }: IProps) {
    const [state, setState] = useState({
        title: data.title ?? "",
        isDefault: data.isDefault ?? false
    })

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

    const onInputCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState(prev => ({ ...prev, [e.target.name]: e.target.checked }))
    }

    return (
        <div className="rounded-md bg-white shadow-sm p-5">
            <div className="space-y-4">
                <div className="flex flex-col md:col-span-2">
                    <label htmlFor="title" className="text-sm text-gray-600 mb-1">Название профиля</label>
                    <Input type="text" id="title" placeholder="Название профиля" name="title" value={state.title} onChange={onInputChange} />
                </div>
                <div className="flex items-center">
                    <input type="checkbox" className="rounded" id="isDefault" name="isDefault" checked={state.isDefault} onChange={onInputCheckboxChange} />
                    <label htmlFor="isDefault" className="text-sm text-gray-600 ml-3">Основной профиль доставки</label>
                </div>
            </div>
        </div>
    )
}
