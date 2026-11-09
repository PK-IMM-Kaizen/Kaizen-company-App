import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import IdCardResult from './Idcardresult'

export default function SuccessScreen({
                                          nama,
                                          prodi,
                                          fotoUrl
                                      }: {
    nama: string
    prodi: string
    fotoUrl: string
}) {
    return (
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-12 grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-8 md:gap-14 items-center">
            <div className="text-center md:text-left">
                <div className="w-14 h-14 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mb-5 border border-[var(--primary)]/30 text-[var(--primary)] mx-auto md:mx-0">
                    <CheckCircle2 className="w-7 h-7" />
                </div>
                <h1 className="text-2xl sm:text-4xl font-black text-[var(--text-primary)] mb-3 font-display tracking-tight">
                    Pendaftaran berhasil
                </h1>
                <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed mb-3 max-w-md mx-auto md:mx-0">
                    Terima kasih, <strong className="text-[var(--text-primary)]">{nama}</strong>. Data Darul
                    Arqam Dasar (DAD) kamu sudah kami terima. Panitia akan menghubungimu untuk informasi
                    selanjutnya.
                </p>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-7 max-w-md mx-auto md:mx-0">
                    Kartu pesertamu sudah dibuat. Unduh dan simpan sebelum menutup halaman ini.
                </p>
                <Link
                    href="/"
                    className="inline-flex w-full sm:w-auto justify-center items-center px-8 py-3.5 text-sm font-bold font-display rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--primary)]/60 hover:text-[var(--text-primary)] transition-colors"
                >
                    Kembali ke beranda
                </Link>
            </div>

            <IdCardResult nama={nama} prodi={prodi} fotoUrl={fotoUrl} />
        </main>
    )
}