'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Search, ArrowRight, Calendar, RefreshCw, Newspaper } from 'lucide-react'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

const categories = ['Semua', 'Bidang HPKP', 'Bidang Kader', 'Organisasi']

export interface NewsArticle {
    id: number
    title: string
    excerpt: string
    content: string
    category: string
    date: string
    publishDate: string
    cover: string
    gallery: string[]
    status: string
    pwmuUrl: string
}

export default function BeritaPage() {
    const [activeCategory, setActiveCategory] = useState('Semua')
    const [search, setSearch] = useState('')
    const [newsData, setNewsData] = useState<NewsArticle[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchNews()
    }, [])

    const fetchNews = async () => {
        setIsLoading(true)
        try {
            const { data, error } = await supabase
                .from('news')
                .select('*')
                .eq('status', 'published')
                .order('id', { ascending: false })

            if (error) throw error

            if (data) {
                const formatted: NewsArticle[] = data.map((item: any) => ({
                    id: item.id,
                    title: item.title || '',
                    excerpt: item.excerpt || '',
                    content: item.content || '',
                    category: item.category || 'Organisasi',
                    date: item.date || '',
                    publishDate: item.publish_date || item.created_at || '',
                    cover: item.cover || '',
                    gallery: item.gallery || [],
                    status: item.status || 'published',
                    pwmuUrl: item.pwmu_url || ''
                }))
                setNewsData(formatted)
            }
        } catch (error: any) {
            console.error('Error dari Supabase:', error.message || error)
        } finally {
            setIsLoading(false)
        }
    }

    const filtered = newsData.filter(n => {
        const matchCat = activeCategory === 'Semua' || n.category === activeCategory
        const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) ||
            n.excerpt.toLowerCase().includes(search.toLowerCase())
        return matchCat && matchSearch
    })

    return (
        <div className="w-full mk-dark mk-bg-dark min-h-screen selection:bg-[var(--mk-yellow)] selection:text-[var(--mk-maroon-deep)] font-sans pb-24 relative">
            <div className="bg-[var(--mk-maroon-deep)] mk-curve-bottom relative pt-28 pb-20 md:pb-24 overflow-hidden z-10 border-b-4 border-[var(--mk-yellow)]">
                <div className="mk-decor pointer-events-none">
                    <div className="mk-halftone mk-halftone--bl opacity-20"></div>
                    <div className="mk-star mk-star--lg mk-star--spin -right-8 top-10 opacity-30"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
                    <div className="flex items-center gap-3 mb-5 md:mb-6">
                        <div className="w-6 sm:w-10 h-[2px] bg-[var(--mk-orange)]"></div>
                        <span className="mk-chip bg-[var(--mk-yellow)] text-[var(--mk-ink)] shadow-none text-[10px] sm:text-xs md:text-sm font-black px-3 py-1.5">
                            Pusat Informasi
                        </span>
                        <div className="w-6 sm:w-10 h-[2px] bg-[var(--mk-orange)]"></div>
                    </div>

                    <h1 className="mk-sticker-gradient text-[var(--mk-maroon)] text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] xl:text-[5.5rem] tracking-tight relative flex justify-center w-full px-2 sm:px-4">
                        <span aria-hidden="true" className="mk-sticker-stroke absolute text-transparent text-center leading-tight">Berita Publikasi</span>
                        <span className="mk-sticker-fill relative text-center leading-tight">Berita Publikasi</span>
                    </h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 relative z-0">
                <div className="flex flex-col lg:flex-row gap-5 lg:gap-6 mb-10 sm:mb-14 justify-between items-stretch lg:items-center bg-white p-4 sm:p-5 lg:p-6 rounded-2xl border-2 border-[var(--mk-ink)] shadow-[4px_4px_0_var(--mk-ink)] sm:shadow-[6px_6px_0_var(--mk-ink)]">
                    <div className="flex gap-2.5 sm:gap-3 overflow-x-auto lg:overflow-visible lg:flex-wrap pb-2 lg:pb-0 scrollbar-none shrink-0 -mx-4 px-4 sm:mx-0 sm:px-0 flex-1">
                        {categories.map(cat => {
                            const isActive = activeCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`text-[11px] sm:text-xs px-4 sm:px-5 py-2.5 font-black uppercase tracking-wider transition-all rounded-xl font-display shrink-0 cursor-pointer border-2 ${
                                        isActive
                                            ? 'bg-[var(--mk-yellow)] text-[var(--mk-ink)] border-[var(--mk-ink)] shadow-[2px_2px_0_var(--mk-ink)] translate-y-0.5 translate-x-0.5'
                                            : 'bg-white text-[var(--mk-ink)] border-[var(--mk-ink)] hover:bg-[var(--mk-orange)] hover:text-white shadow-[4px_4px_0_var(--mk-ink)] hover:shadow-[2px_2px_0_var(--mk-ink)] hover:translate-y-0.5 hover:translate-x-0.5'
                                    }`}
                                >
                                    {cat}
                                </button>
                            )
                        })}
                    </div>

                    <div className="w-full lg:w-72 xl:w-80 relative shrink-0">
                        <Search className="w-5 h-5 text-[var(--mk-ink)] absolute left-3.5 top-1/2 -translate-y-1/2 font-bold" />
                        <input
                            type="text"
                            placeholder="Cari berita..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-[var(--mk-light)] border-2 border-[var(--mk-ink)] text-sm font-bold pl-11 pr-4 py-3 rounded-xl text-[var(--mk-ink)] placeholder-[var(--mk-ink)]/50 focus:outline-none focus:bg-[var(--mk-yellow)] focus:shadow-[4px_4px_0_var(--mk-ink)] transition-all font-sans"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-[var(--mk-dark)] rounded-3xl border-2 border-dashed border-[#374151]">
                        <div className="w-10 h-10 border-4 border-[var(--mk-yellow)] border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-sm font-bold text-white/70 font-display tracking-widest uppercase animate-pulse">
                            Menjemput Berita...
                        </p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-24 border-2 border-dashed border-[#e5e7eb] rounded-3xl mk-bg-light p-6">
                        <Newspaper className="w-12 h-12 text-[var(--mk-ink)]/30 mx-auto mb-4" />
                        <p className="text-[var(--mk-ink)] font-bold font-display uppercase tracking-wider opacity-70 text-sm md:text-base">
                            Berita Tidak Ditemukan.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {filtered.map(item => (
                            <Link
                                key={item.id}
                                href={`/berita/${item.id}`}
                                className="group cursor-pointer flex flex-col h-full bg-white border-2 border-[var(--mk-ink)] rounded-2xl overflow-hidden shadow-[4px_4px_0_var(--mk-ink)] sm:shadow-[6px_6px_0_var(--mk-ink)] hover:shadow-[6px_6px_0_var(--mk-orange)] md:hover:shadow-[8px_8px_0_var(--mk-orange)] hover:-translate-y-1.5 transition-all duration-300"
                            >
                                <div className="relative aspect-[4/3] overflow-hidden bg-[var(--mk-ink)] border-b-2 border-[var(--mk-ink)]">
                                    {item.cover ? (
                                        <img
                                            src={item.cover}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-all duration-500 grayscale-0 lg:grayscale group-hover:grayscale-0"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                            <Newspaper className="w-10 h-10 text-[var(--mk-ink)]/20" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-3 bg-[var(--mk-yellow)] text-[var(--mk-ink)] border-2 border-[var(--mk-ink)] shadow-[2px_2px_0_var(--mk-ink)] text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md font-display">
                                        {item.category}
                                    </div>
                                </div>

                                <div className="p-4 sm:p-5 lg:p-6 flex flex-col flex-grow relative bg-white mk-bg-light">
                                    <div className="text-[10px] sm:text-[11px] text-[var(--mk-ink)]/60 font-black uppercase tracking-widest mb-2.5 flex items-center gap-1.5 font-display">
                                        <Calendar className="w-3.5 h-3.5 text-[var(--mk-orange)]" />
                                        <span>Rilis: {item.publishDate || '-'}</span>
                                    </div>
                                    <h3 className="font-black font-display text-[var(--mk-ink)] text-lg sm:text-xl lg:text-2xl leading-tight mb-3 group-hover:text-[var(--mk-orange)] transition-colors uppercase tracking-tight line-clamp-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-[var(--mk-ink)] font-medium leading-relaxed line-clamp-3 mb-5 lg:mb-6 opacity-80">
                                        {item.excerpt}
                                    </p>

                                    <div className="mt-auto pt-4 border-t-2 border-dashed border-[var(--mk-ink)]/30">
                                        <span className="text-[10px] sm:text-xs font-black text-[var(--mk-ink)] uppercase tracking-widest group-hover:text-[var(--mk-orange)] transition-colors flex items-center gap-2 font-display">
                                            Baca Selengkapnya <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1.5" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}