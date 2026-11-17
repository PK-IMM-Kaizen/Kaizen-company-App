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
    const emailHandle = profile?.email || 'pkimmkaizen.0@gmail.com'
    const addressText = profile?.address || 'Kompleks Gedung PKM Lt. 1, Fakultas Teknik, Universitas Muhammadiyah Surabaya. Jl. Sutorejo No. 59, Mulyorejo, Surabaya, Jawa Timur 60113.'

    const whatsappHandle = '+62 896-0126-1250'

    const kontakChannels = [
        {
            icon: <InstagramIcon className="w-6 h-6 text-white" />,
            bgColor: 'bg-[#E1306C]', // Instagram Pink
            platform: 'Instagram',
            handle: instagramHandle,
            desc: 'Ikuti kami untuk update kegiatan & dokumentasi terbaru',
            link: `https://www.instagram.com/${instagramHandle.replace('@', '')}`,
        },
        {
            icon: <WhatsAppIcon className="w-6 h-6 text-white" />,
            bgColor: 'bg-[#25D366]',
            platform: 'WhatsApp',
            handle: whatsappHandle,
            desc: 'Hubungi BPH & Pengurus aktif melalui layanan WhatsApp',
            link: `https://wa.me/${whatsappHandle.replace(/[^0-9]/g, '')}`,
        },
        {
            icon: <Mail className="w-6 h-6 text-white" />,
            bgColor: 'bg-[var(--mk-orange)]',
            platform: 'Email Resmi',
            handle: emailHandle,
            desc: 'Kirimkan korespondensi, undangan, atau surat resmi',
            link: `mailto:${emailHandle}`,
        },
    ]

    return (
        <div className="w-full mk-dark mk-bg-dark min-h-screen selection:bg-[var(--mk-yellow)] selection:text-[var(--mk-maroon-deep)] font-sans pb-24 relative overflow-x-hidden">
            <div className="bg-[var(--mk-maroon-deep)] mk-curve-bottom relative pt-28 pb-20 md:pb-24 overflow-hidden z-10 border-b-4 border-[var(--mk-yellow)]">
                <div className="mk-decor pointer-events-none">
                    <div className="mk-halftone mk-halftone--bl opacity-20"></div>
                    <div className="mk-star mk-star--lg mk-star--spin -right-8 top-10 opacity-30"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
                    <div className="flex items-center justify-center gap-3 mb-5 md:mb-6 w-full">
                        <div className="w-6 sm:w-10 h-[2px] bg-[var(--mk-orange)] hidden xs:block"></div>
                        <span className="mk-chip bg-[var(--mk-yellow)] text-[var(--mk-ink)] shadow-none text-[10px] sm:text-xs md:text-sm font-black px-3 py-1.5 uppercase whitespace-nowrap">
                            Hubungi Kami
                        </span>
                        <div className="w-6 sm:w-10 h-[2px] bg-[var(--mk-orange)] hidden xs:block"></div>
                    </div>

                    <h1 className="mk-sticker-gradient text-[var(--mk-maroon)] text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] xl:text-[5.5rem] tracking-tight relative flex justify-center w-full px-2 sm:px-4">
                        <span aria-hidden="true" className="mk-sticker-stroke absolute text-transparent text-center leading-tight">Kontak Resmi</span>
                        <span className="mk-sticker-fill relative text-center leading-tight">Kontak Resmi</span>
                    </h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative z-0">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-16 items-start">
                    <div className="lg:col-span-7 space-y-6 sm:space-y-8">
                        <div>
                            <span className="text-[10px] sm:text-xs font-black text-[var(--mk-yellow)] tracking-widest uppercase mb-2 block font-display">
                                Kanal Komunikasi
                            </span>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-display tracking-tight uppercase">
                                Terhubung Dengan Kami
                            </h2>
                        </div>

                        <div className="space-y-4 sm:space-y-5">
                            {kontakChannels.map((item) => (
                                <a
                                    key={item.platform}
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 sm:p-6 bg-white border-2 border-[var(--mk-ink)] shadow-[4px_4px_0_var(--mk-ink)] hover:shadow-[6px_6px_0_var(--mk-yellow)] hover:-translate-y-1 hover:-translate-x-1 transition-all duration-300 rounded-2xl w-full"
                                >
                                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl ${item.bgColor} border-2 border-[var(--mk-ink)] shadow-[3px_3px_0_var(--mk-ink)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                                        {item.icon}
                                    </div>
                                    <div className="flex-1 min-w-0 w-full">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <h3 className="font-black text-sm sm:text-base text-[var(--mk-ink)] font-display uppercase tracking-wider group-hover:text-[var(--mk-orange)] transition-colors">
                                                {item.platform}
                                            </h3>
                                            <ExternalLink className="w-4 h-4 text-[var(--mk-ink)] opacity-40 group-hover:opacity-100 group-hover:text-[var(--mk-orange)] transition-all shrink-0" />
                                        </div>
                                        <p className="text-sm sm:text-base font-bold text-[var(--mk-ink)] font-sans mb-2 truncate bg-[var(--mk-cream)] px-2 py-0.5 inline-block border border-[var(--mk-ink)] rounded-md">
                                            {item.handle}
                                        </p>
                                        <p className="text-xs sm:text-sm text-[var(--mk-ink)]/70 font-medium leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                </a>
                            ))}
                        </div>

                        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--mk-yellow)] border-2 border-[var(--mk-ink)] shadow-[4px_4px_0_var(--mk-ink)] flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-white border-2 border-[var(--mk-ink)] flex items-center justify-center shrink-0 font-black text-[var(--mk-ink)] font-display text-sm">
                                !
                            </div>
                            <p className="text-[var(--mk-ink)] text-xs sm:text-sm font-medium leading-relaxed">
                                <strong className="font-black">Catatan:</strong> Informasi nomor kontak WhatsApp, Instagram, dan Email diperbarui secara berkala sesuai dengan periode kepengurusan aktif IMM Kaizen.
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-5 space-y-6 sm:space-y-8 lg:pt-0 pt-6">
                        <div>
                            <span className="text-[10px] sm:text-xs font-black text-[var(--mk-yellow)] tracking-widest uppercase mb-2 block font-display">
                                Lokasi Sekretariat
                            </span>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-display tracking-tight uppercase">
                                Alamat Organisasi
                            </h2>
                        </div>

                        <div className="relative rounded-2xl overflow-hidden border-2 border-[var(--mk-ink)] shadow-[6px_6px_0_var(--mk-yellow)] aspect-[4/3] bg-[var(--mk-ink)] group">
                            <iframe
                                title="Lokasi Universitas Muhammadiyah Surabaya"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.9405628549337!2d112.79326467588079!3d-7.24759907118939!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7f9ed5d0a68d7%3A0xb35a0937a03fb7a7!2sUniversitas%20Muhammadiyah%20Surabaya!5e0!3m2!1sid!2sid!4v1710000000000!5m2!1sid!2sid"
                                className="w-full h-full border-0 grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100 transition-all duration-700"
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                            <div className="absolute top-3 right-3 bg-[var(--mk-yellow)] text-[var(--mk-ink)] border-2 border-[var(--mk-ink)] px-3 py-1 rounded-lg text-xs font-black uppercase font-display shadow-[2px_2px_0_var(--mk-ink)] pointer-events-none">
                                Map
                            </div>
                        </div>

                        <div className="p-5 sm:p-6 md:p-8 rounded-2xl bg-white border-2 border-[var(--mk-ink)] shadow-[6px_6px_0_var(--mk-ink)] space-y-5">
                            <div className="flex flex-col xs:flex-row items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-[var(--mk-cream)] border-2 border-[var(--mk-ink)] flex items-center justify-center shrink-0">
                                    <MapPin className="w-5 h-5 text-[var(--mk-orange)]" />
                                </div>
                                <div>
                                    <h3 className="font-black text-sm sm:text-base text-[var(--mk-ink)] font-display uppercase tracking-wider mb-2">
                                        Sekretariat {profile?.short_name || 'PK IMM Kaizen'}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-[var(--mk-ink)]/80 font-medium leading-relaxed">
                                        {addressText}
                                    </p>
                                </div>
                            </div>

                            <div className="border-t-2 border-dashed border-[var(--mk-ink)]/20 pt-5 flex flex-col xs:flex-row items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-[var(--mk-cream)] border-2 border-[var(--mk-ink)] flex items-center justify-center shrink-0">
                                    <Clock className="w-5 h-5 text-[var(--mk-orange)]" />
                                </div>
                                <div>
                                    <h4 className="font-black text-xs sm:text-sm text-[var(--mk-ink)] font-display uppercase tracking-wider mb-1.5">
                                        Jam Layanan Kontak
                                    </h4>
                                    <span className="inline-block bg-[var(--mk-maroon)] text-white text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-md border border-[var(--mk-ink)]">
                                        Senin – Jumat, 09.00 – 17.00 WIB
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}