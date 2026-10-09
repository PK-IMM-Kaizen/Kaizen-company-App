'use client'

import { useState, useEffect } from 'react'
import Logo from './Logo'
import { navItems, type Page } from '../../app/(public)/data'

interface NavbarProps {
    currentPage: Page
    onNavigate: (page: Page) => void
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const handleNav = (page: Page) => {
        onNavigate(page)
        setMobileOpen(false)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <>
            <nav
                className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
                style={{
                    background: scrolled ? '#fff' : '#fff',
                    borderBottom: scrolled ? '1px solid #E0DEDC' : '1px solid #E0DEDC',
                    boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,0.06)' : 'none',
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-16">
                        <button onClick={() => handleNav('home')} className="flex items-center">
                            <Logo size="sm" />
                        </button>

                        <div className="hidden lg:flex items-center gap-0.5">
                            {navItems.map((item) => {
                                const isActive = currentPage === item.page
                                return (
                                    <button
                                        key={item.page}
                                        onClick={() => handleNav(item.page)}
                                        className="px-3.5 py-2 text-sm font-medium rounded transition-colors relative"
                                        style={{
                                            fontFamily: 'Montserrat, sans-serif',
                                            fontWeight: 600,
                                            fontSize: '0.8125rem',
                                            color: isActive ? '#C8102E' : '#333',
                                            letterSpacing: '0.01em',
                                        }}
                                    >
                                        {item.label}
                                        {isActive && (
                                            <span
                                                className="absolute bottom-0 left-3.5 right-3.5 h-0.5 rounded-full"
                                                style={{ background: '#C8102E' }}
                                            />
                                        )}
                                    </button>
                                )
                            })}
                        </div>

                        <div className="hidden lg:flex items-center gap-3">
                            <button
                                onClick={() => handleNav('admin-login')}
                                className="btn-primary text-xs px-4 py-2"
                                style={{ fontSize: '0.75rem', padding: '6px 14px' }}
                            >
                                Admin
                            </button>
                        </div>

                        <button
                            className="lg:hidden p-2 rounded"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Menu"
                        >
                            <div className="w-5 flex flex-col gap-1">
                                <span className={`block h-0.5 bg-gray-800 transition-all ${mobileOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                                <span className={`block h-0.5 bg-gray-800 transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
                                <span className={`block h-0.5 bg-gray-800 transition-all ${mobileOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                            </div>
                        </button>
                    </div>
                </div>
            </nav>

            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 lg:hidden"
                    style={{ top: '64px' }}
                >
                    <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
                    <div className="relative bg-white border-b border-gray-200 shadow-xl">
                        <div className="px-4 py-3 space-y-1">
                            {navItems.map((item) => {
                                const isActive = currentPage === item.page
                                return (
                                    <button
                                        key={item.page}
                                        onClick={() => handleNav(item.page)}
                                        className="w-full text-left px-3 py-2.5 rounded text-sm font-semibold transition-colors"
                                        style={{
                                            fontFamily: 'Montserrat, sans-serif',
                                            color: isActive ? '#C8102E' : '#333',
                                            background: isActive ? '#FEF2F4' : 'transparent',
                                        }}
                                    >
                                        {item.label}
                                    </button>
                                )
                            })}
                            <div className="pt-2 pb-1">
                                <button
                                    onClick={() => handleNav('admin-login')}
                                    className="w-full btn-primary justify-center"
                                >
                                    Masuk Admin
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="h-16" />
        </>
    )
}
