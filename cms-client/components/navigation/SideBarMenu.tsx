import React, { useEffect, useMemo, useState } from 'react'
import SideBar from './SideBar'

export default function SideBarMenu() {
    const [isMenuFolded, setIsMenuFolded] = useState<boolean | undefined>()
    const isMenuFoldedMemo = useMemo(() => localStorage.getItem("isMenuFolded") === "true" ? true : false, [isMenuFolded])

    useEffect(() => {
        const localIsMenuFolded = localStorage.getItem("isMenuFolded")
        if (localIsMenuFolded !== null) {
            setIsMenuFolded(localIsMenuFolded === "true" ? true : false)
        }
    }, [])

    const onToggle = () => {
        const toggle = !isMenuFolded
        localStorage.setItem("isMenuFolded", toggle.toString())
        setIsMenuFolded(toggle)
    }

    return (
        <div className="hidden md:block border-r-[1px] bg-white">
            <div className="sticky top-[64px]">
                <SideBar isMenuFolded={isMenuFoldedMemo} />
                <div className="border-t-[1px] p-2 text-sm hidden md:block">
                    <button className="flex w-full items-center font-semibold px-3 py-2 hover:bg-gray-100 rounded-md stroke-black" onClick={onToggle}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 17L8 13M8 7H20H8ZM20 7L16 3L20 7ZM20 7L16 11L20 7ZM16 17H4H16ZM4 17L8 21L4 17Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className={`ml-2 w-[184px] text-left ${isMenuFoldedMemo && "hidden"}`}>Свернуть меню</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
