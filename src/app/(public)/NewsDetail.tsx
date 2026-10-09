'use client'

import { newsData, type Page } from '../../app/(public)/data'

interface NewsDetailProps {
    newsId: number
    onNavigate: (page: Page) => void
    onNewsDetail: (id: number) => void
}

export default function NewsDetail({ newsId, onNavigate, onNewsDetail }: NewsDetailProps) {
    const item = newsData.find(n => n.id === newsId)
    const related = newsData.filter(n => n.id !== newsId && n.status === 'published').slice(0, 3)

    if (!item) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-20 text-center">
                <p style={{ color: '#888' }}>Berita tidak ditemukan.</p>
                <button onClick={() => onNavigate('news')} className="btn-primary mt-4">← Kembali</button>
            </div>
        )
    }

    return (
        <div>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5">
                <div className="flex items-center gap-2 text-xs" style={{ color: '#888', fontFamily: 'Montserrat, sans-serif' }}>
                    <button onClick={() => onNavigate('home')} className="hover:underline">Beranda</button>
                    <span>/</span>
                    <button onClick={() => onNavigate('news')} className="hover:underline">Berita</button>
                    <span>/</span>
                    <span className="line-clamp-1" style={{ color: '#333' }}>{item.title}</span>
                </div>
            </div>

            <article className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
                <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-bold uppercase tracking-wide" style={{ color: '#C8102E', fontFamily: 'Montserrat, sans-serif' }}>
            {item.category}
          </span>
                    <span style={{ color: '#ddd' }}>·</span>
                    <span className="text-xs" style={{ color: '#888' }}>Kegiatan: {item.date}</span>
                    <span style={{ color: '#ddd' }}>·</span>
                    <span className="text-xs" style={{ color: '#888' }}>Publikasi: {item.publishDate}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black mb-6 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {item.title}
                </h1>

                <div className="rounded overflow-hidden mb-8" style={{ background: '#eee', aspectRatio: '16/9' }}>
                    <img src={item.cover} alt={item.title} className="w-full h-full object-cover" />
                </div>

                <div className="prose-custom max-w-none mb-10">
                    {item.content.split('\n\n').map((para, i) => (
                        <p key={i} className="text-sm leading-relaxed mb-4" style={{ color: '#333' }}>{para}</p>
                    ))}
                </div>

                {item.gallery.length > 0 && (
                    <div className="mb-10">
                        <h3 className="font-black text-sm mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Galeri Dokumentasi</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {item.gallery.map((src, i) => (
                                <div key={i} className="rounded overflow-hidden" style={{ aspectRatio: '4/3', background: '#eee' }}>
                                    <img src={src} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <button onClick={() => onNavigate('news')} className="btn-outline">
                    ← Kembali ke Berita
                </button>
            </article>

            {related.length > 0 && (
                <div className="py-12" style={{ background: '#F7F6F5', borderTop: '1px solid #E0DEDC' }}>
                    <div className="max-w-4xl mx-auto px-4 sm:px-6">
                        <h3 className="font-black text-sm mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>Berita Lainnya</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            {related.map(r => (
                                <article key={r.id} className="bg-white rounded overflow-hidden cursor-pointer group transition-shadow hover:shadow-md"
                                         style={{ border: '1px solid #E0DEDC' }}
                                         onClick={() => { onNewsDetail(r.id); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
                                    <div className="overflow-hidden" style={{ aspectRatio: '16/9', background: '#eee' }}>
                                        <img src={r.cover} alt={r.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                    </div>
                                    <div className="p-4">
                                        <span className="text-xs font-bold" style={{ color: '#C8102E', fontFamily: 'Montserrat, sans-serif' }}>{r.category}</span>
                                        <h4 className="font-bold text-xs mt-1 leading-snug" style={{ fontFamily: 'Montserrat, sans-serif' }}>{r.title}</h4>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
