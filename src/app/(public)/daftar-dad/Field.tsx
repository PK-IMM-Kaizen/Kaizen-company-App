import type { ReactNode } from 'react'

export const inputClass = (hasError: boolean) =>
    `w-full min-h-[44px] px-4 py-2.5 text-base sm:text-sm rounded-xl border bg-[#fcf8f5] text-[#2b1414] placeholder:text-[#b3a29d] focus:outline-none focus:ring-2 focus:ring-[#6b1b1b]/25 focus:border-[#6b1b1b] transition-all ${
        hasError ? 'border-red-500 bg-red-50/20' : 'border-[#e9ddd7]'
    }`

interface FieldProps {
    label: string
    name: string
    error?: string
    hint?: string
    children: ReactNode
}

export default function Field({ label, name, error, hint, children }: FieldProps) {
    return (
        <div>
            <label htmlFor={name} className="mb-1.5 block text-xs font-bold text-[#2b1414] sm:text-sm">
                {label}
            </label>
            {children}
            {error ? (
                <p id={`${name}-error`} role="alert" className="mt-1.5 text-xs font-semibold text-red-600">
                    {error}
                </p>
            ) : hint ? (
                <p className="mt-1.5 text-xs text-[#7d6b68]">{hint}</p>
            ) : null}
        </div>
    )
}