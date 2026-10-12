'use client'

import { useState } from 'react'
import Link from 'next/link'
import Logo from '../../../components/common/Logo'
import {
    CheckCircle2,
    ArrowLeft,
    Send,
    Sparkles,
    Loader2,
    ShieldCheck
} from 'lucide-react'

export default function AspirasiPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const [formData, setFormData] = useState({
        nama: '',
        kategori: '',
        pesan: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        await new Promise(resolve => setTimeout(resolve, 1500))

        setIsSubmitting(false)
        setIsSuccess(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-[var(--background)] flex flex-col justify-between relative overflow-hidden font-sans">
                <header className="p-6 relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between">
                    <Logo size="md" />
                    <Link
                        href="/"
                        className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--primary)] flex items-center gap-1.5 font-display transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Kembali ke Website
                    </Link>
                </header>

                <main className="flex-1 flex items-center justify-center p-4 relative z-10">
                    <div className="max-w-lg w-full bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-8 sm:p-10 text-center shadow-2xl">
                        <div className="w-20 h-20 bg-[var(--success)]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[var(--success)]/30 text-[var(--success)]">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-3 font-display">
                            Aspirasi Terkirim!
                        </h2>
                        <p className="text-[var(--text-secondary)] text-sm mb-8 leading-relaxed">
                            Terima kasih atas masukan dan evaluasi yang Anda berikan. Suara Anda sangat berharga untuk kemajuan PK IMM Kaizen UM Surabaya.
                        </p>
                        <Link
                            href="/"
                            className="btn-primary w-full justify-center py-3.5 text-xs tracking-widest uppercase font-display"
                        >
                            Kembali ke Beranda
                        </Link>
                    </div>
                </main>

                <footer className="py-6 border-t border-[var(--border)] text-center text-[10px] sm:text-xs text-[var(--text-muted)] font-display uppercase tracking-widest relative z-10">
                    © 2026 PK IMM Kaizen · Universitas Muhammadiyah Surabaya
                </footer>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[var(--background)] flex flex-col justify-between relative overflow-hidden font-sans">

            <header className="p-6 relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between">
                <Logo size="md" />
                <Link
                    href="/"
                    className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--primary)] flex items-center gap-1.5 font-display transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Kembali ke Website
                </Link>
            </header>

            <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8 relative z-10">

                <div className="text-center mb-10">
                    <span className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-[var(--accent)] font-display block mb-2 flex items-center justify-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[var(--accent)]" /> Ruang Terbuka
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-black text-[var(--text-primary)] leading-tight font-display mb-4">
                        Suara Mahasiswa
                    </h1>
                    <p className="text-[var(--text-muted)] text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
                        Sampaikan kritik, saran, ide, atau aspirasimu untuk Pimpinan Komisariat IMM Kaizen secara terbuka atau anonim.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-6 sm:p-8 shadow-xl space-y-6">

                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <label htmlFor="nama" className="form-label mb-0">Nama</label>
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
                            className="form-input"
                        />
                    </div>

                    <div>
                        <label htmlFor="kategori" className="form-label">Kategori Aspirasi</label>
                        <select
                            id="kategori"
                            name="kategori"
                            required
                            value={formData.kategori}
                            onChange={handleChange}
                            className="form-input"
                        >
                            <option value="" disabled>Pilih Kategori</option>
                            <option value="Kritik & Saran Organisasi">Kritik & Saran Organisasi</option>
                            <option value="Ide Program Kerja">Ide Program Kerja</option>
                            <option value="Fasilitas & Layanan">Fasilitas & Layanan Kemahasiswaan</option>
                            <option value="Aduan Khusus">Aduan Khusus</option>
                            <option value="Lainnya">Lainnya</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="pesan" className="form-label">Isi Aspirasi</label>
                        <textarea
                            id="pesan"
                            name="pesan"
                            required
                            rows={6}
                            value={formData.pesan}
                            onChange={handleChange}
                            placeholder="Tuliskan pesan, evaluasi, atau ide kamu secara jelas di sini..."
                            className="form-input resize-none"
                        ></textarea>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-primary w-full justify-center py-4 text-xs font-bold tracking-widest uppercase shadow-md flex items-center gap-2"
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
                        <p className="text-center text-[11px] text-[var(--text-muted)] mt-4 flex items-center justify-center gap-1 font-sans">
                            <ShieldCheck className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                            Suara dan identitas Anda dijaga kerahasiaannya.
                        </p>
                    </div>

                </form>
            </main>

            <footer className="py-6 border-t border-[var(--border)] text-center text-[10px] sm:text-xs text-[var(--text-muted)] font-display uppercase tracking-widest relative z-10">
                © 2026 PK IMM Kaizen · Universitas Muhammadiyah Surabaya
            </footer>
        </div>
    )
}
