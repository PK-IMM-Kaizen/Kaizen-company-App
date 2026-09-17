import Link from "next/link";
import Logo from "@/components/common/Logo";

const navLinks = [
    { label: "Beranda", path: "/" },
    { label: "Profil Organisasi", path: "/profile" },
    { label: "Kepengurusan", path: "/management" },
    { label: "Profil Bidang", path: "/division" },
];

const contentLinks = [
    { label: "Berita & Dokumentasi", path: "/news" },
    { label: "Alumni Inspiratif", path: "/alumni" },
    { label: "Kontak", path: "/contact" },
];

export default function Footer() {
    return (
        <footer className="bg-[var(--footer-bg)] border-t border-[var(--footer-border)] font-sans">
            <div className="h-[3px] bg-gradient-to-r from-primary-brand via-[var(--accent)] via-60% to-yellow-400" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
                    <div className="md:col-span-2">
                        <Logo variant="white" size="md" />

                        <p className="mt-4 text-sm leading-relaxed text-[var(--footer-text-muted)] max-w-[320px]">
                            Ikatan Mahasiswa Muhammadiyah Komisariat Kaizen — Bergerak,
                            Berprestasi, Berkontribusi.
                        </p>

                        <div className="flex items-center gap-3 mt-5">
                            <a
                                href="#"
                                aria-label="Instagram"
                                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all bg-[var(--footer-surface)] border border-[var(--footer-border)] text-[var(--footer-text-muted)] hover:bg-primary-brand hover:text-white hover:border-primary-brand shadow-sm"
                            >
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </a>
                            <a
                                href="#"
                                aria-label="WhatsApp"
                                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all bg-[var(--footer-surface)] border border-[var(--footer-border)] text-[var(--footer-text-muted)] hover:bg-green-500 hover:text-white hover:border-green-500 shadow-sm"
                            >
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-primary-brand font-display">
                            Navigasi
                        </h4>
                        <ul className="space-y-2.5">
                            {navLinks.map((item) => (
                                <li key={item.path}>
                                    <Link
                                        href={item.path}
                                        className="group text-sm transition-colors text-[var(--footer-text-muted)] hover:text-white flex items-center gap-1.5"
                                    >
                                        <span className="w-1 h-1 rounded-full bg-primary-brand opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-primary-brand font-display">
                            Konten
                        </h4>
                        <ul className="space-y-2.5">
                            {contentLinks.map((item) => (
                                <li key={item.path}>
                                    <Link
                                        href={item.path}
                                        className="group text-sm transition-colors text-[var(--footer-text-muted)] hover:text-white flex items-center gap-1.5"
                                    >
                                        <span className="w-1 h-1 rounded-full bg-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-[var(--footer-border)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-[var(--footer-text-muted)]">
                        © 2026 IMM Komisariat Kaizen. Hak cipta dilindungi.
                    </p>
                    <p className="text-xs text-[var(--footer-text-muted)] font-medium">
                        Kaizen Company V1
                    </p>
                </div>
            </div>
        </footer>
    );
}