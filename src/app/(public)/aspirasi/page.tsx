'use client'

import { useState } from 'react'
import Link from 'next/link'
import Logo from '../../../components/common/Logo'
import {
    CheckCircle2,
    ArrowLeft,
    Send,
    Loader2,
    ShieldCheck,
    AlertCircle
} from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

export default function AspirasiPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const [formData, setFormData] = useState({
        nama: '',
        kategori: '',
        pesan: ''
    })

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setErrorMessage('')

        try {
            const { error } = await supabase
                .from('aspirations')
                .insert([
                    {
                        nama: formData.nama.trim() || 'Anonim',
                        kategori: formData.kategori,
                        pesan: formData.pesan,
                        status: 'unread',
                        created_at: new Date().toISOString()
                    }
                ])

            if (error) throw error

            setIsSuccess(true)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        } catch (err: any) {
            console.error('Gagal mengirim aspirasi:', err.message)
            setErrorMessage(err.message || 'Gagal mengirim aspirasi. Silakan coba lagi.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-[var(--background)] flex flex-col justify-between relative overflow-hidden font-sans selection:bg-[var(--primary)] selection:text-white">
                <header className="p-4 sm:p-6 relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between">
                    <Logo size="md" />
                    <Link
                        href="/"
                        className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--primary)] flex items-center gap-1.5 font-display transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 text-[var(--primary)]" /> <span className="hidden xs:inline">Kembali ke Website</span>
                    </Link>
                </header>

                <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10 my-auto">
                    <div className="max-w-lg w-full bg-[var(--card)] border border-[var(--border)] rounded-2xl sm:rounded-[var(--radius)] p-6 sm:p-10 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[var(--success)]/10 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6 border border-[var(--success)]/30 text-[var(--success)]">
                            <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
                        </div>
                        <h2 className="text-xl sm:text-3xl font-black text-[var(--text-primary)] mb-2.5 sm:mb-3 font-display">
                            Aspirasi Terkirim!
                        </h2>
                        <p className="text-[var(--text-secondary)] text-xs sm:text-sm mb-6 sm:mb-8 leading-relaxed">
                            Terima kasih atas masukan dan evaluasi yang Anda berikan. Suara Anda sangat berharga untuk kemajuan PK IMM Kaizen UM Surabaya.
                        </p>
                        <Link
                            href="/"
                            className="btn-primary w-full justify-center py-3.5 text-xs font-bold tracking-widest uppercase font-display flex items-center justify-center rounded-xl shadow-md transition-all hover:-translate-y-0.5"
                        >
                            Kembali ke Beranda
                        </Link>
                    </div>
                </main>

                <footer className="py-5 sm:py-6 border-t border-[var(--border)] text-center text-[10px] sm:text-xs text-[var(--text-muted)] font-display uppercase tracking-widest relative z-10 px-4">
                    © 2026 PK IMM Kaizen · Universitas Muhammadiyah Surabaya
                </footer>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[var(--background)] flex flex-col justify-between relative overflow-hidden font-sans selection:bg-[var(--primary)] selection:text-white">

            <header className="p-4 sm:p-6 relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between">
                <Logo size="md" />
                <Link
                    href="/"
                    className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--primary)] flex items-center gap-1.5 font-display transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 text-[var(--primary)]" /> <span className="hidden xs:inline">Kembali ke Website</span>
                </Link>
            </header>

            <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10 my-auto">

                <div className="text-center mb-8 sm:mb-10">
                    <h1 className="text-2xl xs:text-3xl sm:text-5xl font-black text-[var(--text-primary)] leading-tight font-display mb-3 tracking-tight">
                        Suara Mahasiswa
                    </h1>
                    <p className="text-[var(--text-muted)] text-xs sm:text-sm max-w-xl mx-auto leading-relaxed px-2">
                        Sampaikan kritik, saran, ide, atau aspirasimu untuk Pimpinan Komisariat IMM Kaizen secara terbuka atau anonim.
                    </p>
                </div>

                {errorMessage && (
                    <div className="mb-6 p-3.5 sm:p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/40 text-xs font-bold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMessage}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl sm:rounded-[var(--radius)] p-5 sm:p-8 shadow-xl space-y-5 sm:space-y-6">

                    <div>
                        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1 mb-1.5">
                            <label htmlFor="nama" className="form-label mb-0 text-xs sm:text-sm font-medium">Nama</label>
                            <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold font-display">
                                Opsional (Boleh Anonim)
                            </span>
                        </div>
                        <input
                            type="text"
                            id="nama"
                            name="nama"
                            value={formData.nama}
                            onChange={handleChange}
                            placeholder="Samarkan atau kosongkan jika ingin anonim"
                            className="form-input w-full px-4 py-2.5 sm:py-3 text-xs sm:text-sm rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="kategori" className="form-label block text-xs sm:text-sm font-medium mb-1.5">Kategori Aspirasi</label>
                        <select
                            id="kategori"
                            name="kategori"
                            required
                            value={formData.kategori}
                            onChange={handleChange}
                            className="form-input w-full px-4 py-2.5 sm:py-3 text-xs sm:text-sm rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all cursor-pointer"
                        >
                            <option value="" disabled>Pilih Kategori Aspirasi</option>
                            <option value="Kritik & Saran Organisasi">Kritik & Saran Organisasi</option>
                            <option value="Ide Program Kerja">Ide Program Kerja</option>
                            <option value="Fasilitas & Layanan">Fasilitas & Layanan Kemahasiswaan</option>
                            <option value="Aduan Khusus">Aduan Khusus</option>
                            <option value="Lainnya">Lainnya</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="pesan" className="form-label block text-xs sm:text-sm font-medium mb-1.5">Isi Aspirasi</label>
                        <textarea
                            id="pesan"
                            name="pesan"
                            required
                            rows={5}
                            value={formData.pesan}
                            onChange={handleChange}
                            placeholder="Tuliskan pesan, evaluasi, atau ide kamu secara jelas di sini..."
                            className="form-input w-full px-4 py-3 text-xs sm:text-sm rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all resize-none leading-relaxed"
                        ></textarea>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-primary w-full justify-center py-3.5 sm:py-4 text-xs font-bold tracking-widest uppercase shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 rounded-xl transition-all hover:-translate-y-0.5"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Mengirim Aspirasi...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" /> Kirim Aspirasi Sekarang
                                </>
                            )}
                        </button>
                        <p className="text-center text-[10px] sm:text-[11px] text-[var(--text-muted)] mt-3.5 flex items-center justify-center gap-1.5 font-sans leading-normal">
                            <ShieldCheck className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                            Suara dan identitas Anda dijaga kerahasiaannya.
                        </p>
                    </div>

                </form>
            </main>

            <footer className="py-5 sm:py-6 border-t border-[var(--border)] text-center text-[10px] sm:text-xs text-[var(--text-muted)] font-display uppercase tracking-widest relative z-10 px-4">
                © 2026 PK IMM Kaizen · Universitas Muhammadiyah Surabaya
            </footer>
        </div>
    )
}