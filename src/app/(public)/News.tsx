import { useState } from 'react'
import { newsData, type Page } from '../(public)/data'

interface NewsProps {
    onNavigate: (page: Page) => void
    onNewsDetail: (id: number) => void
}

const categories = ['Semua', 'Organisasi', 'Ekowir', 'Medkom', 'Sosial']

export default function News({ onNavigate, onNewsDetail }: NewsProps) {
    const [activeCategory, setActiveCategory] = useState('Semua')
    const [search, setSearch] = useState('')

    const published = newsData.filter(n => n.status === 'published')
    const filtered = published.filter(n => {
        const matchCat = activeCategory === 'Semua' || n.category === activeCategory
        const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) ||
            n.excerpt.toLowerCase().includes(search.toLowerCase())
        return matchCat && matchSearch
    })

    return (
        <div>
            <div className="py-14" style={{ background: '#C8102E' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="section-label mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>Informasi Terkini</div>
                    <h1 className="text-3xl font-black text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>Berita & Dokumentasi</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                    <div className="flex gap-2 flex-wrap">
                        {categories.map(cat => (
                            <button key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className="text-xs px-4 py-1.5 rounded-full font-semibold transition-all"
                                    style={{
                                        fontFamily: 'Montserrat, sans-serif',
                                        background: activeCategory === cat ? '#C8102E' : '#F0EFEE',
                                        color: activeCategory === cat ? '#fff' : '#555',
                                        border: activeCategory === cat ? '1px solid #C8102E' : '1px solid transparent',
                                    }}>
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="sm:ml-auto">
                        <input
                            type="text"
                            placeholder="Cari berita..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="form-input text-sm"
                            style={{ width: '220px' }}
                        />
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-2xl mb-2">📰</p>
                        <p className="text-sm" style={{ color: '#888' }}>Tidak ada berita yang ditemukan.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map(item => (
                            <article key={item.id}
                                     className="bg-white rounded overflow-hidden cursor-pointer group transition-shadow hover:shadow-md"
                                     style={{ border: '1px solid #E0DEDC' }}
                                     onClick={() => onNewsDetail(item.id)}>
                                <div className="overflow-hidden" style={{ aspectRatio: '16/9', background: '#eee' }}>
                                    <img src={item.cover} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                </div>
                                <div className="p-5">
                                    <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wide" style={{ color: '#C8102E', fontFamily: 'Montserrat, sans-serif' }}>
                      {item.category}
                    </span>
                                        <span style={{ color: '#ddd' }}>·</span>
                                        <span className="text-xs" style={{ color: '#888' }}>{item.publishDate}</span>
                                    </div>
                                    <h3 className="font-bold text-sm leading-snug mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                        {item.title}
                                    </h3>
                                    <p className="text-xs leading-relaxed line-clamp-3" style={{ color: '#666' }}>{item.excerpt}</p>
                                    <div className="mt-4 pt-4 flex items-center" style={{ borderTop: '1px solid #F0EFEE' }}>
                    <span className="text-xs font-semibold" style={{ color: '#C8102E', fontFamily: 'Montserrat, sans-serif' }}>
                      Baca Selengkapnya →
                    </span>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
