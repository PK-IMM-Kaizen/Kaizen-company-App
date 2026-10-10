'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Logo from '../../../components/common/Logo'
import { adminMenuByRole, roleLabels, type Role } from '../../(public)/data'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()

    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [role, setRole] = useState<Role | null>(null)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        const savedRole = localStorage.getItem('userRole') as Role | null
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

    const getRoutePath = (pageKey: string) => {
        if (!pageKey || pageKey === 'dashboard' || pageKey === 'overview') {
            return '/dashboard'
        }

        if (pageKey.startsWith('admin-')) {
            return `/dashboard/${pageKey}`
        }

        return `/dashboard/admin-${pageKey}`
    }

    if (!isMounted || !role) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#111111] text-white font-display">
                Memuat Dashboard...
            </div>
        )
    }

    const menu = adminMenuByRole[role] || []
    const currentMenuLabel = menu.find(m => getRoutePath(m.page) === pathname)?.label ?? 'Dashboard'

    return (
        <div className="min-h-screen flex" style={{ background: '#F7F6F5' }}>
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 lg:hidden bg-black/40 backdrop-blur-sm transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside
                className={`fixed lg:static inset-y-0 left-0 z-30 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
                style={{ width: '220px', background: '#111', flexShrink: 0 }}>

                <div className="p-4 border-b" style={{ borderColor: '#222' }}>
                    <Logo variant="white" size="sm" />
                </div>

                <div className="px-4 py-2" style={{ borderBottom: '1px solid #222' }}>
                    <span className="text-[10px] font-bold uppercase tracking-widest"
                          style={{ color: '#E07B1A', fontFamily: 'Montserrat, sans-serif' }}>
                        {roleLabels[role]}
                    </span>
                </div>

                <nav className="flex-1 py-3 overflow-y-auto">
                    {menu.map(item => {
                        const itemPath = getRoutePath(item.page)
                        const isActive = pathname === itemPath

                        return (
                            <button
                                key={item.page}
                                onClick={() => {
                                    router.push(itemPath)
                                    setSidebarOpen(false)
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-xs font-semibold transition-all hover:bg-white/5"
                                style={{
                                    fontFamily: 'Montserrat, sans-serif',
                                    color: isActive ? '#fff' : '#888',
                                    background: isActive ? '#C8102E' : 'transparent',
                                    borderLeft: isActive ? '3px solid #E07B1A' : '3px solid transparent',
                                }}>
                                <span className="text-sm">{item.icon}</span>
                                {item.label}
                            </button>
                        )
                    })}
                </nav>

                <div className="p-4 border-t" style={{ borderColor: '#222' }}>
                    <button
                        onClick={handleLogout}
                        className="w-full text-xs flex items-center gap-2 px-3 py-2 rounded transition-colors hover:bg-white/5 hover:text-white"
                        style={{ color: '#888', fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Keluar
                    </button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                <header className="flex items-center justify-between px-5 py-3 bg-white shadow-sm"
                        style={{ borderBottom: '1px solid #E0DEDC', flexShrink: 0 }}>
                    <div className="flex items-center gap-3">
                        <button className="lg:hidden p-1.5 rounded hover:bg-gray-100 transition-colors" onClick={() => setSidebarOpen(true)}>
                            <div className="w-5 flex flex-col gap-1">
                                <span className="block h-0.5 bg-gray-700" />
                                <span className="block h-0.5 bg-gray-700" />
                                <span className="block h-0.5 bg-gray-700" />
                            </div>
                        </button>
                        <h1 className="text-sm font-black text-gray-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            {currentMenuLabel}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold text-gray-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>Admin Kaizen</p>
                            <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: '#888' }}>{roleLabels[role]}</p>
                        </div>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black shadow-md shadow-[#C8102E]/20"
                             style={{ background: '#C8102E', fontFamily: 'Montserrat, sans-serif' }}>
                            {roleLabels[role]?.charAt(0) || 'A'}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-4 sm:p-6">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}