'use client'

import { newsData, products, alumniData, divisions, type Page } from '../../app/(public)/data'
import logoImg from '../../../public/img/logo/logo.jpg'

interface HomeProps {
    onNavigate: (page: Page) => void
    onNewsDetail: (id: number) => void
}

export default function Home({ onNavigate, onNewsDetail }: HomeProps) {
    const latestNews = newsData.filter(n => n.status === 'published').slice(0, 3)
    const featuredProducts = products.filter(p => p.available).slice(0, 4)

    return (
        <div>
            <section className="relative overflow-hidden" style={{ background: '#111', minHeight: '88vh', display: 'flex', alignItems: 'center' }}>
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1600&h=900&fit=crop&auto=format)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: 0.18,
                    }}
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #CC1021 0%, #9B0D1A 45%, #1A0A0C 100%)', opacity: 0.88 }} />

                <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: 'linear-gradient(180deg, #F5C400 0%, #E07B1A 50%, #CC1021 100%)' }} />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                        <div className="hidden lg:flex justify-center items-center order-2">
                            <img
                                src={logoImg.src}
                                alt="IMM Kaizen Logo"
                                style={{
                                    width: 320,
                                    height: 320,
                                    objectFit: 'contain',
                                    filter: 'drop-shadow(0 0 40px rgba(224,123,26,0.35)) drop-shadow(0 0 80px rgba(204,16,33,0.2))',
                                    mixBlendMode: 'screen',
                                }}
                            />
                        </div>
                        <div className="order-1 max-w-2xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-px w-8" style={{ background: '#F5C400' }} />
                                <span className="text-xs font-bold tracking-widest uppercase"
                                      style={{ color: '#F5C400', fontFamily: 'Montserrat, sans-serif' }}>
                Ikatan Mahasiswa Muhammadiyah
              </span>
                            </div>
                            <h1 className="text-5xl sm:text-6xl font-black text-white leading-tight mb-4"
                                style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                KAIZEN<br />
                                <span style={{ color: '#E07B1A' }}>COMPANY</span>
                            </h1>
                            <p className="text-base sm:text-lg leading-relaxed mb-8"
                               style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'Inter, sans-serif', maxWidth: '480px' }}>
                                Platform digital resmi IMM Komisariat Kaizen. Bergerak bersama dalam ilmu, iman, dan amal nyata untuk masyarakat.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <button onClick={() => onNavigate('profile')} className="btn-primary"
                                        style={{ background: '#E07B1A', color: '#fff', fontWeight: 700 }}>
                                    Profil Organisasi
                                </button>
                                <button onClick={() => onNavigate('news')} className="btn-outline"
                                        style={{ borderColor: 'rgba(255,255,255,0.5)', color: '#fff' }}>
                                    Lihat Berita
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-8 mt-14 pt-8 border-t" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
                                {[
                                    { label: 'Anggota Aktif', value: '120+' },
                                    { label: 'Bidang', value: '5' },
                                    { label: 'Tahun Berdiri', value: '2017' },
                                    { label: 'Alumni', value: '300+' },
                                ].map(s => (
                                    <div key={s.label}>
                                        <div className="text-2xl font-black text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>{s.value}</div>
                                        <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter, sans-serif' }}>{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="section-label mb-3">Tentang Kami</div>
                            <h2 className="text-3xl font-black mb-5" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                Komisariat Kaizen,<br />Melahirkan Pemimpin Masa Depan
                            </h2>
                            <p className="text-sm leading-relaxed mb-4" style={{ color: '#555' }}>
                                IMM Komisariat Kaizen adalah organisasi mahasiswa Islam yang bernaung di bawah Ikatan Mahasiswa Muhammadiyah. Didirikan pada 2017, kami berkomitmen dalam pembentukan kader yang berilmu, berakhlak, dan berdaya guna bagi masyarakat.
                            </p>
                            <p className="text-sm leading-relaxed mb-6" style={{ color: '#555' }}>
                                Dengan semangat <em>Kaizen</em> — perbaikan terus-menerus — kami mendorong setiap anggota untuk terus berkembang, berinovasi, dan memberikan kontribusi terbaik.
                            </p>
                            <button onClick={() => onNavigate('profile')} className="btn-primary">
                                Selengkapnya →
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {divisions.slice(0, 4).map((div, i) => (
                                <div key={div.id} className="rounded overflow-hidden relative group cursor-pointer"
                                     style={{ aspectRatio: '4/3', background: '#eee' }}
                                     onClick={() => onNavigate('division')}>
                                    <img src={div.photo} alt={div.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)' }} />
                                    <div className="absolute bottom-2 left-3 right-3">
                                        <p className="text-white text-xs font-bold leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                            {div.name.split('(')[0].trim()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20" style={{ background: '#F7F6F5' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <div className="section-label mb-2">Kabar Terkini</div>
                            <h2 className="text-2xl font-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>Berita & Dokumentasi</h2>
                        </div>
                        <button onClick={() => onNavigate('news')} className="btn-outline text-xs hidden sm:flex">
                            Semua Berita →
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {latestNews.map((item, idx) => (
                            <article key={item.id}
                                     className="bg-white rounded overflow-hidden cursor-pointer group transition-shadow hover:shadow-md"
                                     style={{ border: '1px solid #E0DEDC' }}
                                     onClick={() => onNewsDetail(item.id)}>
                                <div className="overflow-hidden" style={{ aspectRatio: idx === 0 ? '16/9' : '16/9', background: '#eee' }}>
                                    <img src={item.cover} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wide" style={{ color: '#C8102E', fontFamily: 'Montserrat, sans-serif' }}>
                      {item.category}
                    </span>
                                        <span style={{ color: '#ccc' }}>·</span>
                                        <span className="text-xs" style={{ color: '#888' }}>{item.publishDate}</span>
                                    </div>
                                    <h3 className="font-bold text-sm leading-snug mb-2 line-clamp-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                        {item.title}
                                    </h3>
                                    <p className="text-xs leading-relaxed line-clamp-2" style={{ color: '#666' }}>{item.excerpt}</p>
                                </div>
                            </article>
                        ))}
                    </div>

                    <div className="sm:hidden mt-6">
                        <button onClick={() => onNavigate('news')} className="btn-outline w-full justify-center">Semua Berita →</button>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <div className="section-label mb-2">Produk Kami</div>
                            <h2 className="text-2xl font-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>Ekowir — Katalog Produk</h2>
                        </div>
                        <button onClick={() => onNavigate('ekowir')} className="btn-outline text-xs hidden sm:flex">
                            Lihat Semua →
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {featuredProducts.map(product => (
                            <div key={product.id} className="rounded overflow-hidden group cursor-pointer"
                                 style={{ border: '1px solid #E0DEDC', background: '#fff' }}
                                 onClick={() => onNavigate('ekowir')}>
                                <div className="overflow-hidden" style={{ aspectRatio: '1/1', background: '#F7F6F5' }}>
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                </div>
                                <div className="p-3">
                                    <p className="text-xs text-gray-500 mb-0.5" style={{ fontFamily: 'Montserrat, sans-serif' }}>{product.category}</p>
                                    <h4 className="font-bold text-xs leading-snug mb-1 line-clamp-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>{product.name}</h4>
                                    <p className="font-black text-sm" style={{ color: '#C8102E', fontFamily: 'Montserrat, sans-serif' }}>
                                        Rp {product.price.toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20" style={{ background: '#F7F6F5' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <div className="section-label mb-2">Mereka yang Menginspirasi</div>
                            <h2 className="text-2xl font-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>Alumni Inspiratif</h2>
                        </div>
                        <button onClick={() => onNavigate('alumni')} className="btn-outline text-xs hidden sm:flex">
                            Semua Alumni →
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {alumniData.map(a => (
                            <div key={a.id} className="bg-white rounded p-5 text-center" style={{ border: '1px solid #E0DEDC' }}>
                                <img src={a.photo} alt={a.name} className="w-16 h-16 rounded-full object-cover mx-auto mb-3"
                                     style={{ border: '2px solid #E0DEDC' }} />
                                <h4 className="font-bold text-sm mb-0.5" style={{ fontFamily: 'Montserrat, sans-serif' }}>{a.name}</h4>
                                <p className="text-xs mb-1" style={{ color: '#C8102E', fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>Angkatan {a.batch}</p>
                                <p className="text-xs leading-relaxed mb-2 line-clamp-2" style={{ color: '#666' }}>{a.achievement}</p>
                                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#FEF2F4', color: '#C8102E', fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                  {a.role}
                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16" style={{ background: '#C8102E' }}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <h2 className="text-2xl sm:text-3xl font-black text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        Ingin Tahu Lebih Lanjut tentang IMM Kaizen?
                    </h2>
                    <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.8)' }}>
                        Pelajari struktur organisasi, kepengurusan, dan berbagai program unggulan kami.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <button onClick={() => onNavigate('management')} className="btn-primary"
                                style={{ background: '#fff', color: '#C8102E', fontWeight: 700 }}>
                            Lihat Kepengurusan
                        </button>
                        <button onClick={() => onNavigate('contact')} className="btn-outline"
                                style={{ borderColor: 'rgba(255,255,255,0.6)', color: '#fff' }}>
                            Hubungi Kami
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}
