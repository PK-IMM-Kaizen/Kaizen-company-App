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
            <div className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden font-sans mk-light mk-bg-light selection:bg-[var(--mk-yellow)] selection:text-[var(--mk-maroon-deep)]">
                <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between p-4 sm:p-6 lg:p-8">
                    <Logo size="md" />
                </header>

                <main className="relative z-10 my-auto flex flex-1 items-center justify-center p-4 sm:p-6">
                    <div className="pointer-events-none absolute inset-0 overflow-hidden mk-decor">
                        <div className="opacity-10 mk-halftone mk-halftone--tl"></div>
                        <div className="opacity-10 mk-halftone mk-halftone--br"></div>
                    </div>

                    <div className="relative z-20 w-full max-w-lg animate-in fade-in zoom-in-95 duration-500 rounded-2xl border-2 border-[var(--mk-ink)] bg-white p-8 text-center shadow-[8px_8px_0_var(--mk-ink)] sm:p-12">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[var(--mk-ink)] bg-[var(--mk-yellow)] text-[var(--mk-ink)] shadow-[4px_4px_0_var(--mk-ink)]">
                            <CheckCircle2 className="h-10 w-10" />
                        </div>
                        <h2 className="mb-4 font-display text-2xl font-black uppercase tracking-tight text-[var(--mk-ink)] sm:text-3xl">
                            Aspirasi Terkirim!
                        </h2>
                        <p className="mb-8 text-sm font-medium leading-relaxed text-[var(--mk-ink)]/80 sm:text-base">
                            Terima kasih atas masukan dan evaluasi yang Anda berikan. Suara Anda sangat berharga untuk kemajuan kepengurusan IMM Kaizen.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex w-full items-center justify-center rounded-xl border-2 border-[var(--mk-ink)] bg-[var(--mk-ink)] px-6 py-4 font-display text-sm font-black uppercase tracking-widest text-white shadow-[4px_4px_0_var(--mk-yellow)] transition-all hover:-translate-x-1 hover:-translate-y-1 hover:bg-[var(--mk-maroon)] hover:shadow-[6px_6px_0_var(--mk-yellow)] active:translate-x-1 active:translate-y-1 active:shadow-none sm:text-base"
                        >
                            Kembali ke Beranda
                        </Link>
                    </div>
                </main>

                <footer className="relative z-10 flex justify-center px-4 pb-8 pt-4">
                    <p className="flex items-center gap-2 rounded-full border-2 border-[var(--mk-ink)] bg-white px-5 py-2.5 font-display text-[10px] font-black uppercase tracking-widest text-[var(--mk-ink)] shadow-[4px_4px_0_var(--mk-ink)] sm:gap-3 sm:text-sm">
                        <span>@IMM Kaizen UMSURA</span>
                        <span aria-hidden className="h-4 w-[2px] bg-[var(--mk-ink)]/30" />
                        <span className="text-[var(--mk-orange)]">Bidang Organisasi</span>
                    </p>
                </footer>
            </div>
        )
    }

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden font-sans mk-light mk-bg-light selection:bg-[var(--mk-yellow)] selection:text-[var(--mk-maroon-deep)]">
            <div className="relative z-10 border-b-4 border-[var(--mk-yellow)] bg-[var(--mk-maroon-deep)] pb-28 pt-6 sm:pb-36 lg:pb-40 mk-curve-bottom">

                <header className="relative z-20 mx-auto mb-10 flex w-full max-w-7xl items-center justify-between px-4 sm:mb-16 sm:px-6 lg:px-8">
                    <Link
                        href="/"
                        className="flex items-center gap-2 rounded-full border border-white/10 bg-[var(--mk-ink)]/40 px-4 py-2 font-display text-[10px] font-black uppercase tracking-widest text-white transition-colors hover:text-[var(--mk-yellow)] sm:text-xs"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span className="hidden xs:inline">Beranda</span>
                        <span className="xs:hidden">Kembali</span>
                    </Link>
                </header>

                <div className="pointer-events-none mk-decor">
                    <div className="opacity-20 mk-halftone mk-halftone--bl"></div>
                    <div className="-right-8 top-20 opacity-30 mk-star mk-star--lg mk-star--spin"></div>
                </div>

                <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-4 text-center sm:px-6">
                    <div className="mb-5 flex w-full items-center justify-center gap-3 md:mb-6">
                        <div className="hidden h-[2px] w-6 bg-[var(--mk-orange)] xs:block sm:w-10"></div>
                        <span className="whitespace-nowrap bg-[var(--mk-yellow)] px-4 py-1.5 font-display text-[10px] font-black uppercase text-[var(--mk-ink)] sm:text-xs md:text-sm mk-chip shadow-none">
                            Aspirasi Terbuka
                        </span>
                        <div className="hidden h-[2px] w-6 bg-[var(--mk-orange)] xs:block sm:w-10"></div>
                    </div>

                    <h1 className="relative flex w-full justify-center px-2 text-4xl tracking-tight text-[var(--mk-maroon)] xs:text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] mk-sticker-gradient">
                        <span aria-hidden="true" className="absolute text-center leading-tight text-transparent mk-sticker-stroke">Suara Mahasiswa</span>
                        <span className="relative text-center leading-tight mk-sticker-fill">Suara Mahasiswa</span>
                    </h1>

                    <p className="mx-auto mt-6 max-w-xl px-2 text-sm font-medium leading-relaxed text-white/90 sm:text-base">
                        Sampaikan kritik, saran, ide, atau aspirasimu untuk Pimpinan Komisariat IMM Kaizen secara terbuka atau anonim.
                    </p>
                </div>
            </div>

            <main className="relative z-20 mx-auto -mt-16 flex w-full max-w-3xl flex-1 flex-col px-4 pb-12 sm:-mt-24 sm:px-6 lg:-mt-28">
                {errorMessage && (
                    <div className="mb-6 flex items-center gap-3 rounded-xl border-2 border-[var(--mk-ink)] bg-white p-4 font-display text-xs font-black uppercase text-[var(--mk-maroon)] shadow-[4px_4px_0_var(--mk-maroon)] sm:text-sm">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <span className="leading-snug">{errorMessage}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border-2 border-[var(--mk-ink)] bg-white p-5 shadow-[6px_6px_0_var(--mk-ink)] sm:space-y-8 sm:p-8 md:p-10 md:shadow-[8px_8px_0_var(--mk-ink)]">
                    <div>
                        <div className="mb-2.5 flex flex-col justify-between gap-2 xs:flex-row xs:items-center">
                            <label htmlFor="nama" className="font-display text-xs font-black uppercase tracking-wider text-[var(--mk-ink)] sm:text-sm">
                                Nama Lengkap
                            </label>
                            <span className="w-fit rounded border border-[var(--mk-ink)] bg-[var(--mk-cream)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[var(--mk-ink)] sm:text-[10px]">
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
                            className="w-full rounded-xl border-2 border-[var(--mk-ink)] bg-white px-4 py-3.5 text-sm font-medium text-[var(--mk-ink)] placeholder-[var(--mk-ink)]/40 transition-all duration-300 focus:-translate-x-1 focus:-translate-y-1 focus:shadow-[4px_4px_0_var(--mk-orange)] focus:outline-none sm:text-base"
                        />
                    </div>

                    <div>
                        <label htmlFor="kategori" className="mb-2.5 block font-display text-xs font-black uppercase tracking-wider text-[var(--mk-ink)] sm:text-sm">
                            Kategori Aspirasi
                        </label>
                        <select
                            id="kategori"
                            name="kategori"
                            required
                            value={formData.kategori}
                            onChange={handleChange}
                            className="w-full cursor-pointer appearance-none rounded-xl border-2 border-[var(--mk-ink)] bg-white px-4 py-3.5 text-sm font-medium text-[var(--mk-ink)] transition-all duration-300 focus:-translate-x-1 focus:-translate-y-1 focus:shadow-[4px_4px_0_var(--mk-orange)] focus:outline-none sm:text-base"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%230f172a'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                backgroundPosition: 'right 1rem center',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: '1.2em 1.2em'
                            }}
                        >
                            <option value="" disabled>-- Pilih Kategori --</option>
                            <option value="Kritik & Saran Organisasi">Kritik & Saran Organisasi</option>
                            <option value="Ide Program Kerja">Ide Program Kerja</option>
                            <option value="Fasilitas & Layanan">Fasilitas & Layanan Kemahasiswaan</option>
                            <option value="Aduan Khusus">Aduan Khusus</option>
                            <option value="Lainnya">Lainnya</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="pesan" className="mb-2.5 block font-display text-xs font-black uppercase tracking-wider text-[var(--mk-ink)] sm:text-sm">
                            Isi Aspirasi
                        </label>
                        <textarea
                            id="pesan"
                            name="pesan"
                            required
                            rows={5}
                            value={formData.pesan}
                            onChange={handleChange}
                            placeholder="Tuliskan pesan, evaluasi, atau ide kamu secara tajam dan jelas di sini..."
                            className="w-full resize-none rounded-xl border-2 border-[var(--mk-ink)] bg-white px-4 py-3.5 text-sm font-medium leading-relaxed text-[var(--mk-ink)] placeholder-[var(--mk-ink)]/40 transition-all duration-300 focus:-translate-x-1 focus:-translate-y-1 focus:shadow-[4px_4px_0_var(--mk-orange)] focus:outline-none sm:text-base md:rows-6"
                        ></textarea>
                    </div>

                    <div className="border-t-2 border-dashed border-[var(--mk-ink)]/20 pt-5 sm:pt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group flex w-full items-center justify-center gap-3 rounded-xl border-2 border-[var(--mk-ink)] bg-[var(--mk-yellow)] px-6 py-4 font-display text-xs font-black uppercase tracking-widest text-[var(--mk-ink)] shadow-[4px_4px_0_var(--mk-ink)] transition-all hover:-translate-x-1 hover:-translate-y-1 hover:bg-[var(--mk-orange)] hover:text-white hover:shadow-[6px_6px_0_var(--mk-ink)] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:pointer-events-none disabled:opacity-60 sm:text-sm"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Mengirim...
                                </>
                            ) : (
                                <>
                                    <Send className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                                    Kirim Aspirasi Sekarang
                                </>
                            )}
                        </button>

                        <div className="mx-auto mt-5 flex max-w-max items-center justify-center gap-2 rounded-lg border border-[var(--mk-ink)] bg-[var(--mk-cream)] px-3 py-2 sm:px-4">
                            <ShieldCheck className="h-4 w-4 shrink-0 text-[var(--mk-orange)] sm:h-5 sm:w-5" />
                            <p className="text-center text-[9px] font-bold uppercase tracking-wider text-[var(--mk-ink)] sm:text-[10px] md:text-[11px]">
                                Suara dan identitas Anda dijaga kerahasiaannya.
                            </p>
                        </div>
                    </div>

                </form>
            </main>

            <footer className="relative z-10 flex justify-center px-4 pb-10 pt-4 sm:pb-12 sm:pt-6">
                <p className="flex cursor-default items-center gap-2 rounded-full border-2 border-[var(--mk-ink)] bg-white px-4 py-2.5 font-display text-[10px] font-black uppercase tracking-widest text-[var(--mk-ink)] shadow-[4px_4px_0_var(--mk-ink)] transition-transform hover:-translate-y-1 sm:gap-3 sm:px-5 sm:text-xs md:text-sm">
                    <span>@IMM Kaizen</span>
                    <span aria-hidden className="h-3 w-[2px] bg-[var(--mk-ink)]/30 sm:h-4" />
                    <span className="text-[var(--mk-orange)]">Bidang Organisasi</span>
                </p>
            </footer>
        </div>
    )
}