'use client'

import { newsData, products, managementData, alumniData, type Role } from '../../(public)/data'

interface OverviewProps { role: Role }

export default function Overview({ role }: OverviewProps) {
    const publishedNews = newsData.filter(n => n.status === 'published').length
    const draftNews = newsData.filter(n => n.status === 'draft').length
    const availableProducts = products.filter(p => p.available).length

    const stats = [
        { label: 'Berita Terbit', value: publishedNews, color: '#C8102E', icon: '📰' },
        { label: 'Draft Berita', value: draftNews, color: '#D4A017', icon: '✏️' },
        { label: 'Produk Aktif', value: availableProducts, color: '#2D7D46', icon: '🛍' },
        { label: 'Pengurus Aktif', value: managementData.length, color: '#1A6FA8', icon: '👥' },
        { label: 'Alumni Terdaftar', value: alumniData.length, color: '#6B46C1', icon: '🎓' },
        { label: 'Total Produk', value: products.length, color: '#555', icon: '📦' },
    ]

    const recentNews = newsData.slice(0, 5)

    return (
        <div className="space-y-6">
            <div className="rounded p-5" style={{ background: '#C8102E', backgroundImage: 'linear-gradient(135deg, #C8102E, #9B0D22)' }}>
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Montserrat, sans-serif' }}>
                            Selamat Datang
                        </p>
                        <h2 className="text-lg font-black text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            Panel Admin IMM Kaizen
                        </h2>
                        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
                            Kaizen Company V1 — {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {stats.map(s => (
                    <div key={s.label} className="bg-white rounded p-4" style={{ border: '1px solid #E0DEDC' }}>
                        <div className="flex items-start justify-between mb-2">
                            <span className="text-lg">{s.icon}</span>
                            <span className="text-2xl font-black" style={{ color: s.color, fontFamily: 'Montserrat, sans-serif' }}>{s.value}</span>
                        </div>
                        <p className="text-xs font-semibold" style={{ color: '#888', fontFamily: 'Montserrat, sans-serif' }}>{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded" style={{ border: '1px solid #E0DEDC' }}>
                <div className="px-5 py-4 border-b" style={{ borderColor: '#E0DEDC' }}>
                    <h3 className="font-black text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>Berita Terkini</h3>
                </div>
                <table className="admin-table">
                    <thead>
                    <tr>
                        <th>Judul</th>
                        <th>Kategori</th>
                        <th>Tanggal</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {recentNews.map(n => (
                        <tr key={n.id}>
                            <td>
                                <p className="font-semibold text-xs line-clamp-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{n.title}</p>
                            </td>
                            <td>
                                <span className="text-xs" style={{ color: '#C8102E', fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>{n.category}</span>
                            </td>
                            <td className="text-xs" style={{ color: '#888' }}>{n.publishDate}</td>
                            <td>
                  <span className={n.status === 'published' ? 'badge-published' : 'badge-draft'}>
                    {n.status === 'published' ? 'Terbit' : 'Draft'}
                  </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
