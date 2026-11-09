import Link from 'next/link'
import { Clock, Loader2 } from 'lucide-react'

export default function StatusOverlay({
                                          isChecking,
                                          isOpen
                                      }: {
    isChecking: boolean
    isOpen: boolean
}) {
    if (isChecking) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4" role="status">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-9 h-9 animate-spin text-[var(--primary)]" />
                    <p className="text-sm font-bold text-white font-display">Mengecek status pendaftaran...</p>
                </div>
            </div>
        )
    }

    if (isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="closed-title"
                className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 sm:p-10 max-w-md w-full text-center shadow-2xl animate-in fade-in zoom-in-95 duration-300 motion-reduce:animate-none"
            >
                <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-5 border border-[var(--primary)]/30 text-[var(--primary)]">
                    <Clock className="w-8 h-8" />
                </div>
                <h2 id="closed-title" className="text-xl sm:text-2xl font-black text-[var(--text-primary)] mb-3 font-display tracking-tight">
                    Pendaftaran belum dibuka
                </h2>
                <p className="text-[var(--text-secondary)] text-sm mb-7 leading-relaxed">
                    Pendaftaran Darul Arqam Dasar (DAD) belum dimulai. Jadwalnya akan diumumkan lewat media
                    sosial resmi IMM Kaizen UMSurabaya.
                </p>
                <Link
                    href="/"
                    className="btn-primary w-full justify-center py-3.5 text-sm font-bold font-display flex items-center rounded-xl shadow-md transition-all"
                >
                    Kembali ke beranda
                </Link>
            </div>
        </div>
    )
}