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

    const textColor = scrolled ? '#333' : '#fff'
    const activeColor = scrolled ? '#C8102E' : '#F5C400'
    const logoVariant = scrolled ? 'default' : 'white'

    return (
        <>
            <nav
                className={`fixed z-50 transition-all duration-300 ease-out left-1/2 -translate-x-1/2 ${
                    scrolled
                        ? 'top-4 w-[calc(100%-2rem)] max-w-5xl bg-white/90 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-200/60 rounded-full'
                        : 'top-0 w-full bg-transparent border-transparent rounded-none py-2'
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-16">
                        <button onClick={() => handleNav('home')} className="flex items-center ml-2 lg:ml-0">
                            <Logo size="sm" variant={logoVariant} />
                        </button>

                        <div className="hidden lg:flex items-center gap-1">
                            {navItems.map((item) => {
                                const isActive = currentPage === item.page
                                return (
                                    <button
                                        key={item.page}
                                        onClick={() => handleNav(item.page)}
                                        className="relative px-4 py-2 text-[13px] font-semibold rounded-full transition-colors font-montserrat tracking-wide"
                                        style={{ color: isActive ? activeColor : textColor }}
                                    >
                                        {item.label}
                                        {isActive && (
                                            <span
                                                className="absolute bottom-1.5 left-4 right-4 h-[2px] rounded-full transition-colors"
                                                style={{ background: activeColor }}
                                            />
                                        )}
                                    </button>
                                )
                            })}
                        </div>

                        <div className="hidden lg:flex items-center pr-2">
                            <button
                                onClick={() => handleNav('admin-login')}
                                className={`text-xs px-5 py-2 rounded-full font-medium transition-all hover:scale-105 ${
                                    scrolled
                                        ? 'bg-[#C8102E] text-white hover:bg-[#9b0d23]'
                                        : 'bg-white text-[#C8102E] hover:bg-gray-100'
                                }`}
                            >
                                Admin
                            </button>
                        </div>

                        <button
                            className="lg:hidden p-2 mr-1 rounded-full transition-colors"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Menu"
                        >
                            <div className="w-5 flex flex-col gap-1.5">
                                <span className={`block h-0.5 transition-transform origin-center ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} style={{ background: textColor }} />
                                <span className={`block h-0.5 transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} style={{ background: textColor }} />
                                <span className={`block h-0.5 transition-transform origin-center ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} style={{ background: textColor }} />
                            </div>
                        </button>
                    </div>
                </div>
            </nav>

            {mobileOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setMobileOpen(false)}
                    />

                    <div
                        className={`absolute left-4 right-4 bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 ${
                            scrolled ? 'top-24' : 'top-20'
                        }`}
                    >
                        <div className="px-3 py-3 space-y-1">
                            {navItems.map((item) => {
                                const isActive = currentPage === item.page
                                return (
                                    <button
                                        key={item.page}
                                        onClick={() => handleNav(item.page)}
                                        className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors font-montserrat"
                                        style={{
                                            color: isActive ? '#C8102E' : '#333',
                                            background: isActive ? '#FEF2F4' : 'transparent',
                                        }}
                                    >
                                        {item.label}
                                    </button>
                                )
                            })}
                            <div className="pt-2 pb-1 px-1">
                                <button
                                    onClick={() => handleNav('admin-login')}
                                    className="w-full py-3 rounded-xl shadow-sm text-white font-semibold text-sm transition-colors hover:bg-[#9b0d23]"
                                    style={{ background: '#C8102E' }}
                                >
                                    Kaizen Company
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}