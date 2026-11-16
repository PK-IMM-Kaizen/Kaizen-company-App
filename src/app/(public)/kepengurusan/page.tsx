'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Layers, Users, ChevronUp, Star, X } from 'lucide-react'

export interface Management {
    id: string
    name: string
    position: string
    division: string
    isLeader: boolean
    photo: string
    createdAt?: string
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

const divisionOrder = [
    'Polum',
    'Organisasi',
    'Perkaderan',
    'Hikmah Politik & Kebijakan Publik',
    'Riset & Pengembangan Keilmuan',
    'Tabligh & Kajian Keislaman',
    'Sosial Pemberdayaan Masyarakat',
    'Ekonomi & Kewirausahaan',
    'IMMawati',
    'Seni Budaya & Olahraga',
    'Media Komunikasi & Informasi'
]

export default function PengurusPage() {
    const [activeTab, setActiveTab] = useState<string>('Polum')
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)
    const [managementData, setManagementData] = useState<Management[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const contentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchPengurus = async () => {
            try {
                const { data, error } = await supabase
                    .from('pengurus')
                    .select('*')
                    .order('created_at', { ascending: true })

                if (error) throw error

                if (data) {
                    const formattedData: Management[] = data.map((item: any) => ({
                        id: item.id,
                        name: item.name,
                        position: item.position,
                        division: item.division === 'BPH' ? 'Polum' : item.division,
                        isLeader: item.is_leader,
                        photo: item.photo,
                        createdAt: item.created_at
                    }))
                    setManagementData(formattedData)
                }
            } catch (error) {
                console.error('Error fetching pengurus:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchPengurus()
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

    const handleTabChange = (divName: string) => {
        setActiveTab(divName)
        setIsMobileMenuOpen(false)

        if (contentRef.current) {
            const yOffset = -80;
            const element = contentRef.current;
            const y = element.getBoundingClientRect().top + window.scrollY + yOffset;

            window.scrollTo({ top: y, behavior: 'smooth' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    const grouped: Record<string, Management[]> = {}
    managementData.forEach(m => {
        if (!grouped[m.division]) grouped[m.division] = []
        grouped[m.division].push(m)
    })

    const activeMembers = grouped[activeTab] || []

    return (
        <div className="w-full mk-dark mk-bg-dark min-h-screen selection:bg-[var(--mk-yellow)] selection:text-[var(--mk-maroon-deep)] font-sans pb-24 md:pb-16 relative">
            <div className="bg-[var(--mk-maroon-deep)] mk-curve-bottom relative pt-24 pb-20 overflow-hidden z-10 border-b-4 border-[var(--mk-yellow)]">
                <div className="mk-decor pointer-events-none">
                    <div className="mk-halftone mk-halftone--bl opacity-20"></div>
                    <div className="mk-star mk-star--lg mk-star--spin -right-8 top-10 opacity-30"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-6 sm:w-8 h-[2px] bg-[var(--mk-orange)]"></div>
                        <span className="mk-chip bg-[var(--mk-yellow)] text-[var(--mk-ink)] shadow-none">
                            Periode 2026 - 2027
                        </span>
                        <div className="w-6 sm:w-8 h-[2px] bg-[var(--mk-orange)]"></div>
                    </div>
                    <h1 className="mk-sticker-gradient text-[var(--mk-maroon)] text-4xl sm:text-5xl md:text-7xl lg:text-8xl tracking-tight relative flex justify-center w-full">
                        <span aria-hidden="true" className="mk-sticker-stroke absolute text-transparent">Struktur Pengurus</span>
                        <span className="mk-sticker-fill relative text-center">Struktur Pengurus</span>
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
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <div key={i} className="h-11 bg-gray-200 rounded-xl animate-pulse"></div>
                                    ))}
                                </div>
                            ) : (
                                divisionOrder.map((divName) => {
                                    const members = grouped[divName]
                                    if (!members || members.length === 0) return null
                                    const isActive = activeTab === divName

                                    return (
                                        <button
                                            key={divName}
                                            onClick={() => handleTabChange(divName)} /* 4. Gunakan fungsi baru */
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold font-display uppercase tracking-wider transition-all text-left cursor-pointer border-2 ${
                                                isActive
                                                    ? 'bg-[var(--mk-yellow)] text-[var(--mk-ink)] border-[var(--mk-ink)] shadow-[2px_2px_0_var(--mk-ink)] translate-x-2'
                                                    : 'bg-white text-[var(--mk-ink)] opacity-70 border-transparent hover:border-[var(--mk-ink)] hover:opacity-100 hover:translate-x-1'
                                            }`}
                                        >
                                            <span className="truncate pr-2">
                                                {divName === 'Polum' ? 'Polisi Umum' : divName}
                                            </span>
                                            <span className={`shrink-0 text-[10px] px-2.5 py-1 rounded-md font-bold ${isActive ? 'bg-[var(--mk-ink)] text-white' : 'bg-gray-200 text-[var(--mk-ink)]'}`}>
                                                {members.length}
                                            </span>
                                        </button>
                                    )
                                })
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-8 xl:col-span-9">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-[var(--mk-dark)] rounded-2xl border-2 border-dashed border-[#374151]">
                                <div className="w-10 h-10 border-4 border-[var(--mk-yellow)] border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-sm font-bold text-white/70 font-display tracking-widest uppercase animate-pulse">
                                    Memuat Data Pengurus...
                                </p>
                            </div>
                        ) : activeMembers.length === 0 ? (
                            <div className="text-center py-24 border-2 border-dashed border-[#e5e7eb] rounded-2xl mk-bg-light p-6">
                                <Users className="w-12 h-12 text-[#9ca3af] mx-auto mb-4 opacity-40" />
                                <p className="text-[var(--mk-ink)] font-medium text-sm opacity-70">
                                    Belum ada data pengurus di bidang ini.
                                </p>
                            </div>
                        ) : (
                            <div className="mk-outline-box mk-bg-light relative overflow-hidden">
                                <div className="absolute -right-4 -top-6 text-[var(--mk-yellow)] opacity-30 font-black text-6xl md:text-8xl select-none pointer-events-none font-display">
                                    {activeMembers.length}
                                </div>

                                <div className="relative z-10">
                                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b-4 border-[var(--mk-ink)] gap-3">
                                        <div>
                                            <div className="mk-kicker text-[var(--mk-orange)] mb-2">Struktur Aktif</div>
                                            <h2 className="mk-display text-3xl sm:text-4xl text-[var(--mk-ink)] uppercase tracking-tight">
                                                {activeTab === 'Polum' ? 'Polisi Umum (Polum)' : `Bidang ${activeTab}`}
                                            </h2>
                                        </div>
                                    </div>

                                    <div className="grid gap-5 sm:gap-6 md:gap-8 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4">
                                        {activeMembers.map((m, index) => (
                                            <div key={m.id} className="group/card flex flex-col relative">

                                                {m.isLeader && (
                                                    <div className="absolute -top-3 -right-3 z-20 bg-[var(--mk-orange)] text-white w-8 h-8 rounded-full flex items-center justify-center border-2 border-[var(--mk-ink)] shadow-[2px_2px_0_var(--mk-ink)]" title="Ketua / Pimpinan">
                                                        <Star className="w-4 h-4 fill-white" />
                                                    </div>
                                                )}

                                                <div className={`relative aspect-[3/4] bg-[var(--mk-ink)] overflow-hidden mb-3 border-2 border-[var(--mk-ink)] transition-all duration-300 group-hover/card:-translate-y-1 ${m.isLeader ? 'shadow-[4px_4px_0_var(--mk-orange)]' : 'shadow-[4px_4px_0_var(--mk-yellow)]'}`}>
                                                    {m.photo ? (
                                                        <img
                                                            src={m.photo}
                                                            alt={m.name}
                                                            className="w-full h-full object-cover transition-all duration-500 grayscale-0 md:grayscale group-hover/card:grayscale-0"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                                                            <Users className="w-8 h-8 text-white/20 mb-2" />
                                                            <span className="text-[10px] font-bold tracking-widest uppercase font-display text-white/40">No Image</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className={`text-left border-l-4 pl-3 py-1 ${m.isLeader ? 'border-[var(--mk-orange)]' : 'border-[var(--mk-yellow)]'}`}>
                                                    <h3 className="font-black text-[var(--mk-ink)] text-sm md:text-base leading-tight mb-1 font-display line-clamp-2">
                                                        {m.name}
                                                    </h3>
                                                    <p className={`text-[10px] md:text-xs font-bold uppercase tracking-widest font-sans leading-tight ${m.isLeader ? 'text-[var(--mk-orange)]' : 'text-[var(--mk-maroon)]'}`}>
                                                        {m.position}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-[300px]">
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="w-full bg-[var(--mk-yellow)] text-[var(--mk-ink)] border-2 border-[var(--mk-ink)] shadow-[4px_4px_0_var(--mk-ink)] rounded-full px-5 py-3.5 flex items-center justify-between transition-transform active:scale-95"
                >
                    <div className="flex items-center gap-2 overflow-hidden">
                        <Layers className="w-5 h-5 shrink-0 text-[var(--mk-orange)]" />
                        <span className="font-black font-display uppercase tracking-widest text-xs sm:text-sm truncate">
                            {activeTab === 'Polum' ? 'Polisi Umum' : activeTab}
                        </span>
                    </div>
                    <ChevronUp className="w-5 h-5 shrink-0 ml-2" />
                </button>
            </div>

            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
                    <div
                        className="absolute inset-0 bg-[var(--mk-ink)]/70 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsMobileMenuOpen(false)}
                    ></div>

                    <div className="relative bg-white border-t-4 border-[var(--mk-ink)] rounded-t-3xl pt-2 pb-8 px-4 flex flex-col max-h-[75vh] animate-in slide-in-from-bottom-full duration-300">
                        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-5"></div>

                        <div className="flex items-center justify-between mb-4 px-2">
                            <h3 className="font-display font-black text-sm uppercase tracking-widest text-[var(--mk-ink)]">Pilih Bidang</h3>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 bg-gray-100 rounded-full text-gray-500 hover:text-black">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="overflow-y-auto space-y-2 px-2 pb-10">
                            {divisionOrder.map((divName) => {
                                const members = grouped[divName]
                                if (!members || members.length === 0) return null
                                const isActive = activeTab === divName

                                return (
                                    <button
                                        key={divName}
                                        onClick={() => handleTabChange(divName)}
                                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-xs sm:text-sm font-bold font-display uppercase tracking-wider transition-all text-left border-2 ${
                                            isActive
                                                ? 'bg-[var(--mk-yellow)] text-[var(--mk-ink)] border-[var(--mk-ink)] shadow-[2px_2px_0_var(--mk-ink)]'
                                                : 'bg-white text-gray-500 border-gray-200 active:bg-gray-50'
                                        }`}
                                    >
                                        <span className="truncate pr-2">
                                            {divName === 'Polum' ? 'Polisi Umum (Polum)' : divName}
                                        </span>
                                        <span className={`shrink-0 text-[10px] px-2.5 py-1 rounded-md font-black ${isActive ? 'bg-[var(--mk-ink)] text-white' : 'bg-gray-100 text-gray-400'}`}>
                                            {members.length}
                                        </span>
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