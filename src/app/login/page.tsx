'use client'

import { useState, useEffect } from 'react'
import Logo from '../../components/common/Logo'
import { Lock, Mail, ArrowLeft, ShieldCheck } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        localStorage.removeItem('isAuthenticated')
        localStorage.removeItem('userRole')
    }, [])

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password: password,
            })

            if (authError) {
                setError('Email atau kata sandi tidak valid.')
                setLoading(false)
                return
            }

            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', authData.user?.id)
                .single()

            if (profileError && profileError.code !== 'PGRST116') {
                console.error('Gagal mengambil profil:', profileError)
            }

            const userRole = (profileData?.role || 'admin').trim().toLowerCase()

            localStorage.setItem('isAuthenticated', 'true')
            localStorage.setItem('userRole', userRole)

            window.location.href = '/dashboard'
        } catch (err) {
            setError('Terjadi kesalahan pada sistem. Silakan coba lagi.')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex bg-[var(--surface)] relative overflow-hidden font-sans selection:bg-[var(--primary)] selection:text-white">
            <div
                className="hidden lg:flex flex-col justify-between p-8 xl:p-12 w-80 xl:w-96 shrink-0 relative overflow-hidden z-10"
                style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)' }}
            >
                <div className="relative z-20">
                    <Logo variant="white" size="md" />
                </div>

                <div className="relative z-20 flex flex-col items-center justify-center my-auto py-8">
                    <div className="w-28 h-28 xl:w-36 xl:h-36 rounded-full bg-black/20 border-2 border-white/10 flex items-center justify-center p-3 xl:p-4 mb-6 shadow-2xl backdrop-blur-sm">
                        <img
                            src="/img/logo/logo.png"
                            alt="IMM Kaizen"
                            className="w-full h-full object-contain rounded-full mix-blend-screen drop-shadow-[0_0_15px_rgba(245,196,0,0.3)]"
                        />
                    </div>
                    <div className="text-center">
                        <h2 className="text-xl xl:text-2xl font-black text-white mb-2 font-display leading-snug">
                            Panel Admin <br />
                            <span className="text-[var(--accent-light)]">IMM KAIZEN</span>
                        </h2>
                        <p className="text-xs leading-relaxed text-white/70 max-w-xs font-sans">
                            Masuk untuk mengelola konten, kepengurusan, produk Ekowir, dan data organisasi.
                        </p>
                    </div>
                </div>

                <div className="relative z-20 text-[10px] text-white/40 font-display uppercase tracking-widest text-center">
                    © 2026 IMM Kaizen · Kaizen Company V1
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-5 xs:p-6 sm:p-10 lg:p-12 relative z-50 bg-[var(--surface)] pointer-events-auto min-h-screen lg:min-h-0">
                <div className="w-full max-w-sm sm:max-w-md space-y-6 sm:space-y-8 relative z-50 my-auto">
                    <div className="lg:hidden flex flex-col items-center text-center mb-2">
                        <div className="mb-4">
                            <Logo size="md" />
                        </div>
                        <div className="w-16 h-16 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 flex items-center justify-center p-2.5 shadow-sm">
                            <img
                                src="/img/logo/logo.png"
                                alt="IMM Kaizen"
                                className="w-full h-full object-contain rounded-full"
                            />
                        </div>
                    </div>

                    <div className="text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[var(--primary)] text-[11px] sm:text-xs font-bold tracking-widest uppercase mb-1.5 font-display">
                            <ShieldCheck className="w-4 h-4" /> Autentikasi Pengurus
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] font-display tracking-tight">
                            Masuk ke Dashboard
                        </h1>
                        <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1.5 leading-relaxed">
                            Gunakan akun yang telah terdaftar untuk mengelola sistem.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 relative z-50">
                        <div>
                            <label className="form-label flex items-center gap-1.5 mb-1.5 text-xs sm:text-sm font-medium text-[var(--text-primary)] font-display">
                                <Mail className="w-3.5 h-3.5 text-[var(--text-muted)]" /> Email
                            </label>
                            <input
                                type="email"
                                className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-xs sm:text-sm cursor-text relative z-50 text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="nama@kaizen.id"
                                required
                            />
                        </div>

                        <div>
                            <label className="form-label flex items-center gap-1.5 mb-1.5 text-xs sm:text-sm font-medium text-[var(--text-primary)] font-display">
                                <Lock className="w-3.5 h-3.5 text-[var(--text-muted)]" /> Kata Sandi
                            </label>
                            <input
                                type="password"
                                className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-xs sm:text-sm cursor-text relative z-50 text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3.5 rounded-xl text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/40 font-medium">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-3 sm:py-3.5 px-4 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-xs font-bold tracking-widest uppercase rounded-xl shadow-md shadow-[var(--primary)]/20 transition-all flex items-center justify-center gap-2 cursor-pointer relative z-50 disabled:opacity-70 disabled:cursor-not-allowed font-display"
                            disabled={loading}
                        >
                            {loading ? 'Memverifikasi...' : 'Masuk Dashboard'}
                        </button>
                    </form>

                    <div className="pt-2">
                        <button
                            type="button"
                            onClick={() => window.location.href = '/'}
                            className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--primary)] w-full text-center transition-colors flex items-center justify-center gap-2 font-display relative z-50 cursor-pointer py-1"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Website Utama
                        </button>
                    </div>

                    <div className="lg:hidden text-center pt-4 text-[10px] text-[var(--text-muted)] font-display uppercase tracking-widest">
                        © 2026 IMM Kaizen · Kaizen Company V1
                    </div>
                </div>
            </div>
        </div>
    )
}