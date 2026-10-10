'use client'

import { useState, useEffect } from 'react'
import { newsData, products, managementData, alumniData } from '../../lib/data'
import {
    Newspaper,
    FileEdit,
    ShoppingBag,
    Users,
    GraduationCap,
    Package,
    Sparkles
} from 'lucide-react'

export default function DashboardOverviewPage() {
    const [role, setRole] = useState<string | null>('')
    const [currentDate, setCurrentDate] = useState<string>('')

    useEffect(() => {
        const savedRole = localStorage.getItem('userRole')
        setRole(savedRole)

        setCurrentDate(new Date().toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }))
    }, [])

    const publishedNews = newsData.filter(n => n.status === 'published').length
    const draftNews = newsData.filter(n => n.status === 'draft').length
    const availableProducts = products.filter(p => p.available).length

    const stats = [
        { label: 'Berita Terbit', value: publishedNews, color: 'var(--primary)', icon: <Newspaper className="w-5 h-5 text-[var(--primary)]" /> },
        { label: 'Draft Berita', value: draftNews, color: 'var(--accent-dark)', icon: <FileEdit className="w-5 h-5 text-[var(--accent-dark)]" /> },
        { label: 'Produk Aktif', value: availableProducts, color: 'var(--success)', icon: <ShoppingBag className="w-5 h-5 text-[var(--success)]" /> },
        { label: 'Pengurus Aktif', value: managementData.length, color: 'var(--info)', icon: <Users className="w-5 h-5 text-[var(--info)]" /> },
        { label: 'Alumni Terdaftar', value: alumniData.length, color: '#6B46C1', icon: <GraduationCap className="w-5 h-5 text-[#6B46C1]" /> },
        { label: 'Total Produk', value: products.length, color: 'var(--text-secondary)', icon: <Package className="w-5 h-5 text-[var(--text-secondary)]" /> },
    ]

    const recentNews = newsData.slice(0, 5)

    return (
        <div className="space-y-6">
            {/* Header / Banner */}
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
                            Selamat Datang, {role === 'superadmin' ? 'Super Admin' : 'Admin'}
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-white font-display">
                            Panel Admin IMM Kaizen
                        </h2>
                        <p className="text-xs sm:text-sm mt-1 text-white/80">
                            Kaizen Company V1 — {currentDate || 'Memuat tanggal...'}
                        </p>
                    </div>
                </div>

                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-xl pointer-events-none" />
            </div>

            {/* Statistik */}
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

            {/* Tabel Berita Terkini */}
            <div className="bg-[var(--card)] rounded-[var(--radius)] border border-[var(--border)] overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-[var(--border)] bg-[var(--surface)]">
                    <h3 className="font-black text-sm text-[var(--text-primary)] font-display">
                        Berita Terkini
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="admin-table w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-[var(--surface-2)] border-b border-[var(--border)] text-xs text-[var(--text-muted)] uppercase tracking-wider font-display">
                            <th className="p-4 font-bold">Judul</th>
                            <th className="p-4 font-bold">Kategori</th>
                            <th className="p-4 font-bold">Tanggal</th>
                            <th className="p-4 font-bold">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {recentNews.map(n => (
                            <tr key={n.id} className="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors">
                                <td className="p-4">
                                    <p className="font-semibold text-xs line-clamp-1 text-[var(--text-primary)] font-display">
                                        {n.title}
                                    </p>
                                </td>
                                <td className="p-4">
                                        <span className="text-xs font-semibold text-[var(--primary)] font-display bg-[var(--primary)]/10 px-2 py-1 rounded-md">
                                            {n.category}
                                        </span>
                                </td>
                                <td className="p-4 text-xs text-[var(--text-muted)] whitespace-nowrap">
                                    {n.publishDate}
                                </td>
                                <td className="p-4">
                                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${n.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {n.status === 'published' ? 'Terbit' : 'Draft'}
                                        </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}