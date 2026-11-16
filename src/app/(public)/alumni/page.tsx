'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { GraduationCap, ArrowRight, MessageCircle, Award } from 'lucide-react'

const WHATSAPP_NUMBER = '6282322143305'

interface Alumni {
    id: string
    name: string
    batch: string
    role: string
    achievement: string
    bio: string
    photo: string
}

export default function AlumniPage() {
    const [alumniData, setAlumniData] = useState<Alumni[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        const fetchAlumni = async () => {
            try {
                const { data, error } = await supabase
                    .from('alumni')
                    .select('*')
                    .order('batch', { ascending: false })

                if (error) throw error
                if (data) setAlumniData(data)
            } catch (error) {
                console.error('Error fetching alumni:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchAlumni()
    }, [supabase])

    const handleContactAdmin = () => {
        const message = encodeURIComponent(
            'Halo Pengurus IMM Kaizen, saya alumni IMM Kaizen ingin memperbarui data alumni / berkontribusi untuk jejaring organisasi.'
        )
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank')
    }

    return (
        <div className="w-full mk-dark mk-bg-dark min-h-screen selection:bg-[var(--mk-yellow)] selection:text-[var(--mk-maroon-deep)] font-sans pb-24 relative">
            <div className="bg-[var(--mk-maroon-deep)] mk-curve-bottom relative pt-28 pb-20 md:pb-24 overflow-hidden z-10 border-b-4 border-[var(--mk-yellow)]">
                <div className="mk-decor pointer-events-none">
                    <div className="mk-halftone mk-halftone--bl opacity-20"></div>
                    <div className="mk-star mk-star--lg mk-star--spin -right-8 top-10 opacity-30"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
                    <div className="flex items-center gap-3 mb-5 md:mb-6">
                        <div className="w-6 sm:w-10 h-[2px] bg-[var(--mk-orange)]"></div>
                        <span className="mk-chip bg-[var(--mk-yellow)] text-[var(--mk-ink)] shadow-none text-[10px] sm:text-xs md:text-sm font-black px-3 py-1.5">
                            Mereka yang Menginspirasi
                        </span>
                        <div className="w-6 sm:w-10 h-[2px] bg-[var(--mk-orange)]"></div>
                    </div>

                    <h1 className="mk-sticker-gradient text-[var(--mk-maroon)] text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] xl:text-[5.5rem] tracking-tight relative flex justify-center w-full px-2 sm:px-4">
                        <span aria-hidden="true" className="mk-sticker-stroke absolute text-transparent text-center leading-tight">Alumni Inspiratif</span>
                        <span className="mk-sticker-fill relative text-center leading-tight">Alumni Inspiratif</span>
                    </h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 relative z-0">
                <div className="mk-paper border-2 border-[var(--mk-ink)] mb-12 sm:mb-16 relative overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-[var(--mk-yellow)] border-2 border-[var(--mk-ink)] shadow-[3px_3px_0_var(--mk-ink)] flex items-center justify-center shrink-0">
                            <GraduationCap className="w-6 h-6 text-[var(--mk-ink)]" />
                        </div>
                        <p className="text-sm sm:text-base md:text-lg text-[var(--mk-ink)] leading-relaxed font-semibold">
                            IMM Kaizen bangga dengan jejaring alumni yang telah memberikan kontribusi nyata di berbagai sektor. Mereka adalah bukti konkret bahwa iklim kaderisasi yang tajam dan terarah mampu melahirkan tokoh-tokoh penggerak peradaban.
                        </p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-[var(--mk-dark)] rounded-3xl border-2 border-dashed border-[#374151]">
                        <div className="w-10 h-10 border-4 border-[var(--mk-yellow)] border-t-transparent rounded-full animate-spin mb-4"></div>
                        <span className="text-sm font-bold text-white/70 font-display tracking-widest uppercase animate-pulse">
                            Memuat Data Alumni...
                        </span>
                    </div>
                ) : alumniData.length === 0 ? (
                    <div className="text-center py-24 border-2 border-dashed border-[#e5e7eb] rounded-3xl mk-bg-light p-6">
                        <GraduationCap className="w-12 h-12 text-[var(--mk-ink)]/30 mx-auto mb-4" />
                        <p className="text-[var(--mk-ink)] font-bold font-display uppercase tracking-wider opacity-70 text-sm md:text-base">
                            Belum ada data alumni yang ditampilkan saat ini.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {alumniData.map((alumni) => (
                            <div
                                key={alumni.id}
                                className="group flex flex-col justify-between bg-white border-2 border-[var(--mk-ink)] rounded-2xl overflow-hidden shadow-[4px_4px_0_var(--mk-ink)] sm:shadow-[6px_6px_0_var(--mk-ink)] hover:shadow-[6px_6px_0_var(--mk-orange)] md:hover:shadow-[8px_8px_0_var(--mk-orange)] hover:-translate-y-1.5 transition-all duration-300"
                            >
                                <div>
                                    <div className="aspect-[4/3] w-full overflow-hidden relative bg-[var(--mk-ink)] border-b-2 border-[var(--mk-ink)]">
                                        <img
                                            src={alumni.photo || '/img/profile/imm.jpeg'}
                                            alt={alumni.name}
                                            className="w-full h-full object-cover transition-all duration-500 grayscale-0 lg:grayscale group-hover:grayscale-0 group-hover:scale-105"
                                        />
                                        <div className="absolute top-3 right-3 bg-[var(--mk-yellow)] text-[var(--mk-ink)] border-2 border-[var(--mk-ink)] shadow-[2px_2px_0_var(--mk-ink)] text-[10px] sm:text-xs font-black tracking-widest px-2.5 py-1 rounded-md font-display uppercase">
                                            Angkatan {alumni.batch}
                                        </div>
                                    </div>

                                    <div className="p-5 sm:p-6 bg-white mk-bg-light">
                                        <span className="text-[var(--mk-orange)] text-[10px] sm:text-xs font-black uppercase tracking-widest block mb-1.5 font-display">
                                            {alumni.role}
                                        </span>
                                        <h3 className="text-xl sm:text-2xl font-black text-[var(--mk-ink)] font-display uppercase tracking-tight mb-3 leading-tight group-hover:text-[var(--mk-maroon)] transition-colors">
                                            {alumni.name}
                                        </h3>

                                        {alumni.achievement && (
                                            <div className="mb-4 p-3 rounded-xl bg-[var(--mk-cream)] border-2 border-[var(--mk-ink)] shadow-[2px_2px_0_var(--mk-ink)] flex items-start gap-2.5">
                                                <Award className="w-4 h-4 text-[var(--mk-orange)] shrink-0 mt-0.5" />
                                                <span className="text-xs sm:text-sm font-bold text-[var(--mk-ink)] leading-snug">
                                                    {alumni.achievement}
                                                </span>
                                            </div>
                                        )}

                                        <p className="text-xs sm:text-sm text-[var(--mk-ink)]/80 font-medium leading-relaxed line-clamp-3">
                                            {alumni.bio}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-16 sm:mt-24 mk-outline-box mk-bg-light border-2 border-[var(--mk-ink)] shadow-[6px_6px_0_var(--mk-yellow)] sm:shadow-[10px_10px_0_var(--mk-yellow)] p-6 sm:p-10 md:p-12 relative overflow-hidden group">
                    <div className="mk-decor pointer-events-none">
                        <div className="mk-halftone mk-halftone--tr opacity-15"></div>
                    </div>
                    <div className="absolute -right-4 -bottom-8 text-[var(--mk-yellow)] opacity-35 font-black text-8xl sm:text-9xl md:text-[11rem] select-none group-hover:scale-105 transition-transform duration-700 font-display pointer-events-none leading-none">
                        #
                    </div>

                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
                        <div className="max-w-2xl">
                            <span className="mk-chip bg-[var(--mk-orange)] text-white border-2 border-[var(--mk-ink)] shadow-[2px_2px_0_var(--mk-ink)] mb-3">
                                Jejaring Kaizen
                            </span>
                            <h3 className="mk-display text-3xl sm:text-4xl md:text-5xl text-[var(--mk-ink)] mb-3 uppercase tracking-tight">
                                Anda Alumni IMM Kaizen?
                            </h3>
                            <p className="text-[var(--mk-ink)]/80 text-xs sm:text-sm md:text-base font-medium leading-relaxed">
                                Mari perkuat simpul ikatan. Hubungi pimpinan aktif untuk pembaruan database, kolaborasi program, atau berbagi inspirasi di halaman etalase ini.
                            </p>
                        </div>

                        <button
                            onClick={handleContactAdmin}
                            className="w-full sm:w-auto inline-flex items-center justify-center bg-[var(--mk-yellow)] text-[var(--mk-ink)] border-2 border-[var(--mk-ink)] px-6 sm:px-8 py-4 text-xs sm:text-sm font-black tracking-widest uppercase rounded-xl shadow-[4px_4px_0_var(--mk-ink)] hover:bg-[var(--mk-orange)] hover:text-white hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[2px_2px_0_var(--mk-ink)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all whitespace-nowrap font-display group/btn cursor-pointer shrink-0"
                        >
                            <MessageCircle className="w-4 h-4 mr-2 shrink-0" />
                            <span>Hubungi Pengurus</span>
                            <ArrowRight className="w-4 h-4 ml-2 shrink-0 transition-transform group-hover/btn:translate-x-1" />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}