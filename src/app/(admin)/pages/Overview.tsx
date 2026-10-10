'use client'

import { newsData, products, managementData, alumniData, type Role } from '../../(public)/data'
import {
    Newspaper,
    FileEdit,
    ShoppingBag,
    Users,
    GraduationCap,
    Package,
    Sparkles
} from 'lucide-react'

interface OverviewProps { role: Role }

export default function Overview({ role }: OverviewProps) {
    const publishedNews = newsData.filter(n => n.status === 'published').length
    const draftNews = newsData.filter(n => n.status === 'draft').length
    const availableProducts = products.filter(p => p.available).length

    const stats = [
        { label: 'Berita Terbit', value: publishedNews, color: 'var(--primary)', icon: <Newspaper className="w-5 h-5 text-[var(--primary)]" /> },
        { label: 'Draft Berita', value: draftNews, color: 'var(--accent-dark)', icon: <FileEdit className="w-5 h-5 text-[var(--accent-dark)]" /> },
        { label: 'Produk Aktif', value: availableProducts, color: 'var(--success)', icon: <ShoppingBag className="w-5 h-5 text-[var(--success)]" /> },
        { label: 'Pengurus Aktif', value: managementData.length, color: 'var(--info)', icon: <Users className="w-5 h-5 text-[var(--info)]" /> },
        { label: 'Page Terdaftar', value: alumniData.length, color: '#6B46C1', icon: <GraduationCap className="w-5 h-5 text-[#6B46C1]" /> },
        { label: 'Total Produk', value: products.length, color: 'var(--text-secondary)', icon: <Package className="w-5 h-5 text-[var(--text-secondary)]" /> },
    ]

    const recentNews = newsData.slice(0, 5)

    return (
        <div className="space-y-6">
            <div
                className="rounded-[var(--radius)] p-6 relative overflow-hidden shadow-sm"
                style={{
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)'
                }}
            >
                <div className="relative z-10 flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest mb-1 text-white/70 font-display">
                            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-light)]" />
                            Selamat Datang
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-white font-display">
                            Panel Admin IMM Kaizen
                        </h2>
                        <p className="text-xs sm:text-sm mt-1 text-white/80">
                            Kaizen Company V1 — {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                </div>

                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-xl pointer-events-none" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {stats.map(s => (
                    <div
                        key={s.label}
                        className="bg-[var(--card)] rounded-[var(--radius)] p-4 border border-[var(--border)] shadow-sm hover:border-[var(--primary)] transition-all"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-9 h-9 rounded-[var(--radius)] bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center">
                                {s.icon}
                            </div>
                            <span
                                className="text-2xl font-black font-display"
                                style={{ color: s.color }}
                            >
                                {s.value}
                            </span>
                        </div>
                        <p className="text-xs font-bold text-[var(--text-muted)] font-display uppercase tracking-wider">
                            {s.label}
                        </p>
                    </div>
                ))}
            </div>

            <div className="bg-[var(--card)] rounded-[var(--radius)] border border-[var(--border)] overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-[var(--border)] bg-[var(--surface)]">
                    <h3 className="font-black text-sm text-[var(--text-primary)] font-display">
                        Berita Terkini
                    </h3>
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
                                <p className="font-semibold text-xs line-clamp-1 text-[var(--text-primary)] font-display">
                                    {n.title}
                                </p>
                            </td>
                            <td>
                                    <span className="text-xs font-semibold text-[var(--primary)] font-display">
                                        {n.category}
                                    </span>
                            </td>
                            <td className="text-xs text-[var(--text-muted)] whitespace-nowrap">
                                {n.publishDate}
                            </td>
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
