import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Kaizen Company — IMM Kaizen UMSurabaya',
    description: 'Badan Usaha Milik Komisariat PK IMM Kaizen Universitas Muhammadiyah Surabaya.',
}

export default function KaizenCompanyLayout({
                                                children,
                                            }: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex flex-col bg-[#0A0A0A] text-white font-sans scroll-smooth selection:bg-[#C8102E] selection:text-white">
            {children}
        </div>
    )
}