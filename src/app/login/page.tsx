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

    // PERBAIKAN 1: Otomatis hapus sesi lama/nyangkut saat halaman login dibuka
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

            // Memastikan data yang masuk huruf kecil dan bersih dari spasi
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
        <div className="min-h-screen flex bg-[var(--surface)] relative overflow-hidden">
            {/* Panel Kiri Desktop - Diberi batasan ketat agar tidak menutupi tombol */}
            <div
                className="hidden lg:flex flex-col justify-between p-12 w-96 flex-shrink-0 relative overflow-hidden z-10"
                style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)' }}
            >
                <div className="relative z-20">
                    <Logo variant="white" size="md" />
                </div>

                <div className="relative z-20 flex flex-col items-center justify-center my-auto">
                    <div className="w-36 h-36 rounded-full bg-black/20 border-2 border-white/10 flex items-center justify-center p-4 mb-6 shadow-2xl backdrop-blur-sm">
                        <img
                            src="/img/logo/logo.png"
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
                            Masuk untuk mengelola konten, kepengurusan, produk Ekowir, dan data organisasi.
                        </p>
                    </div>
                </div>

                <div className="relative z-20 text-[10px] text-white/40 font-display uppercase tracking-widest text-center">
                    © 2026 IMM Kaizen · Kaizen Company V1
                </div>
            </div>

            {/* Panel Kanan (Form Input) - PERBAIKAN 2: z-index ditingkatkan & pointer-events dipastikan hidup */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative z-50 bg-[var(--surface)] pointer-events-auto">
                <div className="w-full max-w-sm space-y-6 relative z-50">
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

                    <form onSubmit={handleSubmit} className="space-y-4 relative z-50">
                        <div>
                            <label className="form-label flex items-center gap-1.5 mb-1.5 text-sm font-medium">
                                <Mail className="w-3.5 h-3.5 text-[var(--text-muted)]" /> Email
                            </label>
                            <input
                                type="email"
                                className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm cursor-text relative z-50"
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
                                className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm cursor-text relative z-50"
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
                            className="w-full py-3 px-4 bg-[var(--primary)] text-white text-xs font-bold tracking-widest uppercase rounded-lg shadow-md hover:bg-[var(--primary-dark)] transition-all flex items-center justify-center gap-2 cursor-pointer relative z-50 disabled:opacity-70 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? 'Memverifikasi...' : 'Masuk Dashboard'}
                        </button>
                    </form>

                    <button
                        type="button"
                        onClick={() => window.location.href = '/'}
                        className="mt-4 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--primary)] w-full text-center transition-colors flex items-center justify-center gap-2 font-display relative z-50 cursor-pointer"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Website Utama
                    </button>
                </div>
            </div>
        </div>
    )
}