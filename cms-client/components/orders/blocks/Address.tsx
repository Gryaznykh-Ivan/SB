import React, { useEffect, useMemo, useState } from 'react'
import { IOrderAddress, IUserAddress, OrderCreateRequest } from '@/types/api';
import ManageAddress from '../../orders/popups/ManageAddress';
import AddAddress from '../popups/ManageAddress';

interface IProps {
    mailingCountry: string | null;
    mailingCity: string | null;
    mailingRegion: string | null;
    mailingAddress: string | null;
    userId: number | null;
    onChange: (obj: OrderCreateRequest) => void;
}

export default function Address({ onChange, ...data }: IProps) {
    const [popup, setPopup] = useState(false)
    const [state, setState] = useState({
        mailingCountry: data.mailingCountry ?? "",
        mailingCity: data.mailingCity ?? "",
        mailingRegion: data.mailingRegion ?? "",
        mailingAddress: data.mailingAddress ?? ""
    })

    const onPopupOpen = () => setPopup(true)
    const onPopupClose = () => setPopup(false)

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

    const onNewAddress = (address: IOrderAddress) => {
        setState(prev => ({
            ...prev,
            ...address
        }))
    }

    const isSelected = useMemo(() => Object.values(state).every(a => a !== ""), [state])

    return (
        <div className="rounded-md bg-white shadow-sm">
            <div className="flex justify-between p-5">
                <h2 className="font-semibold">Адреса</h2>
            </div>
            <div className="text-gray-800 divide-y-[1px]">
                <div className=""></div>
                {isSelected &&
                    <div className="relative px-5 py-3">
                        <button className="absolute right-5 top-5" onClick={onPopupOpen}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.675 4.317C13.249 2.561 10.751 2.561 10.325 4.317C10.049 5.452 8.749 5.99 7.753 5.382C6.209 4.442 4.443 6.209 5.383 7.752C5.5243 7.98375 5.60889 8.24559 5.62987 8.51621C5.65085 8.78683 5.60764 9.05859 5.50375 9.30935C5.39985 9.56011 5.23822 9.7828 5.032 9.95929C4.82578 10.1358 4.5808 10.2611 4.317 10.325C2.561 10.751 2.561 13.249 4.317 13.675C4.58056 13.7391 4.82529 13.8645 5.03127 14.0409C5.23726 14.2174 5.3987 14.44 5.50247 14.6906C5.60624 14.9412 5.64942 15.2128 5.62848 15.4832C5.60755 15.7537 5.5231 16.0153 5.382 16.247C4.442 17.791 6.209 19.557 7.752 18.617C7.98375 18.4757 8.24559 18.3911 8.51621 18.3701C8.78683 18.3491 9.05859 18.3924 9.30935 18.4963C9.56011 18.6001 9.7828 18.7618 9.95929 18.968C10.1358 19.1742 10.2611 19.4192 10.325 19.683C10.751 21.439 13.249 21.439 13.675 19.683C13.7391 19.4194 13.8645 19.1747 14.0409 18.9687C14.2174 18.7627 14.44 18.6013 14.6906 18.4975C14.9412 18.3938 15.2128 18.3506 15.4832 18.3715C15.7537 18.3924 16.0153 18.4769 16.247 18.618C17.791 19.558 19.557 17.791 18.617 16.248C18.4757 16.0162 18.3911 15.7544 18.3701 15.4838C18.3491 15.2132 18.3924 14.9414 18.4963 14.6907C18.6001 14.4399 18.7618 14.2172 18.968 14.0407C19.1742 13.8642 19.4192 13.7389 19.683 13.675C21.439 13.249 21.439 10.751 19.683 10.325C19.4194 10.2609 19.1747 10.1355 18.9687 9.95905C18.7627 9.78258 18.6013 9.55999 18.4975 9.30938C18.3938 9.05877 18.3506 8.78721 18.3715 8.51677C18.3924 8.24634 18.4769 7.98466 18.618 7.753C19.558 6.209 17.791 4.443 16.248 5.383C16.0162 5.5243 15.7544 5.60889 15.4838 5.62987C15.2132 5.65085 14.9414 5.60764 14.6907 5.50375C14.4399 5.39985 14.2172 5.23822 14.0407 5.032C13.8642 4.82578 13.7389 4.5808 13.675 4.317Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M14.1213 14.1213C14.6839 13.5587 15 12.7956 15 12C15 11.2044 14.6839 10.4413 14.1213 9.87868C13.5587 9.31607 12.7956 9 12 9C11.2044 9 10.4413 9.31607 9.87868 9.87868C9.31607 10.4413 9 11.2044 9 12C9 12.7956 9.31607 13.5587 9.87868 14.1213C10.4413 14.6839 11.2044 15 12 15C12.7956 15 13.5587 14.6839 14.1213 14.1213Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <div className="">{state.mailingCountry}</div>
                        <div className="">{state.mailingRegion}</div>
                        <div className="">{state.mailingCity}</div>
                        <div className="">{state.mailingAddress}</div>
                    </div>
                }
            </div>
            {isSelected === false &&
                <div className="space-y-4 p-2 border-t-[1px]">
                    <button className="flex p-2 text-blue-800 rounded-md" onClick={onPopupOpen}>
                        <svg className="stroke-blue-800" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 9V12M12 12V15M12 12H15M12 12H9M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12Z" stroke="inherit" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="ml-2">Добавить адрес</span>
                    </button>
                </div>
            }
            {popup && <ManageAddress
                title="Выбор адреса"
                mailingAddress={state.mailingAddress}
                mailingCity={state.mailingCity}
                mailingRegion={state.mailingRegion}
                mailingCountry={state.mailingCountry}
                userId={ data.userId }
                onDone={onNewAddress}
                onClose={onPopupClose}
            />}
        </div>
    )
}
