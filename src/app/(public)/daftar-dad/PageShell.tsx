import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Decor from './Decor'
import styles from '../../Dad.module.css'

export default function PageShell({ children }: { children: ReactNode }) {
    return (
        <div className={`${styles.page} relative flex min-h-screen flex-col overflow-x-clip text-white`}>
            <Decor />

            <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between gap-3 p-4 sm:p-6">
                <Link
                    href="/"
                    className="flex items-center gap-1.5 text-xs font-bold text-white/80 transition-colors hover:text-[#f4b82e] sm:text-sm"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Kembali ke website</span>
                    <span className="sm:hidden">Kembali</span>
                </Link>
            </header>

            <div className="relative z-10 flex flex-1 flex-col">{children}</div>

            <footer className="relative z-10 flex justify-center px-4 pb-6 pt-2">
                <p className="flex items-center gap-3 rounded-full bg-white px-5 py-2 text-xs font-bold text-[#4d1010] shadow-lg sm:text-sm">
                    <span>@IMM Kaizen UMSURA</span>
                    <span aria-hidden className="h-4 w-px bg-[#4d1010]/40" />
                    <span>Bidang Kaderisasi</span>
                </p>
            </footer>
        </div>
    )
}