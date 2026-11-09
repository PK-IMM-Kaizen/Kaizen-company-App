'use client'

import { useEffect, useState } from 'react'
import { Download, Loader2, RefreshCw } from 'lucide-react'
import { generateIdCard } from './idCard'
import { slugify } from './Format'

export default function IdCardResult({
                                         nama,
                                         prodi,
                                         fotoUrl
                                     }: {
    nama: string
    prodi: string
    fotoUrl: string
}) {
    const [cardUrl, setCardUrl] = useState<string | null>(null)
    const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
    const [attempt, setAttempt] = useState(0)

    useEffect(() => {
        let cancelled = false
        let created: string | null = null
        setStatus('loading')

        generateIdCard({ nama, prodi, fotoUrl })
            .then(blob => {
                if (cancelled) return
                created = URL.createObjectURL(blob)
                setCardUrl(created)
                setStatus('ready')
            })
            .catch(err => {
                console.error('Gagal membuat ID card:', err)
                if (!cancelled) setStatus('error')
            })

        return () => {
            cancelled = true
            if (created) URL.revokeObjectURL(created)
        }
    }, [nama, prodi, fotoUrl, attempt])

    return (
        <div className="w-full max-w-xs sm:max-w-sm mx-auto">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-3 sm:p-4 shadow-xl">
                {status === 'ready' && cardUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={cardUrl}
                        alt={`Kartu peserta DAD atas nama ${nama}`}
                        className="w-full h-auto rounded-lg animate-in fade-in duration-300 motion-reduce:animate-none"
                    />
                ) : status === 'loading' ? (
                    <div className="aspect-[906/1280] flex items-center justify-center" role="status">
                        <span className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                            <Loader2 className="w-4 h-4 animate-spin" /> Membuat kartu...
                        </span>
                    </div>
                ) : (
                    <div className="aspect-[906/1280] flex flex-col items-center justify-center gap-3 text-center px-6" role="alert">
                        <p className="text-sm text-[var(--text-secondary)]">
                            Kartu belum berhasil dibuat. Data pendaftaranmu sudah aman tersimpan.
                        </p>
                        <button
                            type="button"
                            onClick={() => setAttempt(a => a + 1)}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)]"
                        >
                            <RefreshCw className="w-4 h-4" /> Coba buat lagi
                        </button>
                    </div>
                )}
            </div>

            {status === 'ready' && cardUrl && (
                <a
                    href={cardUrl}
                    download={`kartu-dad-${slugify(nama)}.png`}
                    className="btn-primary mt-4 w-full inline-flex items-center justify-center gap-2 py-3.5 text-sm font-bold font-display rounded-xl shadow-md transition-all hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
                >
                    <Download className="w-4 h-4" /> Unduh kartu (PNG)
                </a>
            )}
        </div>
    )
}