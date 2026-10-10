'use client'

import { newsData, type Page } from '../../../lib/data'

interface NewsDetailProps {
    newsId: number
    onNavigate: (page: Page) => void
    onNewsDetail: (id: number) => void
}

export default function Page({ newsId, onNavigate, onNewsDetail }: NewsDetailProps) {
    const item = newsData.find(n => n.id === newsId)
    const typedItem = item as any;

    const related = newsData.filter(n => n.id !== newsId && n.status === 'published').slice(0, 3)

    if (!item) {
        return (
            <div className="max-w-3xl mx-auto px-4 pt-32 pb-32 text-center min-h-screen flex flex-col items-center justify-center">
                <p className="text-gray-500 font-medium mb-6">Berita tidak ditemukan.</p>
                <button
                    onClick={() => onNavigate('news')}
                    className="border border-gray-900 text-gray-900 px-6 py-2 text-sm font-bold tracking-widest uppercase hover:bg-gray-900 hover:text-white transition-colors"
                >
                    ← Kembali
                </button>
            </div>
        )
    }

    return (
        <div className="bg-white min-h-screen pt-24 md:pt-28">
            <div className="border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>
                        <button onClick={() => onNavigate('home')} className="hover:text-gray-900 transition-colors">Beranda</button>
                        <span>/</span>
                        <button onClick={() => onNavigate('news')} className="hover:text-gray-900 transition-colors">Berita</button>
                        <span>/</span>
                        <span className="text-gray-900 truncate">{item.title}</span>
                    </div>
                </div>
            </div>

            <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 lg:py-16">

                <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className="text-xs font-black uppercase tracking-widest text-[#C8102E]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {item.category}
                    </span>
                    <span className="text-gray-300">|</span>
                    <span className="text-xs text-gray-500 font-medium" title="Tanggal Acara">
                        📅 Pelaksanaan: <strong className="text-gray-900">{item.date}</strong>
                    </span>
                    <span className="text-gray-300">|</span>
                    <span className="text-xs text-gray-500 font-medium" title="Tanggal Rilis Berita">
                        📰 Rilis: <strong className="text-gray-900">{item.publishDate}</strong>
                    </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-10 leading-tight tracking-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {item.title}
                </h1>

                <div className="w-full aspect-[16/9] bg-gray-100 mb-10 overflow-hidden border border-gray-200">
                    <img src={item.cover} alt={item.title} className="w-full h-full object-cover" />
                </div>

                <div className="prose prose-gray max-w-none mb-12">
                    <p className="text-lg text-gray-700 leading-relaxed font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {item.content}
                    </p>
                </div>

                <div className="border-t border-gray-200 pt-10 pb-4">
                    <a
                        href={typedItem.pwmuUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full sm:w-auto bg-[#C8102E] text-white px-8 py-5 text-sm sm:text-base font-black tracking-widest uppercase transition-all hover:bg-[#9B0D1A] group shadow-lg shadow-red-900/20"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                        Baca Selengkapnya di PWMU.CO
                        <span className="ml-3 transition-transform group-hover:translate-x-2">↗</span>
                    </a>
                    <p className="mt-4 text-xs text-gray-500 text-center sm:text-left">
                        *Anda akan diarahkan ke halaman portal berita resmi Pimpinan Wilayah Muhammadiyah Jawa Timur.
                    </p>
                </div>
            </article>

            {related.length > 0 && (
                <div className="bg-gray-50 border-t border-gray-200 py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6">
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            Berita Lainnya
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {related.map(r => (
                                <article
                                    key={r.id}
                                    className="bg-white border border-gray-200 cursor-pointer group hover:border-[#C8102E] transition-colors"
                                    onClick={() => { onNewsDetail(r.id); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                                >
                                    <div className="aspect-[16/9] bg-gray-100 overflow-hidden relative">
                                        <img src={r.cover} alt={r.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                    </div>
                                    <div className="p-5">
                                        <span className="text-[10px] font-bold text-[#C8102E] uppercase tracking-widest mb-2 block" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                            {r.category}
                                        </span>
                                        <h4 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                            {r.title}
                                        </h4>
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