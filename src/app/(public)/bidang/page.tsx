'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Briefcase, Layers } from 'lucide-react'

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
                            Struktur Organisasi
                        </span>
                    </div>
                    <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight font-display">
                        Profil Bidang
                    </h1>
                </div>
            </div>

            <div className="bg-[var(--surface)] border-b border-[var(--border)] sticky top-[60px] sm:top-[64px] z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 overflow-x-auto py-3.5 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
                        <button
                            onClick={() => setSelectedDivision('ALL')}
                            className={`whitespace-nowrap px-3.5 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all font-display shrink-0 cursor-pointer ${
                                selectedDivision === 'ALL'
                                    ? 'bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20'
                                    : 'bg-[var(--background)] text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)] border border-[var(--border)]'
                            }`}
                        >
                            Semua Bidang ({divisionsData.length})
                        </button>

                        {isLoading ? (
                            <div className="flex gap-2 animate-pulse shrink-0">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-8 w-20 sm:w-24 bg-[var(--surface-2)] rounded-xl"></div>
                                ))}
                            </div>
                        ) : (
                            divisionsData.map((div) => {
                                const isActive = selectedDivision === div.id
                                return (
                                    <button
                                        key={div.id}
                                        onClick={() => setSelectedDivision(div.id)}
                                        className={`whitespace-nowrap px-3.5 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all font-display shrink-0 cursor-pointer ${
                                            isActive
                                                ? 'bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20'
                                                : 'bg-[var(--background)] text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)] border border-[var(--border)]'
                                        }`}
                                    >
                                        {div.name}
                                    </button>
                                )
                            })
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
                {isLoading ? (
                    <div className="space-y-16 sm:space-y-20 lg:space-y-28">
                        {[1, 2].map(i => (
                            <div key={i} className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-16 items-center animate-pulse">
                                <div className={`lg:col-span-7 ${i % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
                                    <div className="aspect-[16/10] bg-[var(--surface-2)] rounded-2xl"></div>
                                </div>
                                <div className={`lg:col-span-5 ${i % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                                    <div className="h-12 sm:h-16 w-16 bg-[var(--surface-2)] rounded-xl mb-4"></div>
                                    <div className="h-6 sm:h-8 w-3/4 bg-[var(--surface-2)] rounded-xl mb-4"></div>
                                    <div className="space-y-2.5">
                                        <div className="h-3.5 w-full bg-[var(--surface-2)] rounded-lg"></div>
                                        <div className="h-3.5 w-full bg-[var(--surface-2)] rounded-lg"></div>
                                        <div className="h-3.5 w-4/5 bg-[var(--surface-2)] rounded-lg"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : divisionsData.length === 0 ? (
                    <div className="text-center py-16 sm:py-20 border border-dashed border-[var(--border)] rounded-2xl bg-[var(--card)] p-6 max-w-2xl mx-auto">
                        <Briefcase className="w-10 h-10 sm:w-12 sm:h-12 text-[var(--text-muted)] mx-auto mb-3 opacity-40" />
                        <h3 className="text-base sm:text-lg font-bold font-display text-[var(--text-primary)] mb-1">Belum Ada Data Bidang</h3>
                        <p className="text-[var(--text-secondary)] text-xs sm:text-sm">Data profil bidang belum ditambahkan oleh administrator.</p>
                    </div>
                ) : (
                    <div className="space-y-16 sm:space-y-20 lg:space-y-28">
                        {filteredDivisions.map((div, idx) => {
                            const isEven = idx % 2 === 0;
                            const numberStr = String(idx + 1).padStart(2, '0');

                            return (
                                <div
                                    key={div.id}
                                    className="group grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-16 items-center"
                                >
                                    <div className={`lg:col-span-7 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                                        <div className="relative aspect-[16/10] overflow-hidden bg-[#111111] border border-[var(--border)] rounded-2xl shadow-sm hover:shadow-xl transition-all">
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
                                                <div className="w-full h-full flex flex-col items-center justify-center bg-[var(--surface)] text-[var(--text-muted)] p-6">
                                                    <Briefcase className="w-8 h-8 sm:w-10 sm:h-10 mb-2 opacity-40" />
                                                    <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase font-display opacity-50">
                                                        Tanpa Foto Bidang
                                                    </span>
                                                </div>
                                            )}

                                            <div
                                                className="absolute bottom-0 left-0 w-0 h-1.5 transition-all duration-700 group-hover:w-full z-20"
                                                style={{ backgroundColor: div.color || 'var(--primary)' }}
                                            />
                                        </div>
                                    </div>

                                    <div className={`lg:col-span-5 flex flex-col justify-center ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                                        <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-4">
                                            <span
                                                className="text-4xl sm:text-6xl md:text-7xl font-black text-[var(--surface-2)] select-none group-hover:text-[var(--border-strong)] transition-colors font-display"
                                                style={{ letterSpacing: '-0.05em' }}
                                            >
                                                {numberStr}
                                            </span>
                                            <div
                                                className="h-[3px] w-10 sm:w-16 rounded-full transition-all duration-500"
                                                style={{ backgroundColor: div.color || 'var(--primary)' }}
                                            />
                                        </div>

                                        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[var(--text-primary)] mb-3 sm:mb-4 uppercase tracking-tight leading-snug font-display">
                                            Bidang <br />
                                            <span style={{ color: div.color || 'var(--primary)' }}>{div.name}</span>
                                        </h2>

                                        <p className="text-xs sm:text-sm md:text-base text-[var(--text-secondary)] leading-relaxed font-medium whitespace-pre-line">
                                            {div.description}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}