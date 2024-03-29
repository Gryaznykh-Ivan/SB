import React, { useRef } from 'react'
import dynamic from 'next/dynamic'

const ReactJoditDynamic = dynamic(
    async () => await import("jodit-react"),
    {
        ssr: false,
        loading: () => <div className="w-full h-10 bg-gray-100 animate-pulse rounded-lg"></div>
    }
);

interface IProps {
    value: string;
    onChange: (value: string) => void;
}

const joditConfig = {
    readonly: false,
    placeholder: 'Начинайте писать...',
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    maxHeight: 600,
    removeButtons: ['image', 'video', 'copyformat', 'font'],
    buttons: [
        'underline',
        'strikethrough',
        'hr',
        'indent',
        'outdent',
        'find',
        'source',
        'print',
    ],
}

export default function ReactJodit({ value, onChange }: IProps) {
    const editor = useRef(null);

    return <ReactJoditDynamic
        className="prose prose-p:m-0 font-['Roboto'] !rounded-lg overflow-hidden"
        ref={editor}
        config={joditConfig}
        value={value}
        onBlur={onChange}
    />
}

