import React, { useEffect, useState } from 'react'
import { CollectionCreateRequest, CollectionUpdateRequest } from '@/types/api';
import Input from '../../inputs/Input'
import TextArea from '../../inputs/TextArea'
import ReactJodit from '../../textEditor/ReactJodit';

interface IProps {
    title: string | null;
    description: string | null;
    hidden: boolean | null;
    onChange: (obj: CollectionCreateRequest | CollectionUpdateRequest) => void;
}

export default function GeneralInfo({ onChange, ...data }: IProps) {
    const [state, setState] = useState({
        title: data.title ?? "",
        description: data.description ?? "",
        hidden: data.hidden ?? false,
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

    const onTextChange = (value: string) => {
        setState(prev => ({ ...prev, description: value !== "<p><br></p>" ? value : "" }))
    }

    return (
        <div className="rounded-md bg-white shadow-sm p-5">
            <div className="space-y-4">
                <div className="flex flex-col">
                    <label htmlFor="title" className="text-sm text-gray-600 mb-1">Название коллекции</label>
                    <Input type="text" id="title" placeholder="Название коллекции" name="title" value={state.title} onChange={onInputChange} />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="description" className="text-sm text-gray-600 mb-1">Описание</label>
                    <ReactJodit value={state.description} onChange={onTextChange} />
                </div>
                <div className="flex items-center">
                    <input type="checkbox" className="rounded" id="hidden" name="hidden" checked={state.hidden} onChange={onInputCheckboxChange} />
                    <label htmlFor="hidden" className="text-sm text-gray-600 ml-3">Скрыть коллекцию от пользователей</label>
                </div>
            </div>
        </div>
    )
}
