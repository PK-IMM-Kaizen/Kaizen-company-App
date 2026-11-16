import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import { ArrowLeft, Calendar, Newspaper, ExternalLink, ChevronRight } from 'lucide-react'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const resolvedParams = await params
    const paramId = resolvedParams.id

    const { data: rawItem } = await supabase
        .from('news')
        .select('title, content, cover')
        .eq('id', paramId)
        .single()

    if (!rawItem) {
        return {
            title: 'Berita Tidak Ditemukan',
        }
    }

    const excerpt = rawItem.content
        ? rawItem.content.substring(0, 150).replace(/\n/g, ' ') + '...'
        : 'Berita terbaru dari IMM Kaizen'

    return {
        title: rawItem.title,
        description: excerpt,
        openGraph: {
            title: rawItem.title,
            description: excerpt,
            images: rawItem.cover ? [rawItem.cover] : ['/img/og-image.jpg'],
            type: 'article',
        },
    }
}

export default async function DetailBerita({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params
    const paramId = resolvedParams.id

    const { data: rawItem, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', paramId)
        .single()

    const { data: rawRelated } = await supabase
        .from('news')
        .select('*')
        .eq('status', 'published')
        .neq('id', paramId)
        .order('id', { ascending: false })
        .limit(3)

    if (error || !rawItem) {
        return (
            <div className="w-full mk-bg-light min-h-screen flex flex-col items-center justify-center px-4 pt-28 pb-28 font-sans">
                <div className="bg-white border-2 border-[var(--mk-ink)] shadow-[8px_8px_0_var(--mk-ink)] rounded-3xl p-10 sm:p-14 text-center max-w-2xl w-full">
                    <Newspaper className="w-16 h-16 mx-auto mb-6 text-[var(--mk-ink)]/20" />
                    <h2 className="text-3xl sm:text-4xl font-black font-display text-[var(--mk-ink)] uppercase tracking-tight mb-4">Waduh!</h2>
                    <p className="text-[var(--mk-ink)]/70 font-medium mb-8 text-sm sm:text-base">
                        Berita yang kamu cari tidak ditemukan atau sudah ditarik dari publikasi.
                    </p>
                    <Link
                        href="/berita"
                        className="inline-flex items-center gap-2 bg-[var(--mk-yellow)] text-[var(--mk-ink)] border-2 border-[var(--mk-ink)] px-6 sm:px-8 py-3.5 text-xs sm:text-sm font-black tracking-widest uppercase rounded-xl shadow-[4px_4px_0_var(--mk-ink)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all font-display"
                    >
                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /> Kembali ke Berita
                    </Link>
                </div>
            </div>
        )
    }

    const item = {
        title: rawItem.title || '',
        content: rawItem.content || '',
        category: rawItem.category || 'Organisasi',
        date: rawItem.date || '',
        publishDate: rawItem.publish_date || rawItem.created_at || '',
        cover: rawItem.cover || '',
        pwmuUrl: rawItem.pwmu_url || ''
    }

    const related = (rawRelated || []).map((r: any) => ({
        id: r.id,
        title: r.title,
        category: r.category,
        cover: r.cover,
        publishDate: r.publish_date || r.created_at || '',
        excerpt: r.excerpt || (r.content ? r.content.substring(0, 100) + '...' : '')
    }))

    return (
        <div className="w-full mk-bg-light min-h-screen font-sans selection:bg-[var(--mk-yellow)] selection:text-[var(--mk-ink)]">
            <div className="bg-[var(--mk-maroon-deep)] pt-28 sm:pt-36 pb-32 sm:pb-40 relative z-0 border-b-4 border-[var(--mk-yellow)] overflow-hidden">
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, var(--mk-yellow) 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}></div>
                <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
                    <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs font-black text-white/80 uppercase tracking-widest font-display mb-8">
                        <Link href="/" className="hover:text-[var(--mk-yellow)] transition-colors border-b-2 border-transparent hover:border-[var(--mk-yellow)] pb-0.5">Beranda</Link>
                        <span className="text-[var(--mk-orange)]">/</span>
                        <Link href="/berita" className="hover:text-[var(--mk-yellow)] transition-colors border-b-2 border-transparent hover:border-[var(--mk-yellow)] pb-0.5">Berita</Link>
                        <span className="text-[var(--mk-orange)]">/</span>
                        <span className="text-[var(--mk-yellow)] truncate max-w-[120px] xs:max-w-[200px] sm:max-w-xs">{item.title}</span>
                    </div>

                    <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] sm:leading-[1.1] tracking-tight font-display drop-shadow-[2px_2px_0_var(--mk-ink)] max-w-4xl">
                        {item.title}
                    </h1>
                </div>
            </div>

            <article className="max-w-5xl mx-auto px-4 sm:px-6 -mt-20 sm:-mt-24 relative z-10 mb-16 sm:mb-24">
                <div className="bg-white border-2 border-[var(--mk-ink)] shadow-[6px_6px_0_var(--mk-ink)] sm:shadow-[12px_12px_0_var(--mk-ink)] rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-12">
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8 sm:mb-10 pb-6 sm:pb-8 border-b-2 border-dashed border-[var(--mk-ink)]/30">
                        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[var(--mk-ink)] bg-[var(--mk-yellow)] border-2 border-[var(--mk-ink)] shadow-[2px_2px_0_var(--mk-ink)] px-3 py-1.5 rounded-lg font-display">
                            {item.category}
                        </span>

                        <div className="flex flex-wrap items-center gap-4 text-[10px] sm:text-xs text-[var(--mk-ink)] font-bold uppercase tracking-wider font-display">
                            {item.date && (
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4 text-[var(--mk-orange)]" />
                                    <span className="opacity-60">Acara:</span> <span>{item.date}</span>
                                </span>
                            )}
                            {item.date && item.publishDate && <span className="w-1.5 h-1.5 rounded-full bg-[var(--mk-ink)]/20 hidden sm:block"></span>}
                            {item.publishDate && (
                                <span className="flex items-center gap-1.5">
                                    <Newspaper className="w-4 h-4 text-[var(--mk-orange)]" />
                                    <span className="opacity-60">Rilis:</span> <span>{item.publishDate}</span>
                                </span>
                            )}
                        </div>
                    </div>

                    {item.cover && (
                        <div className="w-full aspect-[4/3] sm:aspect-[16/9] bg-[var(--mk-ink)] mb-8 sm:mb-12 overflow-hidden rounded-xl border-2 border-[var(--mk-ink)] shadow-[4px_4px_0_var(--mk-ink)] relative group">
                            <img
                                src={item.cover}
                                alt={item.title}
                                className="w-full h-full object-cover transition-all duration-500 grayscale-0 lg:grayscale group-hover:grayscale-0"
                            />
                        </div>
                    )}

                    <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none mb-12 sm:mb-16 text-[var(--mk-ink)] leading-relaxed whitespace-pre-line font-medium selection:bg-[var(--mk-orange)] selection:text-white">
                        <p className="leading-[1.8] sm:leading-[1.8]">{item.content}</p>
                    </div>

                    {item.pwmuUrl && (
                        <div className="bg-[var(--mk-light)] border-2 border-[var(--mk-ink)] p-5 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 justify-between border-dashed">
                            <div className="text-center sm:text-left">
                                <h4 className="font-black font-display text-[var(--mk-ink)] uppercase tracking-wider text-sm sm:text-base mb-1.5">Baca di Portal Resmi</h4>
                                <p className="text-xs sm:text-sm text-[var(--mk-ink)]/70 font-medium">
                                    Berita ini juga dipublikasikan secara resmi di portal PWMU Jawa Timur.
                                </p>
                            </div>
                            <a
                                href={item.pwmuUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto inline-flex items-center justify-center bg-[var(--mk-orange)] text-white border-2 border-[var(--mk-ink)] px-6 sm:px-8 py-3.5 text-xs sm:text-sm font-black tracking-widest uppercase rounded-xl shadow-[4px_4px_0_var(--mk-ink)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all font-display shrink-0"
                            >
                                Buka PWMU.CO
                                <ExternalLink className="w-4 h-4 ml-2" />
                            </a>
                        </div>
                    )}
                </div>
            </article>

            {related.length > 0 && (
                <section className="bg-[var(--mk-dark)] border-t-4 border-[var(--mk-yellow)] py-16 sm:py-24 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--mk-maroon)] rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 sm:mb-12">
                            <h3 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight font-display flex items-center gap-3">
                                <div className="w-6 sm:w-10 h-[2px] bg-[var(--mk-orange)]"></div>
                                Berita Lainnya
                            </h3>
                            <Link
                                href="/berita"
                                className="inline-flex items-center justify-center gap-2 bg-white text-[var(--mk-ink)] border-2 border-[var(--mk-ink)] px-5 py-2.5 text-[10px] sm:text-xs font-black tracking-widest uppercase rounded-xl shadow-[4px_4px_0_var(--mk-ink)] hover:bg-[var(--mk-yellow)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[2px_2px_0_var(--mk-ink)] transition-all font-display"
                            >
                                Lihat Semua
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {related.map(r => (
                                <Link
                                    key={r.id}
                                    href={`/berita/${r.id}`}
                                    className="group cursor-pointer flex flex-col h-full bg-white border-2 border-[var(--mk-ink)] rounded-2xl overflow-hidden shadow-[4px_4px_0_var(--mk-ink)] sm:shadow-[6px_6px_0_var(--mk-ink)] hover:shadow-[6px_6px_0_var(--mk-orange)] md:hover:shadow-[8px_8px_0_var(--mk-orange)] hover:-translate-y-1.5 transition-all duration-300"
                                >
                                    <div className="relative aspect-[4/3] overflow-hidden bg-[var(--mk-ink)] border-b-2 border-[var(--mk-ink)]">
                                        {r.cover ? (
                                            <img
                                                src={r.cover}
                                                alt={r.title}
                                                className="w-full h-full object-cover transition-all duration-500 grayscale-0 lg:grayscale group-hover:grayscale-0"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                <Newspaper className="w-10 h-10 text-[var(--mk-ink)]/20" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 left-3 bg-[var(--mk-yellow)] text-[var(--mk-ink)] border-2 border-[var(--mk-ink)] shadow-[2px_2px_0_var(--mk-ink)] text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md font-display">
                                            {r.category}
                                        </div>
                                    </div>

                                    <div className="p-4 sm:p-5 lg:p-6 flex flex-col flex-grow relative bg-white mk-bg-light">
                                        <div className="text-[10px] sm:text-[11px] text-[var(--mk-ink)]/60 font-black uppercase tracking-widest mb-2.5 flex items-center gap-1.5 font-display">
                                            <Calendar className="w-3.5 h-3.5 text-[var(--mk-orange)]" />
                                            <span>Rilis: {r.publishDate || '-'}</span>
                                        </div>
                                        <h4 className="font-black font-display text-[var(--mk-ink)] text-lg sm:text-xl leading-tight mb-3 group-hover:text-[var(--mk-orange)] transition-colors uppercase tracking-tight line-clamp-2">
                                            {r.title}
                                        </h4>
                                        <p className="text-xs sm:text-sm text-[var(--mk-ink)] font-medium leading-relaxed line-clamp-2 opacity-80">
                                            {r.excerpt}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    )
}