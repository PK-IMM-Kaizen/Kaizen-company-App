import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://www.imm-kaizen.org'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/dashboard/', '/api/', '/_next/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}