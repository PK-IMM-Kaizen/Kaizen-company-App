'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

interface Alumni {
    id: string
    name: string
    batch: string
    role: string
    achievement: string
    bio: string
    photo: string
}

export default function Page() {
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
                            Mereka yang Menginspirasi
                        </span>
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight font-display">
                        Alumni Inspiratif
                    </h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
                <div className="max-w-3xl mb-16">
                    <p className="text-lg text-[var(--text-secondary)] leading-relaxed font-medium">
                        IMM Kaizen bangga dengan jejaring alumni yang telah memberikan kontribusi nyata di berbagai sektor. Mereka adalah bukti konkret bahwa iklim kaderisasi yang tajam dan terarah mampu melahirkan tokoh-tokoh penggerak peradaban.
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {alumniData.length === 0 ? (
                            <p className="text-[var(--text-muted)] col-span-full">Belum ada data alumni.</p>
                        ) : (
                            alumniData.map((alumni) => (
                                <div key={alumni.id} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden hover:shadow-lg transition-all group">
                                    <div className="aspect-[4/3] w-full overflow-hidden relative bg-[var(--surface)]">
                                        <img
                                            src={alumni.photo || '/img/profile/imm.jpeg'}
                                            alt={alumni.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 right-4 bg-[#6B46C1] text-white text-xs font-black tracking-widest px-3 py-1.5 rounded-lg shadow-md">
                                            {alumni.batch}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <span className="text-[var(--primary)] text-xs font-bold uppercase tracking-wider block mb-2">
                                            {alumni.role}
                                        </span>
                                        <h3 className="text-xl font-black text-[var(--text-primary)] font-display mb-3">
                                            {alumni.name}
                                        </h3>
                                        {alumni.achievement && (
                                            <div className="mb-4 text-sm font-semibold text-[var(--text-secondary)] border-l-2 border-[var(--accent)] pl-3">
                                                {alumni.achievement}
                                            </div>
                                        )}
                                        <p className="text-sm text-[var(--text-muted)] leading-relaxed line-clamp-3">
                                            {alumni.bio}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                <div className="mt-24 bg-[#111111] border-l-4 border-[var(--primary)] p-8 sm:p-12 relative overflow-hidden group rounded-2xl">
                    <div
                        className="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none"
                        style={{ background: 'linear-gradient(to left, var(--primary), transparent)' }}
                    />
                    <div className="absolute -right-10 -bottom-10 text-white/5 opacity-20 font-black text-9xl select-none group-hover:scale-105 transition-transform duration-700 font-display">
                        #
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                            <span className="text-[var(--accent)] text-xs font-bold tracking-[0.2em] uppercase mb-3 block font-display">
                                Jejaring Kaizen
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-black text-white mb-3 font-display">
                                Anda Alumni IMM Kaizen?
                            </h3>
                            <p className="text-[#a0a0a0] text-sm leading-relaxed max-w-xl">
                                Mari perkuat simpul ikatan. Hubungi pimpinan aktif untuk pembaruan database, kolaborasi program, atau berbagi inspirasi di halaman etalase ini.
                            </p>
                        </div>
                        <a
                            href="#"
                            className="inline-flex items-center justify-center bg-[var(--primary)] text-white px-8 py-4 text-sm font-bold tracking-widest uppercase transition-all hover:bg-[var(--primary-dark)] whitespace-nowrap rounded-xl font-display group cursor-pointer shadow-lg shadow-[var(--primary)]/20 hover:-translate-y-1"
                        >
                            Hubungi Pengurus
                            <span className="ml-3 transition-transform group-hover:translate-x-1">→</span>
                        </a>
                    </div>
                </div>

            </div>
        </div>
    )
}