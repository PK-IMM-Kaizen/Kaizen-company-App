import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://immkaizen.com'

    const routes = [
        '',
        '/profil',
        '/berita',
        '/ekowir',
        '/kepengurusan',
        '/alumni',
        '/kaizen-company',
        '/daftar-dad',
        'aspirasi',
    ]

    return routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1.0 : 0.8,
    }))
}