'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import Logo from './Logo'
import { navItems } from '../../app/(public)/data'

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    const pathname = usePathname()

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [mobileOpen])

    const closeMobile = () => setMobileOpen(false)

    const textColor = scrolled ? '#333' : '#fff'
    const activeColor = scrolled ? '#C8102E' : '#F5C400'
    const logoVariant = scrolled ? 'default' : 'white'

    const getPath = (page: string) => {
        if (page === 'home') return '/'
        if (page === 'profile') return '/profil'
        if (page === 'news') return '/berita'
        if (page === 'management') return '/kepengurusan'
        if (page === 'division') return '/bidang'
        if (page === 'admin-alumni') return '/admin-alumni'
        if (page === 'kontak') return '/kontak'
        return `/${page}`
    }

    return (
        <>
            <nav
                className={`fixed z-40 transition-all duration-300 ease-out left-1/2 -translate-x-1/2 ${
                    scrolled
                        ? 'top-4 w-[calc(100%-2rem)] max-w-5xl bg-white/90 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-200/60 rounded-full'
                        : 'top-0 w-full bg-transparent border-transparent rounded-none py-2'
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" onClick={closeMobile} className="flex items-center ml-2 lg:ml-0">
                            <Logo size="sm" variant={logoVariant} />
                        </Link>

                        <div className="hidden lg:flex items-center gap-1">
                            {navItems.map((item) => {
                                const itemPath = getPath(item.page)
                                const isActive = pathname === itemPath || (pathname.startsWith(itemPath) && itemPath !== '/')

                                return (
                                    <Link
                                        key={item.page}
                                        href={itemPath}
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
                                    </Link>
                                )
                            })}
                        </div>

                        <div className="hidden lg:flex items-center gap-2 pr-2">
                            <Link
                                href="/kaizen-company"
                                className={`text-xs px-4 py-2 rounded-full font-semibold transition-all hover:scale-105 flex items-center ${
                                    scrolled
                                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                                }`}
                            >
                                Kaizen Company
                            </Link>

                            <a
                                href="/daftar-dad"
                                className={`text-xs px-5 py-2 rounded-full font-bold transition-all shadow-sm hover:scale-105 flex items-center ${
                                    scrolled
                                        ? 'bg-[#C8102E] text-white hover:bg-[#9b0d23]'
                                        : 'bg-[#F5C400] text-gray-900 hover:bg-[#e6b800]'
                                }`}
                            >
                                Daftar DAD
                            </a>
                        </div>

                        <button
                            className="lg:hidden p-2 mr-1 rounded-full transition-colors relative z-50"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Menu"
                        >
                            <div className="w-5 flex flex-col gap-1.5">
                                <span className="block h-0.5 transition-transform origin-center" style={{ background: textColor }} />
                                <span className="block h-0.5 transition-opacity" style={{ background: textColor }} />
                                <span className="block h-0.5 transition-transform origin-center" style={{ background: textColor }} />
                            </div>
                        </button>
                    </div>
                </div>
            </nav>

            <div
                className={`fixed inset-0 z-50 lg:hidden pointer-events-none ${
                    mobileOpen ? 'pointer-events-auto' : ''
                }`}
            >
                <div
                    className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
                        mobileOpen ? 'opacity-100' : 'opacity-0'
                    }`}
                    onClick={closeMobile}
                />

                <div
                    className={`absolute top-0 right-0 h-full w-[280px] sm:w-[320px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
                        mobileOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                >
                    <div className="flex items-center justify-between p-5 border-b border-gray-100">
                        <Logo size="sm" variant="default" />
                        <button
                            onClick={closeMobile}
                            className="p-2 -mr-2 text-gray-400 hover:text-primary transition-colors rounded-full hover:bg-gray-50"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-1">
                        {navItems.map((item) => {
                            const itemPath = getPath(item.page)
                            const isActive = pathname === itemPath || (pathname.startsWith(itemPath) && itemPath !== '/')

                            return (
                                <Link
                                    key={item.page}
                                    href={itemPath}
                                    onClick={closeMobile}
                                    className="w-full text-left px-4 py-3.5 rounded-xl text-sm font-semibold transition-all font-montserrat flex items-center justify-between group"
                                    style={{
                                        color: isActive ? '#C8102E' : '#4B5563',
                                        background: isActive ? '#FEF2F4' : 'transparent',
                                    }}
                                >
                                    {item.label}
                                    <span className={`text-[10px] transition-transform ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`}>
                                        ❯
                                    </span>
                                </Link>
                            )
                        })}
                    </div>

                    <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex flex-col gap-3">
                        <a
                            href="#/daftar-dad"
                            className="w-full py-3.5 rounded-xl shadow-md shadow-red-900/10 text-white font-bold text-sm transition-all hover:bg-[#9b0d23] hover:shadow-lg active:scale-[0.98] flex justify-center items-center"
                            style={{ background: '#C8102E' }}
                        >
                            Daftar DAD
                        </a>

                        <Link
                            href="/kaizen-company"
                            onClick={closeMobile}
                            className="w-full py-3.5 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold text-sm transition-all hover:bg-gray-100 active:scale-[0.98] flex justify-center items-center"
                        >
                            Kaizen Company
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}