'use client'

import { alumniData } from '../../app/(public)/data'

export default function Alumni() {
    return (
        <div>
            <div className="py-14" style={{ background: '#C8102E' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="section-label mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>Mereka yang Menginspirasi</div>
                    <h1 className="text-3xl font-black text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>Alumni Inspiratif</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
                <div className="max-w-2xl mb-10">
                    <p className="text-sm leading-relaxed" style={{ color: '#555' }}>
                        IMM Kaizen bangga dengan alumni-alumni yang telah memberikan kontribusi nyata di berbagai bidang. Mereka adalah bukti bahwa kaderisasi yang baik melahirkan pemimpin-pemimpin berkualitas.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {alumniData.map(a => (
                        <div key={a.id} className="rounded overflow-hidden bg-white"
                             style={{ border: '1px solid #E0DEDC', display: 'flex', gap: 0 }}>
                            <div className="flex-shrink-0" style={{ width: 120, background: '#F7F6F5' }}>
                                <img src={a.photo} alt={a.name} className="w-full h-full object-cover" style={{ minHeight: '160px' }} />
                            </div>
                            <div className="p-5 flex flex-col justify-center">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold" style={{ color: '#C8102E', fontFamily: 'Montserrat, sans-serif' }}>Angkatan {a.batch}</span>
                                </div>
                                <h3 className="font-black text-base mb-0.5" style={{ fontFamily: 'Montserrat, sans-serif' }}>{a.name}</h3>
                                <p className="text-xs font-semibold mb-2" style={{ color: '#888', fontFamily: 'Montserrat, sans-serif' }}>{a.role}</p>
                                <p className="text-xs leading-relaxed mb-2" style={{ color: '#555' }}>{a.bio}</p>
                                <div className="flex items-start gap-2 mt-1">
                                    <span className="text-yellow-500 text-xs mt-0.5">★</span>
                                    <p className="text-xs font-semibold" style={{ color: '#333', fontFamily: 'Inter, sans-serif' }}>{a.achievement}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 p-8 rounded text-center" style={{ background: '#F7F6F5', border: '1px solid #E0DEDC' }}>
                    <div className="section-label mb-2" style={{ textAlign: 'center' }}>Kamu Alumni IMM Kaizen?</div>
                    <h3 className="text-lg font-black mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Ingin Ditampilkan di Sini?</h3>
                    <p className="text-sm mb-5" style={{ color: '#666' }}>
                        Hubungi pengurus aktif untuk mendaftarkan diri sebagai alumni inspiratif.
                    </p>
                    <a href="#" className="btn-primary">Hubungi Pengurus</a>
                </div>
            </div>
        </div>
    )
}
