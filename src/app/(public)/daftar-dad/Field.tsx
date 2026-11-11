import type { ReactNode } from 'react'

export const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 text-base sm:text-sm rounded-xl border bg-[#fcf8f5] text-[#2b1414] placeholder:text-[#b3a29d] focus:outline-none focus:ring-2 focus:ring-[#6b1b1b]/25 focus:border-[#6b1b1b] transition-colors ${
        hasError ? 'border-red-500' : 'border-[#e9ddd7]'
    }`

export default function Field({
                                  label,
                                  name,
                                  error,
                                  hint,
                                  children
                              }: {
    label: string
    name: string
    error?: string
    hint?: string
    children: ReactNode
}) {
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-bold text-[#2b1414] mb-1.5">
                {label}
            </label>
            {children}
            {error ? (
                <p id={`${name}-error`} role="alert" className="text-red-600 text-xs mt-1.5">
                    {error}
                </p>
            ) : hint ? (
                <p className="text-[#7d6b68] text-xs mt-1.5">{hint}</p>
            ) : null}
        </div>
    )
}