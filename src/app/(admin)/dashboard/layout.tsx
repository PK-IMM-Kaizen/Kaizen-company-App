'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Logo from '../../../components/common/Logo'
import {
    LayoutDashboard, Newspaper, ShoppingBag, Users,
    GraduationCap, Building, ShieldCheck, LogOut, Menu, X
} from 'lucide-react'

const roleLabels: Record<string, string> = {
    superadmin: 'Super Admin',
    admin: 'Admin Bidang',
    bpi: 'Admin BPI',
    medkom: 'Admin Medkom',
    ekowir: 'Admin Ekowir'
}

const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" />, allowedRoles: ['superadmin', 'admin', 'bpi', 'medkom', 'ekowir'] },
    { name: 'Kelola Berita', path: '/dashboard/berita', icon: <Newspaper className="w-4 h-4" />, allowedRoles: ['superadmin', 'admin', 'bpi', 'medkom', 'ekowir'] },
    { name: 'Produk Ekowir', path: '/dashboard/ekowir', icon: <ShoppingBag className="w-4 h-4" />, allowedRoles: ['superadmin', 'ekowir'] },
    { name: 'Kepengurusan', path: '/dashboard/kepengurusan', icon: <Users className="w-4 h-4" />, allowedRoles: ['superadmin', 'admin', 'bpi'] },
    { name: 'Data Alumni', path: '/dashboard/alumni', icon: <GraduationCap className="w-4 h-4" />, allowedRoles: ['superadmin', 'admin', 'bpi'] },
    { name: 'Profil Organisasi', path: '/dashboard/organisasi', icon: <Building className="w-4 h-4" />, allowedRoles: ['superadmin'] },
    { name: 'Pengguna & Akses', path: '/dashboard/users', icon: <ShieldCheck className="w-4 h-4" />, allowedRoles: ['superadmin'] },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()

    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [role, setRole] = useState<string | null>(null)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        const savedRole = localStorage.getItem('userRole')
        const isAuth = localStorage.getItem('isAuthenticated')

        if (!isAuth || !savedRole) {
            router.replace('/')
        } else {
            setRole(savedRole)
        }
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated')
        localStorage.removeItem('userRole')
        router.replace('/')
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

    return (
        <div className="h-screen flex bg-[var(--background)] overflow-hidden">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 md:hidden bg-black/50 backdrop-blur-sm transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside
                className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col transition-transform duration-300 w-[240px] bg-[#111111] text-white flex-shrink-0 shadow-2xl md:shadow-none ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                }`}
            >
                <div className="p-5 border-b border-white/10 flex items-center justify-between">
                    <Logo variant="white" size="sm" />
                    <button className="md:hidden text-white/50 hover:text-white" onClick={() => setSidebarOpen(false)}>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-5 py-3 border-b border-white/5 bg-white/5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)] font-display">
                        Akses: {roleLabels[role] || role}
                    </span>
                </div>

                <nav className="flex-1 py-4 overflow-y-auto px-3 space-y-1">
                    {filteredMenu.map(item => {
                        const isActive = pathname === item.path
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all font-display ${
                                    isActive
                                        ? 'bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20'
                                        : 'text-white/60 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-white/60 hover:bg-red-500/10 hover:text-red-500 font-display uppercase tracking-wider"
                    >
                        <LogOut className="w-4 h-4" /> Keluar
                    </button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col h-full overflow-y-auto max-w-full relative z-0">
                <header className="flex items-center justify-between px-4 sm:px-6 py-4 bg-[var(--card)] border-b border-[var(--border)] sticky top-0 z-30 shadow-sm">
                    <div className="flex items-center gap-3">
                        <button
                            className="md:hidden p-2 rounded-lg bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <h1 className="text-base sm:text-lg font-black text-[var(--text-primary)] font-display tracking-tight">
                            {currentMenuLabel}
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-[var(--text-primary)] font-display leading-none mb-1">
                                Panel Admin
                            </p>
                            <p className="text-[10px] uppercase tracking-wider font-bold text-[var(--text-muted)]">
                                {roleLabels[role] || 'Administrator'}
                            </p>
                        </div>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-black shadow-md shadow-[var(--primary)]/20 font-display bg-[var(--primary)]">
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