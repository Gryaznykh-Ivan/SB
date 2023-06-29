import Link from 'next/link'
import { IErrorResponse, IFeature, IProductFeature, ProductUpdateFeatureRequest } from '@/types/api'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { useCreateFeatureMutation, useRemoveFeatureMutation, useUpdateFeatureMutation } from '@/services/productService';
import Input from '../../inputs/Input'
import Feature from '../cards/Feature';

interface IProps {
    productId: number;
    options: IProductFeature[];
}

export default function FeatureList({ productId, options }: IProps) {
    const [selected, setSelected] = useState<IProductFeature | null>(null)
    const [items, setItems] = useState<IProductFeature[]>(options)
    const [state, setState] = useState({
        newFeature: "",
        newFeatureValues: [{ key: "", value: "" }]
    })

    const [createFeature, { isSuccess: isCreateFeatureSuccess, isError: isCreateFeatureError, error: createFeatureError }] = useCreateFeatureMutation()
    const [updateFeature, { isSuccess: isUpdateFeatureSuccess, isError: isUpdateFeatureError, error: updateFeatureError }] = useUpdateFeatureMutation()
    const [removeFeature, { isSuccess: isRemoveFeatureSuccess, isError: isRemoveFeatureError, error: removeFeatureError }] = useRemoveFeatureMutation()

    useEffect(() => {
        setItems(options)
    }, [options])

    useEffect(() => {
        if (isCreateFeatureSuccess) {
            toast.success("Характеристики созданы")
        }

        if (isCreateFeatureError) {
            if (createFeatureError && "status" in createFeatureError) {
                toast.error((createFeatureError.data as IErrorResponse)?.message)
            } else {
                toast.error("Произошла неизвесная ошибка")
            }
        }
    }, [isCreateFeatureSuccess, isCreateFeatureError])

    useEffect(() => {
        if (isUpdateFeatureSuccess) {
            toast.success("Характеристики обновлены")
        }

        if (isUpdateFeatureError) {
            if (updateFeatureError && "status" in updateFeatureError) {
                toast.error((updateFeatureError.data as IErrorResponse)?.message)
            } else {
                toast.error("Произошла неизвесная ошибка")
            }
        }
    }, [isUpdateFeatureSuccess, isUpdateFeatureError])

    useEffect(() => {
        if (isRemoveFeatureSuccess) {
            setTimeout(() => toast.success("Характеристики удалены"), 100)
        }

        if (isRemoveFeatureError) {
            if (removeFeatureError && "status" in removeFeatureError) {
                toast.error((removeFeatureError.data as IErrorResponse)?.message)
            } else {
                toast.error("Произошла неизвесная ошибка")
            }
        }
    }, [isRemoveFeatureSuccess, isRemoveFeatureError])


    const onDragStart = (e: React.DragEvent) => {
        if (selected === null) return e.preventDefault()
    }

    const onDragEnd = async (e: React.DragEvent) => {
        if (selected === null) return

        const currentPosition = items.findIndex(c => c.id === selected.id);
        if (selected.position !== currentPosition) {
            await updateFeature({ productId, featureId: selected.id, position: currentPosition })
        }

        setSelected(null)
    }

    const onDragOver = (e: React.DragEvent, item: IProductFeature, index: number) => {
        e.preventDefault();

        if (selected === null) return
        if (item.id === selected.id) return

        if (index !== selected.position) {
            const sortedItems = [...items].sort((a, b) => a.position - b.position)
            const mappedItems = sortedItems.map((current) => {
                if (current.id === item.id) return selected
                if (current.id === selected.id) return item

                return current
            })

            setItems(mappedItems)
        } else {
            setItems(options)
        }
    }

    const onStateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const onItemsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setItems(prev => prev.map(c => c.id.toString() === e.target.name ? { ...c, title: e.target.value } : c))
    }

    const onFeatureCreate = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (state.newFeature.length === 0) {
            return toast.error("Характеристика не может быть пустой")
        }

        const createFeatureValues = [...state.newFeatureValues];
        createFeatureValues.pop()

        if (createFeatureValues.length === 0) {
            return toast.error("Характеристики должны иметь хотя бы одно значение")
        }

        const result = await createFeature({ productId, title: state.newFeature, createFeatureValues }).unwrap()
        if (result.success === true) {
            setState(prev => ({ ...prev, newFeature: "", newFeatureValues: [{ key: "", value: "" }] }))
        }
    }

    const onFeatureUpdate = async (item: IProductFeature) => {
        if (item.title === options.find(c => c.id === item.id)?.title) {
            return
        }

        if (item.title.length === 0) {
            return toast.error("Характеристика не может быть пустой")
        }

        await updateFeature({ productId, featureId: item.id, title: item.title })
    }

    const onFeatureValuesUpdate = async (id: number, data: Pick<ProductUpdateFeatureRequest, "createFeatureValues" | "deleteFeatureValues" | "updateFeatureValues">): Promise<boolean> => {
        try {
            await updateFeature({ productId, featureId: id, ...data }).unwrap()

            return true
        } catch (e) {
            return false
        }
    }

    const onFeatureRemove = async (id: number) => {
        await removeFeature({ productId, featureId: id }).unwrap()
    }

    const onNewFeatureValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newFeatureValues = state.newFeatureValues


        const [field, index] = e.target.name.split("_")

        newFeatureValues[Number(index)][field as "key" | "value"] = e.target.value

        newFeatureValues = newFeatureValues.filter(feature => feature.key !== "")

        const lastNewFeature = newFeatureValues.at(-1)
        if (lastNewFeature?.key !== "" && lastNewFeature?.value !== "") {
            newFeatureValues.push({ key: "", value: "" })
        }

        setState(prev => ({ ...prev, newFeatureValues }))
    }

    const onRemoveNewFeatureValue = (i: number) => {
        const newFeatureValues = state.newFeatureValues

        newFeatureValues.splice(i, 1)

        setState(prev => ({ ...prev, newFeatureValues }))
    }

    return (
        <div className="rounded-md bg-white shadow-sm">
            <h2 className="font-semibold p-5 border-b-[1px]">Характеристики</h2>
            <div className="border-b-[1px] divide-y-[1px]" >
                {items.map((item, index) => (
                    <Feature
                        key={item.id}
                        className={selected?.id === item.id ? "opacity-30" : ""}
                        item={item}
                        index={index}
                        onFeatureValuesUpdate={onFeatureValuesUpdate}
                        onItemsInputChange={onItemsInputChange}
                        onFeatureUpdate={onFeatureUpdate}
                        onFeatureRemove={onFeatureRemove}
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}
                        onDragOver={onDragOver}
                        setSelected={setSelected}
                    />
                ))}
                <div className="">
                    <div className="px-5 py-4">
                        {state.newFeature.length > 0 &&
                            <div className="text-sm text-gray-500 mb-1">Заголовок характеристик</div>
                        }
                        <div className="flex items-center">
                            <Input type="text" className="" name="newFeature" value={state.newFeature} onChange={onStateInputChange} placeholder="Добавить характеристики" />
                        </div>
                    </div>
                    {state.newFeature.length > 0 &&
                        <div className="px-5 pb-5">
                            <div className="flex-1 text-sm text-gray-500 mb-1">Характеристики</div>
                            <div className="space-y-2">
                                {state.newFeatureValues.map((feature, i) =>
                                    <div key={i} className="flex items-center justify-between gap-2 bg-white">
                                        <Input className="flex-1" type="text" placeholder="Характеристика" name={`key_${i.toString()}`} value={feature.key} onChange={onNewFeatureValueChange} />
                                        <Input className="flex-1" disabled={feature.key === ""} type="text" placeholder="Значение" name={`value_${i.toString()}`} value={feature.value} onChange={onNewFeatureValueChange} />
                                        <div className="flex items-center justify-center w-10 h-10">
                                            {state.newFeatureValues.length - 1 !== i &&
                                                <button className={`p-2 rounded-md hover:bg-gray-50`} onClick={() => onRemoveNewFeatureValue(i)}>
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M10 11V17M14 11V17M4 7H20M19 7L18.133 19.142C18.0971 19.6466 17.8713 20.1188 17.5011 20.4636C17.1309 20.8083 16.6439 21 16.138 21H7.862C7.35614 21 6.86907 20.8083 6.49889 20.4636C6.1287 20.1188 5.90292 19.6466 5.867 19.142L5 7H19ZM15 7V4C15 3.73478 14.8946 3.48043 14.7071 3.29289C14.5196 3.10536 14.2652 3 14 3H10C9.73478 3 9.48043 3.10536 9.29289 3.29289C9.10536 3.48043 9 3.73478 9 4V7H15Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </button>
                                            }
                                        </div>
                                    </div>
                                )}
                                {state.newFeatureValues.length > -1 &&
                                    <div className="flex ">
                                        <button className="flex-1 text-sm py-2 px-3 border-[1px] border-gray-300 hover:bg-gray-50 rounded-md font-medium" onClick={onFeatureCreate}>Создать</button>
                                    </div>
                                }
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div >
    )
}
