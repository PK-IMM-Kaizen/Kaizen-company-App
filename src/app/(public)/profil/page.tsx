'use client'

import { type Page } from '../../lib/data'

interface ProfileProps {
    onNavigate?: (page: Page) => void
}

export default function ProfilePage({ onNavigate }: ProfileProps) {
    return (
        <div className="w-full mk-dark mk-bg-dark min-h-screen selection:bg-[var(--mk-yellow)] selection:text-[var(--mk-maroon-deep)] font-sans">

            <div className="bg-[var(--mk-maroon-deep)] mk-curve-bottom relative pt-24 pb-20 overflow-hidden z-10 border-b-4 border-[var(--mk-yellow)]">
                <div className="mk-decor pointer-events-none">
                    <div className="mk-halftone mk-halftone--bl opacity-20"></div>
                    <div className="mk-star mk-star--lg mk-star--spin -right-8 top-10 opacity-30"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-6 sm:w-8 h-[2px] bg-[var(--mk-orange)]"></div>
                        <span className="mk-chip bg-[var(--mk-yellow)] text-[var(--mk-ink)] shadow-none text-xs md:text-sm">
                            Tentang Kami
                        </span>
                        <div className="w-6 sm:w-8 h-[2px] bg-[var(--mk-orange)]"></div>
                    </div>
                    <h1 className="mk-sticker-gradient text-[var(--mk-maroon)] text-5xl md:text-6xl lg:text-7xl tracking-tight relative flex justify-center w-full">
                        <span aria-hidden="true" className="mk-sticker-stroke absolute text-transparent">Profil Organisasi</span>
                        <span className="mk-sticker-fill relative text-center">Profil Organisasi</span>
                    </h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-0">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 space-y-12">
                        <section>
                            <h2 className="mk-heading text-3xl md:text-4xl text-[var(--mk-yellow)] mb-6">
                                Identitas Organisasi
                            </h2>
                            <p className="text-white/90 leading-relaxed text-base font-medium mb-10 text-justify sm:text-left">
                                Pimpinan Komisariat (PK) Ikatan Mahasiswa Muhammadiyah (IMM) Kaizen adalah basis perkaderan tingkat komisariat di lingkungan Fakultas Teknik Universitas Muhammadiyah Surabaya (UMSURA). Bergerak di bawah naungan Pimpinan Cabang (PC) IMM Kota Surabaya dan Koordinator Komisariat (Koorkom) UMSURA, IMM Kaizen menjadi wadah perjuangan mahasiswa teknik dalam mengusung nilai-nilai intelektualitas, religiusitas, dan kemanusiaan.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="mk-paper">
                                    <span className="mk-chip mb-4">01 / Sejarah Nama</span>
                                    <h3 className="mk-heading text-xl text-[var(--mk-maroon)] mb-2">Filosofi Kaizen</h3>
                                    <p className="text-[var(--mk-ink)] opacity-80 text-sm leading-relaxed font-medium">
                                        Nama <strong className="opacity-100">Kaizen (改善)</strong> bermakna <em>{'"perbaikan berkesinambungan"'}</em> menuju arah yang lebih baik. Komitmen bahwa perkaderan dilakukan konsisten dan bertahap.
                                    </p>
                                </div>
                                <div className="mk-paper">
                                    <span className="mk-chip mb-4">02 / Makna Visual</span>
                                    <h3 className="mk-heading text-xl text-[var(--mk-maroon)] mb-2">Anatomi Logo</h3>
                                    <p className="text-[var(--mk-ink)] opacity-80 text-sm leading-relaxed font-medium">
                                        Logo menyertakan simbol <strong className="opacity-100">Burung Phoenix (🐦‍🔥)</strong>. Melambangkan daya tahan dan regenerasi agar selalu memberikan manfaat nyata.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="mk-bg-light mk-outline-box relative overflow-hidden group">
                            <div className="absolute -right-4 -top-8 text-[var(--mk-yellow)] opacity-30 font-black text-8xl md:text-[10rem] select-none pointer-events-none font-display">
                                #1
                            </div>
                            <div className="relative z-10">
                                <div className="mk-kicker mb-3">Official Tagline</div>
                                <h2 className="mk-display text-[var(--mk-ink)] text-4xl md:text-5xl mb-4 leading-tight">
                                    #1Byte<span className="text-[var(--mk-maroon)]">LebihDekat</span>
                                </h2>
                                <p className="text-[var(--mk-ink)] opacity-80 leading-relaxed font-medium max-w-2xl">
                                    Dalam arsitektur komputasi, <strong className="opacity-100">1 Byte</strong> adalah satuan informasi dasar. Filosofi ini melambangkan pergerakan khas kader teknik: setiap aksi kecil terukur yang dieksekusi dengan presisi akan membawa komisariat selangkah <strong className="opacity-100">Lebih Dekat</strong> dengan masyarakat.
                                </p>
                            </div>
                        </section>

                        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="mk-card-yellow shadow-[4px_4px_0_var(--mk-ink)] border-2 border-[var(--mk-ink)]">
                                <h3 className="mk-display text-3xl mb-2 text-[var(--mk-ink)]">Visi</h3>
                                <p className="text-[var(--mk-ink)] font-medium leading-relaxed text-sm">
                                    Mewujudkan akademisi Islam di lingkungan Fakultas Teknik yang berakhlak mulia, kompeten, serta menjadi kader autentik yang bermanfaat.
                                </p>
                            </div>
                            <div className="mk-paper border-2 border-[var(--mk-ink)]">
                                <h3 className="mk-display text-3xl mb-2 text-[var(--mk-maroon)]">Misi</h3>
                                <p className="text-[var(--mk-ink)] opacity-80 font-medium leading-relaxed text-sm">
                                    Menyelenggarakan perkaderan formal dan informal secara konsisten, menguatkan silaturahmi gagasan, serta aktif berbakti lewat aksi sosial.
                                </p>
                            </div>
                        </section>
                    </div>

                    <div className="lg:col-span-4 space-y-8 mt-8 lg:mt-0">

                        <div className="mk-paper flex flex-col items-center text-center">
                            <div className="mk-photo-circle w-24 h-24 mb-6 bg-white">
                                <img src="/img/logo/logo.jpg" alt="Logo PK IMM Kaizen" className="w-full h-full object-cover" />
                            </div>

                            <h3 className="mk-heading text-xl text-[var(--mk-maroon)] w-full pb-3 border-b-2 border-dashed border-[#d4b9b5] mb-4">
                                Data Organisasi
                            </h3>

                            <dl className="w-full space-y-3">
                                {[
                                    { label: 'Nama Resmi', value: 'PK IMM Kaizen' },
                                    { label: 'Basis', value: 'FT UMSURABAYA' },
                                    { label: 'Berdiri', value: '2017' },
                                    { label: 'Kader', value: '120+ Aktif' },
                                    { label: 'Fokus', value: 'Teknik & Humanitas' },
                                ].map(({ label, value }) => (
                                    <div key={label} className="flex justify-between items-center text-sm font-medium border-b border-[#ead9d6] pb-2 last:border-0 last:pb-0">
                                        <dt className="text-[var(--mk-ink)] opacity-60">{label}</dt>
                                        <dd className="font-bold text-[var(--mk-ink)]">{value}</dd>
                                    </div>
                                ))}
                            </dl>

                            <button onClick={() => onNavigate?.('contact' as Page)} className="mk-btn mk-btn--primary w-full mt-6">
                                Hubungi Kami
                            </button>
                        </div>

                        <div className="mk-paper">
                            <h3 className="mk-heading text-xl text-[var(--mk-maroon)] border-b-2 border-dashed border-[#d4b9b5] w-full pb-3 mb-6">
                                Perjalanan Kami
                            </h3>
                            <div className="border-l-4 border-[var(--mk-orange)] ml-3 space-y-6">
                                {[
                                    { year: '2017', title: 'Pendirian', event: 'Perintisan wadah gerakan.' },
                                    { year: '2019', title: 'Teras Kader', event: 'Materi ideologi kader.' },
                                    { year: '2021', title: 'Aksi Sosial', event: 'Baksos daerah Jawa Timur.' },
                                    { year: '2026', title: 'Autentik', event: 'Gerakan #1bytelebihdekat.' },
                                ].map((item, i) => (
                                    <div key={i} className="relative pl-5">
                                        <div className="absolute w-4 h-4 bg-[var(--mk-yellow)] border-4 border-[var(--mk-ink)] rounded-full -left-[10px] top-1" />
                                        <span className="mk-display text-lg text-[var(--mk-orange)] leading-none">{item.year}</span>
                                        <h4 className="mk-heading text-sm text-[var(--mk-ink)] mt-1">{item.title}</h4>
                                        <p className="text-[var(--mk-ink)] opacity-80 text-xs mt-1 font-medium">{item.event}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
