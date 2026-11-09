import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Logo from '../../../../src/components/common/Logo'

export default function PageShell({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-[var(--background)] flex flex-col font-sans selection:bg-[var(--primary)] selection:text-white">
            <header className="p-4 sm:p-6 relative z-10 max-w-6xl mx-auto w-full flex items-center justify-between">
                <Logo size="md" />
                <Link
                    href="/"
                    className="text-xs sm:text-sm font-bold text-[var(--text-muted)] hover:text-[var(--primary)] flex items-center gap-1.5 font-display transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 text-[var(--primary)]" />
                    <span className="hidden sm:inline">Kembali ke website</span>
                    <span className="sm:hidden">Kembali</span>
                </Link>
            </header>

            {children}

            <footer className="py-5 sm:py-6 border-t border-[var(--border)] text-center text-xs text-[var(--text-muted)] font-display relative z-10 px-4">
                © 2026 PK IMM Kaizen, Universitas Muhammadiyah Surabaya
            </footer>
        </div>
    )
}