'use client'

import { useState, useEffect } from 'react'
import {
    Mail,
    MapPin,
    Clock,
    ExternalLink
} from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

const InstagramIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
)

const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
)

export default function ContactPage() {
    const [profile, setProfile] = useState<any>(null)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        async function fetchContactData() {
            const { data } = await supabase
                .from('organization_profile')
                .select('*')
                .eq('id', 1)
                .single()

            if (data) setProfile(data)
        }
        fetchContactData()
    }, [supabase])

    const instagramHandle = profile?.instagram || '@imm_kaizen'
    const whatsappHandle = profile?.whatsapp || '+62 812-3456-7890'
    const emailHandle = profile?.email || 'pkimmkaizen.0@gmail.com'
    const addressText = profile?.address || 'Kompleks Gedung PKM Lt. 1, Fakultas Teknik, Universitas Muhammadiyah Surabaya. Jl. Sutorejo No. 59, Mulyorejo, Surabaya, Jawa Timur 60113.'

    const kontakChannels = [
        {
            icon: <InstagramIcon className="w-5 h-5 text-[#E1306C]" />,
            platform: 'Instagram',
            handle: instagramHandle,
            desc: 'Ikuti kami untuk update kegiatan & dokumentasi terbaru',
            link: `https://www.instagram.com/${instagramHandle.replace('@', '')}`,
        },
        {
            icon: <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />,
            platform: 'WhatsApp',
            handle: whatsappHandle,
            desc: 'Hubungi BPH & Pengurus aktif melalui layanan WhatsApp',
            link: `https://wa.me/${whatsappHandle.replace(/[^0-9]/g, '')}`,
        },
        {
            icon: <Mail className="w-5 h-5 text-[var(--primary)]" />,
            platform: 'Email Resmi',
            handle: emailHandle,
            desc: 'Kirimkan korespondensi, undangan, atau surat resmi',
            link: `mailto:${emailHandle}`,
        },
    ]

    return (
        <div className="bg-[var(--background)] min-h-screen font-sans selection:bg-[var(--primary)] selection:text-white">

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
                            Hubungi Kami
                        </span>
                    </div>
                    <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight font-display">
                        Kontak Resmi
                    </h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-start">

                    <div className="lg:col-span-7 space-y-6">
                        <div>
                            <span className="text-[10px] sm:text-xs font-bold text-[var(--primary)] tracking-[0.2em] uppercase mb-1.5 block font-display">
                                Kanal Komunikasi
                            </span>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[var(--text-primary)] mb-6 sm:mb-8 font-display tracking-tight">
                                Kami Siap Terhubung dengan Anda
                            </h2>
                        </div>

                        <div className="space-y-3.5 sm:space-y-4">
                            {kontakChannels.map((item) => (
                                <a
                                    key={item.platform}
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-start gap-3.5 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)]/60 transition-all duration-300 shadow-sm hover:shadow-md"
                                >
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                        {item.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <h3 className="font-bold text-xs sm:text-sm text-[var(--text-primary)] font-display group-hover:text-[var(--primary)] transition-colors">
                                                {item.platform}
                                            </h3>
                                        </div>
                                        <p className="text-xs sm:text-sm font-bold text-[var(--text-primary)] font-display mb-1 truncate">
                                            {item.handle}
                                        </p>
                                        <p className="text-[11px] sm:text-xs text-[var(--text-muted)] leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--primary)] transition-colors mt-1 shrink-0" />
                                </a>
                            ))}
                        </div>

                        <div className="p-4 sm:p-5 rounded-xl bg-[#FFF8E7] dark:bg-amber-950/20 border border-[#F0E4B0] dark:border-amber-800/30 text-[#7A5C00] dark:text-amber-300 text-xs leading-relaxed">
                            <strong>Catatan:</strong> Informasi nomor kontak WhatsApp, Instagram, dan Email diperbarui secara berkala sesuai periode kepengurusan yang aktif.
                        </div>
                    </div>

                    <div className="lg:col-span-5 space-y-6 pt-4 lg:pt-0">
                        <div>
                            <span className="text-[10px] sm:text-xs font-bold text-[var(--primary)] tracking-[0.2em] uppercase mb-1.5 block font-display">
                                Lokasi Sekretariat
                            </span>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[var(--text-primary)] mb-6 sm:mb-8 font-display tracking-tight">
                                Alamat Organisasi
                            </h2>
                        </div>

                        <div className="relative rounded-2xl overflow-hidden border border-[var(--border)] shadow-sm bg-[var(--surface-2)] aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3]">
                            <iframe
                                title="Lokasi Universitas Muhammadiyah Surabaya"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.9405628549337!2d112.79326467588079!3d-7.24759907118939!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7f9ed5d0a68d7%3A0xb35a0937a03fb7a7!2sUniversitas%20Muhammadiyah%20Surabaya!5e0!3m2!1sid!2sid!4v1710000000000!5m2!1sid!2sid"
                                className="w-full h-full border-0 grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>

                        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-4 shadow-sm">
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-[var(--primary)] shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-bold text-xs sm:text-sm text-[var(--text-primary)] font-display mb-1">
                                        Sekretariat {profile?.short_name || 'PK IMM Kaizen'}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                                        {addressText}
                                    </p>
                                </div>
                            </div>

                            <div className="border-t border-[var(--border)] pt-3.5 flex items-center gap-3">
                                <Clock className="w-5 h-5 text-[var(--accent)] shrink-0" />
                                <div>
                                    <h4 className="font-bold text-[10px] sm:text-xs text-[var(--text-primary)] font-display uppercase tracking-wider">
                                        Jam Layanan Kontak
                                    </h4>
                                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                                        Senin – Jumat, 09.00 – 17.00 WIB
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}