'use client'

import { useState } from 'react'
import Logo from '../../components/common/Logo'
import { type Role, type Page } from '../../app/(public)/data'
import { Lock, Mail, ArrowLeft, ShieldCheck } from 'lucide-react'

interface LoginProps {
    onLogin: (role: Role) => void
    onNavigate: (page: Page) => void
}

const demoAccounts: { label: string; role: Role; email: string }[] = [
    { label: 'Super Admin', role: 'superadmin', email: 'superadmin@kaizen.id' }
]

export default function Login({ onLogin, onNavigate }: LoginProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setTimeout(() => {
            const acc = demoAccounts.find(a => a.email === email)
            if (acc && password === 'admin123') {
                onLogin(acc.role)
            } else {
                setError('Email atau kata sandi tidak valid.')
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
                            <label className="form-label flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-[var(--text-muted)]" /> Email
                            </label>
                            <input
                                type="email"
                                className="form-input"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="nama@kaizen.id"
                                required
                            />
                        </div>
                        <div>
                            <label className="form-label flex items-center gap-1.5">
                                <Lock className="w-3.5 h-3.5 text-[var(--text-muted)]" /> Kata Sandi
                            </label>
                            <input
                                type="password"
                                className="form-input"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 rounded-[var(--radius)] text-xs bg-[#FEF2F4] text-[var(--error)] border border-[#FECDD3] font-medium">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn-primary w-full justify-center py-3 text-xs tracking-widest uppercase shadow-md hover:scale-[1.01] transition-all"
                            style={{ opacity: loading ? 0.7 : 1 }}
                            disabled={loading}
                        >
                            {loading ? 'Memverifikasi...' : 'Masuk Dashboard'}
                        </button>
                    </form>

                    <div className="p-4 rounded-[var(--radius)] bg-[var(--card)] border border-[var(--border)] shadow-sm">
                        <p className="text-xs font-bold text-[var(--text-secondary)] mb-3 font-display text-center">
                            Demo — Klik untuk isi otomatis (password: admin123)
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                            {demoAccounts.map(acc => (
                                <button
                                    key={acc.role}
                                    type="button"
                                    onClick={() => { setEmail(acc.email); setPassword('admin123') }}
                                    className="text-xs px-3 py-2.5 rounded-[var(--radius)] font-bold transition-all text-center bg-[var(--surface)] hover:bg-[var(--surface-2)] text-[var(--text-primary)] border border-[var(--border)] font-display"
                                >
                                    Isi Otomatis sebagai {acc.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => onNavigate('home')}
                        className="mt-4 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--primary)] w-full text-center transition-colors flex items-center justify-center gap-2 font-display"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Website Utama
                    </button>
                </div>
            </div>
        </div>
    )
}