'use client'

import { divisions } from '../../app/(public)/data'

export default function Division() {
    return (
        <div>
            <div className="py-14" style={{ background: '#C8102E' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="section-label mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>Struktur Organisasi</div>
                    <h1 className="text-3xl font-black text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>Profil Bidang</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
                <div className="space-y-8">
                    {divisions.map((div, idx) => (
                        <div key={div.id}
                             className="rounded overflow-hidden"
                             style={{ border: '1px solid #E0DEDC' }}>
                            <div className={`grid grid-cols-1 lg:grid-cols-2 ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                                <div className={`overflow-hidden ${idx % 2 === 1 ? 'lg:order-2' : ''}`}
                                     style={{ minHeight: '240px', background: '#eee' }}>
                                    <img src={div.photo} alt={div.name} className="w-full h-full object-cover" style={{ minHeight: '240px' }} />
                                </div>
                                <div className={`p-8 flex flex-col justify-center ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-1 rounded" style={{ background: div.color }} />
                                        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: div.color, fontFamily: 'Montserrat, sans-serif' }}>
                      Bidang {String(idx + 1).padStart(2, '0')}
                    </span>
                                    </div>
                                    <h2 className="text-xl font-black mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                        {div.name}
                                    </h2>
                                    <p className="text-sm leading-relaxed" style={{ color: '#555' }}>
                                        {div.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
