import React, { useEffect, useState } from 'react'
import MainLayout from '@/components/layouts/Main'
import SEOSnippetProduct from '@/components/settings/blocks/SEOSnippetProduct'
import SEOSnippetCollection from '@/components/settings/blocks/SEOSnippetCollection'
import SEOSnippetPage from '@/components/settings/blocks/SEOSnippetPage'


function Index() {

    return (
        <MainLayout>
            <div className="px-6 my-4 max-w-3xl mx-auto space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-medium">Настройки</h1>
                </div>
                <div className="space-y-4">
                    <div className="">
                        <div className="text-lg font-medium">SEO шаблоны</div>
                        <div className="text-gray-600 text-md">SEO шаблоны не влияют на сущестующие товары, коллекции и страницы.</div>
                        <div className="text-gray-600 text-md">Применяются только при создании.</div>
                    </div>
                    <SEOSnippetProduct />
                    <SEOSnippetCollection />
                    <SEOSnippetPage />
                </div>
            </div>
        </MainLayout>
    )
}

export default Index
