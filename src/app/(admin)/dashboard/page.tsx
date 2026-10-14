'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
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
    Clock,
    Loader2
} from 'lucide-react'

const timeAgo = (dateString: string) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Baru saja'
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours} jam yang lalu`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} hari yang lalu`

    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

export default function DashboardOverviewPage() {
    const [role, setRole] = useState<string | null>('')
    const [currentDate, setCurrentDate] = useState<string>('')
    const [isLoading, setIsLoading] = useState(true)

    const [dashboardStats, setDashboardStats] = useState({
        publishedNews: 0,
        draftNews: 0,
        availableProducts: 0,
        totalProducts: 0,
        activePengurus: 0,
        totalAlumni: 0
    })

    const [recentNews, setRecentNews] = useState<any[]>([])
    const [recentActivities, setRecentActivities] = useState<any[]>([])

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        const savedRole = localStorage.getItem('userRole')
        setRole(savedRole)

        setCurrentDate(new Date().toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }))

        const fetchDashboardData = async () => {
            setIsLoading(true)
            try {
                const [
                    { count: publishedNewsCount },
                    { count: draftNewsCount },
                    { count: availableProductsCount },
                    { count: totalProductsCount },
                    { count: pengurusCount },
                    { count: alumniCount },
                    { data: recentNewsData },
                    { data: recentLogsData }
                ] = await Promise.all([
                    supabase.from('news').select('*', { count: 'exact', head: true }).eq('status', 'published'),
                    supabase.from('news').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
                    supabase.from('products').select('*', { count: 'exact', head: true }).eq('available', true),
                    supabase.from('products').select('*', { count: 'exact', head: true }),
                    supabase.from('pengurus').select('*', { count: 'exact', head: true }),
                    supabase.from('alumni').select('*', { count: 'exact', head: true }),
                    supabase.from('news').select('id, title, category, publish_date, status, created_at').order('created_at', { ascending: false }).limit(5),
                    supabase.from('system_logs').select('*').order('created_at', { ascending: false }).limit(6)
                ])

                setDashboardStats({
                    publishedNews: publishedNewsCount || 0,
                    draftNews: draftNewsCount || 0,
                    availableProducts: availableProductsCount || 0,
                    totalProducts: totalProductsCount || 0,
                    activePengurus: pengurusCount || 0,
                    totalAlumni: alumniCount || 0
                })

                if (recentNewsData) setRecentNews(recentNewsData)
                if (recentLogsData) setRecentActivities(recentLogsData)

            } catch (error) {
                console.error('Gagal mengambil data dashboard:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchDashboardData()
    }, [supabase])

    const stats = [
        { label: 'Berita Terbit', value: dashboardStats.publishedNews, color: 'var(--primary)', href: '/dashboard/berita', icon: <Newspaper className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--primary)]" /> },
        { label: 'Draft Berita', value: dashboardStats.draftNews, color: 'var(--accent-dark)', href: '/dashboard/berita?tab=draft', icon: <FileEdit className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--accent-dark)]" /> },
        { label: 'Produk Aktif', value: dashboardStats.availableProducts, color: 'var(--success)', href: '/dashboard/ekowir', icon: <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--success)]" /> },
        { label: 'Pengurus Aktif', value: dashboardStats.activePengurus, color: 'var(--info)', href: '/dashboard/kepengurusan', icon: <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--info)]" /> },
        { label: 'Alumni Terdaftar', value: dashboardStats.totalAlumni, color: '#6B46C1', href: '/dashboard/alumni', icon: <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-[#6B46C1]" /> },
        { label: 'Total Produk', value: dashboardStats.totalProducts, color: 'var(--text-secondary)', href: '/dashboard/ekowir', icon: <Package className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--text-secondary)]" /> },
    ]

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'users': return <Users className="w-3.5 h-3.5 text-[var(--info)]" />
            case 'news': return <Newspaper className="w-3.5 h-3.5 text-[var(--primary)]" />
            case 'product': return <Package className="w-3.5 h-3.5 text-[var(--success)]" />
            case 'draft': return <FileEdit className="w-3.5 h-3.5 text-[var(--accent-dark)]" />
            case 'settings': return <Activity className="w-3.5 h-3.5 text-orange-500" />
            default: return <Activity className="w-3.5 h-3.5 text-[var(--text-muted)]" />
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] sm:min-h-[60vh] gap-3">
                <Loader2 className="w-7 h-7 sm:w-8 sm:h-8 animate-spin text-[var(--primary)]" />
                <p className="text-xs sm:text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest font-display">
                    Memuat Data Dashboard...
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-5 sm:space-y-6 font-sans">

            <div
                className="rounded-2xl p-5 sm:p-6 lg:p-8 relative overflow-hidden shadow-sm"
                style={{
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)'
                }}
            >
                <div className="relative z-10 flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1 text-white/70 font-display">
                            Selamat Datang, {role === 'superadmin' ? 'Super Admin' : 'Admin'}
                        </div>
                        <h2 className="text-lg xs:text-xl sm:text-3xl font-black text-white font-display tracking-tight">
                            Panel Admin IMM Kaizen
                        </h2>
                        <p className="text-xs sm:text-sm mt-1 text-white/80 font-sans">
                            Kaizen Company V1 — {currentDate || 'Memuat tanggal...'}
                        </p>
                    </div>
                </div>
                <div className="absolute -bottom-10 -right-10 w-36 h-36 sm:w-48 sm:h-48 bg-white/5 rounded-full blur-xl pointer-events-none" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {stats.map(s => (
                    <Link
                        href={s.href}
                        key={s.label}
                        className="group bg-[var(--card)] rounded-2xl p-3.5 sm:p-4 border border-[var(--border)] shadow-sm hover:border-[var(--primary)] hover:shadow-md transition-all duration-300 block relative overflow-hidden"
                    >
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shrink-0">
                                {s.icon}
                            </div>
                            <span
                                className="text-xl sm:text-2xl font-black font-display shrink-0"
                                style={{ color: s.color }}
                            >
                                {s.value}
                            </span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                            <p className="text-[10px] sm:text-xs font-bold text-[var(--text-muted)] group-hover:text-[var(--text-primary)] font-display uppercase tracking-wider transition-colors truncate">
                                {s.label}
                            </p>
                            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--text-muted)] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shrink-0 hidden sm:block" />
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">

                <div className={`bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm flex flex-col ${role === 'superadmin' ? 'lg:col-span-7 xl:col-span-8' : 'lg:col-span-12'}`}>
                    <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between">
                        <h3 className="font-black text-xs sm:text-sm text-[var(--text-primary)] font-display uppercase tracking-wider">
                            Berita Terkini
                        </h3>
                        <Link
                            href="/dashboard/berita"
                            className="text-[11px] sm:text-xs font-bold text-[var(--primary)] hover:text-[var(--primary-dark)] flex items-center gap-1 transition-colors uppercase tracking-wider font-display"
                        >
                            Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="overflow-x-auto w-full scrollbar-none">
                        <table className="w-full text-left border-collapse min-w-[550px]">
                            <thead>
                            <tr className="bg-[var(--surface-2)] border-b border-[var(--border)] text-[10px] sm:text-xs text-[var(--text-muted)] uppercase tracking-wider font-display">
                                <th className="p-3.5 sm:p-4 font-bold">Judul</th>
                                <th className="p-3.5 sm:p-4 font-bold">Kategori</th>
                                <th className="p-3.5 sm:p-4 font-bold">Tanggal</th>
                                <th className="p-3.5 sm:p-4 font-bold">Status</th>
                                <th className="p-3.5 sm:p-4 font-bold text-right">Aksi</th>
                            </tr>
                            </thead>
                            <tbody>
                            {recentNews.length > 0 ? (
                                recentNews.map(n => (
                                    <tr key={n.id} className="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors group">
                                        <td className="p-3.5 sm:p-4">
                                            <p className="font-semibold text-xs text-[var(--text-primary)] font-display line-clamp-1 max-w-xs">
                                                {n.title}
                                            </p>
                                        </td>
                                        <td className="p-3.5 sm:p-4">
                                                <span className="text-[9px] sm:text-[10px] font-bold text-[var(--primary)] font-display bg-[var(--primary)]/10 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md uppercase tracking-wider whitespace-nowrap">
                                                    {n.category || '-'}
                                                </span>
                                        </td>
                                        <td className="p-3.5 sm:p-4 text-[11px] sm:text-xs text-[var(--text-muted)] whitespace-nowrap font-medium">
                                            {timeAgo(n.publish_date || n.created_at)}
                                        </td>
                                        <td className="p-3.5 sm:p-4">
                                                <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md whitespace-nowrap ${n.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400'}`}>
                                                    {n.status === 'published' ? 'Terbit' : 'Draft'}
                                                </span>
                                        </td>
                                        <td className="p-3.5 sm:p-4 text-right">
                                            <Link
                                                href={`/dashboard/berita/${n.id}`}
                                                className="inline-flex items-center justify-center p-1.5 text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-lg transition-colors"
                                                title="Edit Berita"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-xs sm:text-sm text-[var(--text-muted)]">
                                        Belum ada berita yang diterbitkan atau di-draft.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {role === 'superadmin' && (
                    <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm flex flex-col lg:col-span-5 xl:col-span-4">
                        <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-[var(--border)] bg-[var(--surface)] flex items-center gap-2">
                            <Activity className="w-4 h-4 text-[var(--primary)] shrink-0" />
                            <h3 className="font-black text-xs sm:text-sm text-[var(--text-primary)] font-display uppercase tracking-wider">
                                Aktivitas Sistem
                            </h3>
                        </div>

                        <div className="p-4 sm:p-5 flex-1 bg-[var(--surface-2)]/30">
                            {recentActivities.length > 0 ? (
                                <div className="space-y-3.5">
                                    {recentActivities.map((activity) => (
                                        <div key={activity.id} className="p-3 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm hover:border-[var(--primary)]/30 transition-colors">
                                            <div className="flex items-center justify-between mb-1.5 gap-2">
                                                <div className="flex items-center gap-1.5 min-w-0">
                                                    <div className="p-1 rounded-md bg-[var(--surface)] border border-[var(--border)] shrink-0">
                                                        {getActivityIcon(activity.type)}
                                                    </div>
                                                    <span className="font-bold text-xs text-[var(--text-primary)] font-display truncate">
                                                        {activity.admin_name || 'Admin'}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] font-semibold text-[var(--text-muted)] flex items-center gap-1 shrink-0">
                                                    <Clock className="w-3 h-3 text-[var(--primary)]" /> {timeAgo(activity.created_at)}
                                                </span>
                                            </div>
                                            <p className="text-[11px] sm:text-xs text-[var(--text-secondary)] leading-relaxed">
                                                {activity.action} <span className="font-semibold text-[var(--text-primary)]">{activity.target}</span>.
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 opacity-70">
                                    <p className="text-xs text-[var(--text-muted)] font-semibold">Belum ada riwayat aktivitas.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}