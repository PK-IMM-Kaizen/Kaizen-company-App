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

const BG_GRID = {
    backgroundImage:
        'linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(180deg,#701b1b,#561212)',
    backgroundSize: '56px 56px,56px 56px,100% 100%'
}

const PAPER =
    'rounded-[28px] bg-white text-[#2b1414] p-5 sm:p-8 md:p-10 shadow-[8px_-8px_0_0_#f6c244,0_24px_50px_-14px_rgba(0,0,0,0.5)] sm:shadow-[14px_-14px_0_0_#f6c244,0_24px_50px_-14px_rgba(0,0,0,0.5)]'

const CHIP =
    'inline-block rounded bg-[#f4b82e] px-2.5 py-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#4d1010] font-display'

const BTN =
    'mb-1 inline-flex items-center justify-center gap-2 rounded-full px-6 sm:px-8 py-3 sm:py-3.5 text-xs sm:text-sm font-bold font-display transition active:translate-y-[3px] motion-reduce:transition-none'
const BTN_GOLD = `${BTN} bg-[#f4b82e] text-[#4d1010] shadow-[0_5px_0_rgba(0,0,0,0.35)] hover:bg-[#ffc845] active:shadow-[0_2px_0_rgba(0,0,0,0.35)]`
const BTN_MAROON = `${BTN} bg-[#6b1b1b] text-white shadow-[0_5px_0_#f4b82e] hover:bg-[#561212] active:shadow-[0_2px_0_#f4b82e]`
const BTN_LINE = `${BTN} border-2 border-white/50 text-white hover:bg-white/10`

const STARS = [
    '-left-10 top-[14%] h-32 w-32 blur-[3px] animate-[spin_90s_linear_infinite]',
    '-right-8 top-[6%] h-28 w-28 blur-[2px] animate-[spin_70s_linear_infinite_reverse]',
    'right-[5%] top-[46%] hidden h-40 w-40 blur-[5px] lg:block',
    '-left-14 top-[72%] h-44 w-44 blur-[6px]'
]

const FAQ_DATA = [
    { id: 1, question: 'Bagaimana cara bergabung dengan IMM Kaizen?', answer: 'Mahasiswa Universitas Muhammadiyah Surabaya dapat bergabung melalui kegiatan Darul Arqam Dasar (DAD) yang rutin kami selenggarakan di awal semester.' },
    { id: 2, question: 'Apa saja fokus kegiatan di IMM?', answer: 'Kami bergerak di tiga ranah utama (Tri Kompetensi Dasar): Keagamaan, Kemahasiswaan, dan Kemasyarakatan. Mulai dari kajian, diskusi publik, hingga aksi sosial.' },
    { id: 3, question: 'Apakah mahasiswa non-Muhammadiyah bisa bergabung?', answer: 'Tentu. Ikatan Mahasiswa Muhammadiyah sangat inklusif. Kami menerima siapapun yang memiliki visi selaras untuk belajar dan berproses bersama.' }
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
                const [agendasRes, newsRes, bphRes] = await Promise.all([
                    supabase.from('agendas').select('*').order('created_at', { ascending: false }).limit(3),
                    supabase.from('news').select('*').eq('status', 'published').order('created_at', { ascending: false }).limit(3),
                    supabase.from('pengurus').select('*').eq('division', 'BPH').order('created_at', { ascending: true })
                ])

                if (agendasRes.error) console.error('Error fetching agendas:', agendasRes.error)
                else if (agendasRes.data) setUpcomingAgendas(agendasRes.data)

                if (newsRes.error) console.error('Error fetching news:', newsRes.error)
                else if (newsRes.data) setLatestNews(newsRes.data)

                if (bphRes.error) console.error('Error fetching BPH:', JSON.stringify(bphRes.error, null, 2))
                else if (bphRes.data) setBphData(bphRes.data)
            } catch (error) {
                console.error('Unexpected error fetching data:', error)
            } finally {
                setIsLoadingAgendas(false)
                setIsLoadingNews(false)
                setIsLoadingBph(false)
            }
        }

        fetchAllData()
    }, [supabase])

    return (
        <div
            style={BG_GRID}
            className="relative w-full overflow-x-hidden bg-[#5a1313] font-sans text-white selection:bg-[#f4b82e] selection:text-[#4d1010]"
        >
            {STARS.map(c => (
                <div
                    key={c}
                    aria-hidden
                    className={`pointer-events-none absolute rotate-12 rounded-[38%] bg-gradient-to-br from-[#ffd567] to-[#e9a010] motion-reduce:animate-none ${c}`}
                />
            ))}

            <section className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center px-4 pb-16 pt-24 sm:px-6 sm:pb-20">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-20"
                    style={{ backgroundImage: `url('/img/bg-hero.webp')` }}
                />

                <div className="relative z-10 mx-auto mt-4 flex w-full max-w-4xl flex-col items-center text-center sm:mt-8">
                    <span className={`${CHIP} mb-5`}>Pimpinan Komisariat</span>

                    <h1 className="mb-4 font-display font-black leading-[1.1]">
                        <span className="block text-lg tracking-tight text-white sm:text-3xl">
                            IKATAN MAHASISWA MUHAMMADIYAH
                        </span>
                        <span
                            aria-label="Kaizen"
                            className="mt-2 grid text-6xl uppercase drop-shadow-[0_6px_0_rgba(0,0,0,0.25)] sm:text-8xl [&>span]:[grid-area:1/1]"
                        >
                            <span aria-hidden className="text-white [-webkit-text-stroke:0.2em_#fff] [stroke-linejoin:round]">Kaizen</span>
                            <span aria-hidden className="bg-gradient-to-b from-[#6b1b1b] to-[#c4585f] bg-clip-text text-transparent">Kaizen</span>
                        </span>
                    </h1>

                    <p className="mb-6 text-xs font-bold uppercase tracking-widest text-white/90 sm:mb-8 sm:text-base md:text-lg">
                        Universitas Muhammadiyah Surabaya
                    </p>

                    <p className="mb-8 max-w-2xl px-2 text-xs leading-relaxed text-white/80 sm:mb-10 sm:text-sm md:text-base">
                        Platform digital resmi IMM Komisariat Kaizen. Bergerak bersama dalam ilmu, iman, dan amal nyata untuk membangun peradaban masyarakat.
                    </p>

                    <div className="flex w-full flex-col items-center gap-3 px-4 sm:w-auto sm:flex-row sm:gap-4 sm:px-0">
                        <Link href="/profil" className={`${BTN_GOLD} w-full sm:w-auto`}>Profil Organisasi</Link>
                        <Link href="/berita" className={`${BTN_LINE} w-full sm:w-auto`}>Lihat Berita</Link>
                    </div>

                    <div className="mt-12 grid w-full max-w-3xl grid-cols-2 gap-6 border-t border-white/15 pt-8 sm:mt-16 sm:gap-8 sm:pt-10 md:grid-cols-4 md:gap-16">
                        {[
                            { label: 'Anggota Aktif', value: '120+' },
                            { label: 'Bidang', value: '10' },
                            { label: 'Tahun Berdiri', value: '2017' },
                            { label: 'Alumni', value: '300+' }
                        ].map(s => (
                            <div key={s.label} className="flex flex-col items-center">
                                <div className="font-display text-2xl font-black text-[#f4b82e] sm:text-3xl">{s.value}</div>
                                <div className="mt-1 text-center text-[10px] font-semibold uppercase tracking-wider text-white/70 sm:text-xs">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className={`${PAPER} grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-14`}>
                        <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#111] lg:aspect-square">
                            <img
                                src="https://pwmu.co/wp-content/uploads/2026/09/konsep-otomatis-V9a3.jpeg"
                                alt="Profil IMM Kaizen"
                                className="h-full w-full object-cover grayscale opacity-80 transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100"
                            />
                        </div>

                        <div className="flex flex-col items-start justify-center">
                            <span className={`${CHIP} mb-4`}>Tentang Kami</span>
                            <h2 className="mb-4 font-display text-2xl font-black leading-[1.15] tracking-tight text-[#6b1b1b] sm:mb-6 sm:text-4xl md:text-5xl">
                                Melahirkan Pemimpin Masa Depan.
                            </h2>
                            <p className="mb-6 text-sm leading-relaxed text-[#5b4a47] sm:mb-8 sm:text-base md:text-lg">
                                IMM Komisariat Kaizen adalah organisasi mahasiswa Islam di bawah Ikatan Mahasiswa Muhammadiyah. Dengan semangat <em className="font-semibold text-[#2b1414]">Kaizen</em> (perbaikan terus-menerus), kami mendorong setiap kader untuk berinovasi, mandiri, dan berkontribusi nyata bagi masyarakat.
                            </p>
                            <Link href="/profil" className={`${BTN_MAROON} w-full sm:w-auto`}>
                                Profil Selengkapnya <span aria-hidden>→</span>
                            </Link>
                        </div>
                    </div>

                    <div className="mt-16 flex flex-col items-center sm:mt-20">
                        <span className={`${CHIP} mb-6`}>Video Profil</span>
                        <div className="relative aspect-[16/9] w-full max-w-5xl overflow-hidden rounded-3xl bg-black shadow-2xl ring-4 ring-white">
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

            <section className="relative px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-12 flex flex-col items-center text-center sm:mb-16">
                        <span className={`${CHIP} mb-3`}>Kabar Terkini</span>
                        <h2 className="font-display text-2xl font-black tracking-tight sm:text-3xl md:text-4xl">Berita & Dokumentasi</h2>
                    </div>

                    {isLoadingNews ? (
                        <p className="animate-pulse py-12 text-center text-sm text-white/70">Memuat berita terbaru...</p>
                    ) : latestNews.length === 0 ? (
                        <p className="rounded-2xl border border-white/20 p-6 py-12 text-center text-sm text-white/70">Belum ada berita yang dipublikasikan.</p>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
                            {latestNews.map(item => (
                                <article
                                    key={item.id}
                                    className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white text-[#2b1414] shadow-lg transition duration-200 hover:-translate-y-1 hover:ring-4 hover:ring-[#f4b82e] motion-reduce:transition-none"
                                >
                                    <Link href={`/berita/${item.id}`} className="relative block aspect-[16/10] overflow-hidden bg-[#eee]">
                                        <img
                                            src={item.cover}
                                            alt={item.title}
                                            className="h-full w-full object-cover grayscale opacity-90 transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100"
                                        />
                                        <span className="absolute left-3 top-3 rounded bg-[#6b1b1b] px-2.5 py-1 font-display text-[9px] font-bold uppercase tracking-widest text-white sm:text-[10px]">
                                            {item.category}
                                        </span>
                                    </Link>

                                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                                        <span className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-[#7d6b68] sm:text-xs">{item.publishDate}</span>
                                        <Link href={`/berita/${item.id}`}>
                                            <h3 className="mb-3 line-clamp-2 font-display text-base font-black leading-snug transition-colors group-hover:text-[#6b1b1b] sm:text-lg md:text-xl">
                                                {item.title}
                                            </h3>
                                        </Link>
                                        <p className="mb-6 line-clamp-3 text-xs leading-relaxed text-[#5b4a47] sm:text-sm">{item.excerpt}</p>

                                        {item.pwmuUrl && (
                                            <a
                                                href={item.pwmuUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-auto inline-flex items-center gap-1.5 self-start border-b-2 border-[#6b1b1b] pb-1 font-display text-[11px] font-bold uppercase tracking-widest text-[#6b1b1b] transition-colors hover:border-[#f4b82e] sm:text-xs"
                                            >
                                                Baca di PWMU.CO <span aria-hidden>→</span>
                                            </a>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="relative px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:px-8">
                <div className={`${PAPER} mx-auto max-w-4xl`}>
                    <div className="mb-10 flex flex-col items-center text-center sm:mb-12">
                        <span className={`${CHIP} mb-3`}>Kalender Kegiatan</span>
                        <h2 className="font-display text-2xl font-black tracking-tight text-[#6b1b1b] sm:text-3xl md:text-4xl">Agenda Yang Akan Datang.</h2>
                    </div>

                    <div className="flex flex-col gap-4">
                        {isLoadingAgendas ? (
                            <p className="animate-pulse py-12 text-center text-sm text-[#7d6b68]">Memuat jadwal kegiatan...</p>
                        ) : upcomingAgendas.length === 0 ? (
                            <p className="rounded-2xl border border-[#e9ddd7] bg-[#fcf8f5] p-6 py-12 text-center text-sm text-[#5b4a47]">Belum ada agenda dalam waktu dekat.</p>
                        ) : (
                            upcomingAgendas.map(agenda => {
                                const isComingSoon = !agenda.month || (agenda.date && agenda.date.toLowerCase().includes('soon'))

                                return (
                                    <div
                                        key={agenda.id}
                                        className="group flex flex-col items-start gap-4 rounded-2xl border border-[#e9ddd7] bg-[#fcf8f5] p-5 transition-colors hover:border-[#6b1b1b] sm:flex-row sm:items-center sm:gap-6 sm:p-6"
                                    >
                                        {agenda.image_url ? (
                                            <div className="aspect-video w-full shrink-0 overflow-hidden rounded-xl bg-[#eee] sm:aspect-square sm:w-32 md:w-36">
                                                <img
                                                    src={agenda.image_url}
                                                    alt={agenda.title}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    onError={e => (e.currentTarget.style.display = 'none')}
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex w-full min-w-[80px] flex-col items-center justify-center border-b border-[#e9ddd7] pb-3 text-center sm:w-auto sm:min-w-[100px] sm:border-b-0 sm:border-r sm:pb-0 sm:pr-6">
                                                <span className={`${isComingSoon ? 'text-lg sm:text-2xl' : 'text-3xl sm:text-4xl'} font-display font-black uppercase leading-tight text-[#6b1b1b]`}>
                                                    {agenda.date || 'TBA'}
                                                </span>
                                                {agenda.month && (
                                                    <span className="mt-0.5 font-display text-xs font-bold uppercase tracking-widest text-[#7d6b68] sm:text-sm">{agenda.month}</span>
                                                )}
                                            </div>
                                        )}

                                        <div className="w-full flex-1 sm:w-auto">
                                            <h3 className="font-display text-base font-bold leading-snug text-[#2b1414] transition-colors group-hover:text-[#6b1b1b] sm:text-lg md:text-xl">
                                                {agenda.title}
                                            </h3>
                                            <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs font-medium text-[#5b4a47] sm:text-sm">
                                                {agenda.image_url && agenda.date && (
                                                    <span className="flex items-center gap-1.5 font-bold text-[#6b1b1b]">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-[#f4b82e]" />
                                                        {agenda.date} {agenda.month || ''}
                                                    </span>
                                                )}
                                                {[agenda.location, agenda.time].filter(Boolean).map(v => (
                                                    <span key={v} className="flex items-center gap-1.5">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-[#b3a29d]" />
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

            <section className="relative px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-12 flex flex-col items-center text-center sm:mb-16">
                        <span className={`${CHIP} mb-3`}>Pimpinan Komisariat</span>
                        <h2 className="font-display text-2xl font-black tracking-tight sm:text-3xl md:text-4xl">Badan Pengurus Harian</h2>
                    </div>

                    {isLoadingBph ? (
                        <p className="animate-pulse py-12 text-center text-sm text-white/70">Memuat data BPH...</p>
                    ) : bphData.length === 0 ? (
                        <p className="rounded-2xl border border-white/20 p-6 py-12 text-center text-sm text-white/70">Data kepengurusan belum tersedia.</p>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
                            {bphData.map(bph => (
                                <div
                                    key={bph.id}
                                    className="group flex flex-col items-center rounded-3xl border border-white/15 bg-white/10 p-6 text-center backdrop-blur-sm transition duration-200 hover:-translate-y-1 hover:border-[#f4b82e] motion-reduce:transition-none sm:p-8"
                                >
                                    <div className="mb-5 flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#4d1010] sm:mb-6 sm:h-36 sm:w-36">
                                        {bph.photo ? (
                                            <img
                                                src={bph.photo}
                                                alt={bph.name}
                                                className="h-full w-full object-cover grayscale opacity-80 transition-all duration-500 group-hover:grayscale-0 group-hover:opacity-100"
                                            />
                                        ) : (
                                            <span className="font-display text-[10px] font-bold uppercase text-white/50">No Photo</span>
                                        )}
                                    </div>
                                    <h4 className="mb-1.5 font-display text-lg font-bold text-white sm:text-xl">{bph.name}</h4>
                                    <span className="rounded bg-[#f4b82e] px-2 py-0.5 font-display text-[10px] font-bold uppercase tracking-widest text-[#4d1010] sm:text-xs">
                                        {bph.position}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="relative px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:px-8">
                <div className={`${PAPER} mx-auto max-w-3xl`}>
                    <div className="mb-8 flex flex-col items-center text-center sm:mb-12">
                        <span className={`${CHIP} mb-3`}>Pusat Informasi</span>
                        <h2 className="font-display text-2xl font-black tracking-tight text-[#6b1b1b] sm:text-3xl md:text-4xl">Pertanyaan Seputar IMM Kaizen.</h2>
                    </div>

                    <div className="flex flex-col border-t border-[#e9ddd7]">
                        {FAQ_DATA.map((faq, index) => {
                            const isOpen = openFaq === index
                            return (
                                <div key={faq.id} className="border-b border-[#e9ddd7]">
                                    <button
                                        onClick={() => setOpenFaq(isOpen ? null : index)}
                                        aria-expanded={isOpen}
                                        className="group flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6b1b1b]/40 sm:py-6"
                                    >
                                        <h4 className="font-display text-sm font-bold leading-snug text-[#2b1414] transition-colors group-hover:text-[#6b1b1b] sm:text-base md:text-lg">
                                            {faq.question}
                                        </h4>
                                        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-transform duration-300 sm:h-8 sm:w-8 ${isOpen ? 'rotate-180 border-[#6b1b1b] bg-[#6b1b1b] text-white' : 'border-[#d9c9c1] text-[#7d6b68] group-hover:border-[#6b1b1b]'}`}>
                                            <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </span>
                                    </button>

                                    <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] pb-5 opacity-100 sm:pb-6' : 'grid-rows-[0fr] opacity-0'}`}>
                                        <div className="overflow-hidden">
                                            <p className="pr-2 text-xs leading-relaxed text-[#5b4a47] sm:pr-8 sm:text-sm md:text-base">{faq.answer}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            <section className="relative bg-[#f4b82e] py-10 text-[#4d1010] sm:py-12 md:py-16">
                <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-6 px-4 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
                    <div className="max-w-xl">
                        <span className="mb-1 block font-display text-[10px] font-bold uppercase tracking-[0.2em]">Suara Mahasiswa</span>
                        <h3 className="font-display text-xl font-black tracking-tight sm:text-2xl md:text-3xl">SAMPAIKAN ASPIRASIMU!</h3>
                        <p className="mt-1.5 text-xs leading-relaxed sm:text-sm">
                            Punya ide, kritik, atau saran untuk komisariat? Suaramu sangat berarti untuk perubahan yang lebih baik.
                        </p>
                    </div>
                    <Link href="/aspirasi" className={`${BTN_MAROON} w-full shrink-0 whitespace-nowrap uppercase tracking-widest sm:w-auto`}>
                        Kirim Aspirasi
                    </Link>
                </div>
            </section>
        </div>
    )
}
