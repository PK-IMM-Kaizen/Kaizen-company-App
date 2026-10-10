'use client'

import { useState } from 'react'
import { managementData } from '../../lib/data'

const divisionOrder = ['BPH', 'Organisasi', 'Kader', 'Hikmah Politik Kebijakan Publik', 'Riset Pengembangan Keilmuan']

export default function Page() {
    const [activeTab, setActiveTab] = useState<string>('ALL')

    const grouped: Record<string, typeof managementData> = {}
    managementData.forEach(m => {
        if (!grouped[m.division]) grouped[m.division] = []
        grouped[m.division].push(m)
    })

    const displayedDivisions = activeTab === 'ALL'
        ? divisionOrder
        : divisionOrder.filter(div => div === activeTab)

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
                            Periode 2026 - 2027
                        </span>
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight font-display">
                        Struktur Kepengurusan
                    </h1>
                </div>
            </div>

            <div className="relative z-20 bg-[var(--background)] border-b border-[var(--border)] shadow-sm transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto py-4 scrollbar-none">
                        <button
                            onClick={() => setActiveTab('ALL')}
                            className={`whitespace-nowrap px-4 py-2 rounded-[var(--radius)] text-xs font-bold uppercase tracking-wider transition-all font-display ${
                                activeTab === 'ALL'
                                    ? 'bg-[var(--primary)] text-white shadow-md'
                                    : 'bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]'
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
                                    className={`whitespace-nowrap px-4 py-2 rounded-[var(--radius)] text-xs font-bold uppercase tracking-wider transition-all font-display ${
                                        isActive
                                            ? 'bg-[var(--primary)] text-white shadow-md'
                                            : 'bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]'
                                    }`}
                                >
                                    {divName === 'BPH' ? 'BPH / Pimpinan' : divName}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16 space-y-16 lg:space-y-24">
                {displayedDivisions.map((divName) => {
                    const members = grouped[divName]
                    if (!members || members.length === 0) return null

                    const isPimpinan = divName === 'BPH'

                    return (
                        <div key={divName} className="relative scroll-mt-32" id={`bidang-${divName.replace(/\s+/g, '-').toLowerCase()}`}>
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b-2 border-[var(--text-primary)]">
                                <div>
                                    <h2 className="text-xl sm:text-3xl font-black text-[var(--text-primary)] uppercase tracking-tight font-display">
                                        {isPimpinan ? 'Badan Pengurus Harian (BPH)' : `Bidang ${divName}`}
                                    </h2>
                                </div>
                                <div className="mt-2 sm:mt-0 text-xs font-bold text-[var(--text-muted)] tracking-[0.2em] uppercase font-display">
                                    {members.length} Personil
                                </div>
                            </div>

                            <div
                                className={`grid gap-6 sm:gap-8 ${
                                    isPimpinan
                                        ? 'grid-cols-1 sm:grid-cols-3 max-w-4xl mx-auto'
                                        : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                                }`}
                            >
                                {members.map((m, index) => (
                                    <div key={m.id} className="group cursor-pointer">
                                        <div className="relative aspect-[3/4] bg-[#111111] overflow-hidden mb-4 border border-[var(--border)] rounded-[var(--radius)] shadow-sm">
                                            {m.photo ? (
                                                <img
                                                    src={m.photo}
                                                    alt={m.name}
                                                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center bg-[#181818] text-[var(--text-muted)] p-4 text-center">
                                                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-2">
                                                        <svg className="w-6 h-6 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-[10px] font-bold tracking-widest uppercase font-display text-white/40">
                                                        No Image
                                                    </span>
                                                </div>
                                            )}

                                            <div className="absolute bottom-0 left-0 w-full h-1 bg-[var(--primary)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                                            <div className="absolute top-2 right-3 text-white text-opacity-40 font-black text-2xl sm:text-3xl mix-blend-overlay font-display pointer-events-none">
                                                {String(index + 1).padStart(2, '0')}
                                            </div>
                                        </div>

                                        <div className="text-left border-l-2 border-transparent group-hover:border-[var(--primary)] pl-2.5 transition-all duration-300 transform group-hover:translate-x-1">
                                            <h3 className="font-black text-[var(--text-primary)] text-sm sm:text-base leading-snug mb-1 font-display">
                                                {m.name}
                                            </h3>
                                            <p className="text-[10px] sm:text-xs font-bold text-[var(--primary)] uppercase tracking-widest font-sans">
                                                {m.position}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}