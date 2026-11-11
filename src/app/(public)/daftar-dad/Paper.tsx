import type { ReactNode } from 'react'
import { Paperclip } from 'lucide-react'
import styles from '../../Dad.module.css'

export default function Paper({
                                  children,
                                  clip = false,
                                  className = ''
                              }: {
    children: ReactNode
    clip?: boolean
    className?: string
}) {
    return (
        <div className={`${styles.goldBack} ${className}`}>
            <div className="relative rounded-[28px] bg-white p-5 sm:p-8 text-[#2b1414] shadow-[0_24px_50px_-14px_rgba(0,0,0,0.5)]">
                {clip && (
                    <Paperclip
                        aria-hidden
                        className="absolute -top-6 right-5 h-14 w-14 rotate-[14deg] text-slate-400 drop-shadow"
                        strokeWidth={1.6}
                    />
                )}
                {children}
            </div>
        </div>
    )
}