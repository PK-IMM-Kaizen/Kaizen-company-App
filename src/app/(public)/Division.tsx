'use client'

import { useState } from 'react'

const divisionsData = [
    {
        id: 1,
        name: 'Organisasi',
        color: 'var(--primary)',
        description: 'Mewadahi pengelolaan administrasi, penataan struktur internal, serta koordinasi keorganisasian agar jalannya komisariat tetap solid, tertib, dan sistematis.',
        photo: '/img/divisions/organisasi.jpg'
    },
    {
        id: 2,
        name: 'Perkaderan',
        color: 'var(--accent)',
        description: 'Jantung utama perkaderan yang bertanggung jawab atas proses rekruitasi, pembinaan ideologi, serta pengawalan jenjang kaderisasi berkesinambungan melalui DAD dan Teras Perkaderan.',
        photo: '/img/divisions/perkaderan.jpg'
    },
    {
        id: 3,
        name: 'Hikmah Politik & Kebijakan Publik',
        color: '#D4A017',
        description: 'Mengasah kepekaan kritis kader terhadap isu-isu keumatan, kebangsaan, dan sosial kemasyarakatan melalui kajian politik, advokasi, dan perumusan kebijakan publik.',
        photo: '/img/divisions/hikmah.jpg'
    },
    {
        id: 4,
        name: 'Riset & Pengembangan Keilmuan',
        color: '#1A6FA8',
        description: 'Mengembangkan budaya literasi, kajian akademik, ilmiah, serta riset teknologi khas mahasiswa teknik untuk mewujudkan intelektualitas kader yang unggul.',
        photo: '/img/divisions/rpk.jpg'
    },
    {
        id: 5,
        name: 'Tabligh & Kajian Keislaman',
        color: '#2E7D32',
        description: 'Menanamkan nilai-nilai religiusitas, memperdalam pemahaman al-Islam dan Kemuhammadiyahan (AIK), serta menyelenggarakan kajian keagamaan rutin untuk internal dan publik.',
        photo: '/img/divisions/tabligh.jpg'
    },
    {
        id: 6,
        name: 'Sosial Pemberdayaan Masyarakat',
        color: '#C8102E',
        description: 'Mengorganisir aksi-aksi kemanusiaan, bakti sosial (Baksos), serta pengabdian masyarakat secara nyata di berbagai wilayah pelosok Jawa Timur.',
        photo: '/img/divisions/spm.jpg'
    },
    {
        id: 7,
        name: 'Ekonomi & Kewirausahaan',
        color: '#2D7D46',
        description: 'Menumbuhkan jiwa kemandirian finansial komisariat dan kader melalui unit bisnis kreatif (Ekowir), penjualan merchandise, serta pelatihan wirausaha digital.',
        photo: '/img/divisions/ekowir.jpg'
    },
    {
        id: 8,
        name: 'IMMawati',
        color: '#C71585',
        description: 'Fokus pada penguatan kapasitas, wawasan kesetaraan gender, isu kepemimpinan perempuan, serta ruang aktualisasi khusus bagi seluruh kader perempuan (Immawati) Kaizen.',
        photo: '/img/divisions/immawati.jpg'
    },
    {
        id: 9,
        name: 'Seni Budaya & Olahraga',
        color: '#E07B1A',
        description: 'Wadah penyaluran bakat, minat, dan ekspresi kreatif kader di bidang seni, kebudayaan, serta menjaga kebugaran fisik dan keakraban melalui kegiatan olahraga bersama.',
        photo: '/img/divisions/sbo.jpg'
    },
    {
        id: 10,
        name: 'Media Komunikasi & Informasi',
        color: 'var(--primary-light)',
        description: 'Garda terdepan syiar digital yang mengelola publikasi, desain visual, dokumentasi kegiatan, serta branding #1ByteLebihDekat di berbagai platform media sosial.',
        photo: '/img/divisions/medkom.jpg'
    }
]

export default function Division() {
    const [selectedDivision, setSelectedDivision] = useState<number | 'ALL'>('ALL')

    const filteredDivisions = selectedDivision === 'ALL'
        ? divisionsData
        : divisionsData.filter(d => d.id === selectedDivision)

    return (
        <div className="bg-[var(--background)] min-h-screen">
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
                            Struktur Organisasi
                        </span>
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight font-display">
                        Profil Bidang
                    </h1>
                </div>
            </div>

            <div className="bg-[var(--surface)] border-b border-[var(--border)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none">
                        <button
                            onClick={() => setSelectedDivision('ALL')}
                            className={`whitespace-nowrap px-4 py-2 rounded-[var(--radius)] text-xs font-bold uppercase tracking-wider transition-all font-display ${
                                selectedDivision === 'ALL'
                                    ? 'bg-[var(--primary)] text-white shadow-md'
                                    : 'bg-[var(--background)] text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)] border border-[var(--border)]'
                            }`}
                        >
                            Semua Bidang ({divisionsData.length})
                        </button>
                        {divisionsData.map((div) => {
                            const isActive = selectedDivision === div.id
                            return (
                                <button
                                    key={div.id}
                                    onClick={() => setSelectedDivision(div.id)}
                                    className={`whitespace-nowrap px-4 py-2 rounded-[var(--radius)] text-xs font-bold uppercase tracking-wider transition-all font-display ${
                                        isActive
                                            ? 'bg-[var(--primary)] text-white shadow-md'
                                            : 'bg-[var(--background)] text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)] border border-[var(--border)]'
                                    }`}
                                >
                                    {div.name}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
                <div className="space-y-20 lg:space-y-28">
                    {filteredDivisions.map((div, idx) => {
                        const isEven = idx % 2 === 0;
                        const numberStr = String(div.id).padStart(2, '0');

                        return (
                            <div
                                key={div.id}
                                className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center"
                            >
                                <div className={`lg:col-span-7 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                                    <div className="relative aspect-[4/3] lg:aspect-[16/10] overflow-hidden bg-[#111111] border border-[var(--border)] rounded-[var(--radius)] shadow-sm">
                                        <img
                                            src={div.photo}
                                            alt={`Bidang ${div.name}`}
                                            onError={(e) => {
                                                (e.target as HTMLElement).style.display = 'none';
                                            }}
                                            className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105"
                                        />

                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#181818] text-[var(--text-muted)] -z-10">
                                            <span className="text-xs font-bold tracking-widest uppercase font-display text-white/30">
                                                Foto Bidang {div.name}
                                            </span>
                                        </div>

                                        <div
                                            className="absolute bottom-0 left-0 w-0 h-1.5 transition-all duration-700 group-hover:w-full z-20"
                                            style={{ backgroundColor: div.color }}
                                        />
                                    </div>
                                </div>

                                <div className={`lg:col-span-5 flex flex-col justify-center ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                                    <div className="flex items-center gap-4 mb-4">
                                        <span
                                            className="text-5xl sm:text-7xl font-black text-[var(--surface-2)] select-none group-hover:text-[var(--border-strong)] transition-colors font-display"
                                            style={{ letterSpacing: '-0.05em' }}
                                        >
                                            {numberStr}
                                        </span>
                                        <div
                                            className="h-[3px] w-12 sm:w-16 rounded-full"
                                            style={{ backgroundColor: div.color }}
                                        />
                                    </div>

                                    <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-4 uppercase tracking-tight leading-snug font-display">
                                        Bidang <br />
                                        <span style={{ color: div.color }}>{div.name}</span>
                                    </h2>

                                    <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed font-medium">
                                        {div.description}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}