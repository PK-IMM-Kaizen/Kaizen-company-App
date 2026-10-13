'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Search, ArrowRight, Calendar, RefreshCw } from 'lucide-react'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

const categories = ['Semua', 'Bidang HPKP', 'Bidang Kader', 'Organisasi', 'Medkom', 'Kewirausahaan', 'Keilmuan']

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
            // Mengambil data dari tabel 'news' (bukan 'berita')
            const { data, error } = await supabase
                .from('news')
                .select('*')
                .eq('status', 'published')
                .order('id', { ascending: false })

            if (error) throw error

            if (data) {
                // Pemetaan nama kolom Supabase (snake_case) ke objek frontend (camelCase)
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
        <div className="bg-[var(--background)] min-h-screen w-full">
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
                            Pusat Informasi
                        </span>
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight font-display">
                        Berita & Publikasi
                    </h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
                <div className="flex flex-col lg:flex-row gap-6 mb-12 justify-between items-start lg:items-center">
                    <div className="flex gap-2 flex-wrap">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`text-xs px-5 py-2.5 font-bold uppercase tracking-wider transition-all rounded-[var(--radius)] font-display cursor-pointer ${
                                    activeCategory === cat
                                        ? 'bg-[var(--primary)] text-white shadow-md'
                                        : 'bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="w-full lg:w-auto relative">
                        <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Cari berita..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full lg:w-72 bg-[var(--surface)] border border-[var(--border)] text-sm pl-10 pr-4 py-2.5 rounded-[var(--radius)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:bg-[var(--background)] transition-colors"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center py-24 border border-dashed border-[var(--border-strong)] rounded-[var(--radius)] bg-[var(--surface)]">
                        <RefreshCw className="w-8 h-8 text-[var(--primary)] animate-spin mx-auto mb-4" />
                        <p className="text-[var(--text-muted)] font-medium text-sm">
                            Memuat berita dari Supabase...
                        </p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-24 border border-dashed border-[var(--border-strong)] rounded-[var(--radius)] bg-[var(--surface)]">
                        <p className="text-[var(--text-muted)] font-medium text-sm">
                            Tidak ada berita publikasi yang ditemukan.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filtered.map(item => (
                            <Link
                                key={item.id}
                                href={`/berita/${item.id}`}
                                className="group cursor-pointer flex flex-col h-full border border-[var(--border)] hover:border-[var(--primary)] transition-all duration-300 bg-[var(--card)] rounded-[var(--radius)] overflow-hidden shadow-sm hover:shadow-md"
                            >
                                <div className="relative aspect-[16/9] overflow-hidden bg-[#111111]">
                                    {item.cover ? (
                                        <img
                                            src={item.cover}
                                            alt={item.title}
                                            className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105 opacity-90 group-hover:opacity-100"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white/30 text-xs font-bold uppercase tracking-wider">
                                            Tanpa Cover
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4 bg-[var(--primary)] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-[calc(var(--radius)-2px)] font-display shadow-sm">
                                        {item.category}
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="text-xs text-[var(--text-muted)] font-medium mb-3 flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>Rilis: {item.publishDate || '-'}</span>
                                    </div>
                                    <h3 className="font-black text-[var(--text-primary)] text-lg leading-snug mb-3 group-hover:text-[var(--primary)] transition-colors font-display line-clamp-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3 mb-6">
                                        {item.excerpt}
                                    </p>

                                    <div className="mt-auto pt-4 border-t border-[var(--border)]">
                                        <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-widest group-hover:text-[var(--primary)] transition-colors flex items-center gap-2 font-display">
                                            Lihat Ringkasan <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
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