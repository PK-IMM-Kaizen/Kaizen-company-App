import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { ArrowLeft, Calendar, Newspaper, ExternalLink, ChevronRight } from 'lucide-react'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

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
            <div className="max-w-3xl mx-auto px-4 pt-28 sm:pt-32 pb-28 sm:pb-32 text-center min-h-screen flex flex-col items-center justify-center bg-[var(--background)] font-sans">
                <p className="text-[var(--text-muted)] font-medium mb-6 text-xs sm:text-sm">
                    Berita tidak ditemukan atau telah dihapus.
                </p>
                <Link
                    href="/berita"
                    className="inline-flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-5 sm:px-6 py-2.5 sm:py-3 text-xs font-bold tracking-widest uppercase rounded-xl shadow-lg shadow-[var(--primary)]/20 transition-all font-display"
                >
                    <ArrowLeft className="w-4 h-4" /> Kembali ke Berita
                </Link>
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
        cover: r.cover
    }))

    return (
        <div className="bg-[var(--background)] min-h-screen w-full font-sans selection:bg-[var(--primary)] selection:text-white">

            <div className="relative bg-[var(--primary-dark)] pt-28 sm:pt-32 pb-12 sm:pb-16 overflow-hidden">
                <div
                    className="absolute top-0 left-0 w-full h-1.5"
                    style={{ background: 'linear-gradient(to right, var(--primary), var(--accent), var(--accent-light))' }}
                />
                <div
                    className="absolute top-0 right-0 w-2/3 h-full opacity-10 pointer-events-none"
                    style={{ background: 'linear-gradient(to left, var(--primary), transparent)' }}
                />

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 mb-3 sm:mb-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-8 sm:w-10 h-[2px] bg-[var(--accent)] rounded-full"></div>
                        <span className="text-[var(--accent)] text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase font-display">
                            Pusat Informasi
                        </span>
                    </div>
                </div>

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-medium text-white/60 uppercase tracking-wider font-display">
                        <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
                        <span className="text-white/30">/</span>
                        <Link href="/berita" className="hover:text-white transition-colors">Berita</Link>
                        <span className="text-white/30">/</span>
                        <span className="text-white truncate max-w-[120px] xs:max-w-[180px] sm:max-w-xs">{item.title}</span>
                    </div>
                </div>
            </div>

            <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">

                <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 mb-6 sm:mb-8 bg-[var(--surface)] p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border border-[var(--border)] shadow-sm">
                    <span className="text-[9px] sm:text-xs font-black uppercase tracking-widest text-white bg-[var(--primary)] px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md font-display shadow-sm">
                        {item.category}
                    </span>
                    <div className="w-[1px] h-4 bg-[var(--border)] hidden sm:block"></div>
                    <span className="text-[10px] sm:text-xs text-[var(--text-secondary)] font-medium flex items-center gap-1.5 uppercase tracking-wide">
                        <Calendar className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" />
                        <span>Pelaksanaan: <strong className="text-[var(--text-primary)]">{item.date || item.publishDate || '-'}</strong></span>
                    </span>
                    <div className="w-[1px] h-4 bg-[var(--border)] hidden sm:block"></div>
                    <span className="text-[10px] sm:text-xs text-[var(--text-secondary)] font-medium flex items-center gap-1.5 uppercase tracking-wide">
                        <Newspaper className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" />
                        <span>Rilis: <strong className="text-[var(--text-primary)]">{item.publishDate || '-'}</strong></span>
                    </span>
                </div>

                <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] mb-6 sm:mb-8 leading-tight sm:leading-tight tracking-tight font-display">
                    {item.title}
                </h1>

                {item.cover && (
                    <div className="w-full aspect-[16/10] sm:aspect-[16/9] bg-[var(--surface-2)] mb-8 sm:mb-12 overflow-hidden rounded-2xl border border-[var(--border)] shadow-md relative">
                        <img src={item.cover} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                )}

                <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none mb-12 sm:mb-16 text-[var(--text-secondary)] leading-relaxed whitespace-pre-line font-sans">
                    <p className="leading-relaxed">{item.content}</p>
                </div>

                {item.pwmuUrl && (
                    <div className="border-t border-[var(--border)] pt-8 sm:pt-12 pb-4 flex flex-col sm:flex-row items-center sm:items-start gap-4 justify-between">
                        <p className="text-[11px] sm:text-xs text-[var(--text-muted)] text-center sm:text-left max-w-sm order-2 sm:order-1 leading-relaxed">
                            *Anda akan diarahkan ke halaman portal berita resmi Pimpinan Wilayah Muhammadiyah Jawa Timur.
                        </p>
                        <a
                            href={item.pwmuUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="order-1 sm:order-2 inline-flex items-center justify-center w-full sm:w-auto bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-bold tracking-widest uppercase transition-all duration-300 rounded-xl shadow-lg shadow-[var(--primary)]/20 hover:-translate-y-0.5 group font-display shrink-0"
                        >
                            Baca di PWMU.CO
                            <ExternalLink className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </a>
                    </div>
                )}
            </article>

            {related.length > 0 && (
                <section className="bg-[var(--surface)] border-t border-[var(--border)] py-12 sm:py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6">
                        <div className="flex items-center justify-between mb-8 sm:mb-10">
                            <h3 className="text-lg sm:text-2xl font-black text-[var(--text-primary)] uppercase tracking-wider font-display">
                                Berita Lainnya
                            </h3>
                            <Link href="/berita" className="text-xs text-[var(--primary)] hover:text-[var(--primary-dark)] font-bold uppercase tracking-widest flex items-center gap-1 transition-colors group font-display">
                                Lihat Semua
                                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {related.map(r => (
                                <Link
                                    key={r.id}
                                    href={`/berita/${r.id}`}
                                    className="group flex flex-col h-full border border-[var(--border)] hover:border-[var(--primary)]/60 transition-all duration-300 bg-[var(--card)] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1"
                                >
                                    <div className="relative aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-[#111111]">
                                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent z-10 opacity-60"></div>
                                        {r.cover ? (
                                            <img
                                                src={r.cover}
                                                alt={r.title}
                                                className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white/30 text-xs font-bold">Tanpa Cover</div>
                                        )}
                                        <div className="absolute top-3 left-3 z-20 bg-[var(--primary)] text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md font-display shadow-md">
                                            {r.category}
                                        </div>
                                    </div>

                                    <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between">
                                        <h4 className="font-black text-[var(--text-primary)] text-xs sm:text-sm md:text-base leading-snug line-clamp-3 group-hover:text-[var(--primary)] transition-colors font-display">
                                            {r.title}
                                        </h4>
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