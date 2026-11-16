'use client'

import { useState, useEffect, useRef } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Layers, Briefcase, ChevronUp, X } from 'lucide-react'

export interface Division {
    id: string
    name: string
    description: string
    color: string
    photo: string
    created_at: string
}

export default function ProfilBidangPage() {
    const [divisionsData, setDivisionsData] = useState<Division[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedDivision, setSelectedDivision] = useState<string>('')
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)

    const contentRef = useRef<HTMLDivElement>(null)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        fetchDivisions()
    }, [])

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [isMobileMenuOpen])

    const fetchDivisions = async () => {
        setIsLoading(true)
        try {
            const { data, error } = await supabase
                .from('divisions')
                .select('*')
                .order('created_at', { ascending: true })

            if (error) throw error

            if (data && data.length > 0) {
                setDivisionsData(data)

                const orgDiv = data.find(d => d.name.toLowerCase().includes('organisasi'))

                if (orgDiv) {
                    setSelectedDivision(orgDiv.id)
                } else {
                    setSelectedDivision(data[0].id)
                }
            }
        } catch (error: any) {
            console.error('Gagal mengambil data bidang:', error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDivisionChange = (id: string) => {
        setSelectedDivision(id)
        setIsMobileMenuOpen(false)

        if (contentRef.current) {
            const yOffset = typeof window !== 'undefined' && window.innerWidth < 1024 ? -20 : -80;
            const element = contentRef.current;
            const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }

    const filteredDivisions = divisionsData.filter(d => d.id === selectedDivision)

    const getActiveDivisionName = () => {
        const found = divisionsData.find(d => d.id === selectedDivision)
        return found ? found.name : 'Pilih Bidang'
    }

    return (
        <div className="w-full mk-dark mk-bg-dark min-h-screen selection:bg-[var(--mk-yellow)] selection:text-[var(--mk-maroon-deep)] font-sans pb-28 md:pb-16 relative">
            <div className="bg-[var(--mk-maroon-deep)] mk-curve-bottom relative pt-24 pb-20 overflow-hidden z-10 border-b-4 border-[var(--mk-yellow)]">
                <div className="mk-decor pointer-events-none">
                    <div className="mk-halftone mk-halftone--bl opacity-20"></div>
                    <div className="mk-star mk-star--lg mk-star--spin -right-8 top-10 opacity-30"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-6 sm:w-8 h-[2px] bg-[var(--mk-orange)]"></div>
                        <span className="mk-chip bg-[var(--mk-yellow)] text-[var(--mk-ink)] shadow-none text-xs md:text-sm">
                            Struktur Organisasi
                        </span>
                        <div className="w-6 sm:w-8 h-[2px] bg-[var(--mk-orange)]"></div>
                    </div>
                    <h1 className="mk-sticker-gradient text-[var(--mk-maroon)] text-4xl sm:text-5xl md:text-6xl lg:text-8xl tracking-tight relative flex justify-center w-full px-4">
                        <span aria-hidden="true" className="mk-sticker-stroke absolute text-transparent text-center">Profil Bidang</span>
                        <span className="mk-sticker-fill relative text-center">Profil Bidang</span>
                    </h1>
                </div>
            </div>

            <div ref={contentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 relative z-0">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-start">
                    <div className="hidden lg:block lg:col-span-4 xl:col-span-3 sticky top-24 lg:top-28 space-y-4 z-10">
                        <div className="mk-paper p-4 space-y-2 border-2 border-[var(--mk-ink)]">
                            <div className="flex items-center gap-2 px-3 py-2 text-xs font-black uppercase tracking-widest text-[var(--mk-ink)] font-display border-b-2 border-dashed border-[#d1d5db] mb-4">
                                <Layers className="w-4 h-4 text-[var(--mk-orange)] shrink-0" /> Pilih Bidang
                            </div>

                            {isLoading ? (
                                <div className="space-y-2 py-2">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className="h-11 bg-gray-200 rounded-xl animate-pulse"></div>
                                    ))}
                                </div>
                            ) : (
                                divisionsData.map((div) => {
                                    const isActive = selectedDivision === div.id
                                    return (
                                        <button
                                            key={div.id}
                                            onClick={() => handleDivisionChange(div.id)}
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold font-display uppercase tracking-wider transition-all text-left cursor-pointer border-2 ${
                                                isActive
                                                    ? 'bg-[var(--mk-yellow)] text-[var(--mk-ink)] border-[var(--mk-ink)] shadow-[2px_2px_0_var(--mk-ink)] translate-x-2'
                                                    : 'bg-white text-[var(--mk-ink)] opacity-70 border-transparent hover:border-[var(--mk-ink)] hover:opacity-100 hover:translate-x-1'
                                            }`}
                                        >
                                            <span className="truncate pr-2">{div.name}</span>
                                        </button>
                                    )
                                })
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-8 xl:col-span-9 space-y-8">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-24 bg-[var(--mk-dark)] rounded-3xl border-2 border-dashed border-[#374151]">
                                <div className="w-10 h-10 border-4 border-[var(--mk-yellow)] border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-sm font-bold text-white/70 font-display tracking-widest uppercase animate-pulse">
                                    Memuat Data Bidang...
                                </p>
                            </div>
                        ) : divisionsData.length === 0 ? (
                            <div className="text-center py-24 border-2 border-dashed border-[#e5e7eb] rounded-3xl mk-bg-light p-6">
                                <Briefcase className="w-12 h-12 text-[#9ca3af] mx-auto mb-4 opacity-40" />
                                <p className="text-[var(--mk-ink)] font-bold font-display uppercase tracking-wider opacity-70">
                                    Belum ada data bidang.
                                </p>
                            </div>
                        ) : (
                            filteredDivisions.map((div) => {
                                const realIndex = divisionsData.findIndex(d => d.id === div.id);
                                const numberDecor = (realIndex + 1).toString().padStart(2, '0');

                                return (
                                    <div key={div.id} className="mk-outline-box mk-bg-light relative overflow-hidden group">
                                        <div className="absolute -right-4 -top-6 text-[var(--mk-yellow)] opacity-[0.15] font-black text-8xl sm:text-9xl md:text-[12rem] select-none pointer-events-none font-display z-0 leading-none">
                                            {numberDecor}
                                        </div>

                                        <div className="relative z-10">
                                            <div className="flex flex-col mb-6 pb-4 border-b-4 border-[var(--mk-ink)] gap-3">
                                                <div className="mk-kicker text-[var(--mk-orange)] mb-1 sm:mb-2">Profil Bidang</div>
                                                <h2 className="mk-display text-3xl sm:text-4xl lg:text-5xl text-[var(--mk-ink)] uppercase tracking-tight break-words">
                                                    {div.name}
                                                </h2>
                                            </div>

                                            <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-[var(--mk-ink)] overflow-hidden mb-6 sm:mb-8 border-2 border-[var(--mk-ink)] shadow-[4px_4px_0_var(--mk-yellow)] md:shadow-[6px_6px_0_var(--mk-yellow)] transition-all duration-300 md:hover:shadow-[8px_8px_0_var(--mk-orange)] md:hover:-translate-y-1">
                                                {div.photo ? (
                                                    <img
                                                        src={div.photo}
                                                        alt={`Bidang ${div.name}`}
                                                        onError={(e) => {
                                                            (e.target as HTMLElement).style.display = 'none';
                                                        }}
                                                        className="w-full h-full object-cover transition-all duration-500 grayscale-0 lg:grayscale group-hover:grayscale-0"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                                                        <Briefcase className="w-10 h-10 sm:w-12 sm:h-12 text-white/20 mb-3" />
                                                        <span className="text-xs sm:text-sm font-bold tracking-widest uppercase font-display text-white/40">
                                                            Belum Ada Foto
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="text-[var(--mk-ink)] text-sm sm:text-base leading-relaxed font-medium border-l-4 border-[var(--mk-orange)] pl-4 sm:pl-5 py-1">
                                                {div.description ? (
                                                    <p className="whitespace-pre-line">{div.description}</p>
                                                ) : (
                                                    <span className="italic opacity-60">Belum ada rincian deskripsi tugas untuk bidang ini.</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>
            </div>

            {!isLoading && divisionsData.length > 0 && (
                <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full px-4 max-w-sm sm:max-w-md">
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="w-full bg-[var(--mk-yellow)] text-[var(--mk-ink)] border-2 border-[var(--mk-ink)] shadow-[4px_4px_0_var(--mk-ink)] rounded-full px-5 py-3.5 sm:py-4 flex items-center justify-between transition-transform active:scale-95"
                    >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                            <Layers className="w-5 h-5 shrink-0 text-[var(--mk-orange)]" />
                            <span className="font-black font-display uppercase tracking-widest text-xs sm:text-sm truncate">
                                {getActiveDivisionName()}
                            </span>
                        </div>
                        <ChevronUp className="w-5 h-5 shrink-0 ml-2" />
                    </button>
                </div>
            )}

            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
                    <div
                        className="absolute inset-0 bg-[var(--mk-ink)]/70 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsMobileMenuOpen(false)}
                    ></div>

                    <div className="relative bg-white border-t-4 border-[var(--mk-ink)] rounded-t-3xl pt-3 pb-8 px-4 flex flex-col max-h-[80vh] sm:max-h-[70vh] animate-in slide-in-from-bottom-full duration-300 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-5"></div>

                        <div className="flex items-center justify-between mb-4 px-2">
                            <h3 className="font-display font-black text-sm sm:text-base uppercase tracking-widest text-[var(--mk-ink)]">Pilih Bidang</h3>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="p-1.5 bg-gray-100 rounded-full text-gray-500 hover:text-[var(--mk-ink)] active:bg-gray-200">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="overflow-y-auto space-y-2.5 px-2 pb-14 scrollbar-none">
                            {divisionsData.map((div) => {
                                const isActive = selectedDivision === div.id
                                return (
                                    <button
                                        key={div.id}
                                        onClick={() => handleDivisionChange(div.id)}
                                        className={`w-full flex items-center justify-between px-4 py-4 rounded-xl text-xs sm:text-sm font-bold font-display uppercase tracking-wider transition-all text-left border-2 ${
                                            isActive
                                                ? 'bg-[var(--mk-yellow)] text-[var(--mk-ink)] border-[var(--mk-ink)] shadow-[2px_2px_0_var(--mk-ink)]'
                                                : 'bg-white text-[var(--mk-ink)] opacity-70 border-gray-200 active:bg-gray-50'
                                        }`}
                                    >
                                        <span className="truncate pr-2">{div.name}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}