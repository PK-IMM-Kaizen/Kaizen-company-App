import Link from 'next/link'
import { newsData, type NewsItem } from '../../../lib/data'
import { ArrowLeft, Calendar, Newspaper, ExternalLink, ChevronRight } from 'lucide-react'

export default async function DetailBerita({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params
    const paramId = String(resolvedParams.id)

    const item = newsData.find(n => String(n.id) === paramId)
    const typedItem = item as (NewsItem & { pwmuUrl?: string }) | undefined

    const related = newsData.filter(n => String(n.id) !== paramId && n.status === 'published').slice(0, 3)

    if (!item) {
        return (
            <div className="max-w-3xl mx-auto px-4 pt-32 pb-32 text-center min-h-screen flex flex-col items-center justify-center bg-[var(--background)]">
                <p className="text-[var(--text-muted)] font-medium mb-6 text-sm">Berita tidak ditemukan.</p>
                <Link
                    href="/berita"
                    className="inline-flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-6 py-2.5 text-xs font-bold tracking-widest uppercase rounded-lg shadow-lg shadow-[var(--primary)]/20 transition-all"
                >
                    <ArrowLeft className="w-4 h-4" /> Kembali ke Berita
                </Link>
            </div>
        )
    }

    return (
        <div className="bg-[var(--background)] min-h-screen w-full selection:bg-[var(--primary)] selection:text-white">

            <div className="relative bg-[var(--primary-dark)] pt-32 pb-16 overflow-hidden">
                <div
                    className="absolute top-0 left-0 w-full h-1.5"
                    style={{ background: 'linear-gradient(to right, var(--primary), var(--accent), var(--accent-light))' }}
                />
                <div
                    className="absolute top-0 right-0 w-2/3 h-full opacity-10 pointer-events-none"
                    style={{ background: 'linear-gradient(to left, var(--primary), transparent)' }}
                />

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-[2px] bg-[var(--accent)] rounded-full"></div>
                        <span className="text-[var(--accent)] text-xs font-bold tracking-[0.2em] uppercase font-display">
                            Pusat Informasi
                        </span>
                    </div>
                </div>

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-white/60 uppercase tracking-wider">
                        <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
                        <span className="text-white/30">/</span>
                        <Link href="/berita" className="hover:text-white transition-colors">Berita</Link>
                        <span className="text-white/30">/</span>
                        <span className="text-white truncate max-w-[150px] sm:max-w-xs">{item.title}</span>
                    </div>
                </div>
            </div>

            <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 lg:py-16">

                <div className="flex flex-wrap items-center gap-4 mb-8 bg-[var(--surface)] p-3 rounded-xl border border-[var(--border)] inline-flex shadow-sm">
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-white bg-[var(--primary)] px-3 py-1.5 rounded-md font-display shadow-sm">
                        {item.category}
                    </span>
                    <div className="w-[1px] h-4 bg-[var(--border)] hidden sm:block"></div>
                    <span className="text-[11px] sm:text-xs text-[var(--text-secondary)] font-medium flex items-center gap-1.5 uppercase tracking-wide">
                        <Calendar className="w-3.5 h-3.5 text-[var(--primary)]" />
                        Pelaksanaan: <strong className="text-[var(--text-primary)]">{item.date || item.publishDate}</strong>
                    </span>
                    <div className="w-[1px] h-4 bg-[var(--border)] hidden sm:block"></div>
                    <span className="text-[11px] sm:text-xs text-[var(--text-secondary)] font-medium flex items-center gap-1.5 uppercase tracking-wide">
                        <Newspaper className="w-3.5 h-3.5 text-[var(--primary)]" />
                        Rilis: <strong className="text-[var(--text-primary)]">{item.publishDate}</strong>
                    </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] mb-8 leading-tight tracking-tight font-display">
                    {item.title}
                </h1>

                <div className="w-full aspect-[16/9] bg-[var(--surface-2)] mb-12 overflow-hidden rounded-2xl border border-[var(--border)] shadow-md relative">
                    <img src={item.cover} alt={item.title} className="w-full h-full object-cover" />
                </div>

                <div className="prose prose-lg prose-gray max-w-none mb-16 text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                    <p>{item.content}</p>
                </div>

                <div className="border-t border-[var(--border)] pt-12 pb-4 flex flex-col sm:flex-row items-center sm:items-start gap-4 justify-between">
                    <p className="text-xs text-[var(--text-muted)] text-center sm:text-left max-w-sm order-2 sm:order-1">
                        *Anda akan diarahkan ke halaman portal berita resmi Pimpinan Wilayah Muhammadiyah Jawa Timur.
                    </p>
                    <a
                        href={typedItem?.pwmuUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="order-1 sm:order-2 inline-flex items-center justify-center w-full sm:w-auto bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-8 py-4 text-xs sm:text-sm font-bold tracking-widest uppercase transition-all duration-300 rounded-xl shadow-lg shadow-[var(--primary)]/20 hover:-translate-y-1 group font-display"
                    >
                        Baca di PWMU.CO
                        <ExternalLink className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </a>
                </div>
            </article>

            {related.length > 0 && (
                <section className="bg-[var(--surface)] border-t border-[var(--border)] py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] uppercase tracking-wider font-display">
                                Berita Lainnya
                            </h3>
                            <Link href="/berita" className="text-xs text-[var(--primary)] hover:text-[var(--primary-dark)] font-bold uppercase tracking-widest flex items-center gap-1 transition-colors group">
                                Lihat Semua
                                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {related.map(r => (
                                <Link
                                    key={r.id}
                                    href={`/berita/${r.id}`}
                                    className="group flex flex-col h-full border border-[var(--border)] hover:border-[var(--primary)]/50 transition-all duration-300 bg-[var(--card)] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[var(--primary)]/5 hover:-translate-y-1.5"
                                >
                                    <div className="relative aspect-[16/9] overflow-hidden bg-[#111111]">
                                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent z-10 opacity-60"></div>
                                        <img
                                            src={r.cover}
                                            alt={r.title}
                                            className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105"
                                        />
                                        <div className="absolute top-4 left-4 z-20 bg-[var(--primary)] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md font-display shadow-md">
                                            {r.category}
                                        </div>
                                    </div>

                                    <div className="p-5 flex flex-col flex-grow justify-between">
                                        <h4 className="font-black text-[var(--text-primary)] text-sm md:text-base leading-snug line-clamp-3 group-hover:text-[var(--primary)] transition-colors font-display">
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