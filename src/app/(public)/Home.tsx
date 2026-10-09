'use client'

import { newsData, products, alumniData, divisions, type Page } from '../../app/(public)/data'
import heroBg from '../../../public/img/bg-hero.webp'

interface HomeProps {
    onNavigate: (page: Page) => void
    onNewsDetail: (id: number) => void
}

export default function Home({ onNavigate, onNewsDetail }: HomeProps) {
    const latestNews = newsData.filter(n => n.status === 'published').slice(0, 3)
    const featuredProducts = products.filter(p => p.available).slice(0, 4)

    return (
        <div className="w-full">
            <section className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-[#111] pt-20 pb-16">
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: `url(${heroBg.src})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: 0.90,
                    }}
                />
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#CC1021]/80 via-[#111]/80 to-[#111] opacity-90" />

                <div className="relative z-10 max-w-4xl mx-auto px-4 flex flex-col items-center text-center w-full mt-8">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="h-[1px] w-6 sm:w-12 bg-[#F5C400]" />
                        <span className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-[#F5C400]"
                              style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            Pimpinan Komisariat
                        </span>
                        <div className="h-[1px] w-6 sm:w-12 bg-[#F5C400]" />
                    </div>

                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-[1.2] mb-4 tracking-tight"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        IKATAN MAHASISWA MUHAMMADIYAH <br />
                        <span className="text-[#E07B1A]">KAIZEN</span>
                    </h1>

                    <p className="text-sm sm:text-lg font-bold text-white/90 mb-8 tracking-widest uppercase">
                        Universitas Muhammadiyah Surabaya
                    </p>

                    <p className="text-sm sm:text-base leading-relaxed text-white/80 max-w-2xl mb-10"
                       style={{ fontFamily: 'Inter, sans-serif' }}>
                        Platform digital resmi IMM Komisariat Kaizen. Bergerak bersama dalam ilmu, iman, dan amal nyata untuk membangun peradaban masyarakat.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                        <button
                            onClick={() => onNavigate('profile')}
                            className="w-full sm:w-auto px-8 py-3.5 bg-[#E07B1A] text-white font-bold rounded-full transition-all hover:bg-[#c96c15] hover:scale-105 shadow-lg shadow-[#E07B1A]/20"
                        >
                            Profil Organisasi
                        </button>
                        <button
                            onClick={() => onNavigate('news')}
                            className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-white/40 text-white font-bold rounded-full transition-all hover:bg-white/10"
                        >
                            Lihat Berita
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 w-full max-w-3xl mt-16 pt-10 border-t border-white/15">
                        {[
                            { label: 'Anggota Aktif', value: '120+' },
                            { label: 'Bidang', value: '10' },
                            { label: 'Tahun Berdiri', value: '2017' },
                            { label: 'Alumni', value: '300+' },
                        ].map(s => (
                            <div key={s.label} className="flex flex-col items-center">
                                <div className="text-3xl font-black text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                    {s.value}
                                </div>
                                <div className="text-xs mt-1 text-white/50 uppercase tracking-wider font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                                    {s.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SISA KODE DI BAWAH INI SAMA DENGAN SEBELUMNYA */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex flex-col items-center text-center mb-16">
                        <span className="text-xs font-bold text-[#CC1021] tracking-widest uppercase mb-3">Tentang Kami</span>
                        <h2 className="text-3xl sm:text-4xl font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            Melahirkan Pemimpin Masa Depan
                        </h2>
                        <p className="mt-6 text-gray-600 max-w-2xl leading-relaxed">
                            IMM Komisariat Kaizen adalah organisasi mahasiswa Islam di bawah Ikatan Mahasiswa Muhammadiyah. Dengan semangat <em>Kaizen</em> (perbaikan terus-menerus), kami mendorong setiap kader untuk berinovasi dan berkontribusi.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {divisions.slice(0, 4).map((div) => (
                            <div key={div.id}
                                 className="group relative rounded-2xl overflow-hidden cursor-pointer aspect-[4/5] bg-gray-100"
                                 onClick={() => onNavigate('division')}>
                                <img src={div.photo} alt={div.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                <div className="absolute bottom-5 left-5 right-5 text-left">
                                    <h3 className="text-white font-bold text-lg leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                        {div.name.split('(')[0].trim()}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <button onClick={() => onNavigate('profile')} className="text-sm font-bold text-[#C8102E] hover:text-[#9B0D1A] transition-colors inline-flex items-center gap-2">
                            Pelajari Selengkapnya <span>→</span>
                        </button>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
                        <div className="text-center sm:text-left">
                            <span className="text-xs font-bold text-[#E07B1A] tracking-widest uppercase mb-2 block">Kabar Terkini</span>
                            <h2 className="text-3xl font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>Berita & Dokumentasi</h2>
                        </div>
                        <button onClick={() => onNavigate('news')} className="hidden sm:inline-flex px-5 py-2 rounded-full border border-gray-300 text-sm font-semibold hover:bg-gray-100 transition-colors">
                            Semua Berita
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {latestNews.map((item) => (
                            <article key={item.id}
                                     className="group bg-white rounded-2xl overflow-hidden cursor-pointer border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                                     onClick={() => onNewsDetail(item.id)}>
                                <div className="relative aspect-video overflow-hidden bg-gray-100">
                                    <img src={item.cover} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full">
                                        <span className="text-[10px] font-bold uppercase tracking-wide text-[#C8102E]">{item.category}</span>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <span className="text-xs text-gray-400 mb-3">{item.publishDate}</span>
                                    <h3 className="font-bold text-lg leading-snug mb-3 text-gray-900 line-clamp-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mt-auto">{item.excerpt}</p>
                                </div>
                            </article>
                        ))}
                    </div>

                    <div className="mt-8 text-center sm:hidden">
                        <button onClick={() => onNavigate('news')} className="w-full px-5 py-3 rounded-xl border border-gray-200 text-sm font-semibold">
                            Semua Berita
                        </button>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex flex-col items-center text-center mb-16">
                        <span className="text-xs font-bold text-[#E07B1A] tracking-widest uppercase mb-3">Katalog</span>
                        <h2 className="text-3xl font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            Produk Ekowir Kaizen
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                        {featuredProducts.map(product => (
                            <div key={product.id} className="group cursor-pointer" onClick={() => onNavigate('ekowir')}>
                                <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-4">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                </div>
                                <div className="text-center px-2">
                                    <p className="text-xs text-gray-400 mb-1 font-medium">{product.category}</p>
                                    <h4 className="font-bold text-sm text-gray-800 leading-snug mb-2 line-clamp-1">{product.name}</h4>
                                    <p className="font-black text-base text-[#C8102E]">
                                        Rp {product.price.toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-16">
                        <span className="text-xs font-bold text-[#F5C400] tracking-widest uppercase mb-3 block">Mereka yang Menginspirasi</span>
                        <h2 className="text-3xl font-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>Alumni Inspiratif</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {alumniData.map(a => (
                            <div key={a.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center backdrop-blur-sm transition-colors hover:bg-white/10">
                                <img src={a.photo} alt={a.name} className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-2 border-[#E07B1A]" />
                                <h4 className="font-bold text-base mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{a.name}</h4>
                                <p className="text-xs text-[#F5C400] font-semibold mb-3 tracking-wide">Angkatan {a.batch}</p>
                                <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-3">{a.achievement}</p>
                                <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-white">
                                    {a.role}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-[#CC1021]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <h2 className="text-3xl sm:text-4xl font-black text-white mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        Mari Berkolaborasi Bersama Kami
                    </h2>
                    <p className="text-base text-white/80 mb-10 max-w-2xl mx-auto">
                        Pelajari struktur organisasi, kepengurusan, dan berbagai program unggulan kami untuk menciptakan dampak positif bagi masyarakat.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button onClick={() => onNavigate('management')}
                                className="px-8 py-3.5 bg-white text-[#CC1021] font-bold rounded-full transition-transform hover:scale-105 shadow-lg">
                            Lihat Kepengurusan
                        </button>
                        <button onClick={() => onNavigate('contact')}
                                className="px-8 py-3.5 border border-white/50 text-white font-bold rounded-full transition-colors hover:bg-white/10">
                            Hubungi Kami
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}