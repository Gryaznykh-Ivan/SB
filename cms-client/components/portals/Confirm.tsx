import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/store'
import useConfirm from '@/hooks/useConfirm'
import Modal from './Modal'

export default function Confirm() {
    const state = useAppSelector(state => state.confirm)
    const { onClose, onConfirm } = useConfirm()

    return (
        <Modal>
            <div className={`fixed inset-0 ${state.show ? "bg-black" : "h-0"} bg-opacity-30 transform transition-colors duration-300 z-30`} onClick={onClose}>
                {state.show &&
                    <div className="w-full h-full flex justify-center items-end sm:items-center">
                        <div className="w-full bg-white md:w-1/2 lg:w-1/3 xl:w-1/4 md:rounded" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between p-5 border-b-[1px]">
                                <h2 className="font-medium">{state.title}</h2>
                                <button className="p-2" onClick={onClose}>
                                    <svg className="rotate-45" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 4V12M12 12V20M12 12H20M12 12H4" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-5">{state.message}</div>
                            <div className="p-5 border-t-[1px]">
                                <div className="flex justify-end space-x-4">
                                    <button className="border-gray-500 border-[1px] text-gray-800 px-4 py-2 font-medium rounded-md" onClick={onClose}>Отмена</button>
                                    <button className="bg-green-700 px-4 py-2 text-white font-medium rounded-md" onClick={onConfirm}>Подтверждаю</button>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </Modal>
    )
}
