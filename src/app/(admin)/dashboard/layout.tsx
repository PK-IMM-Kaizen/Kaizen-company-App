'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Logo from '../../../components/common/Logo'
import {
    LayoutDashboard, Newspaper, ShoppingBag, Users,
    GraduationCap, Building, ShieldCheck, LogOut, Menu, X, MessageSquare, UserPlus,
    Maximize, Minimize, PanelLeftClose, PanelLeft
} from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

const roleLabels: Record<string, string> = {
    superadmin: 'Super Admin',
    admin: 'Admin Bidang',
    bpi: 'Admin BPI',
    medkom: 'Admin Medkom',
    ekowir: 'Admin Ekowir'
}

const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4 shrink-0" />, allowedRoles: ['superadmin', 'admin', 'bpi', 'medkom', 'ekowir'] },
    { name: 'Pendaftar DAD', path: '/dashboard/daftar-dad', icon: <UserPlus className="w-4 h-4 shrink-0" />, allowedRoles: ['superadmin', 'admin', 'bpi'] },
    { name: 'Kelola Berita', path: '/dashboard/berita', icon: <Newspaper className="w-4 h-4 shrink-0" />, allowedRoles: ['superadmin', 'admin', 'bpi', 'medkom', 'ekowir'] },
    { name: 'Kotak Aspirasi', path: '/dashboard/aspirasi', icon: <MessageSquare className="w-4 h-4 shrink-0" />, allowedRoles: ['superadmin', 'admin', 'bpi'] },
    { name: 'Produk Ekowir', path: '/dashboard/ekowir', icon: <ShoppingBag className="w-4 h-4 shrink-0" />, allowedRoles: ['superadmin', 'ekowir'] },
    { name: 'Kepengurusan', path: '/dashboard/kepengurusan', icon: <Users className="w-4 h-4 shrink-0" />, allowedRoles: ['superadmin', 'admin', 'bpi'] },
    { name: 'Data Alumni', path: '/dashboard/alumni', icon: <GraduationCap className="w-4 h-4 shrink-0" />, allowedRoles: ['superadmin', 'admin', 'bpi'] },
    { name: 'Profil Organisasi', path: '/dashboard/organisasi', icon: <Building className="w-4 h-4 shrink-0" />, allowedRoles: ['superadmin'] },
    { name: 'Pengguna & Akses', path: '/dashboard/users', icon: <ShieldCheck className="w-4 h-4 shrink-0" />, allowedRoles: ['superadmin'] },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()

    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [role, setRole] = useState<string | null>(null)
    const [isMounted, setIsMounted] = useState(false)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        setIsMounted(true)
        const savedRole = localStorage.getItem('userRole')
        const isAuth = localStorage.getItem('isAuthenticated')
        const savedCollapsed = localStorage.getItem('sidebarCollapsed')

        if (savedCollapsed === 'true') {
            setIsCollapsed(true)
        }

        if (!isAuth || !savedRole) {
            router.replace('/login')
        } else {
            setRole(savedRole)
        }

        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement)
        }
        document.addEventListener('fullscreenchange', handleFullscreenChange)
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }, [router])

    const toggleCollapse = () => {
        setIsCollapsed(prev => {
            const nextState = !prev
            localStorage.setItem('sidebarCollapsed', String(nextState))
            return nextState
        })
    }

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.error(`Gagal mengaktifkan mode Fullscreen: ${err.message}`)
            })
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen()
            }
        }
    }

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut()
        } catch (error) {
            console.error('Gagal logout Supabase:', error)
        } finally {
            localStorage.removeItem('isAuthenticated')
            localStorage.removeItem('userRole')
            router.replace('/login')
        }
    }

    if (!isMounted || !role) {
        return (
            <div className="h-screen flex items-center justify-center bg-[var(--background)] text-[var(--text-primary)] font-display font-bold">
                Memuat Dashboard...
            </div>
        )
    }

    const filteredMenu = menuItems.filter(item => item.allowedRoles.includes(role))
    const currentMenuLabel = filteredMenu.find(m => m.path === pathname)?.name ?? 'Dashboard'

    const showExpandedUI = !isCollapsed || isHovered

    return (
        <div className="h-screen flex bg-[var(--background)] overflow-hidden">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 md:hidden bg-black/60 backdrop-blur-sm transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div
                className={`hidden md:block shrink-0 transition-all duration-300 ${
                    isCollapsed ? 'w-[72px]' : 'w-[240px]'
                }`}
            />

            <aside
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 bg-[#111111] text-white flex-shrink-0 shadow-2xl md:shadow-none ${
                    isCollapsed
                        ? (isHovered ? 'md:w-[240px] md:shadow-2xl' : 'md:w-[72px]')
                        : 'md:w-[240px]'
                } ${sidebarOpen ? 'translate-x-0 w-[240px]' : '-translate-x-full md:translate-x-0'}`}
            >
                <div className={`p-4 border-b border-white/10 flex items-center ${!showExpandedUI ? 'justify-center' : 'justify-between'}`}>
                    {!showExpandedUI ? (
                        <div className="w-8 h-8 flex items-center justify-center overflow-hidden">
                            <img
                                src="/img/logo/logo.png"
                                alt="Logo Kaizen Mini"
                                className="w-full h-full object-contain"
                            />
                        </div>
                    ) : (
                        <Logo variant="white" size="sm" />
                    )}
                    <button className="md:hidden text-white/50 hover:text-white" onClick={() => setSidebarOpen(false)}>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {showExpandedUI && (
                    <div className="px-5 py-3 border-b border-white/5 bg-white/5 transition-all">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)] font-display block truncate">
                            Akses: {roleLabels[role] || role}
                        </span>
                    </div>
                )}

                <nav className="flex-1 py-4 overflow-y-auto px-3 space-y-1">
                    {filteredMenu.map(item => {
                        const isActive = pathname === item.path
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={() => setSidebarOpen(false)}
                                title={!showExpandedUI ? item.name : undefined}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all font-display ${
                                    !showExpandedUI ? 'justify-center' : ''
                                } ${
                                    isActive
                                        ? 'bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20'
                                        : 'text-white/60 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                {item.icon}
                                {showExpandedUI && <span className="truncate">{item.name}</span>}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        title={!showExpandedUI ? 'Keluar' : undefined}
                        className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-white/60 hover:bg-red-500/10 hover:text-red-500 font-display uppercase tracking-wider cursor-pointer ${
                            !showExpandedUI ? 'justify-center' : 'justify-center'
                        }`}
                    >
                        <LogOut className="w-4 h-4 shrink-0" />
                        {showExpandedUI && <span>Keluar</span>}
                    </button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col h-full overflow-y-auto max-w-full relative z-0">
                <header className="flex items-center justify-between px-4 sm:px-6 py-4 bg-[var(--card)] border-b border-[var(--border)] sticky top-0 z-30 shadow-sm">
                    <div className="flex items-center gap-3">
                        <button
                            className="md:hidden p-2 rounded-lg bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors cursor-pointer"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        <button
                            className="hidden md:flex p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
                            onClick={toggleCollapse}
                            title={isCollapsed ? 'Buka Kunci Sidebar' : 'Kunci Kategori Mengecil'}
                        >
                            {isCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
                        </button>

                        <h1 className="text-base sm:text-lg font-black text-[var(--text-primary)] font-display tracking-tight">
                            {currentMenuLabel}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            onClick={toggleFullscreen}
                            className="p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
                            title={isFullscreen ? 'Keluar Fullscreen' : 'Mode Fullscreen'}
                        >
                            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                        </button>

                        <div className="h-5 w-[1px] bg-[var(--border)] hidden sm:block" />

                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-[var(--text-primary)] font-display leading-none mb-1">
                                Panel Admin
                            </p>
                            <p className="text-[10px] uppercase tracking-wider font-bold text-[var(--text-muted)]">
                                {roleLabels[role] || 'Administrator'}
                            </p>
                        </div>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-black shadow-md shadow-[var(--primary)]/20 font-display bg-[var(--primary)] shrink-0">
                            {(roleLabels[role] || role)?.charAt(0).toUpperCase() || 'A'}
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <div className="max-w-[1200px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
