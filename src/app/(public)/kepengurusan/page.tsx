'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

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
    'BPH',
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
    const [activeTab, setActiveTab] = useState<string>('ALL')
    const [managementData, setManagementData] = useState<Management[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchPengurus = async () => {
            try {
                const { data, error } = await supabase
                    .from('pengurus')
                    .select('*')
                    .order('created_at', { ascending: true })

                if (error) {
                    throw error
                }

                if (data) {
                    const formattedData: Management[] = data.map((item: any) => ({
                        id: item.id,
                        name: item.name,
                        position: item.position,
                        division: item.division,
                        isLeader: item.is_leader,
                        photo: item.photo,
                        createdAt: item.created_at
                    }))
                    setManagementData(formattedData)
                }
            } catch (error) {
                console.error('Error fetching pengurus dari Supabase:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchPengurus()
    }, [])

    const grouped: Record<string, Management[]> = {}
    managementData.forEach(m => {
        if (!grouped[m.division]) grouped[m.division] = []
        grouped[m.division].push(m)
    })

    const displayedDivisions = activeTab === 'ALL'
        ? divisionOrder.filter(divName => grouped[divName] && grouped[divName].length > 0)
        : divisionOrder.filter(div => div === activeTab)

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
                            Periode 2026 - 2027
                        </span>
                    </div>
                    <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight font-display">
                        Struktur Kepengurusan
                    </h1>
                </div>
            </div>

            <div className="sticky top-[60px] sm:top-[64px] z-30 bg-[var(--surface)] border-b border-[var(--border)] shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto py-3.5 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
                        <button
                            onClick={() => setActiveTab('ALL')}
                            className={`whitespace-nowrap px-3.5 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all font-display shrink-0 cursor-pointer ${
                                activeTab === 'ALL'
                                    ? 'bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20'
                                    : 'bg-[var(--background)] text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)] border border-[var(--border)]'
                            }`}
                        >
                            Semua Bidang
                        </button>

                        {divisionOrder.map((divName) => {
                            if (!grouped[divName] || grouped[divName].length === 0) return null
                            const isActive = activeTab === divName

                            return (
                                <button
                                    key={divName}
                                    onClick={() => setActiveTab(divName)}
                                    className={`whitespace-nowrap px-3.5 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all font-display shrink-0 cursor-pointer ${
                                        isActive
                                            ? 'bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20'
                                            : 'bg-[var(--background)] text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)] border border-[var(--border)]'
                                    }`}
                                >
                                    {divName === 'BPH' ? 'BPH / Pimpinan' : divName}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 sm:space-y-16 lg:space-y-24">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-16 sm:py-20">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-xs sm:text-sm font-bold text-[var(--text-muted)] font-display tracking-widest uppercase animate-pulse">
                            Memuat Struktur Kepengurusan...
                        </p>
                    </div>
                ) : managementData.length === 0 ? (
                    <div className="text-center py-16 sm:py-24 border border-dashed border-[var(--border-strong)] rounded-2xl bg-[var(--surface)] p-6">
                        <p className="text-[var(--text-muted)] font-medium text-xs sm:text-sm">
                            Belum ada data pengurus yang dipublikasikan.
                        </p>
                    </div>
                ) : (
                    displayedDivisions.map((divName) => {
                        const members = grouped[divName]
                        if (!members || members.length === 0) return null

                        const isPimpinan = divName === 'BPH'

                        return (
                            <div key={divName} className="relative scroll-mt-32" id={`bidang-${divName.replace(/\s+/g, '-').toLowerCase()}`}>
                                <div className="flex flex-col xs:flex-row xs:items-end justify-between mb-6 sm:mb-8 pb-3 border-b-2 border-[var(--text-primary)] gap-2">
                                    <div>
                                        <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-black text-[var(--text-primary)] uppercase tracking-tight font-display">
                                            {isPimpinan ? 'Badan Pengurus Harian (BPH)' : `Bidang ${divName}`}
                                        </h2>
                                    </div>
                                    <div className="text-[10px] sm:text-xs font-bold text-[var(--text-muted)] tracking-[0.2em] uppercase font-display shrink-0">
                                        {members.length} Personil
                                    </div>
                                </div>

                                <div
                                    className={`grid gap-4 sm:gap-6 md:gap-8 ${
                                        isPimpinan
                                            ? 'grid-cols-2 sm:grid-cols-3 max-w-4xl mx-auto'
                                            : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                                    }`}
                                >
                                    {members.map((m, index) => (
                                        <div key={m.id} className="group cursor-pointer">
                                            <div className="relative aspect-[3/4] bg-[#111111] overflow-hidden mb-3 sm:mb-4 border border-[var(--border)] rounded-2xl shadow-sm hover:shadow-xl transition-all">
                                                {m.photo ? (
                                                    <img
                                                        src={m.photo}
                                                        alt={m.name}
                                                        className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center bg-[#181818] text-[var(--text-muted)] p-4 text-center">
                                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/10 flex items-center justify-center mb-2">
                                                            <svg className="w-5 h-5 sm:w-6 sm:h-6 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                            </svg>
                                                        </div>
                                                        <span className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase font-display text-white/40">
                                                            No Image
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="absolute bottom-0 left-0 w-full h-1 bg-[var(--primary)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                                                <div className="absolute top-2 right-2.5 sm:top-2 sm:right-3 text-white text-opacity-40 font-black text-xl sm:text-2xl md:text-3xl mix-blend-overlay font-display pointer-events-none select-none">
                                                    {String(index + 1).padStart(2, '0')}
                                                </div>
                                            </div>

                                            <div className="text-left border-l-2 border-transparent group-hover:border-[var(--primary)] pl-2 sm:pl-2.5 transition-all duration-300 transform group-hover:translate-x-1">
                                                <h3 className="font-black text-[var(--text-primary)] text-xs sm:text-sm md:text-base leading-snug mb-0.5 sm:mb-1 font-display line-clamp-2">
                                                    {m.name}
                                                </h3>
                                                <p className="text-[9px] sm:text-[10px] md:text-xs font-bold text-[var(--primary)] uppercase tracking-widest font-sans leading-tight">
                                                    {m.position}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}