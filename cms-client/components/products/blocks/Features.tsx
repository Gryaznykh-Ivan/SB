import Input from '@/components/inputs/Input';
import { IProductFeature, IProductFeatureValue, ProductCreateRequest, ProductUpdateRequest } from '@/types/api'
import React, { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify';
import Feature from '../cards/Feature';

interface IProps {
    features: IProductFeature[];
    onChange: (obj: ProductCreateRequest | ProductUpdateRequest) => void;
}

export default function Features({ features, onChange }: IProps) {
    const [selected, setSelected] = useState<IProductFeature | null>(null)
    const [items, setItems] = useState<IProductFeature[]>(features)
    const [newFeature, setNewFeature] = useState({
        title: "",
        values: [{ id: 0, position: 0, key: "", value: "" }]
    })

    useEffect(() => {
        if (features.length !== 0) {
            setItems(features)
        }
    }, [features])

    useEffect(() => {
        const localFeatures = [...items];

        const reorderFeatures = (localFeatures.length === features.length && localFeatures.every(c => features.some(a => a.id === c.id)) && localFeatures.map(c => c.id).join() !== features.map(c => c.id).join()) ? localFeatures.map(c => ({ id: c.id })) : undefined
        const createFeatures = localFeatures.filter(feature => !features.some(c => c.id === feature.id)).map(c => ({ title: c.title, values: c.values.map(a => ({ key: a.key, value: a.value })) }))
        const deleteFeatures = features.filter(feature => !localFeatures.some(c => c.id === feature.id)).map(c => ({ id: c.id }))
        const updateFeatures = localFeatures
            .filter(c =>
                features.some(a => a.id === c.id && a.title !== c.title)
                || features.some(a => a.id === c.id && a.values.length !== c.values.length)
                || features.some(a => a.id === c.id && a.values.some(v1 => c.values.some(v2 => v2.id === v1.id && (v1.key !== v2.key || v1.value !== v2.value))))
                || features.some(a => a.id === c.id && a.values.every(v1 => c.values.some(v2 => v1.id === v2.id)) && a.values.map(v1 => v1.id).join() !== c.values.map(v2 => v2.id).join()))
            .map(feature => {
                const currentFeatureValues = features.find(c => c.id === feature.id)?.values ?? []

                return {
                    id: feature.id,
                    title: features.some(c => c.id === feature.id && c.title !== feature.title) ? feature.title : undefined,
                    reorderValues: (feature.values.every(c => currentFeatureValues.some(a => a.id === c.id) && feature.values.map(c => c.id).join() !== currentFeatureValues.map(c => c.id).join())) ? feature.values.map(c => ({ id: c.id })) : undefined,
                    createValues: feature.values.filter(c => !currentFeatureValues.some(a => a.id === c.id)).map(c => ({ key: c.key, value: c.value })),
                    updateValues: feature.values.filter(c => currentFeatureValues.some(a => a.id === c.id && (a.key !== c.key || a.value !== c.value))).map(c => ({ id: c.id, key: c.key, value: c.value })),
                    deleteValues: currentFeatureValues.filter(c => !feature.values.some(a => a.id === c.id)).map(c => ({ id: c.id })),
                }
            })



        onChange({
            reorderFeatures: reorderFeatures,
            createFeatures: createFeatures.length !== 0 ? createFeatures : undefined,
            updateFeatures: updateFeatures.length !== 0 ? updateFeatures : undefined,
            deleteFeatures: deleteFeatures.length !== 0 ? deleteFeatures : undefined,
        })
    }, [items])

    const isNewId = (id: number) => id.toString().indexOf(".") !== -1

    const onNewFeatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewFeature(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const onNewFeatureCreate = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (newFeature.title.trim().length === 0) {
            return toast.error("Заголовое характеристик не может быть пустым")
        }

        if (newFeature.values.length <= 1) {
            return toast.error("Характеристики должны иметь хотя бы одно значение")
        }

        setItems(prev => ([...prev, { id: Math.random(), position: Math.max(...prev.map(c => c.position), 0) + 1, title: newFeature.title, values: newFeature.values.slice(0, -1).map((c, i) => ({ id: Math.random(), position: i, key: c.key, value: c.value })) }]))
        setNewFeature(prev => ({ ...prev, title: "", values: [{ id: 0, position: 0, key: "", value: "" }] }))
    }

    const onNewFeatureValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newFeatureValues = [...newFeature.values]

        const [field, index] = e.target.name.split("_")
        newFeatureValues[Number(index)][field as "key" | "value"] = e.target.value
        newFeatureValues = newFeatureValues.filter(feature => feature.key !== "")

        const lastNewFeature = newFeatureValues.at(-1)
        if (lastNewFeature?.key !== "" && lastNewFeature?.value !== "") {
            newFeatureValues.push({ id: 0, position: 0, key: "", value: "" })
        }

        setNewFeature(prev => ({ ...prev, values: newFeatureValues }))
    }

    const onNewFeatureValueRemove = (index: number) => {
        setNewFeature(prev => ({ ...prev, values: prev.values.filter((_, i) => i !== index) }))
    }

    const onDragStart = (e: React.DragEvent) => {
        if (selected === null) return e.preventDefault()
    }

    const onDragEnd = async (e: React.DragEvent) => {
        if (selected === null) return

        setSelected(null)
    }

    const onDragOver = (e: React.DragEvent, item: IProductFeature, index: number) => {
        e.preventDefault();

        if (selected === null) return
        if (item.id === selected.id) return
        if (isNewId(item.id) === true) return

        const sortedItems = [...items].sort((a, b) => a.position - b.position)
        const mappedItems = sortedItems.map((current, i) => {
            if (current.id === item.id) return { ...selected, position: i }
            if (current.id === selected.id) return { ...item, position: i }

            return { ...current, position: i }
        })

        setItems(mappedItems)
    }

    const onFeatureChange = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
        setItems(prev => (prev.map(c => c.id !== id ? c : { ...c, [e.target.name]: e.target.value })))
    }

    const onFeatureRemove = (id: number) => {
        setItems(prev => (prev.filter(c => c.id !== id)))
    }

    const onFeatureValueCreate = (id: number, data: Pick<IProductFeatureValue, "key" | "value">) => {
        setItems(prev => (prev.map(c => c.id !== id ? c : { ...c, values: [...c.values, { id: Math.random(), position: Math.max(...c.values.map(c => c.position), 0) + 1, key: data.key, value: data.value }] })))
    }

    const onFeatureValueChange = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const [field, valueId] = e.target.name.split("_")
        setItems(prev => (prev.map(c => c.id !== id ? c : { ...c, values: [...c.values.map(a => a.id.toString() !== valueId ? a : { ...a, [field]: e.target.value })] })))
    }

    const onFeatureValueRemove = (id: number, valueId: number) => {
        setItems(prev => (prev.map(c => c.id !== id ? c : { ...c, values: c.values.filter(a => a.id !== valueId) })))
    }

    const onFeatureValueReorder = (id: number, items: IProductFeatureValue[]) => {
        setItems(prev => (prev.map(c => c.id !== id ? c : { ...c, values: items })))
    }

    return (
        <div className="rounded-md bg-white shadow-sm">
            <h2 className="font-semibold p-5 border-b-[1px]">Характеристики</h2>
            <div className="border-b-[1px] divide-y-[1px]" >
                {items.map((item, index) => (
                    <Feature
                        key={item.id}
                        className={selected?.id === item.id ? "opacity-30" : ""}
                        feature={item}
                        index={index}
                        onFeatureChange={onFeatureChange}
                        onFeatureRemove={onFeatureRemove}
                        onFeatureValueCreate={onFeatureValueCreate}
                        onFeatureValueChange={onFeatureValueChange}
                        onFeatureValueRemove={onFeatureValueRemove}
                        onFeatureValueReorder={onFeatureValueReorder}
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}
                        onDragOver={onDragOver}
                        setSelected={setSelected}
                    />
                ))}
                <div className="">
                    <div className="px-5 py-4">
                        {newFeature.title.length > 0 &&
                            <div className="text-sm text-gray-500 mb-1">Заголовок характеристик</div>
                        }
                        <div className="flex items-center">
                            <Input type="text" className="" name="title" value={newFeature.title} onChange={onNewFeatureChange} placeholder="Добавить характеристики" />
                        </div>
                    </div>
                    {newFeature.title.length > 0 &&
                        <div className="px-5 pb-5">
                            <div className="flex-1 text-sm text-gray-500 mb-1">Характеристики</div>
                            <div className="space-y-2">
                                {newFeature.values.map((feature, i) =>
                                    <div key={i} className="flex items-center justify-between gap-2 bg-white">
                                        <Input className="flex-1" type="text" placeholder="Характеристика" name={`key_${i.toString()}`} value={feature.key} onChange={onNewFeatureValueChange} />
                                        <Input className="flex-1" disabled={feature.key === ""} type="text" placeholder="Значение" name={`value_${i.toString()}`} value={feature.value} onChange={onNewFeatureValueChange} />
                                        <div className="flex items-center justify-center w-10 h-10">
                                            {newFeature.values.length - 1 !== i &&
                                                <button className={`p-2 rounded-md hover:bg-gray-50`} onClick={() => onNewFeatureValueRemove(i)}>
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M10 11V17M14 11V17M4 7H20M19 7L18.133 19.142C18.0971 19.6466 17.8713 20.1188 17.5011 20.4636C17.1309 20.8083 16.6439 21 16.138 21H7.862C7.35614 21 6.86907 20.8083 6.49889 20.4636C6.1287 20.1188 5.90292 19.6466 5.867 19.142L5 7H19ZM15 7V4C15 3.73478 14.8946 3.48043 14.7071 3.29289C14.5196 3.10536 14.2652 3 14 3H10C9.73478 3 9.48043 3.10536 9.29289 3.29289C9.10536 3.48043 9 3.73478 9 4V7H15Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </button>
                                            }
                                        </div>
                                    </div>
                                )}
                                {newFeature.values.length > -1 &&
                                    <div className="flex ">
                                        <button className="flex-1 text-sm py-2 px-3 border-[1px] border-gray-300 hover:bg-gray-50 rounded-md font-medium" onClick={onNewFeatureCreate}>Создать</button>
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
