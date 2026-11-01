import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    metadataBase: new URL('https://www.imm-kaizen.org'),

    title: {
        template: '%s | IMM Komisariat Kaizen',
        default: 'Website Resmi PK IMM Kaizen - Fakultas Teknik UMSURA',
    },
    description: 'Pusat Informasi dan Media PK IMM Kaizen. Website resmi Ikatan Mahasiswa Muhammadiyah (IMM) Komisariat Kaizen Fakultas Teknik Universitas Muhammadiyah Surabaya.',
    verification: {
        google: 'dBYMVkOGaSpCQ4wfo-bOkVOFVNJNAAYXq2HPpECeSis',
    },
    keywords: ['IMM', 'Muhammadiyah', 'Mahasiswa Teknik', 'UMSURA', 'IMM Kaizen', 'Organisasi Mahasiswa', 'PK IMM Kaizen'],
    icons: {
        icon: '/img/logo/logo.png',
        apple: '/img/logo/logo.png',
    },
    openGraph: {
        title: 'Website Resmi PK IMM Kaizen',
        description: 'Pusat Informasi dan Media PK IMM Kaizen Fakultas Teknik UMSURA.',
        url: 'https://www.imm-kaizen.org',
        siteName: 'IMM Kaizen',
        images: [
            {
                url: '/img/logo/logo.png',
                width: 1200,
                height: 630,
                alt: 'Logo PK IMM Kaizen',
            },
        ],
        locale: 'id_ID',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Website Resmi PK IMM Kaizen',
        description: 'Pusat Informasi dan Media PK IMM Kaizen Fakultas Teknik UMSURA.',
        images: ['/img/logo/logo.png'],
    },
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="id" data-scroll-behavior="smooth">
        <body>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    "name": "IMM Kaizen",
                    "alternateName": ["PK IMM Kaizen", "IMM Komisariat Kaizen"],
                    "url": "https://www.imm-kaizen.org/"
                }),
            }}
        />
        {children}
        </body>
        </html>
    )
}