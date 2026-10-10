'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Logo from '../../components/common/Logo'
import { Lock, Mail, ArrowLeft, ShieldCheck } from 'lucide-react'

type Role = 'superadmin'

const demoAccount = {
    label: 'Super Admin',
    role: 'superadmin' as Role,
    email: 'superadmin@kaizen.id',
    password: 'admin123'
}

export default function LoginPage() {
    const router = useRouter()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        setTimeout(() => {
            const inputEmail = email.trim()

            if (inputEmail === demoAccount.email && password === demoAccount.password) {
                localStorage.setItem('isAuthenticated', 'true')
                localStorage.setItem('userRole', demoAccount.role)

                router.replace('/dashboard')
            } else {
                setError('Email atau kata sandi tidak valid. Coba klik tombol Demo di bawah.')
            }
            setLoading(false)
        }, 600)
    }

    return (
        <div className="min-h-screen flex bg-[var(--surface)]">
            <div
                className="hidden lg:flex flex-col justify-between p-12 w-96 flex-shrink-0 relative overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)'
                }}
            >
                <div className="relative z-10">
                    <Logo variant="white" size="md" />
                </div>

                <div className="relative z-10 flex flex-col items-center justify-center my-auto">
                    <div className="w-36 h-36 rounded-full bg-black/20 border-2 border-white/10 flex items-center justify-center p-4 mb-6 shadow-2xl backdrop-blur-sm">
                        <img
                            src="/img/logo/logo.jpg"
                            alt="IMM Kaizen"
                            className="w-full h-full object-contain rounded-full mix-blend-screen drop-shadow-[0_0_15px_rgba(245,196,0,0.3)]"
                        />
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl font-black text-white mb-2 font-display">
                            Panel Admin <br />
                            <span className="text-[var(--accent-light)]">IMM KAIZEN</span>
                        </h2>
                        <p className="text-xs leading-relaxed text-white/70 max-w-xs font-sans">
                            Masuk untuk mengelola konten, kepengurusan, produk Ekowir, dan data organisasi IMM Komisariat Kaizen.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 text-[10px] text-white/40 font-display uppercase tracking-widest text-center">
                    © 2026 IMM Kaizen · Kaizen Company V1
                </div>

                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-sm space-y-6">
                    <div className="lg:hidden mb-8 flex justify-center">
                        <Logo size="md" />
                    </div>

                    <div>
                        <div className="flex items-center gap-2 text-[var(--primary)] text-xs font-bold tracking-widest uppercase mb-1 font-display">
                            <ShieldCheck className="w-4 h-4" /> Autentikasi Pengurus
                        </div>
                        <h1 className="text-2xl font-black text-[var(--text-primary)] font-display">
                            Masuk ke Dashboard
                        </h1>
                        <p className="text-xs text-[var(--text-muted)] mt-1">
                            Gunakan akun yang telah terdaftar untuk mengelola sistem.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="form-label flex items-center gap-1.5 mb-1.5 text-sm font-medium">
                                <Mail className="w-3.5 h-3.5 text-[var(--text-muted)]" /> Email
                            </label>
                            <input
                                type="email"
                                className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="nama@kaizen.id"
                                required
                            />
                        </div>
                        <div>
                            <label className="form-label flex items-center gap-1.5 mb-1.5 text-sm font-medium">
                                <Lock className="w-3.5 h-3.5 text-[var(--text-muted)]" /> Kata Sandi
                            </label>
                            <input
                                type="password"
                                className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg text-xs bg-red-50 text-red-600 border border-red-200 font-medium">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-[var(--primary)] text-white text-xs font-bold tracking-widest uppercase rounded-lg shadow-md hover:bg-[var(--primary-dark)] hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                            style={{ opacity: loading ? 0.7 : 1 }}
                            disabled={loading}
                        >
                            {loading ? 'Memverifikasi...' : 'Masuk Dashboard'}
                        </button>
                    </form>

                    <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] shadow-sm">
                        <p className="text-xs font-bold text-[var(--text-secondary)] mb-3 font-display text-center">
                            Akses Cepat (Simulasi)
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setEmail(demoAccount.email);
                                setPassword(demoAccount.password);
                                setError('');
                            }}
                            className="w-full text-xs px-3 py-2.5 rounded-lg font-bold transition-all text-center bg-[var(--surface)] hover:bg-[var(--primary)] hover:text-white border border-[var(--border)] font-display"
                        >
                            Isi Otomatis sebagai {demoAccount.label}
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={() => router.push('/')}
                        className="mt-4 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--primary)] w-full text-center transition-colors flex items-center justify-center gap-2 font-display"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Website Utama
                    </button>
                </div>
            </div>
        </div>
    )
}