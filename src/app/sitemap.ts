import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.imm-kaizen.org'

    const staticRoutes = [
        '',
        '/profil',
        '/berita',
        '/ekowir',
        '/kepengurusan',
        '/alumni',
        '/kaizen-company',
        '/daftar-dad',
        '/aspirasi',
    ]

    return staticRoutes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1.0 : 0.8,
    }))
}