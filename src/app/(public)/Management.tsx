'use client'

import { managementData } from '.././(public)/data'

const leaderPositions = ['Pimpinan']
const divisionOrder = ['Pimpinan', 'BPI', 'Medkom', 'Ekowir', 'Hikmah']

export default function Management() {
    const grouped: Record<string, typeof managementData> = {}
    managementData.forEach(m => {
        if (!grouped[m.division]) grouped[m.division] = []
        grouped[m.division].push(m)
    })

    return (
        <div>
            <div className="py-14" style={{ background: '#C8102E' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="section-label mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>Periode 2024–2025</div>
                    <h1 className="text-3xl font-black text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>Struktur Kepengurusan</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 space-y-14">
                {divisionOrder.map(divName => {
                    const members = grouped[divName]
                    if (!members) return null
                    return (
                        <div key={divName}>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1 h-6 rounded" style={{ background: '#C8102E' }} />
                                <h2 className="text-lg font-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                    {divName === 'Pimpinan' ? 'Pimpinan Komisariat' : `Bidang ${divName}`}
                                </h2>
                            </div>
                            <div className={`grid gap-5 ${divName === 'Pimpinan' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'}`}>
                                {members.map(m => (
                                    <div key={m.id} className="text-center">
                                        <div className="mx-auto mb-3 rounded-full overflow-hidden"
                                             style={{ width: 80, height: 80, border: '2px solid #E0DEDC', background: '#eee' }}>
                                            <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
                                        </div>
                                        <h3 className="font-bold text-xs leading-tight mb-0.5" style={{ fontFamily: 'Montserrat, sans-serif' }}>{m.name}</h3>
                                        <p className="text-xs" style={{ color: '#C8102E', fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                                            {m.position}
                                        </p>
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
