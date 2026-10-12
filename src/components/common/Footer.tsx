'use client'

import Link from 'next/link'
import Logo from './Logo'
import { FaInstagram, FaWhatsapp, FaEnvelope } from 'react-icons/fa'

export default function Footer() {
    return (
        <footer className="bg-[#0a0a0a] text-white relative overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-[#CC1021] via-[#E07B1A] to-[#F5C400]" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-20">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16">
                    <div className="md:col-span-6 lg:col-span-5">
                        <Logo variant="white" size="md" />
                        <p className="mt-6 text-sm leading-relaxed text-gray-400 max-w-sm"
                           style={{ fontFamily: 'Inter, sans-serif' }}>
                            Ikatan Mahasiswa Muhammadiyah Pimpinan Komisariat Kaizen Universitas Muhammadiyah Surabaya. Bergerak, Berprestasi, Berkontribusi membangun peradaban.
                        </p>

                        <div className="flex items-center gap-4 mt-8">
                            <a href="#" aria-label="Instagram"
                               className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 transition-all duration-300 hover:bg-[#CC1021] hover:text-white hover:-translate-y-1">
                                <FaInstagram size={18} />
                            </a>
                            <a href="#" aria-label="WhatsApp"
                               className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 transition-all duration-300 hover:bg-[#25D366] hover:text-white hover:-translate-y-1">
                                <FaWhatsapp size={18} />
                            </a>
                            <a href="#" aria-label="Email"
                               className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 transition-all duration-300 hover:bg-[#E07B1A] hover:text-white hover:-translate-y-1">
                                <FaEnvelope size={18} />
                            </a>
                        </div>
                    </div>

                    <div className="hidden lg:block lg:col-span-1"></div>

                    <div className="md:col-span-3 lg:col-span-3">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-6"
                            style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            Navigasi
                        </h4>
                        <ul className="space-y-4">
                            {[
                                { label: 'Beranda', path: '/' },
                                { label: 'Profil Organisasi', path: '/profil' },
                                { label: 'Kepengurusan', path: '/kepengurusan' },
                                { label: 'Profil Bidang', path: '/bidang' },
                            ].map(item => (
                                <li key={item.path}>
                                    <Link
                                        href={item.path}
                                        className="text-sm text-gray-400 transition-colors hover:text-[#E07B1A] flex items-center gap-2 group"
                                        style={{ fontFamily: 'Inter, sans-serif' }}
                                    >
                                        <span className="w-0 h-[1px] bg-[#E07B1A] transition-all group-hover:w-3"></span>
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-3 lg:col-span-3">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-6"
                            style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            Eksplorasi
                        </h4>
                        <ul className="space-y-4">
                            {[
                                { label: 'Berita & Dokumentasi', path: '/berita' },
                                { label: 'Produk Ekowir', path: '/ekowir' },
                                { label: 'Page Inspiratif', path: '/alumni' },
                                { label: 'Hubungi Kami', path: '/kontak' },
                            ].map(item => (
                                <li key={item.path}>
                                    <Link
                                        href={item.path}
                                        className="text-sm text-gray-400 transition-colors hover:text-[#E07B1A] flex items-center gap-2 group"
                                        style={{ fontFamily: 'Inter, sans-serif' }}
                                    >
                                        <span className="w-0 h-[1px] bg-[#E07B1A] transition-all group-hover:w-3"></span>
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                        © {new Date().getFullYear()} Pimpinan Komisariat IMM Kaizen UMSURA. Hak cipta dilindungi.
                    </p>
                    <p className="text-xs font-semibold tracking-wider text-gray-600 uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        Kaizen App V1
                    </p>
                </div>
            </div>
        </footer>
    )
}