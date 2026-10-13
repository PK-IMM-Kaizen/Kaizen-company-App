'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Briefcase, RefreshCw } from 'lucide-react'

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
        <div className="bg-[var(--background)] min-h-screen">
            <div className="relative bg-[var(--primary-dark)] pt-32 pb-20 overflow-hidden">
                <div
                    className="absolute top-0 left-0 w-full h-1"
                    style={{
                        background: 'linear-gradient(to right, var(--primary), var(--accent), var(--accent-light))'
                    }}
                />
                <div
                    className="absolute top-0 right-0 w-1/2 h-full opacity-10"
                    style={{
                        background: 'linear-gradient(to left, var(--primary), transparent)'
                    }}
                />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-8 h-[1px] bg-[var(--accent)]"></div>
                        <span className="text-[var(--accent)] text-xs sm:text-sm font-bold tracking-[0.2em] uppercase font-display">
                            Struktur Organisasi
                        </span>
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight font-display">
                        Profil Bidang
                    </h1>
                </div>
            </div>

            <div className="bg-[var(--surface)] border-b border-[var(--border)] sticky top-[72px] z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none">
                        <button
                            onClick={() => setSelectedDivision('ALL')}
                            className={`whitespace-nowrap px-4 py-2 rounded-[var(--radius)] text-xs font-bold uppercase tracking-wider transition-all font-display ${
                                selectedDivision === 'ALL'
                                    ? 'bg-[var(--primary)] text-white shadow-md'
                                    : 'bg-[var(--background)] text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)] border border-[var(--border)]'
                            }`}
                        >
                            Semua Bidang ({divisionsData.length})
                        </button>

                        {isLoading ? (
                            <div className="flex gap-2 animate-pulse">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-8 w-24 bg-[var(--surface-2)] rounded-[var(--radius)]"></div>
                                ))}
                            </div>
                        ) : (
                            divisionsData.map((div) => {
                                const isActive = selectedDivision === div.id
                                return (
                                    <button
                                        key={div.id}
                                        onClick={() => setSelectedDivision(div.id)}
                                        className={`whitespace-nowrap px-4 py-2 rounded-[var(--radius)] text-xs font-bold uppercase tracking-wider transition-all font-display ${
                                            isActive
                                                ? 'bg-[var(--primary)] text-white shadow-md'
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
                {isLoading ? (
                    <div className="space-y-20 lg:space-y-28">
                        {[1, 2].map(i => (
                            <div key={i} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center animate-pulse">
                                <div className={`lg:col-span-7 ${i % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
                                    <div className="aspect-[4/3] lg:aspect-[16/10] bg-[var(--surface-2)] rounded-[var(--radius)]"></div>
                                </div>
                                <div className={`lg:col-span-5 ${i % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                                    <div className="h-16 w-16 bg-[var(--surface-2)] rounded mb-4"></div>
                                    <div className="h-8 w-3/4 bg-[var(--surface-2)] rounded mb-6"></div>
                                    <div className="space-y-3">
                                        <div className="h-4 w-full bg-[var(--surface-2)] rounded"></div>
                                        <div className="h-4 w-full bg-[var(--surface-2)] rounded"></div>
                                        <div className="h-4 w-5/6 bg-[var(--surface-2)] rounded"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : divisionsData.length === 0 ? (
                    <div className="text-center py-20">
                        <Briefcase className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4 opacity-30" />
                        <h3 className="text-lg font-bold font-display text-[var(--text-primary)] mb-2">Belum Ada Data Bidang</h3>
                        <p className="text-[var(--text-secondary)] text-sm">Data profil bidang belum ditambahkan oleh administrator.</p>
                    </div>
                ) : (
                    <div className="space-y-20 lg:space-y-28">
                        {filteredDivisions.map((div, idx) => {
                            const isEven = idx % 2 === 0;
                            const numberStr = String(idx + 1).padStart(2, '0');

                            return (
                                <div
                                    key={div.id}
                                    className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center"
                                >
                                    <div className={`lg:col-span-7 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                                        <div className="relative aspect-[4/3] lg:aspect-[16/10] overflow-hidden bg-[#111111] border border-[var(--border)] rounded-[var(--radius)] shadow-sm">
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
                                                <div className="w-full h-full flex flex-col items-center justify-center bg-[var(--surface)] text-[var(--text-muted)]">
                                                    <Briefcase className="w-10 h-10 mb-2 opacity-50" />
                                                    <span className="text-xs font-bold tracking-widest uppercase font-display opacity-50">
                                                        Tanpa Foto
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
                                        <div className="flex items-center gap-4 mb-4">
                                            <span
                                                className="text-5xl sm:text-7xl font-black text-[var(--surface-2)] select-none group-hover:text-[var(--border-strong)] transition-colors font-display"
                                                style={{ letterSpacing: '-0.05em' }}
                                            >
                                                {numberStr}
                                            </span>
                                            <div
                                                className="h-[3px] w-12 sm:w-16 rounded-full transition-all duration-500"
                                                style={{ backgroundColor: div.color || 'var(--primary)' }}
                                            />
                                        </div>

                                        <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-4 uppercase tracking-tight leading-snug font-display">
                                            Bidang <br />
                                            <span style={{ color: div.color || 'var(--primary)' }}>{div.name}</span>
                                        </h2>

                                        <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed font-medium">
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