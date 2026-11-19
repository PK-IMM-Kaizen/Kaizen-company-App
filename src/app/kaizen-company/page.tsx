'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    ArrowLeft,
    Package,
    Globe,
    Cpu,
    Smartphone,
    ChevronRight,
    Check,
    ShoppingBag,
    Clock,
    Sparkles
} from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

const WHATSAPP_ADMIN = '6282322143305'
const WHATSAPP_TECH = '6289601261250'

interface Product {
    id: string
    name: string
    description: string
    price: number
    category: string
    available: boolean
    image: string
    is_preorder: boolean
    po_duration?: string
    dp_amount?: number
}

export default function KaizenCompanyPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [isLoadingProducts, setIsLoadingProducts] = useState(true)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoadingProducts(true)
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('available', true)
                    .order('created_at', { ascending: false })

                if (error) throw error
                if (data) setProducts(data)
            } catch (error) {
                console.error('Error fetching products:', error)
            } finally {
                setIsLoadingProducts(false)
            }
        }

        fetchProducts()
    }, [supabase])

    const scrollToSection = (href: string) => {
        const element = document.querySelector(href)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    }

    const handleCheckoutWA = (product: Product) => {
        let message = `Halo Admin Kaizen Company,\n\nSaya berminat untuk memesan produk *${product.name}*.\n\nMohon informasi lebih lanjut mengenai stok, pemesanan, dan pembayarannya.`

        if (product.is_preorder) {
            message = `Halo Admin Kaizen Company,\n\nSaya berminat untuk memesan produk *${product.name}* melalui sistem Pre-Order (PO).\n\nMohon informasi lebih lanjut mengenai alur pemesanan dan pembayarannya.`
        }

        const encodedMessage = encodeURIComponent(message)
        window.open(`https://wa.me/${WHATSAPP_ADMIN}?text=${encodedMessage}`, '_blank')
    }

    return (
        <div className="min-h-screen flex flex-col font-sans selection:bg-[var(--mk-yellow)] selection:text-[var(--mk-ink)]">
            <header className="sticky top-0 left-0 right-0 z-50 bg-[var(--mk-maroon)] border-b-4 border-[var(--mk-ink)] shadow-[0_4px_0_var(--mk-ink)] transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
                        <div className="flex items-center gap-3 sm:gap-5 shrink-0">
                            <Link
                                href="/"
                                className="flex items-center gap-1.5 text-xs text-white hover:text-[var(--mk-yellow)] transition-colors shrink-0 font-bold"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span className="hidden xs:inline sm:inline">IMM Kaizen</span>
                            </Link>

                            <div className="w-[3px] h-6 bg-[var(--mk-ink)] hidden xs:block rounded-full" />

                            <div onClick={() => scrollToSection('#hero')} className="flex items-center gap-2 sm:gap-3 cursor-pointer group">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-[var(--mk-ink)] shrink-0 bg-white shadow-[2px_2px_0_var(--mk-ink)] group-hover:scale-105 transition-transform">
                                    <img src="/img/logo/logo.jpg" alt="Logo Kaizen" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex flex-col leading-none">
                                    <span className="text-white font-black text-sm sm:text-base tracking-wide mk-heading">KAIZEN</span>
                                    <span className="text-[var(--mk-yellow)] text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase mt-0.5">Company</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <a
                                href={`https://wa.me/${WHATSAPP_ADMIN}?text=${encodeURIComponent('Halo Admin, saya ingin berdiskusi terkait kolaborasi bisnis dengan Kaizen Company.')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mk-btn mk-btn--gold border-2 border-[var(--mk-ink)] shadow-[3px_3px_0_var(--mk-ink)] hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--mk-ink)] text-xs sm:text-sm py-2 px-4 sm:px-6 mb-0"
                            >
                                Kolaborasi
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 bg-white">
                <section id="hero" className="relative pt-16 sm:pt-24 pb-20 sm:pb-32 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center mk-bg-dark mk-curve-bottom border-b-4 border-[var(--mk-ink)] overflow-hidden z-10">
                    <div className="mk-halftone mk-halftone--tr opacity-40" />
                    <div className="mk-halftone mk-halftone--bl opacity-40" />
                    <div className="mk-star mk-star--lg mk-star--spin top-10 left-[10%] opacity-40 hidden md:block" />
                    <div className="mk-star mk-star--sm mk-star--spin bottom-20 right-[15%] opacity-60" />

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="bg-[var(--mk-yellow)] text-[var(--mk-ink)] font-black uppercase tracking-widest rounded-md border-2 border-[var(--mk-ink)] shadow-[3px_3px_0_var(--mk-ink)] mb-6 text-xs sm:text-sm px-4 py-1.5">
                            Unit Usaha Resmi Komisariat
                        </div>
                        <h1 className="mk-display !text-white text-5xl sm:text-6xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight mb-6 drop-shadow-[0_4px_0_var(--mk-ink)]">
                            KEMANDIRIAN <br />
                            EKONOMI <br className="sm:hidden" />
                            <span className="!text-[var(--mk-yellow)] inline-block mt-2 sm:mt-0">ORGANISASI</span>
                        </h1>

                        <p className="text-white font-medium max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed mb-8 px-5 py-4 font-body bg-[var(--mk-maroon-deep)]/90 rounded-2xl border-2 border-[var(--mk-ink)] shadow-[4px_4px_0_var(--mk-ink)]">
                            Kaizen Company adalah lini bisnis yang dikelola secara profesional oleh kader IMM Kaizen untuk mendukung pendanaan mandiri komisariat serta menyediakan produk dan layanan teknologi berkualitas.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <button
                                onClick={() => scrollToSection('#produk')}
                                className="mk-btn mk-btn--gold border-2 border-[var(--mk-ink)] shadow-[4px_4px_0_var(--mk-ink)] text-sm sm:text-base px-7 py-3"
                            >
                                Lihat Katalog Produk
                            </button>
                            <button
                                onClick={() => scrollToSection('#layanan')}
                                className="mk-btn bg-white text-[var(--mk-ink)] hover:bg-[var(--mk-cream)] border-2 border-[var(--mk-ink)] shadow-[4px_4px_0_var(--mk-orange)] text-sm sm:text-base px-7 py-3"
                            >
                                Layanan Teknologi
                            </button>
                        </div>
                    </div>
                </section>

                <section id="produk" className="py-16 sm:py-24 mk-bg-light relative">
                    <div className="mk-dots mk-dots--maroon top-10 left-10 opacity-30 hidden md:block" />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center sm:text-left mb-12 sm:mb-16">
                            <span className="font-serif font-bold uppercase tracking-[0.25em] text-[var(--mk-maroon)] text-xs sm:text-sm block">Katalog</span>
                            <h2 className="mk-heading text-4xl sm:text-5xl md:text-6xl text-[var(--mk-ink)] mt-2">Produk Official</h2>
                            <p className="mt-4 text-[var(--mk-ink)] font-medium max-w-xl text-sm sm:text-base border-l-4 border-[var(--mk-orange)] pl-4">
                                Produk resmi yang dikurasi dan dikelola langsung oleh Kaizen Company untuk mendukung kebutuhan identitas dan kegiatan kader.
                            </p>
                        </div>

                        {isLoadingProducts ? (
                            <div className="flex justify-center items-center py-20">
                                <div className="w-12 h-12 border-4 border-[var(--mk-ink)] border-t-[var(--mk-orange)] rounded-full animate-spin shadow-[4px_4px_0_var(--mk-yellow)]"></div>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-16 bg-white border-4 border-[var(--mk-ink)] shadow-[8px_8px_0_var(--mk-yellow)] rounded-[var(--mk-radius-lg)] max-w-3xl mx-auto p-8">
                                <Package className="w-12 h-12 text-[var(--mk-maroon)] mx-auto mb-4" />
                                <p className="text-[var(--mk-ink)] font-bold text-lg">Belum ada produk yang ditampilkan saat ini.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 max-w-6xl mx-auto">
                                {products.map(p => (
                                    <div key={p.id} className="group bg-white border-4 border-[var(--mk-ink)] rounded-[var(--mk-radius-lg)] overflow-hidden shadow-[8px_8px_0_var(--mk-yellow)] hover:shadow-[12px_12px_0_var(--mk-maroon)] hover:-translate-y-2 transition-all flex flex-col justify-between">
                                        <div>
                                            <div className="aspect-[16/11] bg-[var(--mk-cream)] border-b-4 border-[var(--mk-ink)] overflow-hidden relative">
                                                <img
                                                    src={p.image || '/img/profile/imm.jpeg'}
                                                    alt={p.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                {p.is_preorder && (
                                                    <div className="absolute top-4 right-4 bg-[var(--mk-orange)] text-white border-2 border-[var(--mk-ink)] shadow-[2px_2px_0_var(--mk-ink)] text-[10px] sm:text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-md flex items-center gap-1.5 z-10">
                                                        <Clock className="w-3.5 h-3.5" /> Pre-Order
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-6">
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="bg-[var(--mk-yellow)] text-[var(--mk-ink)] text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-md border-2 border-[var(--mk-ink)] shadow-[2px_2px_0_var(--mk-ink)]">
                                                        {p.category}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-[var(--mk-ink)] bg-[var(--mk-cream)] border-2 border-[var(--mk-ink)] px-2 py-1 rounded-md font-mono uppercase">
                                                        Official
                                                    </span>
                                                </div>

                                                <div className="mb-4">
                                                    <h3 className="mk-heading text-xl sm:text-2xl text-[var(--mk-ink)] mb-3 leading-tight group-hover:text-[var(--mk-maroon)] transition-colors">
                                                        {p.name}
                                                    </h3>
                                                    <div className="inline-block bg-[var(--mk-yellow)] border-2 border-[var(--mk-ink)] shadow-[3px_3px_0_var(--mk-ink)] px-3 py-1.5 rounded-lg">
                                                        <span className="font-black text-base sm:text-lg text-[var(--mk-ink)] whitespace-nowrap">
                                                            Rp {p.price.toLocaleString('id-ID')}
                                                        </span>
                                                    </div>
                                                </div>

                                                {p.is_preorder && p.po_duration && (
                                                    <div className="mb-4 bg-[var(--mk-cream)] border-2 border-[var(--mk-orange)] border-dashed rounded-lg p-3">
                                                        <p className="text-xs text-[var(--mk-ink)] font-bold">
                                                            Estimasi PO: <span className="text-[var(--mk-maroon)]">{p.po_duration}</span>
                                                        </p>
                                                        {p.dp_amount && p.dp_amount > 0 && (
                                                            <p className="text-xs text-[var(--mk-ink)] font-bold mt-1">
                                                                Min. DP: <span className="text-[var(--mk-maroon)]">Rp {p.dp_amount.toLocaleString('id-ID')}</span>
                                                            </p>
                                                        )}
                                                    </div>
                                                )}

                                                <p className="text-sm font-medium text-[#4a2b2c] leading-relaxed line-clamp-3">
                                                    {p.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="px-6 pb-6 mt-auto">
                                            <button
                                                onClick={() => handleCheckoutWA(p)}
                                                className="w-full mk-btn bg-[var(--mk-ink)] text-white border-2 border-[var(--mk-ink)] hover:bg-[var(--mk-maroon)] shadow-[4px_4px_0_var(--mk-orange)] hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--mk-orange)] transition-all uppercase flex items-center justify-center gap-2 mb-0"
                                            >
                                                <ShoppingBag className="w-4 h-4 text-[var(--mk-yellow)]" /> Pesan via WhatsApp
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-16 text-center p-8 sm:p-10 rounded-[var(--mk-radius-lg)] border-4 border-[var(--mk-ink)] shadow-[8px_8px_0_var(--mk-orange)] bg-[var(--mk-cream)] max-w-4xl mx-auto relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--mk-yellow)] rounded-bl-full border-b-4 border-l-4 border-[var(--mk-ink)] z-0"></div>

                            <div className="relative z-10">
                                <div className="flex justify-center mb-5">
                                    <div className="w-14 h-14 bg-white border-2 border-[var(--mk-ink)] rounded-xl shadow-[4px_4px_0_var(--mk-ink)] flex items-center justify-center">
                                        <Package className="w-8 h-8 text-[var(--mk-orange)]" />
                                    </div>
                                </div>
                                <h3 className="mk-heading text-[var(--mk-ink)] text-xl sm:text-2xl mb-3">Punya Produk Kreatif?</h3>
                                <p className="text-[#4a2b2c] font-medium text-sm sm:text-base mb-6 max-w-lg mx-auto">
                                    Kader IMM Kaizen dapat mengajukan karya atau produknya untuk dikurasi dan dipasarkan bersama di katalog resmi.
                                </p>
                                <a
                                    href={`https://wa.me/${WHATSAPP_ADMIN}?text=${encodeURIComponent('Halo Admin, saya ingin mengajukan produk saya untuk masuk katalog Kaizen Company.')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mk-btn mk-btn--gold border-2 border-[var(--mk-ink)] shadow-[4px_4px_0_var(--mk-ink)] hover:-translate-y-1 inline-flex mb-0"
                                >
                                    Ajukan Produk <ChevronRight className="w-4 h-4 ml-1" />
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="layanan" className="py-16 sm:py-24 border-t-4 border-[var(--mk-ink)] bg-white relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-12 sm:mb-16">
                            <span className="font-serif font-bold uppercase tracking-[0.25em] text-[var(--mk-maroon)] text-xs sm:text-sm block">
                                Jasa & Solusi Teknis
                            </span>
                            <h2 className="mk-heading text-4xl sm:text-5xl md:text-6xl text-[var(--mk-ink)] mt-2">
                                Layanan Unggulan
                            </h2>
                            <div className="mt-4 inline-flex items-center gap-2 bg-[var(--mk-yellow)] text-[var(--mk-ink)] px-4 py-1.5 rounded-full border-2 border-[var(--mk-ink)] shadow-[3px_3px_0_var(--mk-ink)] text-xs sm:text-sm font-black uppercase tracking-wider">
                                <Sparkles className="w-4 h-4 text-[var(--mk-maroon)]" /> 100% Gratis Konsultasi Proyek
                            </div>
                            <p className="mt-4 text-[#4a2b2c] font-medium max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                                Solusi digital dan rekayasa teknologi profesional dari talenta programmer, mobile developer, dan hardware engineer dari Fakultas Teknik UMSurabaya.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">

                            <div className="bg-[var(--mk-cream)] border-4 border-[var(--mk-ink)] rounded-[var(--mk-radius-lg)] p-7 sm:p-8 relative overflow-hidden transition-all shadow-[8px_8px_0_var(--mk-maroon)] hover:-translate-y-2 hover:shadow-[12px_12px_0_var(--mk-maroon)] flex flex-col justify-between group">
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="w-14 h-14 bg-[var(--mk-maroon)] text-[var(--mk-yellow)] rounded-2xl flex items-center justify-center border-4 border-[var(--mk-ink)] shadow-[4px_4px_0_var(--mk-ink)]">
                                            <Globe className="w-7 h-7" />
                                        </div>
                                        <span className="bg-white text-[var(--mk-ink)] text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-md border-2 border-[var(--mk-ink)] shadow-[2px_2px_0_var(--mk-ink)]">
                                            Gratis Konsultasi
                                        </span>
                                    </div>

                                    <div className="inline-block bg-[var(--mk-orange)] text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-md border-2 border-[var(--mk-ink)] mb-4 shadow-[2px_2px_0_var(--mk-ink)]">
                                        Web & Software
                                    </div>
                                    <h3 className="mk-heading text-2xl text-[var(--mk-ink)] mb-3">Pengembangan Website</h3>
                                    <p className="text-[#4a2b2c] font-medium text-sm leading-relaxed mb-6">
                                        Jasa pembuatan website modern, cepat, dan responsif untuk <strong>Landing Page Event</strong>, <strong>Website Profil Organisasi</strong>, hingga Sistem Informasi.
                                    </p>

                                    <div className="mb-8">
                                        <p className="text-xs font-black text-[var(--mk-ink)] uppercase tracking-widest mb-3">Deliverables:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {['Custom UI/UX', 'Responsive Mobile', 'SEO Ready', 'Domain & Hosting'].map((item) => (
                                                <span key={item} className="text-xs font-bold text-[var(--mk-ink)] bg-white border-2 border-[var(--mk-ink)] px-2.5 py-1 rounded-md shadow-[2px_2px_0_var(--mk-ink)] flex items-center gap-1.5">
                                                    <Check className="w-3.5 h-3.5 text-[var(--mk-maroon)] stroke-[3px]" /> {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <a
                                    href={`https://wa.me/${WHATSAPP_TECH}?text=${encodeURIComponent('Halo Admin Kaizen Company, saya tertarik untuk konsultasi gratis mengenai pembuatan Website.')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mk-btn mk-btn--primary w-full border-2 border-[var(--mk-ink)] shadow-[4px_4px_0_var(--mk-ink)] justify-center text-xs sm:text-sm mb-0"
                                >
                                    Konsultasi Web Gratis
                                </a>
                            </div>

                            <div className="bg-white border-4 border-[var(--mk-ink)] rounded-[var(--mk-radius-lg)] p-7 sm:p-8 relative overflow-hidden transition-all shadow-[8px_8px_0_var(--mk-ink)] hover:-translate-y-2 hover:shadow-[12px_12px_0_var(--mk-ink)] flex flex-col justify-between group">
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="w-14 h-14 bg-[var(--mk-orange)] text-white rounded-2xl flex items-center justify-center border-4 border-[var(--mk-ink)] shadow-[4px_4px_0_var(--mk-ink)]">
                                            <Smartphone className="w-7 h-7" />
                                        </div>
                                        <span className="bg-[var(--mk-yellow)] text-[var(--mk-ink)] text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-md border-2 border-[var(--mk-ink)] shadow-[2px_2px_0_var(--mk-ink)]">
                                            Gratis Konsultasi
                                        </span>
                                    </div>

                                    <div className="inline-block bg-[var(--mk-maroon)] text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-md border-2 border-[var(--mk-ink)] mb-4 shadow-[2px_2px_0_var(--mk-ink)]">
                                        Android & Mobile App
                                    </div>
                                    <h3 className="mk-heading text-2xl text-[var(--mk-ink)] mb-3">Pembuatan Aplikasi</h3>
                                    <p className="text-[#4a2b2c] font-medium text-sm leading-relaxed mb-6">
                                        Pengembangan aplikasi mobile berbasis <strong>Android maupun Cross-Platform</strong> untuk kebutuhan bisnis, manajemen operasional, maupun proyek akademik.
                                    </p>

                                    <div className="mb-8">
                                        <p className="text-xs font-black text-[var(--mk-ink)] uppercase tracking-widest mb-3">Deliverables:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {['Android APK / AAB', 'Integrasi API & DB', 'Desain Modern', 'Source Code'].map((item) => (
                                                <span key={item} className="text-xs font-bold text-[var(--mk-ink)] bg-[var(--mk-cream)] border-2 border-[var(--mk-ink)] px-2.5 py-1 rounded-md shadow-[2px_2px_0_var(--mk-ink)] flex items-center gap-1.5">
                                                    <Check className="w-3.5 h-3.5 text-[var(--mk-maroon)] stroke-[3px]" /> {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <a
                                    href={`https://wa.me/${WHATSAPP_TECH}?text=${encodeURIComponent('Halo Admin Kaizen Company, saya tertarik untuk konsultasi gratis mengenai pembuatan Aplikasi Android/Mobile.')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mk-btn mk-btn--gold w-full border-2 border-[var(--mk-ink)] shadow-[4px_4px_0_var(--mk-ink)] justify-center text-xs sm:text-sm mb-0"
                                >
                                    Konsultasi Aplikasi Gratis
                                </a>
                            </div>

                            <div className="bg-[var(--mk-yellow)] border-4 border-[var(--mk-ink)] rounded-[var(--mk-radius-lg)] p-7 sm:p-8 relative overflow-hidden transition-all shadow-[8px_8px_0_var(--mk-orange)] hover:-translate-y-2 hover:shadow-[12px_12px_0_var(--mk-orange)] flex flex-col justify-between group">
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="w-14 h-14 bg-white text-[var(--mk-orange)] rounded-2xl flex items-center justify-center border-4 border-[var(--mk-ink)] shadow-[4px_4px_0_var(--mk-ink)]">
                                            <Cpu className="w-7 h-7" />
                                        </div>
                                        <span className="bg-white text-[var(--mk-ink)] text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-md border-2 border-[var(--mk-ink)] shadow-[2px_2px_0_var(--mk-ink)]">
                                            Gratis Konsultasi
                                        </span>
                                    </div>

                                    <div className="inline-block bg-white text-[var(--mk-ink)] text-xs font-black uppercase tracking-wider px-3 py-1 rounded-md border-2 border-[var(--mk-ink)] mb-4 shadow-[2px_2px_0_var(--mk-ink)]">
                                        Hardware & IoT
                                    </div>
                                    <h3 className="mk-heading text-2xl text-[var(--mk-ink)] mb-3">Sistem IoT & Otomasi</h3>
                                    <p className="text-[var(--mk-ink)] font-medium text-sm leading-relaxed mb-6">
                                        Perancangan prototipe <em>Internet of Things (IoT)</em>, sistem kontrol sensor, otomatisasi mikroprosesor, hingga integrasi dashboard pemantauan realtime.
                                    </p>

                                    <div className="mb-8">
                                        <p className="text-xs font-black text-[var(--mk-ink)] uppercase tracking-widest mb-3">Deliverables:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {['Skema Hardware', 'Firmware & Coding', 'Web Dashboard', 'Buku Panduan'].map((item) => (
                                                <span key={item} className="text-xs font-bold text-[var(--mk-ink)] bg-white border-2 border-[var(--mk-ink)] px-2.5 py-1 rounded-md shadow-[2px_2px_0_var(--mk-ink)] flex items-center gap-1.5">
                                                    <Check className="w-3.5 h-3.5 text-[var(--mk-orange)] stroke-[3px]" /> {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <a
                                    href={`https://wa.me/${WHATSAPP_TECH}?text=${encodeURIComponent('Halo Admin Kaizen Company, saya tertarik untuk konsultasi gratis mengenai proyek IoT / Otomasi.')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mk-btn bg-white text-[var(--mk-ink)] hover:bg-[var(--mk-cream)] border-2 border-[var(--mk-ink)] shadow-[4px_4px_0_var(--mk-ink)] hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--mk-ink)] justify-center text-xs sm:text-sm font-bold uppercase tracking-wider mb-0"
                                >
                                    Konsultasi IoT Gratis
                                </a>
                            </div>

                        </div>

                        <div className="mt-16 text-center px-4">
                            <div className="inline-block bg-[var(--mk-cream)] border-4 border-[var(--mk-ink)] shadow-[6px_6px_0_var(--mk-ink)] rounded-2xl px-6 sm:px-8 py-5 max-w-3xl">
                                <p className="text-[var(--mk-ink)] font-bold text-sm sm:text-base leading-relaxed">
                                    Butuh integrasi sistem atau proyek kustom (Website, Aplikasi Android, maupun IoT)?{' '}
                                    <a
                                        href={`https://wa.me/${WHATSAPP_TECH}?text=${encodeURIComponent('Halo Admin Kaizen Company, saya ingin konsultasi gratis untuk mendiskusikan proyek custom (Web / Aplikasi / IoT).')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[var(--mk-maroon)] underline decoration-2 underline-offset-4 hover:text-[var(--mk-orange)] transition-colors cursor-pointer font-black block sm:inline mt-2 sm:mt-0"
                                    >
                                        Diskusikan kebutuhan Anda secara GRATIS bersama kami.
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t-4 border-[var(--mk-ink)] py-8 sm:py-10 bg-[var(--mk-ink)] mt-auto text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shrink-0 bg-white">
                            <img src="/img/logo/logo.jpg" alt="Logo Kaizen" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p className="font-bold text-sm text-[var(--mk-yellow)] tracking-wider">KAIZEN COMPANY</p>
                            <p className="text-white/80 text-xs mt-1 font-medium">
                                Badan Usaha Milik PK IMM Kaizen UMSurabaya
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/"
                        className="mk-btn mk-btn--outline border-2 border-white text-white px-6 shadow-[4px_4px_0_var(--mk-yellow)] hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--mk-yellow)] text-xs font-bold mb-0"
                    >
                        Kembali ke Situs Utama <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>
            </footer>
        </div>
    )
}