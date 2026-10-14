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
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6 border border-[var(--primary)]/30 text-[var(--primary)]">
                            <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
                        </div>
                        <h2 className="text-xl sm:text-3xl font-black text-[var(--text-primary)] mb-2.5 sm:mb-3 font-display tracking-tight">
                            Pendaftaran Berhasil!
                        </h2>
                        <p className="text-[var(--text-secondary)] text-xs sm:text-sm mb-6 sm:mb-8 leading-relaxed">
                            Terima kasih, <strong className="text-[var(--text-primary)]">{formData.namaLengkap}</strong>. Data pendaftaran Darul Arqam Dasar (DAD) kamu telah kami terima. Panitia akan segera menghubungi kamu untuk informasi selanjutnya.
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

            {isCheckingStatus ? (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-[var(--primary)]" />
                        <p className="text-xs sm:text-sm font-bold text-white tracking-widest uppercase font-display">Mengecek Sistem...</p>
                    </div>
                </div>
            ) : !isRegistrationOpen ? (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl sm:rounded-[var(--radius)] p-6 sm:p-10 max-w-md w-full text-center shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                        <div
                            className="absolute top-0 left-0 w-full h-1.5"
                            style={{
                                background: 'linear-gradient(to right, var(--primary), var(--accent), var(--accent-light))'
                            }}
                        />

                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6 border border-[var(--primary)]/30 text-[var(--primary)]">
                            <Clock className="w-8 h-8 sm:w-10 sm:h-10" />
                        </div>

                        <h2 className="text-xl sm:text-3xl font-black text-[var(--text-primary)] mb-2.5 sm:mb-3 font-display uppercase tracking-tight">
                            Coming Soon!
                        </h2>

                        <p className="text-[var(--text-secondary)] text-xs sm:text-sm mb-6 sm:mb-8 leading-relaxed">
                            Pendaftaran Darul Arqam Dasar (DAD) saat ini <strong className="text-[var(--text-primary)]">belum dibuka</strong>. Pantau terus informasi terbaru melalui media sosial resmi IMM Kaizen UMSurabaya agar tidak ketinggalan jadwalnya!
                        </p>

                        <Link
                            href="/"
                            className="btn-primary w-full justify-center py-3.5 text-xs font-bold tracking-widest uppercase font-display flex items-center justify-center rounded-xl shadow-md transition-all"
                        >
                            Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            ) : null}

            <header className="p-4 sm:p-6 relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between">
                <Logo size="md" />
                <Link
                    href="/"
                    className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--primary)] flex items-center gap-1.5 font-display transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 text-[var(--primary)]" /> <span className="hidden xs:inline">Kembali ke Website</span>
                </Link>
            </header>

            <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10 my-auto">
                <div className={`transition-all duration-300 ${(!isRegistrationOpen || isCheckingStatus) ? 'pointer-events-none opacity-40 select-none' : ''}`}>

                    <div className="text-center mb-8 sm:mb-10">
                        <h1 className="text-2xl xs:text-3xl sm:text-5xl font-black text-[var(--text-primary)] leading-tight font-display mb-3 tracking-tight">
                            Form Pendaftaran <br className="hidden sm:block" />
                            <span className="text-[var(--primary)]">Darul Arqam Dasar</span>
                        </h1>
                        <p className="text-[var(--text-muted)] text-xs sm:text-sm max-w-xl mx-auto leading-relaxed px-2">
                            Langkah awalmu untuk berproses, belajar, dan berdampak bersama Ikatan Mahasiswa Muhammadiyah.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl sm:rounded-[var(--radius)] p-5 sm:p-8 md:p-10 shadow-xl space-y-5 sm:space-y-6">

                        <div>
                            <label htmlFor="namaLengkap" className="form-label block text-xs sm:text-sm font-medium mb-1.5">Nama Lengkap</label>
                            <input
                                type="text"
                                id="namaLengkap"
                                name="namaLengkap"
                                required
                                value={formData.namaLengkap}
                                onChange={handleChange}
                                placeholder="Masukkan nama lengkap"
                                className="form-input w-full px-4 py-2.5 sm:py-3 text-xs sm:text-sm rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                            <div>
                                <label htmlFor="asal" className="form-label block text-xs sm:text-sm font-medium mb-1.5">Asal Daerah / Kota</label>
                                <input
                                    type="text"
                                    id="asal"
                                    name="asal"
                                    required
                                    value={formData.asal}
                                    onChange={handleChange}
                                    placeholder="Contoh: Surabaya"
                                    className="form-input w-full px-4 py-2.5 sm:py-3 text-xs sm:text-sm rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all"
                                />
                            </div>

                            <div>
                                <label htmlFor="tempatTanggalLahir" className="form-label block text-xs sm:text-sm font-medium mb-1.5">Tempat, Tanggal Lahir</label>
                                <input
                                    type="text"
                                    id="tempatTanggalLahir"
                                    name="tempatTanggalLahir"
                                    required
                                    value={formData.tempatTanggalLahir}
                                    onChange={handleChange}
                                    placeholder="Contoh: Surabaya, 17 Agustus 2005"
                                    className="form-input w-full px-4 py-2.5 sm:py-3 text-xs sm:text-sm rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="domisili" className="form-label block text-xs sm:text-sm font-medium mb-1.5">Domisili Saat Ini</label>
                            <input
                                type="text"
                                id="domisili"
                                name="domisili"
                                required
                                value={formData.domisili}
                                onChange={handleChange}
                                placeholder="Alamat tinggal / kos saat ini"
                                className="form-input w-full px-4 py-2.5 sm:py-3 text-xs sm:text-sm rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                            <div>
                                <label htmlFor="asalKomisariat" className="form-label block text-xs sm:text-sm font-medium mb-1.5">Asal Komisariat / Fakultas</label>
                                <input
                                    type="text"
                                    id="asalKomisariat"
                                    name="asalKomisariat"
                                    required
                                    value={formData.asalKomisariat}
                                    onChange={handleChange}
                                    placeholder="Contoh: PK IMM Kaizen"
                                    className="form-input w-full px-4 py-2.5 sm:py-3 text-xs sm:text-sm rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all"
                                />
                            </div>

                            <div>
                                <label htmlFor="prodi" className="form-label block text-xs sm:text-sm font-medium mb-1.5">Program Studi</label>
                                <input
                                    type="text"
                                    id="prodi"
                                    name="prodi"
                                    required
                                    value={formData.prodi}
                                    onChange={handleChange}
                                    placeholder="Contoh: S1 Informatika"
                                    className="form-input w-full px-4 py-2.5 sm:py-3 text-xs sm:text-sm rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting || !isRegistrationOpen || isCheckingStatus}
                                className="btn-primary w-full justify-center py-3.5 sm:py-4 text-xs font-bold tracking-widest uppercase shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 rounded-xl transition-all hover:-translate-y-0.5"
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
                            <p className="text-center text-[10px] sm:text-[11px] text-[var(--text-muted)] mt-3.5 flex items-center justify-center gap-1.5 font-sans leading-normal">
                                <ShieldCheck className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                                Data Anda aman dan hanya digunakan untuk keperluan verifikasi pendaftaran DAD.
                            </p>
                        </div>

                    </form>
                </div>
            </main>

            <footer className="py-5 sm:py-6 border-t border-[var(--border)] text-center text-[10px] sm:text-xs text-[var(--text-muted)] font-display uppercase tracking-widest relative z-10 px-4">
                © 2026 PK IMM Kaizen · Universitas Muhammadiyah Surabaya
            </footer>
        </div>
    )
}