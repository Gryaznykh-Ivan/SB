import React, { ReactNode } from 'react'
import Header from '../Header'
import SideBarMenu from '../navigation/SideBarMenu';

interface IProps {
    children: ReactNode;
}

export default function MainLayout({ children }: IProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex flex-1 mt-16 bg-main-bg">
                <SideBarMenu />
                <div className="flex-1">
                    {children}
                </div>
            </div>
        </div>
    )
}
