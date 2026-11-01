'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Briefcase, ChevronRight, Layers } from 'lucide-react'

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
    const [selectedDivision, setSelectedDivision] = useState<string | 'ALL'>('ALL')

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        fetchDivisions()
    }, [])

    const fetchDivisions = async () => {
        setIsLoading(true)
        try {
            const { data, error } = await supabase
                .from('divisions')
                .select('*')
                .order('created_at', { ascending: true })

            if (error) throw error

            if (data) {
                setDivisionsData(data)
            }
        } catch (error: any) {
            console.error('Gagal mengambil data bidang:', error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const filteredDivisions = selectedDivision === 'ALL'
        ? divisionsData
        : divisionsData.filter(d => d.id === selectedDivision)

    return (
        <div className="bg-[var(--background)] min-h-screen font-sans selection:bg-[var(--primary)] selection:text-white">

            <div className="relative bg-[var(--primary-dark)] pt-32 sm:pt-36 md:pt-40 lg:pt-44 pb-14 sm:pb-16 overflow-hidden">
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
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-6 sm:w-8 h-[2px] bg-[var(--accent)]"></div>
                        <span className="text-[var(--accent)] text-[11px] sm:text-xs md:text-sm font-bold tracking-[0.2em] uppercase font-display">
                            Struktur Organisasi
                        </span>
                    </div>
                    <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight font-display leading-tight">
                        Profil Bidang
                    </h1>
                </div>
            </div>

            <div className="lg:hidden bg-[var(--surface)] border-b border-[var(--border)] sticky top-[64px] sm:top-[72px] z-20 shadow-sm backdrop-blur-md bg-opacity-95">
                <div className="px-4 py-3">
                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-none -mx-4 px-4">
                        <button
                            onClick={() => setSelectedDivision('ALL')}
                            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all font-display shrink-0 cursor-pointer ${
                                selectedDivision === 'ALL'
                                    ? 'bg-[var(--primary)] text-white shadow-sm shadow-[var(--primary)]/20'
                                    : 'bg-[var(--background)] text-[var(--text-secondary)] border border-[var(--border)] hover:bg-[var(--surface-2)]'
                            }`}
                        >
                            Semua ({divisionsData.length})
                        </button>
                        {divisionsData.map((div) => (
                            <button
                                key={div.id}
                                onClick={() => setSelectedDivision(div.id)}
                                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all font-display shrink-0 cursor-pointer ${
                                    selectedDivision === div.id
                                        ? 'bg-[var(--primary)] text-white shadow-sm shadow-[var(--primary)]/20'
                                        : 'bg-[var(--background)] text-[var(--text-secondary)] border border-[var(--border)] hover:bg-[var(--surface-2)]'
                                }`}
                            >
                                {div.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-start">
                    <div className="hidden lg:block lg:col-span-4 xl:col-span-3 sticky top-24 lg:top-28 space-y-4">
                        <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-4 shadow-sm space-y-1.5">
                            <div className="flex items-center gap-2 px-3 py-2 text-xs font-black uppercase tracking-widest text-[var(--text-muted)] font-display border-b border-[var(--border)] mb-2">
                                <Layers className="w-4 h-4 text-[var(--primary)] shrink-0" /> Daftar Bidang
                            </div>

                            <button
                                onClick={() => setSelectedDivision('ALL')}
                                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold font-display uppercase tracking-wider transition-all text-left cursor-pointer ${
                                    selectedDivision === 'ALL'
                                        ? 'bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20'
                                        : 'text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]'
                                }`}
                            >
                                <span>Semua Bidang</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${selectedDivision === 'ALL' ? 'bg-white/20 text-white' : 'bg-[var(--surface-2)] text-[var(--text-muted)]'}`}>
                                    {divisionsData.length}
                                </span>
                            </button>

                            {isLoading ? (
                                <div className="space-y-2 py-2">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className="h-9 bg-[var(--surface-2)] rounded-xl animate-pulse"></div>
                                    ))}
                                </div>
                            ) : (
                                divisionsData.map((div) => {
                                    const isActive = selectedDivision === div.id
                                    return (
                                        <button
                                            key={div.id}
                                            onClick={() => setSelectedDivision(div.id)}
                                            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold font-display uppercase tracking-wider transition-all text-left cursor-pointer group ${
                                                isActive
                                                    ? 'bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20'
                                                    : 'text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]'
                                            }`}
                                        >
                                            <span className="truncate">{div.name}</span>
                                            <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${isActive ? 'translate-x-0.5 text-white' : 'opacity-0 group-hover:opacity-100 text-[var(--text-muted)]'}`} />
                                        </button>
                                    )
                                })
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-8 xl:col-span-9 space-y-8 sm:space-y-10 lg:space-y-12">
                        {isLoading ? (
                            <div className="space-y-6 sm:space-y-8">
                                {[1, 2].map(i => (
                                    <div key={i} className="space-y-4 animate-pulse bg-[var(--card)] p-5 sm:p-8 rounded-2xl border border-[var(--border)]">
                                        <div className="aspect-[16/9] sm:aspect-[21/9] bg-[var(--surface-2)] rounded-xl"></div>
                                        <div className="h-7 w-1/3 bg-[var(--surface-2)] rounded-lg"></div>
                                        <div className="h-16 bg-[var(--surface-2)] rounded-lg"></div>
                                    </div>
                                ))}
                            </div>
                        ) : divisionsData.length === 0 ? (
                            <div className="text-center py-14 sm:py-20 border border-dashed border-[var(--border)] rounded-2xl bg-[var(--card)] p-6 max-w-xl mx-auto">
                                <Briefcase className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3 opacity-40" />
                                <h3 className="text-base font-bold font-display text-[var(--text-primary)] mb-1">Belum Ada Data Bidang</h3>
                                <p className="text-[var(--text-secondary)] text-xs">Data profil bidang belum ditambahkan oleh administrator.</p>
                            </div>
                        ) : (
                            filteredDivisions.map((div) => {
                                return (
                                    <div
                                        key={div.id}
                                        className="group bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden p-5 sm:p-7 lg:p-8 shadow-sm hover:shadow-md transition-all space-y-5 sm:space-y-6"
                                    >
                                        <div className="relative aspect-[16/9] sm:aspect-[21/9] overflow-hidden bg-[#111111] rounded-xl border border-[var(--border)]">
                                            {div.photo ? (
                                                <img
                                                    src={div.photo}
                                                    alt={`Bidang ${div.name}`}
                                                    onError={(e) => {
                                                        (e.target as HTMLElement).style.display = 'none';
                                                    }}
                                                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center bg-[var(--surface)] text-[var(--text-muted)] p-6 text-center">
                                                    <Briefcase className="w-8 h-8 sm:w-10 sm:h-10 mb-2 opacity-40" />
                                                    <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase font-display opacity-50">
                                                        Tanpa Foto Dokumentasi Bidang
                                                    </span>
                                                </div>
                                            )}

                                            <div
                                                className="absolute bottom-0 left-0 w-0 h-1.5 transition-all duration-700 group-hover:w-full z-20"
                                                style={{ backgroundColor: div.color || 'var(--primary)' }}
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="h-5 sm:h-6 w-1.5 sm:w-2 rounded-full shrink-0"
                                                    style={{ backgroundColor: div.color || 'var(--primary)' }}
                                                />
                                                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[var(--text-primary)] uppercase tracking-tight font-display leading-tight">
                                                    Bidang <span style={{ color: div.color || 'var(--primary)' }}>{div.name}</span>
                                                </h2>
                                            </div>

                                            <p className="text-xs sm:text-sm md:text-base text-[var(--text-secondary)] leading-relaxed font-medium whitespace-pre-line pt-1">
                                                {div.description || <span className="italic text-[var(--text-muted)]">Belum ada rincian deskripsi tugas untuk bidang ini.</span>}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}

