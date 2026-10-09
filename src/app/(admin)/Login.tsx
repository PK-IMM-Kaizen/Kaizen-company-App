'use client'

import { useState } from 'react'
import Logo from '../../components/common/Logo'
import logoImg from '../../../public/img/logo/logo.jpg'
import { type Role, type Page } from '../../app/(public)/data'

interface LoginProps {
    onLogin: (role: Role) => void
    onNavigate: (page: Page) => void
}

const demoAccounts: { label: string; role: Role; email: string }[] = [
    { label: 'Super Admin', role: 'superadmin', email: 'superadmin@kaizen.id' },
    { label: 'BPI', role: 'bpi', email: 'bpi@kaizen.id' },
    { label: 'Medkom', role: 'medkom', email: 'medkom@kaizen.id' },
    { label: 'Ekowir', role: 'ekowir', email: 'ekowir@kaizen.id' },
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
        <div className="min-h-screen flex" style={{ background: '#F7F6F5' }}>
            <div className="hidden lg:flex flex-col justify-between p-12 w-96 flex-shrink-0"
                 style={{ background: '#C8102E', backgroundImage: 'linear-gradient(135deg, #C8102E 0%, #9B0D22 100%)' }}>
                <Logo variant="white" size="md" />
                <div className="flex justify-center">
                    <img
                        src={logoImg.src}
                        alt="IMM Kaizen"
                        style={{
                            width: 160,
                            height: 160,
                            objectFit: 'contain',
                            mixBlendMode: 'screen',
                            filter: 'brightness(1.1) drop-shadow(0 0 24px rgba(245,196,0,0.3))',
                        }}
                    />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-white mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        Panel Admin<br />IMM Kaizen
                    </h2>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                        Masuk untuk mengelola konten, kepengurusan, produk Ekowir, dan data organisasi IMM Komisariat Kaizen.
                    </p>
                </div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    © 2024 IMM Kaizen · Kaizen Company V1
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-sm">
                    <div className="lg:hidden mb-8 flex justify-center">
                        <Logo size="md" />
                    </div>

                    <h1 className="text-xl font-black mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>Masuk ke Dashboard</h1>
                    <p className="text-sm mb-8" style={{ color: '#888' }}>Gunakan akun yang telah diberikan oleh administrator.</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="form-label">Email</label>
                            <input type="email" className="form-input" value={email}
                                   onChange={e => setEmail(e.target.value)} placeholder="nama@kaizen.id" required />
                        </div>
                        <div>
                            <label className="form-label">Kata Sandi</label>
                            <input type="password" className="form-input" value={password}
                                   onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
                        </div>
                        {error && (
                            <div className="p-3 rounded text-xs" style={{ background: '#FEF2F4', color: '#C8102E', border: '1px solid #FECDD3' }}>
                                {error}
                            </div>
                        )}
                        <button type="submit" className="btn-primary w-full justify-center"
                                style={{ opacity: loading ? 0.7 : 1 }} disabled={loading}>
                            {loading ? 'Memverifikasi...' : 'Masuk'}
                        </button>
                    </form>

                    <div className="mt-8 p-4 rounded" style={{ background: '#F7F6F5', border: '1px solid #E0DEDC' }}>
                        <p className="text-xs font-bold mb-3" style={{ fontFamily: 'Montserrat, sans-serif', color: '#555' }}>
                            Demo — Klik untuk isi otomatis (password: admin123)
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            {demoAccounts.map(acc => (
                                <button key={acc.role}
                                        onClick={() => { setEmail(acc.email); setPassword('admin123') }}
                                        className="text-xs px-3 py-1.5 rounded font-semibold transition-colors text-left"
                                        style={{
                                            fontFamily: 'Montserrat, sans-serif',
                                            background: '#fff',
                                            border: '1px solid #E0DEDC',
                                            color: '#333',
                                        }}>
                                    {acc.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button onClick={() => onNavigate('home')} className="mt-6 text-xs w-full text-center transition-colors"
                            style={{ color: '#888', fontFamily: 'Montserrat, sans-serif' }}>
                        ← Kembali ke Website
                    </button>
                </div>
            </div>
        </div>
    )
}
