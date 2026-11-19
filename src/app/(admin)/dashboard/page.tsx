'use client'

import { useState, useEffect, useMemo } from 'react'
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
    Loader2,
    ShieldCheck,
    ShieldAlert
} from 'lucide-react'

const timeAgo = (dateString: string) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Baru saja'
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) return `${diffInMinutes}m lalu`
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}j lalu`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}h lalu`

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

    const supabase = useMemo(
        () =>
            createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            ),
        []
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
                    supabase.from('system_logs').select('*').order('created_at', { ascending: false }).limit(3)
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
        { label: 'Draft Berita', value: dashboardStats.draftNews, color: 'var(--accent)', href: '/dashboard/berita', icon: <FileEdit className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--accent)]" /> },
        { label: 'Produk Aktif', value: dashboardStats.availableProducts, color: 'var(--success)', href: '/dashboard/ekowir', icon: <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--success)]" /> },
        { label: 'Pengurus Aktif', value: dashboardStats.activePengurus, color: 'var(--info)', href: '/dashboard/kepengurusan', icon: <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--info)]" /> },
        { label: 'Alumni Terdaftar', value: dashboardStats.totalAlumni, color: '#6B46C1', href: '/dashboard/alumni', icon: <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-[#6B46C1]" /> },
        { label: 'Total Produk', value: dashboardStats.totalProducts, color: 'var(--text-secondary)', href: '/dashboard/ekowir', icon: <Package className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--text-secondary)]" /> },
    ]

    const getActivityIcon = (actionOrType: string) => {
        switch (actionOrType) {
            case 'LOGIN_SUCCESS':
                return <ShieldCheck className="w-3.5 h-3.5 text-[var(--success)]" />
            case 'LOGIN_FAILED':
                return <ShieldAlert className="w-3.5 h-3.5 text-[var(--error)]" />
            case 'users':
                return <Users className="w-3.5 h-3.5 text-[var(--info)]" />
            case 'news':
                return <Newspaper className="w-3.5 h-3.5 text-[var(--primary)]" />
            case 'product':
                return <Package className="w-3.5 h-3.5 text-[var(--success)]" />
            case 'draft':
                return <FileEdit className="w-3.5 h-3.5 text-[var(--accent)]" />
            default:
                return <Activity className="w-3.5 h-3.5 text-[var(--primary)]" />
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] sm:min-h-[60vh] gap-3 w-full">
                <Loader2 className="w-7 h-7 sm:w-8 sm:h-8 animate-spin text-[var(--primary)]" />
                <p className="text-xs sm:text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest font-display">
                    Memuat Data Dashboard...
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-5 sm:space-y-6 font-sans w-full min-w-0">
            <div
                className="mk-bg-dark rounded-2xl p-5 sm:p-6 lg:p-8 relative overflow-hidden border-2 border-[var(--mk-ink)] shadow-[4px_4px_0_var(--mk-ink)] w-full"
                style={{
                    backgroundColor: 'var(--primary)'
                }}
            >
                <div className="mk-decor">
                    <div className="mk-dots right-6 top-4 opacity-25"></div>
                    <div className="-right-8 -bottom-10 opacity-20 mk-star mk-star--lg mk-star--spin"></div>
                </div>

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <span className="mk-chip mb-2.5 shadow-[2px_2px_0_var(--mk-ink)]">
                            {role === 'superadmin' ? 'Super Admin' : 'Admin'}
                        </span>
                        <h2 className="text-xl xs:text-2xl sm:text-3xl font-black text-white font-display tracking-tight uppercase">
                            Panel Admin IMM Kaizen
                        </h2>
                        <p className="text-xs sm:text-sm mt-1 text-white/85 font-sans">
                            Kaizen Company V1 — {currentDate || 'Memuat tanggal...'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 w-full">
                {stats.map(s => (
                    <Link
                        href={s.href}
                        key={s.label}
                        className="group bg-[var(--card)] rounded-xl p-3.5 sm:p-4 border border-[var(--border-strong)] shadow-[3px_3px_0_var(--border)] hover:border-[var(--mk-ink)] hover:shadow-[4px_4px_0_var(--accent-light)] hover:-translate-y-0.5 transition-all duration-200 block relative overflow-hidden"
                    >
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shrink-0">
                                {s.icon}
                            </div>
                            <span
                                className="text-xl sm:text-2xl font-black font-display shrink-0 tabular-nums"
                                style={{ color: s.color }}
                            >
                                {s.value}
                            </span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                            <p className="text-[10px] sm:text-xs font-bold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] font-display uppercase tracking-wider transition-colors truncate">
                                {s.label}
                            </p>
                            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--primary)] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shrink-0 hidden sm:block" />
                        </div>
                    </Link>
                ))}
            </div>

            <div className="flex flex-col lg:flex-row gap-5 sm:gap-6 w-full items-start">
                <div className={`bg-[var(--card)] rounded-2xl border border-[var(--border-strong)] overflow-hidden shadow-[4px_4px_0_var(--surface-2)] flex flex-col w-full min-w-0 ${role === 'superadmin' ? 'lg:w-2/3' : 'lg:w-full'}`}>
                    <div className="h-1 w-full bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--accent-light)]" />

                    <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <span className="w-1.5 h-4 rounded-full bg-[var(--primary)] inline-block" />
                            <h3 className="font-black text-xs sm:text-sm text-[var(--text-primary)] font-display uppercase tracking-wider">
                                Berita Terkini
                            </h3>
                        </div>
                        <Link
                            href="/dashboard/berita"
                            className="text-[11px] sm:text-xs font-bold text-[var(--primary)] hover:text-[var(--primary-dark)] flex items-center gap-1 transition-colors uppercase tracking-wider font-display"
                        >
                            Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="overflow-x-auto w-full scrollbar-none">
                        <table className="admin-table min-w-[500px]">
                            <thead>
                            <tr>
                                <th>Judul</th>
                                <th>Kategori</th>
                                <th>Tanggal</th>
                                <th>Status</th>
                                <th className="text-right">Aksi</th>
                            </tr>
                            </thead>
                            <tbody>
                            {recentNews.length > 0 ? (
                                recentNews.map(n => (
                                    <tr key={n.id} className="group">
                                        <td>
                                            <p className="font-semibold text-xs text-[var(--text-primary)] font-display line-clamp-1">
                                                {n.title}
                                            </p>
                                        </td>
                                        <td>
                                                <span className="text-[9px] sm:text-[10px] font-bold text-[var(--primary)] font-display bg-[var(--primary)]/10 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md uppercase tracking-wider whitespace-nowrap">
                                                    {n.category || '-'}
                                                </span>
                                        </td>
                                        <td className="text-[11px] sm:text-xs text-[var(--text-muted)] whitespace-nowrap font-medium">
                                            {timeAgo(n.publish_date || n.created_at)}
                                        </td>
                                        <td className="whitespace-nowrap">
                                                <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md ${
                                                    n.status === 'published'
                                                        ? 'bg-[var(--success)]/15 text-[var(--success)]'
                                                        : 'bg-[var(--surface-2)] text-[var(--text-secondary)]'
                                                }`}>
                                                    {n.status === 'published' ? 'Terbit' : 'Draft'}
                                                </span>
                                        </td>
                                        <td className="text-right">
                                            <Link
                                                href="/dashboard/berita"
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
                    <div className="bg-[var(--card)] rounded-2xl border border-[var(--border-strong)] overflow-hidden shadow-[4px_4px_0_var(--surface-2)] flex flex-col w-full lg:w-1/3 min-w-0">
                        <div className="h-1 w-full bg-gradient-to-r from-[var(--accent-light)] via-[var(--accent)] to-[var(--primary)]" />

                        <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-[var(--primary)] shrink-0" />
                                <h3 className="font-black text-xs sm:text-sm text-[var(--text-primary)] font-display uppercase tracking-wider">
                                    Aktivitas Sistem
                                </h3>
                            </div>
                            <span className="text-[10px] font-bold px-2.5 py-0.5 bg-[var(--accent-light)] text-[var(--mk-ink)] rounded-full uppercase font-display">
                                Realtime
                            </span>
                        </div>

                        <div className="p-4 sm:p-5 flex-1 bg-[var(--surface)]/40">
                            {recentActivities.length > 0 ? (
                                <div className="space-y-3">
                                    {recentActivities.map((activity) => (
                                        <div key={activity.id} className="p-3 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-xs hover:border-[var(--primary)]/40 transition-colors">
                                            <div className="flex items-center justify-between mb-1.5 gap-2">
                                                <div className="flex items-center gap-1.5 min-w-0">
                                                    <div className="p-1 rounded-md bg-[var(--surface)] border border-[var(--border)] shrink-0">
                                                        {getActivityIcon(activity.action || activity.type)}
                                                    </div>
                                                    <span className="font-bold text-xs text-[var(--text-primary)] font-display truncate">
                                                        {activity.user_email || activity.admin_name || 'Sistem'}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] font-semibold text-[var(--text-muted)] flex items-center gap-1 shrink-0">
                                                    <Clock className="w-3 h-3 text-[var(--primary)]" /> {timeAgo(activity.created_at)}
                                                </span>
                                            </div>
                                            <p className="text-[11px] sm:text-xs text-[var(--text-secondary)] leading-relaxed">
                                                {activity.module && (
                                                    <span className="font-bold text-[var(--text-primary)] mr-1 font-display">
                                                        [{activity.module}]
                                                    </span>
                                                )}
                                                {activity.details || `${activity.action || ''} ${activity.target || ''}`}
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