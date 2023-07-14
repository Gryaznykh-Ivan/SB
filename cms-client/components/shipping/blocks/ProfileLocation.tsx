import React, { useEffect, useState } from 'react'
import { DeliveryProfileUpdateRequest } from '@/types/api';
import CountriesSmartInput from '../../inputs/CountriesSmartInput';
import Input from '../../inputs/Input'
import Select from '../../inputs/Select';
import TextArea from '../../inputs/TextArea'
import CitiesSmartInput from '@/components/inputs/CitiesSmartInput';

interface IProps {
    country: string | null;
    city: string | null;
    address: string | null;
    onChange: (obj: DeliveryProfileUpdateRequest) => void;
}

export default function ProfileLocation({ onChange, ...data }: IProps) {
    const [state, setState] = useState({
        country: data.country ?? "",
        city: data.city ?? "",
        address: data.address ?? "",
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

    return (
        <div className="rounded-md bg-white shadow-sm">
            <div className="flex justify-between items-center p-5 border-b-[1px]">
                <h2 className="font-semibold pl-1">Местоположение</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 p-5">
                <div className="flex flex-col">
                    <label htmlFor="title" className="text-sm text-gray-600 mb-1">Страна</label>
                    <CountriesSmartInput id="country" placeholder="Страна" name="country" value={state.country} onChange={onInputChange} />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="location" className="text-sm text-gray-600 mb-1">Город</label>
                    <CitiesSmartInput id="city" region={state.country || undefined} placeholder="Город" name="city" value={state.city} onChange={onInputChange} />
                </div>
                <div className="flex flex-col col-span-2">
                    <label htmlFor="location" className="text-sm text-gray-600 mb-1">Адрес</label>
                    <Input type="text" id="address" placeholder="Адрес" name="address" value={state.address} onChange={onInputChange} />
                </div>
            </div>
        </div>
    )
}
