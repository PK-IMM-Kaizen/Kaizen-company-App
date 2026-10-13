'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    ArrowLeft,
    Menu,
    X,
    Package,
    Globe,
    Cpu,
    ChevronRight,
    Check,
    ShoppingBag,
    Clock
} from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

const WHATSAPP_NUMBER = '6282322143305'

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
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [activeSection, setActiveSection] = useState('')

    const [products, setProducts] = useState<Product[]>([])
    const [isLoadingProducts, setIsLoadingProducts] = useState(true)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
    }, [isMenuOpen])

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) setIsMenuOpen(false)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

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

    const NAV_LINKS = [
        { href: '#hero', label: 'Pengenalan' },
        { href: '#produk', label: 'Produk' },
        { href: '#layanan', label: 'Layanan' },
    ]

    const scrollToSection = (href: string) => {
        setIsMenuOpen(false)
        const element = document.querySelector(href)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
            setActiveSection(href)
        }
    }

    const handleCheckoutWA = (product: Product) => {
        let message = `Halo Admin Kaizen Company,\n\nSaya berminat untuk memesan produk *${product.name}*.\n\nMohon informasi lebih lanjut mengenai stok, pemesanan, dan pembayarannya.`

        if (product.is_preorder) {
            message = `Halo Admin Kaizen Company,\n\nSaya berminat untuk memesan produk *${product.name}* melalui sistem Pre-Order (PO).\n\nMohon informasi lebih lanjut mengenai alur pemesanan dan pembayarannya.`
        }

        const encodedMessage = encodeURIComponent(message)
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank')
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#0A0A0A] font-sans selection:bg-[#C8102E] selection:text-white">
            <header className="sticky top-0 left-0 right-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#374151]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
                        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
                            <Link
                                href="/"
                                className="flex items-center gap-1.5 text-xs text-[#9CA3AF] hover:text-[#C8102E] transition-colors shrink-0 font-semibold"
                            >
                                <ArrowLeft className="w-4 h-4 text-[#C8102E]" />
                                <span className="hidden xs:inline sm:inline">IMM Kaizen</span>
                            </Link>

                            <div className="w-px h-5 bg-[#374151] hidden xs:block" />

                            <div onClick={() => scrollToSection('#hero')} className="flex items-center gap-2 sm:gap-2.5 cursor-pointer">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-[#374151] shrink-0 bg-[#111827]">
                                    <img src="/img/logo/logo.jpg" alt="Logo Kaizen" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex flex-col leading-none">
                                    <span className="text-white font-black text-xs sm:text-sm tracking-wide">KAIZEN</span>
                                    <span className="text-[#C8102E] text-[8px] sm:text-[9px] font-bold tracking-[0.2em] uppercase mt-0.5">Company</span>
                                </div>
                            </div>
                        </div>

                        <nav className="hidden lg:flex items-center gap-1.5 ml-auto">
                            {NAV_LINKS.map((link) => (
                                <button
                                    key={link.href}
                                    onClick={() => scrollToSection(link.href)}
                                    className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                                        activeSection === link.href
                                            ? 'text-white bg-[#1F2937] border border-[#374151]'
                                            : 'text-[#9CA3AF] hover:text-white hover:bg-[#111827]'
                                    }`}
                                >
                                    {link.label}
                                </button>
                            ))}
                            <a
                                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Halo Admin, saya ingin berdiskusi terkait kolaborasi bisnis dengan Kaizen Company.')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-3 bg-[#C8102E] hover:bg-[#B00E28] active:bg-[#9A0B22] text-white font-bold text-xs py-2 px-4 rounded-lg shadow-lg shadow-[#C8102E]/20 transition-all uppercase tracking-wider cursor-pointer whitespace-nowrap"
                            >
                                Kolaborasi
                            </a>
                        </nav>

                        <button
                            className="lg:hidden ml-auto p-2 text-[#9CA3AF] hover:text-white transition-colors cursor-pointer"
                            onClick={() => setIsMenuOpen(true)}
                            aria-label="Buka Menu Navigasi"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </header>

            <div
                className={`fixed inset-0 z-[100] lg:hidden transition-all duration-300 ${
                    isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
            >
                <div
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
                    onClick={() => setIsMenuOpen(false)}
                />

                <div
                    className={`absolute top-0 right-0 w-[280px] xs:w-[300px] sm:w-[340px] h-full bg-[#111827] border-l border-[#374151] p-5 sm:p-6 shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
                        isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                >
                    <div>
                        <div className="flex items-center justify-between pb-5 border-b border-[#374151]">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full overflow-hidden border border-[#374151] shrink-0 bg-[#0A0A0A]">
                                    <img src="/img/logo/logo.jpg" alt="Logo Kaizen" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex flex-col leading-none">
                                    <span className="text-white font-black text-sm tracking-wide">KAIZEN</span>
                                    <span className="text-[#C8102E] text-[9px] font-bold tracking-[0.2em] uppercase mt-0.5">Company</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="p-2 text-[#9CA3AF] hover:text-white rounded-lg hover:bg-[#1F2937] transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="py-6 flex flex-col gap-2">
                            {NAV_LINKS.map((link) => (
                                <button
                                    key={link.href}
                                    onClick={() => scrollToSection(link.href)}
                                    className={`text-left px-4 py-3 text-sm font-semibold rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                                        activeSection === link.href
                                            ? 'bg-[#C8102E] text-white shadow-lg shadow-[#C8102E]/20'
                                            : 'text-[#D1D5DB] hover:text-white hover:bg-[#1F2937]'
                                    }`}
                                >
                                    {link.label}
                                    <ChevronRight className="w-4 h-4 opacity-60" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-[#374151]">
                        <a
                            href={`https://wa.me/${WHATSAPP_NUMBER}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-3.5 bg-[#C8102E] hover:bg-[#B00E28] text-white font-bold text-xs rounded-xl shadow-lg shadow-[#C8102E]/20 transition-all uppercase tracking-wider flex items-center justify-center gap-2"
                        >
                            Hubungi via WhatsApp
                        </a>
                        <p className="text-center text-[10px] text-[#6B7280] mt-4 font-mono">
                            © PK IMM Kaizen UMSurabaya
                        </p>
                    </div>
                </div>
            </div>

            <main className="flex-1 bg-[#0A0A0A]">
                <section id="hero" className="relative pt-12 sm:pt-16 md:pt-20 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] sm:w-[500px] md:w-[600px] h-[300px] sm:h-[400px] bg-[#C8102E]/15 blur-[100px] sm:blur-[120px] rounded-full pointer-events-none -z-10" />

                    <div className="inline-block px-3 py-1 bg-[#111827] border border-[#374151] rounded-full text-[10px] sm:text-xs font-bold text-[#D97706] uppercase tracking-wider mb-6">
                        Unit Usaha Resmi Komisariat
                    </div>

                    <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight mb-6">
                        Kemandirian Ekonomi <br />
                        <span className="text-[#C8102E]">Organisasi & Kader</span>
                    </h1>

                    <p className="text-[#9CA3AF] max-w-2xl text-xs sm:text-sm md:text-base leading-relaxed mb-8 sm:mb-10 px-2">
                        Kaizen Company adalah lini bisnis yang dikelola secara profesional oleh kader IMM Kaizen untuk mendukung pendanaan mandiri komisariat serta menyediakan produk dan layanan teknologi berkualitas.
                    </p>
                </section>

                <hr className="border-[#374151]" />

                <section id="produk" className="py-12 sm:py-16 md:py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center sm:text-left mb-10 sm:mb-12">
                            <span className="text-[#C8102E] text-xs font-bold tracking-widest uppercase">Katalog</span>
                            <h2 className="mt-1 sm:mt-2 text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">Produk Official</h2>
                            <p className="mt-2 sm:mt-3 text-[#9CA3AF] max-w-xl text-xs sm:text-sm leading-relaxed">
                                Produk resmi yang dikurasi dan dikelola langsung oleh Kaizen Company untuk mendukung kebutuhan identitas dan kegiatan kader.
                            </p>
                        </div>

                        {isLoadingProducts ? (
                            <div className="flex justify-center items-center py-16 sm:py-20">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-12 sm:py-16 bg-[#111827] border border-dashed border-[#374151] rounded-2xl max-w-3xl mx-auto p-6">
                                <Package className="w-10 h-10 sm:w-12 sm:h-12 text-[#9CA3AF] mx-auto mb-3 opacity-50" />
                                <p className="text-[#9CA3AF] text-xs sm:text-sm">Belum ada produk yang ditampilkan saat ini.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
                                {products.map(p => (
                                    <div key={p.id} className="group rounded-2xl bg-[#111827] border border-[#374151] overflow-hidden hover:border-[#C8102E]/60 transition-all shadow-xl flex flex-col justify-between">
                                        <div>
                                            <div className="aspect-[16/10] sm:aspect-[16/11] bg-[#1F2937] overflow-hidden relative">
                                                <img
                                                    src={p.image || '/img/profile/imm.jpeg'}
                                                    alt={p.name}
                                                    className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                                />
                                                {p.is_preorder && (
                                                    <div className="absolute top-3 right-3 bg-orange-600 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
                                                        <Clock className="w-3 h-3" /> Pre-Order
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-5 sm:p-6">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-[10px] sm:text-[11px] text-[#D97706] font-bold uppercase tracking-wider">{p.category}</span>
                                                    <span className="text-[10px] text-[#9CA3AF] bg-[#1F2937] border border-[#374151] px-2 py-0.5 rounded-md font-mono">Official</span>
                                                </div>

                                                <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 mb-3">
                                                    <h3 className="font-bold text-lg sm:text-xl text-white group-hover:text-[#C8102E] transition-colors leading-tight">{p.name}</h3>
                                                    <span className="font-black text-sm sm:text-base text-white whitespace-nowrap bg-[#1F2937] px-2.5 py-1 rounded-lg border border-[#374151] w-fit">
                                                        Rp {p.price.toLocaleString('id-ID')}
                                                    </span>
                                                </div>

                                                {p.is_preorder && p.po_duration && (
                                                    <div className="mb-3 border border-orange-500/30 bg-orange-500/10 rounded-lg p-2.5">
                                                        <p className="text-[11px] text-orange-400 font-medium">Estimasi PO: <strong>{p.po_duration}</strong></p>
                                                        {p.dp_amount && p.dp_amount > 0 && (
                                                            <p className="text-[11px] text-orange-400 font-medium mt-0.5">Min. DP: <strong>Rp {p.dp_amount.toLocaleString('id-ID')}</strong></p>
                                                        )}
                                                    </div>
                                                )}

                                                <p className="text-xs text-[#9CA3AF] leading-relaxed mb-4 whitespace-pre-line line-clamp-3">
                                                    {p.description}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="px-5 sm:px-6 pb-5 sm:pb-6 mt-auto">
                                            <button
                                                onClick={() => handleCheckoutWA(p)}
                                                className="w-full bg-[#1F2937] border border-[#374151] text-white text-xs font-bold py-3 sm:py-3.5 rounded-xl hover:bg-[#C8102E] hover:border-[#C8102E] transition-all uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                                            >
                                                <ShoppingBag className="w-4 h-4 text-[#C8102E] group-hover:text-white transition-colors" /> Pesan via WhatsApp
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-12 sm:mt-16 text-center p-6 sm:p-8 md:p-10 rounded-2xl border border-dashed border-[#374151] bg-[#111827] max-w-4xl mx-auto">
                            <div className="flex justify-center mb-3 sm:mb-4">
                                <Package className="w-8 h-8 sm:w-10 sm:h-10 text-[#D97706]" />
                            </div>
                            <h3 className="text-white font-bold text-base sm:text-lg mb-2">Ingin produkmu masuk katalog?</h3>
                            <p className="text-[#9CA3AF] text-xs sm:text-sm mb-5 max-w-lg mx-auto">Kader IMM Kaizen dapat mengajukan karya atau produknya untuk dikurasi dan dipasarkan bersama.</p>
                            <a
                                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Halo Admin, saya ingin mengajukan produk saya untuk masuk katalog Kaizen Company.')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-[#D97706] text-xs font-bold hover:underline uppercase tracking-wider cursor-pointer"
                            >
                                Hubungi Tim Kaizen <ChevronRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </section>

                <hr className="border-[#374151]" />

                <section id="layanan" className="py-12 sm:py-16 md:py-20 mb-8 sm:mb-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-10 sm:mb-12">
                            <span className="text-[#C8102E] text-xs font-bold tracking-widest uppercase">Jasa & Solusi Teknis</span>
                            <h2 className="mt-1 sm:mt-2 text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">Layanan Unggulan</h2>
                            <p className="mt-2 sm:mt-3 text-[#9CA3AF] max-w-xl mx-auto text-xs sm:text-sm leading-relaxed px-2">
                                Solusi digital dan rekayasa teknologi profesional dari talenta programmer, desainer, dan hardware engineer dari Fakultas Teknik UMSurabaya.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
                            <div className="bg-[#111827] border border-[#374151] hover:border-[#C8102E]/60 rounded-2xl sm:rounded-3xl p-6 sm:p-8 relative overflow-hidden transition-all shadow-2xl flex flex-col justify-between group">
                                <div className="absolute -top-20 -right-20 w-40 sm:w-48 h-40 sm:h-48 bg-[#C8102E]/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-[#C8102E]/20 transition-colors" />

                                <div className="relative z-10">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#1F2937] text-[#C8102E] rounded-2xl flex items-center justify-center border border-[#374151] mb-5 sm:mb-6">
                                        <Globe className="w-6 h-6 sm:w-7 sm:h-7" />
                                    </div>

                                    <div className="inline-block px-3 py-1 bg-[#1F2937] text-[#D97706] text-[10px] font-bold uppercase tracking-wider rounded-full mb-3 border border-[#374151]">
                                        Web & Software
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">Pengembangan Website</h3>
                                    <p className="text-[#9CA3AF] text-xs leading-relaxed mb-6">
                                        Jasa pembuatan website modern, cepat, dan responsif. Solusi tepat untuk <strong>Landing Page Event</strong>, <strong>Website Profil Organisasi</strong>, <strong>Portofolio Digital</strong>, hingga Sistem Informasi Sederhana dengan arsitektur modern.
                                    </p>

                                    <div className="mb-6 sm:mb-8">
                                        <p className="text-[10px] text-[#6B7280] font-bold uppercase tracking-widest mb-2.5">Termasuk Deliverables:</p>
                                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                            {['Custom UI/UX Design', 'Responsive Mobile', 'SEO Optimization', 'Setup Domain & Hosting'].map((item) => (
                                                <span key={item} className="text-[10px] sm:text-[11px] text-[#E5E7EB] bg-[#1F2937] border border-[#374151] px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                                                    <Check className="w-3 h-3 text-[#D97706]" /> {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <a
                                    href={`https://wa.me/6289601261250?text=${encodeURIComponent('Halo Admin Kaizen Company, saya tertarik untuk berkonsultasi mengenai pembuatan Website.')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex justify-center items-center gap-2 py-3 sm:py-3.5 px-6 text-xs font-bold tracking-widest uppercase bg-[#C8102E] hover:bg-[#B00E28] text-white rounded-xl shadow-lg shadow-[#C8102E]/20 transition-all w-full text-center cursor-pointer"
                                >
                                    Konsultasi Web
                                </a>
                            </div>

                            <div className="bg-[#111827] border border-[#374151] hover:border-[#C8102E]/60 rounded-2xl sm:rounded-3xl p-6 sm:p-8 relative overflow-hidden transition-all shadow-2xl flex flex-col justify-between group">
                                <div className="absolute -top-20 -right-20 w-40 sm:w-48 h-40 sm:h-48 bg-[#D97706]/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-[#D97706]/20 transition-colors" />

                                <div className="relative z-10">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#1F2937] text-[#D97706] rounded-2xl flex items-center justify-center border border-[#374151] mb-5 sm:mb-6">
                                        <Cpu className="w-6 h-6 sm:w-7 sm:h-7" />
                                    </div>

                                    <div className="inline-block px-3 py-1 bg-[#1F2937] text-[#D97706] text-[10px] font-bold uppercase tracking-wider rounded-full mb-3 border border-[#374151]">
                                        Hardware & Automation
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">Sistem IoT & Otomasi</h3>
                                    <p className="text-[#9CA3AF] text-xs leading-relaxed mb-6">
                                        Layanan perancangan prototipe Internet of Things (IoT), sistem kontrol sensor, otomatisasi berbasis mikroprosesor, hingga integrasi dashboard pemantauan data secara realtime.
                                    </p>

                                    <div className="mb-6 sm:mb-8">
                                        <p className="text-[10px] text-[#6B7280] font-bold uppercase tracking-widest mb-2.5">Termasuk Deliverables:</p>
                                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                            {['Skema & Wiring Hardware', 'Firmware & Coding', 'Realtime Web Dashboard', 'Panduan Penggunaan'].map((item) => (
                                                <span key={item} className="text-[10px] sm:text-[11px] text-[#E5E7EB] bg-[#1F2937] border border-[#374151] px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                                                    <Check className="w-3 h-3 text-[#D97706]" /> {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <a
                                    href={`https://wa.me/6289601261250?text=${encodeURIComponent('Halo Admin Kaizen Company, saya tertarik untuk berkonsultasi mengenai proyek IoT / Otomasi.')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex justify-center items-center gap-2 py-3 sm:py-3.5 px-6 text-xs font-bold tracking-widest uppercase bg-[#1F2937] hover:bg-[#374151] border border-[#374151] text-white rounded-xl transition-all w-full text-center cursor-pointer"
                                >
                                    Konsultasi IoT
                                </a>
                            </div>

                        </div>

                        <div className="mt-10 sm:mt-12 text-center px-4">
                            <p className="text-[#6B7280] text-xs sm:text-sm">
                                Butuh integrasi sistem atau proyek custom?{' '}
                                <a
                                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Halo Admin Kaizen Company, saya berminat untuk mendiskusikan proyek custom.')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#D97706] hover:underline font-semibold cursor-pointer block sm:inline mt-1 sm:mt-0"
                                >
                                    Mari diskusikan kebutuhan Anda bersama kami.
                                </a>
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t border-[#374151] py-6 sm:py-8 font-sans mt-auto bg-[#030712]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden border border-[#374151] shrink-0 bg-[#111827]">
                            <img src="/img/logo/logo.jpg" alt="Logo Kaizen" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[#6B7280] text-[11px] sm:text-xs">
                            Kaizen Company — Badan Usaha Milik PK IMM Kaizen UMSurabaya
                        </span>
                    </div>

                    <Link
                        href="/"
                        className="text-xs text-[#6B7280] hover:text-white transition-colors inline-flex items-center gap-1 font-semibold"
                    >
                        Kembali ke Situs Utama <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </footer>
        </div>
    )
}