'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'

interface Agenda {
    id: string | number
    title: string
    date: string
    month: string
    location: string
    time: string
    image_url?: string
}

interface News {
    id: string | number
    title: string
    excerpt: string
    cover: string
    category: string
    publishDate: string
    pwmuUrl: string
    status: string
}

interface BPH {
    id: string | number
    name: string
    position: string
    photo: string
}

const faqData = [
    {
        id: 1,
        question: "Apa itu IMM Kaizen?",
        answer: "IMM Komisariat Kaizen adalah organisasi pergerakan mahasiswa Islam di bawah naungan Ikatan Mahasiswa Muhammadiyah yang berada di Universitas Muhammadiyah Surabaya."
    },
    {
        id: 2,
        question: "Bagaimana cara bergabung menjadi anggota?",
        answer: "Anda dapat mengikuti kegiatan Darul Arqam Dasar (DAD) yang rutin kami selenggarakan setiap tahun ajaran baru sebagai gerbang utama pengkaderan."
    },
    {
        id: 3,
        question: "Siapa saja yang bisa bergabung?",
        answer: "Seluruh mahasiswa muslim yang terdaftar aktif di Universitas Muhammadiyah Surabaya dapat bergabung dan berproses bersama kami."
    }
]

export default function HomePage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null)

    const [upcomingAgendas, setUpcomingAgendas] = useState<Agenda[]>([])
    const [latestNews, setLatestNews] = useState<News[]>([])
    const [bphData, setBphData] = useState<BPH[]>([])

    const [isLoadingAgendas, setIsLoadingAgendas] = useState(true)
    const [isLoadingNews, setIsLoadingNews] = useState(true)
    const [isLoadingBph, setIsLoadingBph] = useState(true)

    const supabase = useMemo(
        () =>
            createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            ),
        []
    )

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const fetchNews = async () => {
                    const { data, error } = await supabase
                        .from('news')
                        .select('*')
                        .eq('status', 'published')
                        .order('created_at', { ascending: false })
                        .limit(3)

                    if (!error && data) setLatestNews(data as News[])
                    setIsLoadingNews(false)
                }

                const fetchAgendas = async () => {
                    const { data, error } = await supabase
                        .from('agendas')
                        .select('*')

                    if (!error && data) setUpcomingAgendas(data as Agenda[])
                    setIsLoadingAgendas(false)
                }

                const fetchBph = async () => {
                    const { data, error } = await supabase
                        .from('pengurus')
                        .select('*')
                        .in('position', ['Ketua Umum', 'Sekretaris Umum', 'Bendahara Umum'])

                    if (!error && data) {
                        const urutanJabatan = { 'Ketua Umum': 1, 'Sekretaris Umum': 2, 'Bendahara Umum': 3 }

                        const sortedBph = data.sort((a, b) => {
                            const urutanA = urutanJabatan[a.position as keyof typeof urutanJabatan] || 4
                            const urutanB = urutanJabatan[b.position as keyof typeof urutanJabatan] || 4
                            return urutanA - urutanB
                        })
                        setBphData(sortedBph as BPH[])
                    }
                    setIsLoadingBph(false)
                }

                await Promise.all([fetchNews(), fetchAgendas(), fetchBph()])

            } catch (error) {
                console.error("Error in fetching data:", error)
            }
        }

        fetchAllData()
    }, [supabase])

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden font-sans mk-bg-dark selection:bg-[var(--mk-yellow)] selection:text-[var(--mk-maroon-deep)]">
            <section className="relative z-10 flex flex-col items-center justify-center pb-20 pt-28 sm:pb-32 sm:pt-36 lg:pb-40">
                <div
                    className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
                    style={{ backgroundImage: `url('/img/bg-hero.webp')` }}
                />
                <div className="pointer-events-none absolute inset-0 overflow-hidden mk-decor">
                    <div className="opacity-20 mk-halftone mk-halftone--tl"></div>
                    <div className="opacity-20 mk-halftone mk-halftone--br"></div>
                    <div className="left-10 top-20 opacity-30 mk-star mk-star--lg mk-star--spin"></div>
                    <div className="-right-10 top-1/2 opacity-20 mk-star mk-star--xl mk-star--spin"></div>
                </div>

                <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4 text-center sm:px-6">
                    {/*<div className="mb-6 flex justify-center sm:mb-8">*/}
                    {/*    <div className="mk-photo-circle h-28 w-28 border-[var(--mk-yellow)] bg-white p-3 sm:h-32 sm:w-32 shadow-[8px_8px_0_var(--mk-ink)]">*/}
                    {/*        <img*/}
                    {/*            src="/img/logo/logo.jpg"*/}
                    {/*            alt="Logo IMM Kaizen"*/}
                    {/*            className="h-full w-full object-contain"*/}
                    {/*        />*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    <span className="mk-chip mb-4 rounded-5xl">Pimpinan Komisariat</span>

                    <h1 className="mb-4 flex flex-col items-center">
                        <span className="font-display text-base font-black tracking-widest text-white sm:text-2xl md:text-3xl">
                            IKATAN MAHASISWA MUHAMMADIYAH
                        </span>
                        <div className="relative mt-2 flex w-full justify-center px-2 text-[4rem] tracking-tight text-[var(--mk-yellow)] xs:text-[5rem] sm:text-[6rem] md:text-[5rem] mk-sticker-gradient">
                            <span aria-hidden="true" className="absolute text-center leading-none text-transparent mk-sticker-stroke">KAIZEN</span>
                            <span className="relative text-center leading-none mk-sticker-fill">KAIZEN</span>
                        </div>
                    </h1>

                    <p className="mb-6 font-display text-xs font-black uppercase tracking-widest text-[var(--mk-orange)] sm:mb-8 sm:text-base">
                        Universitas Muhammadiyah Surabaya
                    </p>

                    <p className="mx-auto mb-10 max-w-2xl px-2 text-sm font-medium leading-relaxed text-white/90 sm:mb-12 sm:text-base">
                        Platform digital resmi IMM Komisariat Kaizen. Bergerak bersama dalam ilmu, iman, dan amal nyata untuk membangun peradaban masyarakat.
                    </p>

                    <div className="flex w-full max-w-sm flex-col items-center gap-4 sm:w-auto sm:max-w-none sm:flex-row">
                        <Link href="/profil" className="mk-btn mk-btn--gold w-full sm:w-auto">
                            Profil Organisasi
                        </Link>
                        <Link href="/berita" className="mk-btn w-full sm:w-auto bg-[var(--mk-maroon-deep)] text-white border-2 border-white/50 hover:bg-white hover:text-[var(--mk-maroon-deep)] shadow-[0_5px_0_rgba(255,255,255,0.5)]">
                            Lihat Berita
                        </Link>
                    </div>

                    <div className="mt-16 grid w-full max-w-3xl grid-cols-2 gap-y-8 border-t-2 border-white/20 pt-10 sm:mt-20 sm:grid-cols-4 sm:gap-6 sm:pt-12">
                        {[
                            { label: 'Anggota Aktif', value: '120+' },
                            { label: 'Bidang', value: '10' },
                            { label: 'Tahun Berdiri', value: '2017' },
                            { label: 'Alumni', value: '300+' }
                        ].map(s => (
                            <div key={s.label} className="flex flex-col items-center">
                                <div className="font-display text-3xl font-black tabular-nums text-[var(--mk-yellow)] drop-shadow-[2px_2px_0_var(--mk-ink)] sm:text-4xl">
                                    {s.value}
                                </div>
                                <div className="mt-2 text-center font-display text-[10px] font-black uppercase tracking-widest text-white/90 sm:text-xs">
                                    {s.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative z-20 mx-auto -mt-6 px-4 pb-14 sm:-mt-10 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mk-paper grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-14">
                        <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border-2 border-[var(--mk-ink)] bg-[var(--mk-maroon)] lg:aspect-square shadow-[6px_6px_0_var(--mk-ink)]">
                            <img
                                src="https://pwmu.co/wp-content/uploads/2026/09/konsep-otomatis-V9a3.jpeg"
                                alt="Profil IMM Kaizen"
                                className="h-full w-full object-cover transition-all duration-700 grayscale-0 opacity-100 md:grayscale md:opacity-85 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100"
                            />
                        </div>

                        <div className="flex flex-col items-start justify-center">
                            <span className="mk-chip mb-5">Tentang Kami</span>
                            <h2 className="mb-5 font-display text-3xl font-black uppercase leading-[1.1] tracking-tight text-[var(--mk-ink)] sm:text-4xl md:text-5xl">
                                Melahirkan Pemimpin Masa Depan.
                            </h2>
                            <p className="mb-8 text-sm font-medium leading-relaxed text-[var(--mk-ink)]/80 sm:text-base">
                                IMM Komisariat Kaizen adalah organisasi mahasiswa Islam di bawah Ikatan Mahasiswa Muhammadiyah. Dengan semangat <strong className="font-black text-[var(--mk-maroon)]">KAIZEN</strong> (perbaikan terus-menerus), kami mendorong setiap kader untuk berinovasi, mandiri, dan berkontribusi nyata bagi masyarakat.
                            </p>
                            <Link href="/profil" className="mk-btn bg-[var(--mk-ink)] text-white w-full sm:w-auto shadow-[0_5px_0_var(--mk-yellow)] hover:bg-[var(--mk-maroon)]">
                                Profil Selengkapnya
                            </Link>
                        </div>
                    </div>

                    <div className="mt-16 flex flex-col items-center sm:mt-24">
                        <span className="mk-chip mb-6 bg-[var(--mk-yellow)]">Video Profil</span>
                        <div className="relative aspect-[16/9] w-full max-w-5xl overflow-hidden rounded-2xl border-4 border-[var(--mk-ink)] bg-[var(--mk-ink)] shadow-[8px_8px_0_var(--mk-ink)] sm:rounded-3xl sm:shadow-[16px_16px_0_var(--mk-ink)]">
                            <video
                                src="/video/profile.mp4"
                                className="absolute inset-0 h-full w-full object-cover"
                                controls
                                autoPlay
                                muted
                                loop
                                playsInline
                                title="Video Profil IMM Kaizen"
                            >
                                Maaf, browser Anda tidak mendukung pemutaran video.
                            </video>
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
                <div className="pointer-events-none absolute inset-0 overflow-hidden mk-decor opacity-10">
                    <div className="mk-halftone mk-halftone--tl"></div>
                    <div className="right-5 top-10 mk-star mk-star--spin"></div>
                </div>

                <div className="relative z-10 mx-auto max-w-7xl">
                    <div className="mb-10 flex flex-col items-center text-center sm:mb-14">
                        <span className="mk-chip mb-4">Kabar Terkini</span>
                        <div className="relative flex justify-center text-3xl sm:text-4xl md:text-5xl text-white mk-sticker-gradient">
                            <span aria-hidden="true" className="absolute text-center leading-none text-transparent mk-sticker-stroke">Berita & Dokumentasi</span>
                            <span className="relative text-center leading-none mk-sticker-fill">Berita & Dokumentasi</span>
                        </div>
                    </div>

                    {isLoadingNews ? (
                        <p className="animate-pulse py-12 text-center font-display text-sm font-bold uppercase tracking-widest text-white/90">Memuat berita terbaru...</p>
                    ) : latestNews.length === 0 ? (
                        <p className="rounded-2xl border-2 border-dashed border-white/40 bg-white/10 p-6 py-12 text-center font-display text-sm font-bold uppercase tracking-widest text-white/90">
                            Belum ada berita yang dipublikasikan.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                            {latestNews.map(item => (
                                <article
                                    key={item.id}
                                    className="group flex h-full flex-col overflow-hidden rounded-2xl border-2 border-[var(--mk-ink)] bg-white shadow-[6px_6px_0_var(--mk-ink)] transition-transform duration-300 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0_var(--mk-ink)] sm:rounded-3xl"
                                >
                                    <Link href={`/berita/${item.id}`} className="relative block aspect-[16/10] overflow-hidden border-b-2 border-[var(--mk-ink)] bg-[var(--mk-cream)]">
                                        <img
                                            src={item.cover}
                                            alt={item.title}
                                            className="h-full w-full object-cover transition-all duration-700 grayscale-0 opacity-100 md:grayscale md:opacity-90 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100"
                                        />
                                        <span className="absolute left-3 top-3 rounded border border-[var(--mk-ink)] bg-[var(--mk-yellow)] px-2.5 py-1 font-display text-[9px] font-black uppercase tracking-widest text-[var(--mk-ink)] shadow-[2px_2px_0_var(--mk-ink)] sm:text-[10px]">
                                            {item.category}
                                        </span>
                                    </Link>

                                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                                        <span className="mb-2 block font-display text-[10px] font-black uppercase tracking-widest text-[var(--mk-orange)] sm:text-xs">
                                            {item.publishDate}
                                        </span>
                                        <Link href={`/berita/${item.id}`}>
                                            <h3 className="mb-3 line-clamp-2 font-display text-lg font-black uppercase leading-tight text-[var(--mk-ink)] transition-colors group-hover:text-[var(--mk-maroon)] sm:text-xl md:text-2xl">
                                                {item.title}
                                            </h3>
                                        </Link>
                                        <p className="mb-6 line-clamp-3 text-sm font-medium leading-relaxed text-[var(--mk-ink)]/70">
                                            {item.excerpt}
                                        </p>

                                        {item.pwmuUrl && (
                                            <a
                                                href={item.pwmuUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-auto inline-flex items-center gap-1.5 self-start font-display text-xs font-black uppercase tracking-widest text-[var(--mk-maroon)] hover:text-[var(--mk-orange)]"
                                            >
                                                Baca di PWMU.CO <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                                            </a>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="relative px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
                <div className="mk-paper mx-auto max-w-4xl bg-[var(--mk-cream)] border-2 border-[var(--mk-ink)]">
                    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl sm:rounded-3xl opacity-20">
                        <div className="mk-halftone mk-halftone--tr"></div>
                    </div>

                    <div className="relative z-10 mb-10 flex flex-col items-center text-center sm:mb-14">
                        <span className="mk-chip mb-4">Kalender Kegiatan</span>
                        <h2 className="font-display text-3xl font-black uppercase tracking-tight text-[var(--mk-ink)] sm:text-4xl md:text-5xl">
                            Agenda Mendatang
                        </h2>
                    </div>

                    <div className="relative z-10 flex flex-col gap-4 sm:gap-6">
                        {isLoadingAgendas ? (
                            <p className="animate-pulse py-12 text-center font-display text-sm font-bold uppercase tracking-widest text-[var(--mk-ink)]">Memuat jadwal kegiatan...</p>
                        ) : upcomingAgendas.length === 0 ? (
                            <p className="rounded-xl border-2 border-dashed border-[var(--mk-ink)] bg-white p-6 py-12 text-center font-display text-sm font-bold uppercase tracking-widest text-[var(--mk-ink)]">
                                Belum ada agenda dalam waktu dekat.
                            </p>
                        ) : (
                            upcomingAgendas.map(agenda => {
                                const isComingSoon = !agenda.month || (agenda.date && agenda.date.toLowerCase().includes('soon'))

                                return (
                                    <div
                                        key={agenda.id}
                                        className="group flex flex-col items-start gap-4 rounded-xl border-2 border-[var(--mk-ink)] bg-white p-4 shadow-[4px_4px_0_var(--mk-ink)] transition-transform hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--mk-ink)] sm:flex-row sm:items-center sm:gap-6 sm:p-5"
                                    >
                                        {agenda.image_url ? (
                                            <div className="aspect-video w-full shrink-0 overflow-hidden rounded-lg border-2 border-[var(--mk-ink)] bg-[var(--mk-cream)] sm:aspect-square sm:w-32 md:w-36">
                                                <img
                                                    src={agenda.image_url}
                                                    alt={agenda.title}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    onError={e => (e.currentTarget.style.display = 'none')}
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex w-full flex-row items-baseline justify-center gap-2 border-b-2 border-[var(--mk-ink)] pb-3 text-center sm:w-auto sm:min-w-[110px] sm:flex-col sm:items-center sm:gap-0 sm:border-b-0 sm:border-r-2 sm:pb-0 sm:pr-6">
                                                <span className={`${isComingSoon ? 'text-xl sm:text-2xl' : 'text-3xl sm:text-4xl'} font-display font-black uppercase leading-tight text-[var(--mk-maroon)]`}>
                                                    {agenda.date || 'TBA'}
                                                </span>
                                                {agenda.month && (
                                                    <span className="font-display text-[10px] font-black uppercase tracking-widest text-[var(--mk-ink)] sm:mt-1 sm:text-xs">
                                                        {agenda.month}
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        <div className="w-full flex-1 sm:w-auto">
                                            <h3 className="font-display text-lg font-black uppercase leading-snug text-[var(--mk-ink)] sm:text-xl md:text-2xl">
                                                {agenda.title}
                                            </h3>
                                            <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold text-[var(--mk-ink)]/80 sm:gap-x-5 sm:text-sm">
                                                {agenda.image_url && agenda.date && (
                                                    <span className="flex items-center gap-1.5 rounded bg-[var(--mk-yellow)] px-2 py-0.5 font-display text-[10px] font-black uppercase tracking-widest text-[var(--mk-ink)] border border-[var(--mk-ink)]">
                                                        {agenda.date} {agenda.month || ''}
                                                    </span>
                                                )}
                                                {[agenda.location, agenda.time].filter(Boolean).map(v => (
                                                    <span key={v} className="flex items-center gap-1.5 uppercase tracking-wider">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--mk-orange)]" />
                                                        {v}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>
            </section>

            <section className="relative px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
                <div className="mx-auto max-w-7xl relative z-10">
                    <div className="mb-10 flex flex-col items-center text-center sm:mb-14">
                        <span className="mk-chip mb-4">Pimpinan Komisariat</span>
                        <div className="relative flex justify-center text-3xl sm:text-4xl md:text-5xl text-[var(--mk-yellow)] mk-sticker-gradient">
                            <span aria-hidden="true" className="absolute text-center leading-none text-transparent mk-sticker-stroke">Badan Pengurus Harian</span>
                            <span className="relative text-center leading-none mk-sticker-fill">Badan Pengurus Harian</span>
                        </div>
                    </div>

                    {isLoadingBph ? (
                        <p className="animate-pulse py-12 text-center font-display text-sm font-bold uppercase tracking-widest text-white/90">Memuat data BPH...</p>
                    ) : bphData.length === 0 ? (
                        <p className="rounded-2xl border-2 border-dashed border-white/40 bg-white/10 p-6 py-12 text-center font-display text-sm font-bold uppercase tracking-widest text-white/90">
                            Data kepengurusan belum tersedia.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-8 sm:grid-cols-3">
                            {bphData.map(bph => (
                                <div
                                    key={bph.id}
                                    className="group flex flex-col items-center rounded-2xl border-2 border-[var(--mk-ink)] bg-white p-5 text-center shadow-[6px_6px_0_var(--mk-ink)] transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0_var(--mk-ink)] sm:rounded-3xl sm:p-8 relative overflow-hidden"
                                >
                                    <div className="pointer-events-none absolute inset-0 opacity-5 mk-halftone mk-halftone--tl"></div>

                                    <div className="relative z-10 mb-4 flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-[var(--mk-ink)] bg-[var(--mk-cream)] shadow-[4px_4px_0_var(--mk-yellow)] sm:mb-6 sm:h-32 sm:w-32 md:h-36 md:w-36">
                                        {bph.photo ? (
                                            <img
                                                src={bph.photo}
                                                alt={bph.name}
                                                className="h-full w-full object-cover object-top transition-all duration-500 grayscale-0 opacity-100 md:grayscale md:opacity-85 group-hover:grayscale-0 group-hover:opacity-100"
                                            />
                                        ) : (
                                            <span className="font-display text-[10px] font-black uppercase text-[var(--mk-ink)]/50">No Photo</span>
                                        )}
                                    </div>
                                    <h4 className="relative z-10 mb-2 line-clamp-2 font-display text-base font-black uppercase leading-tight text-[var(--mk-ink)] sm:text-lg md:text-xl">
                                        {bph.name}
                                    </h4>
                                    <span className="relative z-10 mt-auto rounded border border-[var(--mk-ink)] bg-[var(--mk-yellow)] px-2.5 py-1 font-display text-[9px] font-black uppercase tracking-widest text-[var(--mk-ink)] shadow-[2px_2px_0_var(--mk-ink)] sm:text-xs">
                                        {bph.position}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="relative px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
                <div className="mk-paper mx-auto max-w-3xl bg-white border-2 border-[var(--mk-ink)]">
                    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl sm:rounded-3xl opacity-10">
                        <div className="mk-halftone mk-halftone--bl"></div>
                        <div className="right-4 top-4 mk-star mk-star--spin"></div>
                    </div>

                    <div className="relative z-10 mb-10 flex flex-col items-center text-center sm:mb-12">
                        <span className="mk-chip mb-4">Pusat Informasi</span>
                        <h2 className="font-display text-2xl font-black uppercase tracking-tight text-[var(--mk-orange-deep)] sm:text-4xl md:text-3xl">
                            Pertanyaan Seputar IMM Kaizen
                        </h2>
                    </div>

                    <div className="relative z-10 flex flex-col border-t-2 border-[var(--mk-ink)]">
                        {faqData.map((faq, index) => {
                            const isOpen = openFaq === index
                            return (
                                <div key={faq.id} className="border-b-2 border-[var(--mk-ink)] bg-[var(--mk-cream)] first:rounded-t-xl last:rounded-b-xl">
                                    <button
                                        onClick={() => setOpenFaq(isOpen ? null : index)}
                                        aria-expanded={isOpen}
                                        className="group flex min-h-[64px] w-full cursor-pointer items-center justify-between gap-4 px-4 py-4 text-left focus:outline-none sm:px-6 sm:py-5"
                                    >
                                        <h4 className="font-display text-sm font-black uppercase leading-snug text-[var(--mk-ink)] transition-colors group-hover:text-[var(--mk-maroon)] sm:text-base md:text-lg">
                                            {faq.question}
                                        </h4>
                                        <span
                                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[var(--mk-ink)] transition-transform duration-300 sm:h-10 sm:w-10 ${
                                                isOpen
                                                    ? 'rotate-180 bg-[var(--mk-maroon)] text-white shadow-[2px_2px_0_var(--mk-ink)]'
                                                    : 'bg-[var(--mk-yellow)] text-[var(--mk-ink)] shadow-[2px_2px_0_var(--mk-ink)] group-hover:-translate-y-0.5 group-hover:shadow-[4px_4px_0_var(--mk-ink)]'
                                            }`}
                                        >
                                            <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </span>
                                    </button>

                                    <div
                                        className={`grid transition-all duration-300 ease-in-out bg-white ${
                                            isOpen ? 'grid-rows-[1fr] border-t-2 border-[var(--mk-ink)]' : 'grid-rows-[0fr]'
                                        }`}
                                    >
                                        <div className="overflow-hidden">
                                            <p className="px-4 py-4 text-sm font-medium leading-relaxed text-[var(--mk-ink)]/80 sm:px-6 sm:py-5 sm:text-base">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            <section className="relative bg-[var(--mk-yellow)] py-10 border-t-4 border-[var(--mk-ink)] text-[var(--mk-ink)] sm:py-12 md:py-16 mt-10">
                <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-5 px-4 text-center sm:gap-6 sm:px-6 md:flex-row md:text-left lg:px-8">
                    <div className="max-w-xl">
                        <span className="mb-1 block font-display text-[10px] font-bold uppercase tracking-[0.2em]">
                            Suara Mahasiswa
                        </span>
                        <h3 className="font-display text-xl font-black tracking-tight sm:text-2xl md:text-3xl text-[var(--mk-maroon)]">
                            SAMPAIKAN ASPIRASIMU!
                        </h3>
                        <p className="mt-1.5 text-xs font-semibold leading-relaxed sm:text-sm">
                            Punya ide, kritik, atau saran untuk komisariat? Suaramu sangat berarti untuk perubahan yang lebih baik.
                        </p>
                    </div>
                    <Link
                        href="/aspirasi"
                        className="mk-btn mk-btn--primary w-full max-w-xs shrink-0 whitespace-nowrap uppercase tracking-widest sm:w-auto sm:max-w-none border-2 border-white"
                    >
                        Kirim Aspirasi
                    </Link>
                </div>
            </section>
        </div>
    )
}
