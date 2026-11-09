import type { ReactNode } from 'react'

export const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 text-base sm:text-sm rounded-xl border bg-[var(--surface-2)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 focus:border-[var(--primary)] transition-colors ${
        hasError ? 'border-red-500' : 'border-[var(--border)]'
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
            <label htmlFor={name} className="block text-sm font-semibold text-[var(--text-primary)] mb-1.5">
                {label}
            </label>
            {children}
            {error ? (
                <p id={`${name}-error`} role="alert" className="text-red-500 text-xs mt-1.5">
                    {error}
                </p>
            ) : hint ? (
                <p className="text-[var(--text-muted)] text-xs mt-1.5">{hint}</p>
            ) : null}
        </div>
    )
}