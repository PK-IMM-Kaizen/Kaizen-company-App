'use client'

import { type Page } from '../../lib/data'

interface ProfileProps {
    onNavigate?: (page: Page) => void
}

export default function Page({ onNavigate }: ProfileProps) {
    return (
        <div className="w-full bg-[var(--background)] font-sans selection:bg-[var(--primary)] selection:text-white">

            <div className="relative bg-[var(--primary-dark)] pt-28 sm:pt-32 pb-16 sm:pb-20 overflow-hidden">
                <div
                    className="absolute top-0 left-0 w-full h-1"
                    style={{
                        background: 'linear-gradient(to right, var(--primary), var(--accent), var(--accent-light))'
                    }}
                />
                <div
                    className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none"
                    style={{
                        background: 'linear-gradient(to left, var(--primary), transparent)'
                    }}
                />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div className="w-6 sm:w-8 h-[1px] bg-[var(--accent)]"></div>
                        <span className="text-[var(--accent)] text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.2em] uppercase font-display">
                            Tentang Kami
                        </span>
                    </div>
                    <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight font-display">
                        Profil Organisasi
                    </h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16">

                    <div className="lg:col-span-8 space-y-12 sm:space-y-16 md:space-y-20">

                        <section>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[var(--text-primary)] mb-4 sm:mb-6 font-display tracking-tight">
                                Identitas Organisasi
                            </h2>

                            <div className="prose prose-gray max-w-none text-[var(--text-secondary)] leading-relaxed text-xs sm:text-sm md:text-base mb-8 sm:mb-10">
                                <p>
                                    Pimpinan Komisariat (PK) Ikatan Mahasiswa Muhammadiyah (IMM) Kaizen adalah basis perkaderan tingkat komisariat di lingkungan Fakultas Teknik Universitas Muhammadiyah Surabaya (UM Surabaya). Bergerak di bawah naungan Pimpinan Cabang (PC) IMM Kota Surabaya dan Koordinator Komisariat (Koorkom) UM Surabaya, IMM Kaizen menjadi wadah perjuangan mahasiswa teknik dalam mengusung nilai-nilai intelektualitas, religiusitas, dan kemanusiaan.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div className="border border-[var(--border)] p-6 sm:p-8 hover:border-[var(--text-primary)] transition-all rounded-2xl bg-[var(--card)] shadow-sm">
                                    <span className="text-[10px] sm:text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3 block font-display">01 / Sejarah Nama</span>
                                    <h3 className="font-black text-base sm:text-lg text-[var(--text-primary)] mb-3 font-display">Filosofi Kaizen</h3>
                                    <p className="text-[var(--text-secondary)] text-xs sm:text-sm leading-relaxed">
                                        Nama <strong>Kaizen (改善)</strong> diambil dari filosofi Jepang yang bermakna <em>"perbaikan berkesinambungan"</em> menuju arah yang lebih baik. Pemilihan nama ini menjadi komitmen bahwa perkaderan dan perjuangan komisariat dilakukan secara konsisten, bertahap, dan terus-menerus demi melahirkan kader yang autentik.
                                    </p>
                                </div>
                                <div className="border border-[var(--border)] p-6 sm:p-8 hover:border-[var(--primary)] transition-all rounded-2xl bg-[var(--card)] shadow-sm">
                                    <span className="text-[10px] sm:text-xs font-bold text-[var(--primary)] uppercase tracking-widest mb-3 block font-display">02 / Makna Visual</span>
                                    <h3 className="font-black text-base sm:text-lg text-[var(--text-primary)] mb-3 font-display">Anatomi Logo</h3>
                                    <p className="text-[var(--text-secondary)] text-xs sm:text-sm leading-relaxed">
                                        Logo IMM Kaizen menyertakan simbol Burung Sriti / Phoenix (🐦‍🔥) yang terinspirasi dari mitologi abadi. Simbol ini melambangkan daya tahan, regenerasi, dan keabadian—dengan harapan IMM Kaizen akan terus ada, tumbuh berkembang, serta selalu memberikan manfaat nyata bagi mahasiswa, masyarakat, dan lingkungan sekitar.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="bg-[var(--surface)] border-l-4 border-[var(--text-primary)] p-6 sm:p-10 relative overflow-hidden group rounded-2xl shadow-sm">
                            <div className="absolute -right-8 -top-8 text-[var(--surface-2)] opacity-60 font-black text-7xl sm:text-9xl select-none group-hover:scale-105 transition-transform duration-700 font-display pointer-events-none">
                                #1
                            </div>

                            <div className="relative z-10">
                                <div className="font-mono text-[10px] sm:text-xs text-[var(--text-muted)] mb-2 sm:mb-3 tracking-[0.2em] uppercase font-bold">
                                    Official Tagline
                                </div>
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[var(--text-primary)] mb-4 font-display">
                                    #1ByteLebihDekat
                                </h2>
                                <p className="text-[var(--text-secondary)] leading-relaxed text-xs sm:text-sm md:text-base max-w-2xl">
                                    Dalam arsitektur komputasi, <strong>1 Byte</strong> adalah satuan informasi dasar. Filosofi ini melambangkan pendekatan pergerakan khas kader teknik di era digital: setiap aksi kecil dan terukur yang dieksekusi dengan presisi akan membawa komisariat selangkah <strong>Lebih Dekat</strong> dengan masyarakat, solusi, dan kemajuan peradaban.
                                </p>
                            </div>
                        </section>

                        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                            <div className="border-l-4 border-[var(--primary)] pl-5 sm:pl-6 py-1">
                                <h3 className="font-black text-base sm:text-xl mb-2.5 sm:mb-3 text-[var(--text-primary)] uppercase tracking-wide font-display">Visi</h3>
                                <p className="text-[var(--text-secondary)] leading-relaxed text-xs sm:text-sm">
                                    Mewujudkan akademisi Islam di lingkungan Fakultas Teknik yang berakhlak mulia, kompeten, serta menjadi kader autentik yang bermanfaat bagi persyarikatan dan masyarakat.
                                </p>
                            </div>
                            <div className="border-l-4 border-[var(--accent)] pl-5 sm:pl-6 py-1">
                                <h3 className="font-black text-base sm:text-xl mb-2.5 sm:mb-3 text-[var(--text-primary)] uppercase tracking-wide font-display">Misi</h3>
                                <p className="text-[var(--text-secondary)] leading-relaxed text-xs sm:text-sm">
                                    Menyelenggarakan perkaderan formal (DAD) dan informal secara konsisten, menguatkan silaturahmi gagasan melalui Srawung Kader, serta aktif berbakti kepada masyarakat lewat aksi sosial nyata.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[var(--text-primary)] mb-8 sm:mb-10 font-display tracking-tight">
                                Perjalanan Kami
                            </h2>
                            <div className="relative border-l border-[var(--border-strong)] ml-2.5 sm:ml-4 space-y-8 sm:space-y-10">
                                {[
                                    { year: '2017', title: 'Awal Pendirian', event: 'Perintisan wadah gerakan mahasiswa teknik di bawah naungan IMM UM Surabaya.' },
                                    { year: '2019', title: 'Teras Perkaderan & DAD', event: 'Dokumentasi kepengurusan aktif (Artansyah Rahmatan Putra) menggelar Teras Perkaderan dan pembekalan materi ideologi kader.' },
                                    { year: '2021', title: 'Pengabdian Masyarakat', event: 'Peningkatan aksi sosial kemasyarakatan (Baksos) hingga ke pelosok daerah Jawa Timur seperti Bangkalan, Madura.' },
                                    { year: '2026', title: 'Era Kader Autentik', event: 'Penguatan branding gerakan melalui tagline #kaderautentik dan #1bytelebihdekat serta optimalisasi wadah digital Kaizen.' },
                                ].map((item, i) => (
                                    <div key={i} className="relative pl-6 sm:pl-10 group">
                                        <div className="absolute w-3 h-3 bg-white border-2 border-[var(--primary)] rounded-full -left-[6.5px] top-1 group-hover:bg-[var(--primary)] transition-colors" />

                                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 mb-1.5">
                                            <span className="text-lg sm:text-xl font-black text-[var(--primary)] font-display">{item.year}</span>
                                            <h4 className="text-sm sm:text-base font-bold text-[var(--text-primary)] font-display">{item.title}</h4>
                                        </div>
                                        <p className="text-[var(--text-secondary)] text-xs sm:text-sm leading-relaxed">{item.event}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                    </div>

                    <div className="lg:col-span-4">
                        <div className="lg:sticky lg:top-28 space-y-8">

                            <div className="bg-[var(--card)] border border-[var(--border)] p-6 sm:p-8 rounded-2xl flex flex-col items-center shadow-sm">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-[var(--primary)] shadow-md mb-5 bg-black flex items-center justify-center shrink-0">
                                    <img
                                        src="/img/logo/logo.jpg"
                                        alt="Logo PK IMM Kaizen"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <h3 className="font-black text-sm sm:text-base mb-4 text-[var(--text-primary)] uppercase tracking-widest font-display text-center">
                                    Data Singkat Organisasi
                                </h3>

                                <dl className="w-full space-y-3">
                                    {[
                                        { label: 'Nama Resmi', value: 'PK IMM Kaizen' },
                                        { label: 'Basis', value: 'FT UMSURABAYA' },
                                        { label: 'Tahun Berdiri', value: '2017' },
                                        { label: 'Anggota Aktif', value: '120+ Kader' },
                                        { label: 'Fokus Utama', value: 'Religiusitas, Intelektualitas, Humanitas' },
                                    ].map(({ label, value }) => (
                                        <div key={label} className="flex justify-between items-center py-2.5 border-b border-[var(--border)] last:border-0 text-xs">
                                            <dt className="text-[var(--text-muted)] font-medium">{label}</dt>
                                            <dd className="font-bold text-[var(--text-primary)] text-right font-display pl-2">{value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}