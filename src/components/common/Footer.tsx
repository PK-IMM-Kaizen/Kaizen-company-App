'use client'

import Logo from './Logo'
import { type Page } from '../../app/(public)/data'

interface FooterProps {
    onNavigate: (page: Page) => void
}

export default function Footer({ onNavigate }: FooterProps) {
    const nav = (page: Page) => {
        onNavigate(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <footer style={{ background: '#111111', color: '#fff' }}>
            {/* Red top accent */}
            <div style={{ height: '3px', background: 'linear-gradient(90deg, #CC1021 0%, #E07B1A 60%, #F5C400 100%)' }} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <Logo variant="white" size="md" />
                        <p className="mt-4 text-sm leading-relaxed" style={{ color: '#aaa', maxWidth: '320px' }}>
                            Ikatan Mahasiswa Muhammadiyah Komisariat Kaizen — Bergerak, Berprestasi, Berkontribusi.
                        </p>
                        <div className="flex items-center gap-3 mt-5">
                            <a href="#" aria-label="Instagram"
                               className="w-8 h-8 rounded flex items-center justify-center text-sm transition-colors"
                               style={{ background: '#222', color: '#ccc' }}>IG</a>
                            <a href="#" aria-label="WhatsApp"
                               className="w-8 h-8 rounded flex items-center justify-center text-sm transition-colors"
                               style={{ background: '#222', color: '#ccc' }}>WA</a>
                            <a href="#" aria-label="Email"
                               className="w-8 h-8 rounded flex items-center justify-center text-sm transition-colors"
                               style={{ background: '#222', color: '#ccc' }}>✉</a>
                        </div>
                    </div>

                    {/* Quick links */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#E07B1A', fontFamily: 'Montserrat, sans-serif' }}>
                            Navigasi
                        </h4>
                        <ul className="space-y-2">
                            {[
                                { label: 'Beranda', page: 'home' as Page },
                                { label: 'Profil Organisasi', page: 'profile' as Page },
                                { label: 'Kepengurusan', page: 'management' as Page },
                                { label: 'Profil Bidang', page: 'division' as Page },
                            ].map(item => (
                                <li key={item.page}>
                                    <button
                                        onClick={() => nav(item.page)}
                                        className="text-sm transition-colors hover:text-white"
                                        style={{ color: '#888', fontFamily: 'Inter, sans-serif' }}
                                    >
                                        {item.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#E07B1A', fontFamily: 'Montserrat, sans-serif' }}>
                            Konten
                        </h4>
                        <ul className="space-y-2">
                            {[
                                { label: 'Berita & Dokumentasi', page: 'news' as Page },
                                { label: 'Produk Ekowir', page: 'ekowir' as Page },
                                { label: 'Alumni Inspiratif', page: 'alumni' as Page },
                                { label: 'Kontak', page: 'contact' as Page },
                            ].map(item => (
                                <li key={item.page}>
                                    <button
                                        onClick={() => nav(item.page)}
                                        className="text-sm transition-colors hover:text-white"
                                        style={{ color: '#888', fontFamily: 'Inter, sans-serif' }}
                                    >
                                        {item.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderColor: '#222' }}>
                    <p className="text-xs" style={{ color: '#555', fontFamily: 'Inter, sans-serif' }}>
                        © 2024 IMM Komisariat Kaizen. Hak cipta dilindungi.
                    </p>
                    <p className="text-xs" style={{ color: '#555', fontFamily: 'Inter, sans-serif' }}>
                        Kaizen Company V1
                    </p>
                </div>
            </div>
        </footer>
    )
}
