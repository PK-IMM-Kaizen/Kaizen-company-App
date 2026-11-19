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

    const logLoginActivity = async (userEmail: string, action: 'LOGIN_SUCCESS' | 'LOGIN_FAILED', details: string) => {
        try {
            await supabase.from('system_logs').insert([
                {
                    admin_name: userEmail,
                    user_email: userEmail,
                    action: action === 'LOGIN_SUCCESS' ? 'Login Berhasil' : 'Login Gagal',
                    target: 'Dashboard Panel',
                    type: 'users',
                    module: 'Autentikasi',
                    details: details,
                }
            ])
        } catch (logErr) {
            console.error('Gagal mencatat log login:', logErr)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const cleanEmail = email.trim()

        try {
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email: cleanEmail,
                password: password,
            })

            if (authError) {
                setError('Email atau kata sandi tidak valid.')
                setLoading(false)

                await logLoginActivity(cleanEmail, 'LOGIN_FAILED', 'Gagal login: Email atau kata sandi salah')
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

            await logLoginActivity(cleanEmail, 'LOGIN_SUCCESS', `Pengurus berhasil masuk dashboard dengan role: ${userRole}`)

            window.location.href = '/dashboard'
        } catch (err) {
            setError('Terjadi kesalahan pada sistem. Silakan coba lagi.')
            setLoading(false)

            await logLoginActivity(cleanEmail, 'LOGIN_FAILED', 'Terjadi kesalahan sistem saat mencoba login')
        }
    }

    return (
        <div className="min-h-screen flex admin-layout relative overflow-hidden font-sans selection:bg-[var(--primary)] selection:text-white">
            <div
                className="hidden lg:flex flex-col justify-between p-8 xl:p-12 w-80 xl:w-96 shrink-0 relative overflow-hidden z-10 mk-bg-dark border-r-2 border-[var(--mk-ink)] shadow-[4px_0_0_var(--mk-ink)]"
                style={{ backgroundColor: 'var(--primary)' }}
            >
                <div className="mk-decor">
                    <div className="mk-dots right-8 top-12 opacity-30"></div>
                    <div className="-left-10 -bottom-10 opacity-20 mk-star mk-star--lg mk-star--spin"></div>
                </div>

                <div className="relative z-20">
                    <Logo variant="white" size="md" />
                </div>

                <div className="relative z-20 flex flex-col items-center justify-center my-auto py-8">
                    <div className="w-28 h-28 xl:w-36 xl:h-36 rounded-2xl bg-white/5 border-2 border-[var(--accent-light)] flex items-center justify-center p-3 xl:p-4 mb-8 shadow-[6px_6px_0_var(--mk-ink)] backdrop-blur-sm rotate-3 hover:rotate-0 transition-transform duration-300">
                        <img
                            src="/img/logo/logo.png"
                            alt="IMM Kaizen"
                            className="w-full h-full object-contain mix-blend-screen drop-shadow-[0_0_15px_rgba(245,196,0,0.4)]"
                        />
                    </div>
                    <div className="text-center">
                        <span className="mk-chip mb-3 shadow-[2px_2px_0_var(--mk-ink)] bg-[var(--accent)] text-[var(--mk-ink)]">
                            Sistem Internal
                        </span>
                        <h2 className="text-2xl xl:text-3xl font-black text-white mt-4 mb-2 font-display leading-snug uppercase">
                            Panel Admin <br />
                            <span className="text-[var(--accent-light)]">IMM KAIZEN</span>
                        </h2>
                        <p className="text-xs leading-relaxed text-white/80 max-w-xs font-sans mt-3 font-medium">
                            Masuk untuk mengelola konten, kepengurusan, produk Ekowir, dan data organisasi.
                        </p>
                    </div>
                </div>

                <div className="relative z-20 text-[10px] text-white/50 font-display uppercase tracking-widest text-center font-bold">
                    © 2026 IMM Kaizen · Kaizen Company V1
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-5 xs:p-6 sm:p-10 lg:p-12 relative z-50 pointer-events-auto min-h-screen lg:min-h-0">

                <div className="w-full max-w-sm sm:max-w-md bg-[var(--card)] rounded-2xl border-2 border-[var(--border-strong)] shadow-[6px_6px_0_var(--surface-2)] relative z-50 my-auto overflow-hidden">

                    <div className="h-1.5 w-full bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--accent-light)]" />

                    <div className="p-6 sm:p-8 space-y-6 sm:space-y-8">
                        <div className="lg:hidden flex flex-col items-center text-center mb-2">
                            <div className="mb-5">
                                <Logo size="md" />
                            </div>
                            <div className="w-16 h-16 rounded-xl bg-[var(--primary)]/5 border-2 border-[var(--primary)]/20 flex items-center justify-center p-2.5 shadow-[3px_3px_0_var(--border)]">
                                <img
                                    src="/img/logo/logo.png"
                                    alt="IMM Kaizen"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>

                        <div className="text-center sm:text-left">
                            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[var(--primary)] text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-2 font-display">
                                <ShieldCheck className="w-4 h-4" /> Autentikasi Pengurus
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] font-display tracking-tight">
                                Masuk Dashboard
                            </h1>
                            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5 leading-relaxed font-medium">
                                Gunakan email dan kata sandi yang telah terdaftar di sistem Kaizen.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                            <div>
                                <label className="flex items-center gap-1.5 mb-2 text-xs sm:text-sm font-bold text-[var(--text-primary)] font-display uppercase tracking-wide">
                                    <Mail className="w-3.5 h-3.5 text-[var(--primary)]" /> Email
                                </label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--surface)] focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all text-xs sm:text-sm font-medium text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="nama@kaizen.id"
                                    required
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-1.5 mb-2 text-xs sm:text-sm font-bold text-[var(--text-primary)] font-display uppercase tracking-wide">
                                    <Lock className="w-3.5 h-3.5 text-[var(--primary)]" /> Kata Sandi
                                </label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--surface)] focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all text-xs sm:text-sm font-medium text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="p-3.5 rounded-xl text-xs bg-[var(--error)]/10 text-[var(--error)] border-2 border-[var(--error)]/20 font-bold font-display tracking-wide">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full py-3.5 px-4 bg-[var(--primary)] text-white text-xs font-bold tracking-widest uppercase rounded-xl border-2 border-transparent hover:border-[var(--mk-ink)] shadow-[4px_4px_0_rgba(0,0,0,0.1)] hover:shadow-[4px_4px_0_var(--mk-ink)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer font-display disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                                disabled={loading}
                            >
                                {loading ? 'Memverifikasi...' : 'Masuk ke Sistem'}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="pt-6 w-full max-w-sm sm:max-w-md">
                    <button
                        type="button"
                        onClick={() => window.location.href = '/'}
                        className="text-[11px] sm:text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--primary)] w-full text-center transition-colors flex items-center justify-center gap-2 font-display uppercase tracking-wider cursor-pointer py-2 hover:bg-[var(--primary)]/5 rounded-lg"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Website Utama
                    </button>
                </div>

                <div className="lg:hidden text-center pt-8 text-[10px] text-[var(--text-muted)] font-display uppercase tracking-widest font-bold">
                    © 2026 IMM Kaizen · Kaizen Company V1.6
                </div>
            </div>
        </div>
    )
}