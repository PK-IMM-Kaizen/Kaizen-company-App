'use client'

import { useState } from 'react'
import Logo from '../../components/common/Logo'
import { adminMenuByRole, roleLabels, type Role, type Page } from '../../app/(public)/data'

interface AdminLayoutProps {
    role: Role
    currentPage: Page
    onNavigate: (page: Page) => void
    onLogout: () => void
    children: React.ReactNode
}

export default function AdminLayout({ role, currentPage, onNavigate, onLogout, children }: AdminLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const menu = adminMenuByRole[role]

    return (
        <div className="min-h-screen flex" style={{ background: '#F7F6F5' }}>
            {sidebarOpen && (
                <div className="fixed inset-0 z-20 lg:hidden bg-black/40"
                     onClick={() => setSidebarOpen(false)} />
            )}

            <aside
                className={`fixed lg:static inset-y-0 left-0 z-30 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
                style={{ width: '220px', background: '#111', flexShrink: 0 }}>
                <div className="p-4 border-b" style={{ borderColor: '#222' }}>
                    <Logo variant="white" size="sm" />
                </div>

                <div className="px-4 py-2" style={{ borderBottom: '1px solid #222' }}>
          <span className="text-xs font-bold uppercase tracking-widest"
                style={{ color: '#E07B1A', fontFamily: 'Montserrat, sans-serif' }}>
            {roleLabels[role]}
          </span>
                </div>

                <nav className="flex-1 py-3 overflow-y-auto">
                    {menu.map(item => {
                        const isActive = currentPage === item.page
                        return (
                            <button
                                key={item.page}
                                onClick={() => { onNavigate(item.page); setSidebarOpen(false) }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-xs font-semibold transition-all"
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
                        onClick={onLogout}
                        className="w-full text-xs flex items-center gap-2 px-3 py-2 rounded transition-colors"
                        style={{ color: '#888', fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                        <span>⬡</span> Keluar
                    </button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                <header className="flex items-center justify-between px-5 py-3 bg-white"
                        style={{ borderBottom: '1px solid #E0DEDC', flexShrink: 0 }}>
                    <div className="flex items-center gap-3">
                        <button className="lg:hidden p-1.5 rounded" onClick={() => setSidebarOpen(true)}>
                            <div className="w-5 flex flex-col gap-1">
                                <span className="block h-0.5 bg-gray-700" />
                                <span className="block h-0.5 bg-gray-700" />
                                <span className="block h-0.5 bg-gray-700" />
                            </div>
                        </button>
                        <h1 className="text-sm font-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            {menu.find(m => m.page === currentPage)?.label ?? 'Dashboard'}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>Admin Kaizen</p>
                            <p className="text-xs" style={{ color: '#888' }}>{roleLabels[role]}</p>
                        </div>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black"
                             style={{ background: '#C8102E', fontFamily: 'Montserrat, sans-serif' }}>
                            {roleLabels[role].charAt(0)}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-5">
                    {children}
                </main>
            </div>
        </div>
    )
}
