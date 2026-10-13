'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'

interface Agenda {
    id: string | number
    title: string
    date: string
    month: string
    location: string
    time: string
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

export default function HomePage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null)

    const [upcomingAgendas, setUpcomingAgendas] = useState<Agenda[]>([])
    const [latestNews, setLatestNews] = useState<News[]>([])
    const [bphData, setBphData] = useState<BPH[]>([])

    const [isLoadingAgendas, setIsLoadingAgendas] = useState(true)
    const [isLoadingNews, setIsLoadingNews] = useState(true)
    const [isLoadingBph, setIsLoadingBph] = useState(true)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const agendasPromise = supabase
                    .from('agendas')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(3)

                const newsPromise = supabase
                    .from('news')
                    .select('*')
                    .eq('status', 'published')
                    .order('created_at', { ascending: false })
                    .limit(3)

                const bphPromise = supabase
                    .from('pengurus')
                    .select('*')
                    .eq('division', 'BPH')
                    .order('created_at', { ascending: true })

                const [agendasRes, newsRes, bphRes] = await Promise.all([
                    agendasPromise,
                    newsPromise,
                    bphPromise
                ])

                if (agendasRes.error) console.error('Error fetching agendas:', agendasRes.error)
                else if (agendasRes.data) setUpcomingAgendas(agendasRes.data)
                setIsLoadingAgendas(false)

                if (newsRes.error) console.error('Error fetching news:', newsRes.error)
                else if (newsRes.data) setLatestNews(newsRes.data)
                setIsLoadingNews(false)

                if (bphRes.error) console.error('Error fetching BPH:', JSON.stringify(bphRes.error, null, 2))
                else if (bphRes.data) setBphData(bphRes.data)
                setIsLoadingBph(false)

            } catch (error) {
                console.error('Unexpected error fetching data:', error)
                setIsLoadingAgendas(false)
                setIsLoadingNews(false)
                setIsLoadingBph(false)
            }
        }

        fetchAllData()
    }, [supabase])

    const faqData = [
        { id: 1, question: 'Bagaimana cara bergabung dengan IMM Kaizen?', answer: 'Mahasiswa Universitas Muhammadiyah Surabaya dapat bergabung melalui kegiatan Darul Arqam Dasar (DAD) yang rutin kami selenggarakan di awal semester.' },
        { id: 2, question: 'Apa saja fokus kegiatan di IMM?', answer: 'Kami bergerak di tiga ranah utama (Tri Kompetensi Dasar): Keagamaan, Kemahasiswaan, dan Kemasyarakatan. Mulai dari kajian, diskusi publik, hingga aksi sosial.' },
        { id: 3, question: 'Apakah mahasiswa non-Muhammadiyah bisa bergabung?', answer: 'Tentu. Ikatan Mahasiswa Muhammadiyah sangat inklusif. Kami menerima siapapun yang memiliki visi selaras untuk belajar dan berproses bersama.' },
    ]

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index)
    }

    return (
        <div className="w-full bg-[var(--surface)]">
            <section className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-[#111111] pt-20 pb-16">
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center opacity-90"
                    style={{
                        backgroundImage: `url('/img/bg-hero.webp')`,
                    }}
                />
                <div
                    className="absolute inset-0 z-0 opacity-90"
                    style={{
                        background: `linear-gradient(to bottom, rgba(204, 16, 33, 0.8), rgba(17, 17, 17, 0.85), #111111)`
                    }}
                />

                <div className="relative z-10 max-w-4xl mx-auto px-4 flex flex-col items-center text-center w-full mt-8">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="h-[1px] w-6 sm:w-12 bg-[var(--accent-light)]" />
                        <span className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-[var(--accent-light)] font-display">
                            Pimpinan Komisariat
                        </span>
                        <div className="h-[1px] w-6 sm:w-12 bg-[var(--accent-light)]" />
                    </div>

                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-[1.2] mb-4 tracking-tight font-display">
                        IKATAN MAHASISWA MUHAMMADIYAH <br />
                        <span className="text-[var(--accent)]">KAIZEN</span>
                    </h1>

                    <p className="text-sm sm:text-lg font-bold text-white/90 mb-8 tracking-widest uppercase">
                        Universitas Muhammadiyah Surabaya
                    </p>

                    <p className="text-sm sm:text-base leading-relaxed text-white/80 max-w-2xl mb-10">
                        Platform digital resmi IMM Komisariat Kaizen. Bergerak bersama dalam ilmu, iman, dan amal nyata untuk membangun peradaban masyarakat.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                        <Link
                            href="/profil"
                            className="w-full sm:w-auto px-8 py-3.5 bg-[var(--accent)] text-white font-bold rounded-full transition-all hover:bg-[#c96c15] hover:scale-105 shadow-lg shadow-[var(--accent)]/20 font-display flex justify-center text-center"
                        >
                            Profil Organisasi
                        </Link>
                        <Link
                            href="/berita"
                            className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-white/40 text-white font-bold rounded-full transition-all hover:bg-white/10 font-display flex justify-center text-center"
                        >
                            Lihat Berita
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 w-full max-w-3xl mt-16 pt-10 border-t border-white/15">
                        {[
                            { label: 'Anggota Aktif', value: '120+' },
                            { label: 'Bidang', value: '10' },
                            { label: 'Tahun Berdiri', value: '2017' },
                            { label: 'Alumni', value: '300+' },
                        ].map(s => (
                            <div key={s.label} className="flex flex-col items-center">
                                <div className="text-3xl font-black text-white font-display">
                                    {s.value}
                                </div>
                                <div className="text-xs mt-1 text-white/50 uppercase tracking-wider font-semibold">
                                    {s.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 bg-[var(--background)] border-b border-[var(--border)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24">
                        <div className="relative aspect-[4/3] lg:aspect-square bg-[#111111] overflow-hidden group rounded-[var(--radius)] border border-[var(--border)]">
                            <img
                                src="https://pwmu.co/wp-content/uploads/2026/09/konsep-otomatis-V9a3.jpeg"
                                alt="Profil IMM Kaizen"
                                className="w-full h-full object-cover grayscale opacity-80 transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 border-[8px] border-white/10 mix-blend-overlay"></div>
                        </div>

                        <div className="flex flex-col justify-center">
                            <span className="section-label mb-4 block">Tentang Kami</span>
                            <h2 className="text-4xl sm:text-5xl font-black text-[var(--text-primary)] leading-[1.1] mb-6 tracking-tight font-display">
                                Melahirkan Pemimpin Masa Depan.
                            </h2>
                            <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-8">
                                IMM Komisariat Kaizen adalah organisasi mahasiswa Islam di bawah Ikatan Mahasiswa Muhammadiyah. Dengan semangat <em className="font-semibold text-[var(--text-primary)]">Kaizen</em> (perbaikan terus-menerus), kami mendorong setiap kader untuk berinovasi, mandiri, dan berkontribusi nyata bagi masyarakat.
                            </p>
                            <div>
                                <Link
                                    href="/profil"
                                    className="px-8 py-4 bg-[#111111] text-white text-sm font-bold tracking-widest uppercase hover:bg-[var(--primary)] transition-all flex items-center justify-center gap-3 group w-fit rounded-[var(--radius)] font-display"
                                >
                                    Profil Selengkapnya
                                    <span className="transition-transform group-hover:translate-x-1">→</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="w-full flex flex-col items-center border-t border-[var(--border)] pt-16">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-[1px] w-8 sm:w-12 bg-[var(--border-strong)]"></div>
                            <span className="text-xs sm:text-sm font-bold text-[var(--text-muted)] tracking-[0.2em] uppercase text-center font-display">
                                Profil Organisasi
                            </span>
                            <div className="h-[1px] w-8 sm:w-12 bg-[var(--border-strong)]"></div>
                        </div>

                        <div className="w-full max-w-5xl bg-black border border-[var(--border)] overflow-hidden shadow-2xl aspect-[4/5] md:aspect-video relative rounded-[var(--radius)]">
                            <video
                                src="/video/profile.mp4"
                                className="absolute inset-0 w-full h-full object-cover"
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

            <section className="py-24 bg-[var(--surface)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex flex-col items-center text-center mb-16">
                        <span className="text-xs font-bold text-[var(--accent)] tracking-[0.2em] uppercase mb-3 block font-display">Kabar Terkini</span>
                        <h2 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] font-display">
                            Berita & Dokumentasi
                        </h2>
                    </div>

                    {isLoadingNews ? (
                        <div className="py-12 text-center w-full">
                            <span className="text-[var(--text-muted)] animate-pulse font-medium">Memuat berita terbaru...</span>
                        </div>
                    ) : latestNews.length === 0 ? (
                        <div className="py-12 text-center w-full bg-[var(--background)] rounded-[var(--radius)] border border-[var(--border)]">
                            <span className="text-[var(--text-secondary)]">Belum ada berita yang dipublikasikan.</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {latestNews.map((item) => (
                                <article
                                    key={item.id}
                                    className="group bg-[var(--card)] border border-[var(--border)] hover:border-[var(--text-primary)] transition-colors flex flex-col h-full rounded-[var(--radius)] overflow-hidden"
                                >
                                    <Link
                                        href={`/berita/${item.id}`}
                                        className="relative aspect-[4/3] overflow-hidden bg-[var(--surface-2)] block"
                                    >
                                        <img
                                            src={item.cover}
                                            alt={item.title}
                                            className="w-full h-full object-cover grayscale opacity-90 transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
                                        />
                                        <div className="absolute top-4 left-4 bg-[#111111] text-white px-3 py-1.5 rounded-[calc(var(--radius)-2px)]">
                                            <span className="text-[10px] font-bold uppercase tracking-widest font-display">{item.category}</span>
                                        </div>
                                    </Link>

                                    <div className="p-6 sm:p-8 flex flex-col flex-1">
                                        <span className="text-xs text-[var(--text-muted)] font-bold tracking-wider uppercase mb-3 block">
                                            {item.publishDate}
                                        </span>
                                        <Link href={`/berita/${item.id}`}>
                                            <h3 className="font-black text-xl leading-tight mb-4 text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors cursor-pointer font-display">
                                                {item.title}
                                            </h3>
                                        </Link>
                                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3 mb-6">
                                            {item.excerpt}
                                        </p>

                                        <div className="mt-auto pt-4">
                                            {item.pwmuUrl && (
                                                <a
                                                    href={item.pwmuUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-widest border-b-2 border-[var(--text-primary)] pb-1 hover:text-[var(--primary)] hover:border-[var(--primary)] transition-colors inline-flex items-center gap-2 font-display"
                                                >
                                                    Baca Selengkapnya di PWMU <span>→</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="py-24 bg-[var(--background)] border-y border-[var(--border)]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <div className="flex flex-col items-center text-center mb-16">
                        <span className="section-label mb-3 block">Kalender Kegiatan</span>
                        <h2 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] font-display">
                            Agenda Yang Akan Datang.
                        </h2>
                    </div>

                    <div className="flex flex-col gap-4">
                        {isLoadingAgendas ? (
                            <div className="py-12 text-center">
                                <span className="text-[var(--text-muted)] animate-pulse font-medium">Memuat jadwal kegiatan...</span>
                            </div>
                        ) : upcomingAgendas.length === 0 ? (
                            <div className="py-12 text-center bg-[var(--surface)] rounded-[var(--radius)] border border-[var(--border)]">
                                <span className="text-[var(--text-secondary)]">Belum ada agenda dalam waktu dekat.</span>
                            </div>
                        ) : (
                            upcomingAgendas.map((agenda) => {
                                const isComingSoon = !agenda.month || (agenda.date && agenda.date.toLowerCase().includes('soon'));

                                return (
                                    <div
                                        key={agenda.id}
                                        className="group flex flex-col md:flex-row items-start md:items-center p-6 sm:p-8 bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--primary)] transition-colors gap-6 sm:gap-8 rounded-[var(--radius)]"
                                    >
                                        <div className="flex flex-col items-center justify-center min-w-[80px] text-center border-b md:border-b-0 md:border-r border-[var(--border-strong)] pb-4 md:pb-0 md:pr-8 w-full md:w-auto">
                                            <span
                                                className={`${isComingSoon ? 'text-xl sm:text-2xl' : 'text-4xl'} font-black text-[var(--primary)] uppercase font-display`}
                                            >
                                                {agenda.date || 'TBA'}
                                            </span>
                                            {agenda.month && (
                                                <span className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1 font-display">
                                                    {agenda.month}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors font-display">
                                                {agenda.title}
                                            </h3>
                                            {(agenda.location || agenda.time) && (
                                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[var(--text-secondary)] font-medium mt-2">
                                                    {agenda.location && (
                                                        <span className="flex items-center gap-2">
                                                            <span className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full"></span>
                                                            {agenda.location}
                                                        </span>
                                                    )}
                                                    {agenda.time && (
                                                        <span className="flex items-center gap-2">
                                                            <span className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full"></span>
                                                            {agenda.time}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </section>

            <section className="py-24 bg-[#0a0a0a] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="mb-16 flex flex-col items-center text-center">
                        <span className="text-xs font-bold text-[var(--accent-light)] tracking-[0.2em] uppercase mb-3 block font-display">Pimpinan Komisariat</span>
                        <h2 className="text-3xl sm:text-4xl font-black font-display">Badan Pengurus Harian</h2>
                    </div>

                    {isLoadingBph ? (
                        <div className="py-12 text-center w-full">
                            <span className="text-white/50 animate-pulse font-medium">Memuat data BPH...</span>
                        </div>
                    ) : bphData.length === 0 ? (
                        <div className="py-12 text-center w-full border border-white/10 rounded-[var(--radius)]">
                            <span className="text-white/50">Data kepengurusan belum tersedia.</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {bphData.map(bph => (
                                <div
                                    key={bph.id}
                                    className="group bg-[#111111] border border-white/10 hover:border-[var(--accent)] transition-colors p-8 flex flex-col items-center text-center rounded-[var(--radius)]"
                                >
                                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden mb-6 border-2 border-white/10 group-hover:border-[var(--accent)] transition-colors bg-gray-800 flex items-center justify-center">
                                        {bph.photo ? (
                                            <img
                                                src={bph.photo}
                                                alt={bph.name}
                                                className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                                            />
                                        ) : (
                                            <span className="text-xs text-white/40 font-bold uppercase font-display">No Photo</span>
                                        )}
                                    </div>
                                    <h4 className="font-bold text-xl sm:text-2xl text-white mb-2 group-hover:text-[var(--accent)] transition-colors font-display">
                                        {bph.name}
                                    </h4>
                                    <span className="text-xs font-bold tracking-widest uppercase text-[var(--accent-light)] font-display">
                                        {bph.position}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="py-24 bg-[var(--background)] border-y border-[var(--border)]">
                <div className="max-w-3xl mx-auto px-4 sm:px-6">
                    <div className="flex flex-col items-center text-center mb-16">
                        <span className="section-label mb-3 block">Pusat Informasi</span>
                        <h2 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] font-display">
                            Pertanyaan Seputar IMM Kaizen.
                        </h2>
                    </div>

                    <div className="flex flex-col border-t border-[var(--border)]">
                        {faqData.map((faq, index) => {
                            const isOpen = openFaq === index;
                            return (
                                <div key={faq.id} className="border-b border-[var(--border)]">
                                    <button
                                        onClick={() => toggleFaq(index)}
                                        className="w-full flex items-center justify-between py-6 text-left focus:outline-none group"
                                    >
                                        <h4 className="text-base sm:text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors pr-8 font-display">
                                            {faq.question}
                                        </h4>
                                        <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center border border-[var(--border-strong)] rounded-full transition-transform duration-300 ${isOpen ? 'rotate-180 bg-[var(--text-primary)] border-[var(--text-primary)] text-white' : 'text-[var(--text-muted)] group-hover:border-[var(--text-primary)] group-hover:text-[var(--text-primary)]'}`}>
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </button>

                                    <div
                                        className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 pb-6' : 'grid-rows-[0fr] opacity-0'}`}
                                    >
                                        <div className="overflow-hidden">
                                            <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed pr-12">
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

            <section className="bg-[var(--primary)] py-12 sm:py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                    <div className="max-w-xl">
                        <span className="text-[10px] font-bold text-[var(--accent-light)] tracking-[0.2em] uppercase mb-1 block font-display">
                            Suara Mahasiswa
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display">
                            SAMPAIKAN ASPIRASIMU!
                        </h3>
                        <p className="text-white/80 text-xs sm:text-sm mt-1">
                            Punya ide, kritik, atau saran untuk komisariat? Suaramu sangat berarti untuk perubahan yang lebih baik.
                        </p>
                    </div>
                    <Link
                        href="/aspirasi"
                        className="whitespace-nowrap px-6 py-3 bg-white text-[var(--primary)] text-xs font-black tracking-widest uppercase hover:bg-[#111111] hover:text-white transition-all shadow-md hover:scale-105 shrink-0 rounded-[var(--radius)] font-display flex items-center justify-center"
                    >
                        Kirim Aspirasi
                    </Link>
                </div>
            </section>
        </div>
    )
}