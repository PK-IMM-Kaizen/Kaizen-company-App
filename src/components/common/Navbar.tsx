"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/common/Logo";

const navItems = [
    { label: "Beranda", path: "/" },
    { label: "Profil Organisasi", path: "/profile" },
    { label: "Kepengurusan", path: "/management" },
    { label: "Profil Bidang", path: "/division" },
    { label: "Berita", path: "/news" },
    { label: "Alumni", path: "/alumni" },
    { label: "Kontak", path: "/contact" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[var(--background)] ${
                    scrolled
                        ? "border-b border-[var(--border)] shadow-sm"
                        : "border-b border-[var(--border)] shadow-none"
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center">
                            <Logo size="sm" />
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden lg:flex items-center gap-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        href={item.path}
                                        className={`px-3.5 py-2 text-[0.8125rem] font-semibold rounded transition-colors relative font-display tracking-[0.01em] ${
                                            isActive
                                                ? "text-primary-brand"
                                                : "text-[var(--text-secondary)] hover:text-primary-brand"
                                        }`}
                                    >
                                        {item.label}
                                        {isActive && (
                                            <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 rounded-full bg-primary-brand" />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* CTA Button */}
                        <div className="hidden lg:flex items-center gap-3">
                            <Link
                                href="/kaizen-company"
                                className="btn-primary !px-[14px] !py-[6px] !text-xs"
                            >
                                Kaizen Company
                            </Link>
                        </div>

                        {/* Mobile Hamburger Button */}
                        <button
                            className="lg:hidden p-2 rounded relative z-[60]"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Menu"
                        >
                            <div className="w-5 flex flex-col gap-1">
                <span
                    className={`block h-0.5 bg-[var(--text-primary)] transition-all duration-300 ${
                        mobileOpen ? "rotate-45 translate-y-1.5" : ""
                    }`}
                />
                                <span
                                    className={`block h-0.5 bg-[var(--text-primary)] transition-all duration-300 ${
                                        mobileOpen ? "opacity-0" : ""
                                    }`}
                                />
                                <span
                                    className={`block h-0.5 bg-[var(--text-primary)] transition-all duration-300 ${
                                        mobileOpen ? "-rotate-45 -translate-y-1.5" : ""
                                    }`}
                                />
                            </div>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Drawer */}
            {mobileOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-[55] lg:hidden backdrop-blur-sm transition-opacity duration-300"
                        onClick={() => setMobileOpen(false)}
                    />
                    <div className="fixed top-0 right-0 bottom-0 w-64 max-w-[80vw] bg-[var(--background)] shadow-2xl z-[55] lg:hidden flex flex-col pt-20 pb-6 px-4 overflow-y-auto transition-transform duration-300">
                        <div className="flex-1 space-y-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        href={item.path}
                                        onClick={() => setMobileOpen(false)}
                                        className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-colors font-display ${
                                            isActive
                                                ? "text-primary-brand bg-[rgba(200,16,46,0.08)]"
                                                : "text-[var(--text-primary)] hover:bg-[var(--surface)]"
                                        }`}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="pt-6 mt-4 border-t border-[var(--border)]">
                            <Link
                                href="/kaizen-company"
                                onClick={() => setMobileOpen(false)}
                                className="btn-primary w-full justify-center"
                            >
                                Kaizen Company
                            </Link>
                        </div>
                    </div>
                </>
            )}

            <div className="h-16" />
        </>
    );
}