'use client'

import { useState } from 'react'
import { products } from '../../app/(public)/data'

const categories = ['Semua', 'Pakaian', 'Aksesori', 'Stationery']

export default function Ekowir() {
    const [activeCategory, setActiveCategory] = useState('Semua')
    const [showAll, setShowAll] = useState(false)

    const filtered = products.filter(p =>
        activeCategory === 'Semua' || p.category === activeCategory
    )

    return (
        <div>
            <div className="py-14" style={{ background: '#C8102E' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="section-label mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>Bidang Ekonomi & Kewirausahaan</div>
                    <h1 className="text-3xl font-black text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Katalog Produk Ekowir</h1>
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
                        Produk resmi IMM Kaizen — katalog & informasi pemesanan
                    </p>
                </div>
            </div>

            {/* Info banner */}
            <div className="py-4" style={{ background: '#FFF8E7', borderBottom: '1px solid #F0E4B0' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <p className="text-xs" style={{ color: '#7A5C00', fontFamily: 'Inter, sans-serif' }}>
                        <strong>Cara Memesan:</strong> Hubungi kami melalui WhatsApp atau Instagram untuk melakukan pemesanan produk. Halaman ini bersifat katalog informatif.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                {/* Category filter */}
                <div className="flex gap-2 flex-wrap mb-8">
                    {categories.map(cat => (
                        <button key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className="text-xs px-4 py-1.5 rounded-full font-semibold transition-all"
                                style={{
                                    fontFamily: 'Montserrat, sans-serif',
                                    background: activeCategory === cat ? '#C8102E' : '#F0EFEE',
                                    color: activeCategory === cat ? '#fff' : '#555',
                                }}>
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                    {filtered.map(product => (
                        <div key={product.id} className="rounded overflow-hidden bg-white"
                             style={{ border: '1px solid #E0DEDC' }}>
                            <div className="overflow-hidden relative" style={{ aspectRatio: '1/1', background: '#F7F6F5' }}>
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                {!product.available && (
                                    <div className="absolute inset-0 flex items-center justify-center"
                                         style={{ background: 'rgba(0,0,0,0.4)' }}>
                    <span className="text-white text-xs font-bold px-3 py-1 rounded"
                          style={{ background: 'rgba(0,0,0,0.6)', fontFamily: 'Montserrat, sans-serif' }}>
                      Tidak Tersedia
                    </span>
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <p className="text-xs mb-0.5" style={{ color: '#888', fontFamily: 'Montserrat, sans-serif' }}>{product.category}</p>
                                <h3 className="font-bold text-sm leading-snug mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>{product.name}</h3>
                                <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: '#666' }}>{product.description}</p>
                                <div className="flex items-center justify-between">
                  <span className="font-black text-base" style={{ color: '#C8102E', fontFamily: 'Montserrat, sans-serif' }}>
                    Rp {product.price.toLocaleString('id-ID')}
                  </span>
                                    <span className={product.available ? 'badge-available' : 'badge-unavailable'}>
                    {product.available ? 'Tersedia' : 'Habis'}
                  </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="py-14" style={{ background: '#F7F6F5', borderTop: '1px solid #E0DEDC' }}>
                <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
                    <div className="section-label mb-3 justify-center" style={{ textAlign: 'center' }}>Tertarik Memesan?</div>
                    <h2 className="text-xl font-black mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Hubungi Bidang Ekowir IMM Kaizen</h2>
                    <p className="text-sm mb-6" style={{ color: '#666' }}>
                        Pemesanan dilakukan melalui kanal komunikasi resmi kami. Tim Ekowir siap membantu.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <a href="#" className="btn-primary">WhatsApp Ekowir</a>
                        <a href="#" className="btn-outline">Instagram @immkaizen</a>
                    </div>
                </div>
            </div>
        </div>
    )
}
