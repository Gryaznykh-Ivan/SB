import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { IUserAddress, UserUpdateRequest } from '@/types/api';
import Address from '../cards/Address'
import ManageAddress from '../popups/ManageAddress';

interface IProps {
    addresses: IUserAddress[];
    onChange: (obj: UserUpdateRequest) => void;
}


export default function Addresses({ addresses, onChange }: IProps) {
    const [state, setState] = useState(addresses)
    const [popup, setPopup] = useState(false)

    useEffect(() => {
        const createAddresses = state.filter(c => addresses.find(a => a.id === c.id) === undefined).map(({ id, ...address }) => address)
        const updateAddresses = state.filter(c => addresses.find(a => a.id === c.id && Object.values(c).sort().join() !== Object.values(addresses.find(a => a.id === c.id) ?? {}).sort().join()))
        const deleteAddresses = addresses.filter(c => state.find(a => a.id === c.id) === undefined).map(c => c.id)
        
        onChange({
            createAddresses: createAddresses.length !== 0 ? createAddresses : undefined,
            updateAddresses: updateAddresses.length !== 0 ? updateAddresses : undefined,
            deleteAddresses: deleteAddresses.length !== 0 ? deleteAddresses : undefined,
        })
    }, [state])


    const onNewAddress = (address: Omit<IUserAddress, "id">) => {
        const newAddress = { ...address, id: Math.random() }
        setState(prev => ([...prev, newAddress]))
    }

    const onUpdateAddress = (address: IUserAddress) => {
        setState(prev => prev.map(c => c.id === address.id ? address : c))
    }

    const onDeleteAddress = (address: Pick<IUserAddress, "id">) => {
        setState(prev => prev.filter(c => c.id !== address.id))
    }

    const onPopupOpen = () => setPopup(true)
    const onPopupClose = () => setPopup(false)

    return (
        <div className="rounded-md bg-white shadow-sm">
            <div className="flex justify-between p-5">
                <h2 className="font-semibold">Адреса</h2>
            </div>
            <div className="text-gray-800 divide-y-[1px]">
                <div className=""></div>
                {state.map((address, index) => <Address
                    key={index}
                    id={address.id}
                    address={address.address ?? ""}
                    city={address.city ?? ""}
                    country={address.country ?? ""}
                    region={address.region ?? ""}
                    onUpdateAddress={onUpdateAddress}
                    onDeleteAddress={onDeleteAddress}
                />)}
            </div>
            <div className="space-y-4 p-2 border-t-[1px]">
                <button className="flex p-2 text-blue-800 rounded-md" onClick={onPopupOpen}>
                    <svg className="stroke-blue-800" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 9V12M12 12V15M12 12H15M12 12H9M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12Z" stroke="inherit" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="ml-2">Добавить адрес</span>
                </button>
            </div>
            {popup && <ManageAddress title="Добавить адресс" isDeletable={false} onCreate={onNewAddress} onClose={onPopupClose} />}
        </div>
    )
}
