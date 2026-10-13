'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { newsData, products, managementData, alumniData } from '../../lib/data'
import {
    Newspaper,
    FileEdit,
    ShoppingBag,
    Users,
    GraduationCap,
    Package,
    ArrowRight,
    ExternalLink,
    Activity,
    Clock
} from 'lucide-react'

const recentActivities = [
    { id: 1, admin: 'Ahmad (Bid. Kaderisasi)', action: 'menambahkan data pengurus baru', target: 'Syamil - Angkatan 2023', time: '10 menit yang lalu', type: 'users' },
    { id: 2, admin: 'Siti (Bid. Medkom)', action: 'menerbitkan berita', target: 'Pelatihan Jurnalistik 2024', time: '1 jam yang lalu', type: 'news' },
    { id: 3, admin: 'Budi (Bid. Kewirausahaan)', action: 'memperbarui stok produk', target: 'Kemeja PDH IMM Kaizen', time: '3 jam yang lalu', type: 'product' },
    { id: 4, admin: 'Rina (Bid. Keilmuan)', action: 'menyimpan draft berita', target: 'Kajian Rutin Pekanan', time: 'Kemarin, 15:30', type: 'draft' },
]

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
        { label: 'Berita Terbit', value: publishedNews, color: 'var(--primary)', href: '/dashboard/berita', icon: <Newspaper className="w-5 h-5 text-[var(--primary)]" /> },
        { label: 'Draft Berita', value: draftNews, color: 'var(--accent-dark)', href: '/dashboard/berita?tab=draft', icon: <FileEdit className="w-5 h-5 text-[var(--accent-dark)]" /> },
        { label: 'Produk Aktif', value: availableProducts, color: 'var(--success)', href: '/dashboard/produk', icon: <ShoppingBag className="w-5 h-5 text-[var(--success)]" /> },
        { label: 'Pengurus Aktif', value: managementData.length, color: 'var(--info)', href: '/dashboard/pengurus', icon: <Users className="w-5 h-5 text-[var(--info)]" /> },
        { label: 'Alumni Terdaftar', value: alumniData.length, color: '#6B46C1', href: '/dashboard/alumni', icon: <GraduationCap className="w-5 h-5 text-[#6B46C1]" /> },
        { label: 'Total Produk', value: products.length, color: 'var(--text-secondary)', href: '/dashboard/produk', icon: <Package className="w-5 h-5 text-[var(--text-secondary)]" /> },
    ]

    const recentNews = newsData.slice(0, 5)

    // Helper icon untuk timeline aktivitas
    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'users': return <Users className="w-4 h-4 text-[var(--info)]" />
            case 'news': return <Newspaper className="w-4 h-4 text-[var(--primary)]" />
            case 'product': return <Package className="w-4 h-4 text-[var(--success)]" />
            case 'draft': return <FileEdit className="w-4 h-4 text-[var(--accent-dark)]" />
            default: return <Activity className="w-4 h-4 text-[var(--text-muted)]" />
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* --- HEADER --- */}
            <div
                className="rounded-[var(--radius)] p-6 relative overflow-hidden shadow-sm"
                style={{
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)'
                }}
            >
                <div className="relative z-10 flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest mb-1 text-white/70 font-display">
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

            {/* --- STATISTIK --- */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {stats.map(s => (
                    <Link
                        href={s.href}
                        key={s.label}
                        className="group bg-[var(--card)] rounded-[var(--radius)] p-4 border border-[var(--border)] shadow-sm hover:border-[var(--primary)] hover:shadow-md transition-all duration-300 block relative overflow-hidden"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-9 h-9 rounded-[var(--radius)] bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                {s.icon}
                            </div>
                            <span
                                className="text-2xl font-black font-display"
                                style={{ color: s.color }}
                            >
                                {s.value}
                            </span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <p className="text-xs font-bold text-[var(--text-muted)] group-hover:text-[var(--text-primary)] font-display uppercase tracking-wider transition-colors">
                                {s.label}
                            </p>
                            <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                        </div>
                    </Link>
                ))}
            </div>

            {/* --- GRID KONTEN BAWAH --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* TABEL BERITA TERKINI - Lebar dinamis tergantung role */}
                <div className={`bg-[var(--card)] rounded-[var(--radius)] border border-[var(--border)] overflow-hidden shadow-sm ${role === 'superadmin' ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
                    <div className="px-5 py-4 border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between">
                        <h3 className="font-black text-sm text-[var(--text-primary)] font-display">
                            Berita Terkini
                        </h3>
                        <Link
                            href="/dashboard/berita"
                            className="text-xs font-bold text-[var(--primary)] hover:text-[var(--primary-dark)] flex items-center gap-1 transition-colors uppercase tracking-wider font-display"
                        >
                            Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="admin-table w-full text-left border-collapse">
                            <thead>
                            <tr className="bg-[var(--surface-2)] border-b border-[var(--border)] text-xs text-[var(--text-muted)] uppercase tracking-wider font-display">
                                <th className="p-4 font-bold">Judul</th>
                                <th className="p-4 font-bold">Kategori</th>
                                <th className="p-4 font-bold">Tanggal</th>
                                <th className="p-4 font-bold">Status</th>
                                <th className="p-4 font-bold text-right">Aksi</th>
                            </tr>
                            </thead>
                            <tbody>
                            {recentNews.map(n => (
                                <tr key={n.id} className="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors group">
                                    <td className="p-4">
                                        <p className="font-semibold text-xs line-clamp-1 text-[var(--text-primary)] font-display">
                                            {n.title}
                                        </p>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-[10px] font-bold text-[var(--primary)] font-display bg-[var(--primary)]/10 px-2.5 py-1 rounded-md uppercase tracking-wider">
                                            {n.category}
                                        </span>
                                    </td>
                                    <td className="p-4 text-xs text-[var(--text-muted)] whitespace-nowrap font-medium">
                                        {n.publishDate}
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md ${n.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400'}`}>
                                            {n.status === 'published' ? 'Terbit' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <Link
                                            href={`/dashboard/berita/${n.id}`}
                                            className="inline-flex items-center justify-center p-1.5 text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-md transition-colors"
                                            title="Edit Berita"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* RIWAYAT AKTIVITAS ADMIN (Hanya Superadmin) */}
                {role === 'superadmin' && (
                    <div className="bg-[var(--card)] rounded-[var(--radius)] border border-[var(--border)] overflow-hidden shadow-sm flex flex-col h-full">
                        <div className="px-5 py-4 border-b border-[var(--border)] bg-[var(--surface)] flex items-center gap-2">
                            <Activity className="w-4 h-4 text-[var(--primary)]" />
                            <h3 className="font-black text-sm text-[var(--text-primary)] font-display">
                                Aktivitas Sistem
                            </h3>
                        </div>

                        <div className="p-5 flex-1 bg-[var(--surface-2)]/50">
                            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[var(--border)] before:via-[var(--border)] before:to-transparent">
                                {recentActivities.map((activity, index) => (
                                    <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">

                                        {/* Icon Node */}
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-[var(--card)] bg-[var(--surface)] text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 relative">
                                            {getActivityIcon(activity.type)}
                                        </div>

                                        {/* Content Box */}
                                        <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm hover:border-[var(--primary)]/30 transition-colors">
                                            <div className="flex items-center justify-between mb-1 gap-2">
                                                <span className="font-bold text-xs text-[var(--text-primary)] font-display truncate">
                                                    {activity.admin}
                                                </span>
                                                <span className="text-[10px] font-semibold text-[var(--text-muted)] flex items-center gap-1 whitespace-nowrap">
                                                    <Clock className="w-3 h-3" /> {activity.time}
                                                </span>
                                            </div>
                                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                                Telah {activity.action} <span className="font-semibold text-[var(--text-primary)]">{activity.target}</span>.
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="px-5 py-3 border-t border-[var(--border)] bg-[var(--card)] text-center">
                            <button className="text-xs font-bold text-[var(--primary)] hover:text-[var(--primary-dark)] uppercase tracking-wider font-display transition-colors">
                                Muat Lebih Banyak
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}