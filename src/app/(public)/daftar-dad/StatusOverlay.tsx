import Link from 'next/link'
import { Clock, Loader2 } from 'lucide-react'
import Paper from './Paper'
import { primaryBtn } from './Button'

export default function StatusOverlay({
                                          isChecking,
                                          isOpen
                                      }: {
    isChecking: boolean
    isOpen: boolean
}) {
    if (isChecking) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md" role="status">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-9 w-9 animate-spin text-[#f4b82e]" />
                    <p className="text-sm font-bold text-white">Mengecek status pendaftaran...</p>
                </div>
            </div>
        )
    }

    if (isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="closed-title"
                className="w-full max-w-md animate-in fade-in zoom-in-95 duration-300 motion-reduce:animate-none"
            >
                <Paper className="text-center">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#f4b82e] text-[#4d1010]">
                        <Clock className="h-8 w-8" />
                    </div>
                    <h2 id="closed-title" className="mb-3 text-xl font-bold text-[#6b1b1b] sm:text-2xl">
                        Pendaftaran belum dibuka
                    </h2>
                    <p className="mb-7 text-sm leading-relaxed text-[#5b4a47]">
                        Pendaftaran Darul Arqam Dasar (DAD) belum dimulai. Jadwalnya diumumkan lewat media sosial
                        resmi IMM Kaizen UMSURA.
                    </p>
                    <Link href="/" className={`${primaryBtn} w-full`}>
                        Kembali ke beranda
                    </Link>
                </Paper>
            </div>
        </div>
    )
}