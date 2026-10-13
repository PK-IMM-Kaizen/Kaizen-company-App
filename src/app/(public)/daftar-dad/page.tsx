'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from '../../../components/common/Logo'
import { createBrowserClient } from '@supabase/ssr'
import {
    CheckCircle2,
    Clock,
    ArrowLeft,
    Send,
    Sparkles,
    Loader2,
    ShieldCheck
} from 'lucide-react'

export default function DaftarDADPage() {
    const [isRegistrationOpen, setIsRegistrationOpen] = useState(false)
    const [isCheckingStatus, setIsCheckingStatus] = useState(true)

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const [formData, setFormData] = useState({
        namaLengkap: '',
        asal: '',
        tempatTanggalLahir: '',
        domisili: '',
        asalKomisariat: '',
        prodi: ''
    })

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const { data, error } = await supabase
                    .from('site_settings')
                    .select('value')
                    .eq('key', 'is_dad_open')
                    .maybeSingle()

                if (error) throw error
                if (data) {
                    setIsRegistrationOpen(data.value)
                }
            } catch (error) {
                console.error('Error fetching settings:', error)
            } finally {
                setIsCheckingStatus(false)
            }
        }
        fetchStatus()
    }, [supabase])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const { error } = await supabase
                .from('dad_registrations')
                .insert([
                    {
                        nama_lengkap: formData.namaLengkap,
                        asal: formData.asal,
                        tempat_tanggal_lahir: formData.tempatTanggalLahir,
                        domisili: formData.domisili,
                        asal_komisariat: formData.asalKomisariat,
                        prodi: formData.prodi
                    }
                ])

            if (error) throw error

            setIsSuccess(true)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        } catch (error: any) {
            console.error('Error submitting form:', error.message)
            alert('Gagal mengirim pendaftaran. Silakan coba lagi.')
        } finally {
            setIsSubmitting(false)
        }
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
                        <ArrowLeft className="w-4 h-4" /> Kembali ke Website Utama
                    </Link>
                </header>

                <main className="flex-1 flex items-center justify-center p-4 relative z-10">
                    <div className="max-w-lg w-full bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-8 sm:p-10 text-center shadow-2xl">
                        <div className="w-20 h-20 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[var(--primary)]/30 text-[var(--primary)]">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-3 font-display">
                            Pendaftaran Berhasil!
                        </h2>
                        <p className="text-[var(--text-secondary)] text-sm mb-8 leading-relaxed">
                            Terima kasih, <strong className="text-[var(--text-primary)]">{formData.namaLengkap}</strong>. Data pendaftaran Darul Arqam Dasar (DAD) kamu telah kami terima. Panitia akan segera menghubungi kamu untuk informasi selanjutnya.
                        </p>
                        <Link
                            href="/"
                            className="btn-primary w-full justify-center py-3.5 text-xs tracking-widest uppercase font-display"
                        >
                            Kembali ke Beranda
                        </Link>
                    </div>
                </main>

                <footer className="py-6 border-t border-[var(--border)] text-center text-xs text-[var(--text-muted)] font-display uppercase tracking-widest relative z-10">
                    © 2026 IMM Kaizen · Universitas Muhammadiyah Surabaya
                </footer>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[var(--background)] flex flex-col justify-between relative overflow-hidden font-sans">

            {isCheckingStatus ? (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)]" />
                        <p className="text-sm font-bold text-white tracking-widest uppercase font-display">Mengecek Sistem...</p>
                    </div>
                </div>
            ) : !isRegistrationOpen ? (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                    <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-8 sm:p-10 max-w-md w-full text-center shadow-2xl relative overflow-hidden">
                        <div
                            className="absolute top-0 left-0 w-full h-1.5"
                            style={{
                                background: 'linear-gradient(to right, var(--primary), var(--accent), var(--accent-light))'
                            }}
                        />

                        <div className="w-20 h-20 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[var(--primary)]/30 text-[var(--primary)]">
                            <Clock className="w-10 h-10" />
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-3 font-display uppercase tracking-tight">
                            Coming Soon!
                        </h2>

                        <p className="text-[var(--text-secondary)] text-sm mb-8 leading-relaxed">
                            Pendaftaran Darul Arqam Dasar (DAD) saat ini <strong className="text-[var(--text-primary)]">belum dibuka</strong>. Pantau terus informasi terbaru melalui media sosial resmi IMM Kaizen UMSurabaya agar tidak ketinggalan jadwalnya!
                        </p>

                        <Link
                            href="/"
                            className="btn-primary w-full justify-center py-3.5 text-xs tracking-widest uppercase font-display"
                        >
                            Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            ) : null}

            <header className="p-6 relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between">
                <Logo size="md" />
                <Link
                    href="/"
                    className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--primary)] flex items-center gap-1.5 font-display transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Kembali ke Website
                </Link>
            </header>

            <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 relative z-10">
                <div className={`transition-all duration-300 ${(!isRegistrationOpen || isCheckingStatus) ? 'pointer-events-none opacity-40 select-none' : ''}`}>

                    <div className="text-center mb-10">
                        <h1 className="text-3xl sm:text-5xl font-black text-[var(--text-primary)] leading-tight font-display mb-4">
                            Form Pendaftaran <br className="hidden sm:block" />
                            <span className="text-[var(--primary)]">Darul Arqam Dasar</span>
                        </h1>
                        <p className="text-[var(--text-muted)] text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
                            Langkah awalmu untuk berproses, belajar, dan berdampak bersama Ikatan Mahasiswa Muhammadiyah.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-6 sm:p-10 shadow-xl space-y-6">

                        <div>
                            <label htmlFor="namaLengkap" className="form-label">Nama Lengkap</label>
                            <input
                                type="text"
                                id="namaLengkap"
                                name="namaLengkap"
                                required
                                value={formData.namaLengkap}
                                onChange={handleChange}
                                placeholder="Masukkan nama lengkap"
                                className="form-input"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="asal" className="form-label">Asal</label>
                                <input
                                    type="text"
                                    id="asal"
                                    name="asal"
                                    required
                                    value={formData.asal}
                                    onChange={handleChange}
                                    placeholder="Contoh: Surabaya"
                                    className="form-input"
                                />
                            </div>

                            <div>
                                <label htmlFor="tempatTanggalLahir" className="form-label">Tempat, Tanggal Lahir</label>
                                <input
                                    type="text"
                                    id="tempatTanggalLahir"
                                    name="tempatTanggalLahir"
                                    required
                                    value={formData.tempatTanggalLahir}
                                    onChange={handleChange}
                                    placeholder="Contoh: Surabaya, 17 Agustus 2005"
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="domisili" className="form-label">Domisili Saat Ini</label>
                            <input
                                type="text"
                                id="domisili"
                                name="domisili"
                                required
                                value={formData.domisili}
                                onChange={handleChange}
                                placeholder="Alamat tinggal saat ini"
                                className="form-input"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="asalKomisariat" className="form-label">Asal Komisariat</label>
                                <input
                                    type="text"
                                    id="asalKomisariat"
                                    name="asalKomisariat"
                                    required
                                    value={formData.asalKomisariat}
                                    onChange={handleChange}
                                    placeholder="Contoh: PK IMM Kaizen"
                                    className="form-input"
                                />
                            </div>

                            <div>
                                <label htmlFor="prodi" className="form-label">Program Studi</label>
                                <input
                                    type="text"
                                    id="prodi"
                                    name="prodi"
                                    required
                                    value={formData.prodi}
                                    onChange={handleChange}
                                    placeholder="Contoh: S1 Informatika"
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting || !isRegistrationOpen || isCheckingStatus}
                                className="btn-primary w-full justify-center py-4 text-xs font-bold tracking-widest uppercase shadow-md flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Memproses Pendaftaran...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" /> Kirim Pendaftaran
                                    </>
                                )}
                            </button>
                            <p className="text-center text-[11px] text-[var(--text-muted)] mt-4 flex items-center justify-center gap-1 font-sans">
                                <ShieldCheck className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                                Data Anda aman dan hanya digunakan untuk keperluan verifikasi pendaftaran DAD.
                            </p>
                        </div>

                    </form>
                </div>
            </main>

            <footer className="py-6 border-t border-[var(--border)] text-center text-[10px] sm:text-xs text-[var(--text-muted)] font-display uppercase tracking-widest relative z-10">
                © 2026 PK IMM Kaizen · Universitas Muhammadiyah Surabaya
            </footer>
        </div>
    )
}