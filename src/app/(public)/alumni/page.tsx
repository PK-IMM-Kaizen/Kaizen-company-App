'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { GraduationCap, ArrowRight, MessageCircle } from 'lucide-react'

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
        <div className="bg-[var(--background)] min-h-screen font-sans selection:bg-[var(--primary)] selection:text-white">
            <div className="relative bg-[var(--primary-dark)] pt-28 sm:pt-32 pb-16 sm:pb-20 overflow-hidden">
                <div
                    className="absolute top-0 left-0 w-full h-1"
                    style={{
                        background: 'linear-gradient(to right, var(--primary), var(--accent), var(--accent-light))'
                    }}
                />
                <div
                    className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none"
                    style={{
                        background: 'linear-gradient(to left, var(--primary), transparent)'
                    }}
                />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div className="w-6 sm:w-8 h-[1px] bg-[var(--accent)]"></div>
                        <span className="text-[var(--accent)] text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.2em] uppercase font-display">
                            Mereka yang Menginspirasi
                        </span>
                    </div>
                    <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight font-display">
                        Alumni Inspiratif
                    </h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
                <div className="max-w-3xl mb-12 sm:mb-16">
                    <p className="text-sm sm:text-base md:text-lg text-[var(--text-secondary)] leading-relaxed font-medium">
                        IMM Kaizen bangga dengan jejaring alumni yang telah memberikan kontribusi nyata di berbagai sektor. Mereka adalah bukti konkret bahwa iklim kaderisasi yang tajam dan terarah mampu melahirkan tokoh-tokoh penggerak peradaban.
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-16 sm:py-20">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs sm:text-sm text-[var(--text-muted)] font-display font-bold mt-4 animate-pulse">
                            Memuat data alumni...
                        </span>
                    </div>
                ) : alumniData.length === 0 ? (
                    <div className="text-center py-16 bg-[var(--card)] border border-dashed border-[var(--border)] rounded-2xl p-8 max-w-2xl mx-auto">
                        <GraduationCap className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3 opacity-50" />
                        <p className="text-xs sm:text-sm text-[var(--text-muted)] font-medium">Belum ada data alumni yang ditampilkan saat ini.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {alumniData.map((alumni) => (
                            <div
                                key={alumni.id}
                                className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-[var(--primary)]/60 transition-all shadow-sm hover:shadow-xl flex flex-col justify-between group"
                            >
                                <div>
                                    <div className="aspect-[16/11] sm:aspect-[4/3] w-full overflow-hidden relative bg-[var(--surface)]">
                                        <img
                                            src={alumni.photo || '/img/profile/imm.jpeg'}
                                            alt={alumni.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-[#6B46C1] text-white text-[10px] sm:text-xs font-black tracking-widest px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg shadow-md font-display">
                                            {alumni.batch}
                                        </div>
                                    </div>
                                    <div className="p-5 sm:p-6">
                                        <span className="text-[var(--primary)] text-[10px] sm:text-xs font-bold uppercase tracking-wider block mb-1.5 font-display">
                                            {alumni.role}
                                        </span>
                                        <h3 className="text-lg sm:text-xl font-black text-[var(--text-primary)] font-display mb-2.5 leading-snug">
                                            {alumni.name}
                                        </h3>
                                        {alumni.achievement && (
                                            <div className="mb-3.5 text-xs sm:text-sm font-semibold text-[var(--text-secondary)] border-l-2 border-[var(--accent)] pl-3 leading-relaxed">
                                                {alumni.achievement}
                                            </div>
                                        )}
                                        <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed line-clamp-3">
                                            {alumni.bio}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-16 sm:mt-24 bg-[#111111] border-l-4 border-[var(--primary)] p-6 sm:p-10 md:p-12 relative overflow-hidden group rounded-2xl shadow-2xl">
                    <div
                        className="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none"
                        style={{ background: 'linear-gradient(to left, var(--primary), transparent)' }}
                    />
                    <div className="absolute -right-8 -bottom-8 text-white/5 opacity-20 font-black text-8xl sm:text-9xl select-none group-hover:scale-105 transition-transform duration-700 font-display pointer-events-none">
                        #
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8">
                        <div className="max-w-2xl">
                            <span className="text-[var(--accent)] text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase mb-2 block font-display">
                                Jejaring Kaizen
                            </span>
                            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-2 sm:mb-3 font-display">
                                Anda Alumni IMM Kaizen?
                            </h3>
                            <p className="text-[#a0a0a0] text-xs sm:text-sm leading-relaxed">
                                Mari perkuat simpul ikatan. Hubungi pimpinan aktif untuk pembaruan database, kolaborasi program, atau berbagi inspirasi di halaman etalase ini.
                            </p>
                        </div>
                        <button
                            onClick={handleContactAdmin}
                            className="w-full sm:w-auto inline-flex items-center justify-center bg-[var(--primary)] text-white px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-bold tracking-widest uppercase transition-all hover:bg-[var(--primary-dark)] whitespace-nowrap rounded-xl font-display group cursor-pointer shadow-lg shadow-[var(--primary)]/20 hover:-translate-y-0.5 shrink-0"
                        >
                            <MessageCircle className="w-4 h-4 mr-2" /> Hubungi Pengurus
                            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}