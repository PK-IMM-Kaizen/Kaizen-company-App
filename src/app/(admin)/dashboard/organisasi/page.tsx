'use client'

import { useState, useEffect } from 'react'
import { Building, Share2, CheckCircle2, Save, Camera, MapPin, Mail, AtSign, Phone, RefreshCw } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

export default function AdminOrganizationPage() {
    const [saved, setSaved] = useState(false)
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [logoFile, setLogoFile] = useState<File | null>(null)
    const [logoPreview, setLogoPreview] = useState<string>('')
    const [errorMessage, setErrorMessage] = useState('')

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const [form, setForm] = useState({
        name: '',
        shortName: '',
        founded: '',
        description: '',
        address: '',
        email: '',
        instagram: '',
        whatsapp: '',
    })

    // 1. Ambil data profil dari Supabase saat halaman dimuat
    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        setFetching(true)
        try {
            const { data, error } = await supabase
                .from('organization_profile')
                .select('*')
                .eq('id', 1)
                .single()

            if (error && error.code !== 'PGRST116') throw error

            if (data) {
                setForm({
                    name: data.name || '',
                    shortName: data.short_name || '',
                    founded: data.founded || '',
                    description: data.description || '',
                    address: data.address || '',
                    email: data.email || '',
                    instagram: data.instagram || '',
                    whatsapp: data.whatsapp || '',
                })
                if (data.logo_url) {
                    setLogoPreview(data.logo_url)
                }
            }
        } catch (err: any) {
            console.error('Gagal mengambil profil:', err.message)
        } finally {
            setFetching(false)
        }
    }

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setLogoFile(file)
            setLogoPreview(URL.createObjectURL(file))
        }
    }

    // 2. Simpan Data & Upload Logo ke Supabase
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setSaved(false)
        setErrorMessage('')

        try {
            let uploadedLogoUrl = logoPreview

            // Jika pengguna memilih gambar logo baru, unggah ke Storage
            if (logoFile) {
                const fileExt = logoFile.name.split('.').pop()
                const fileName = `logo-${Date.now()}.${fileExt}`
                const filePath = `logos/${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from('organization-assets')
                    .upload(filePath, logoFile, { upsert: true })

                if (uploadError) throw uploadError

                const { data: publicUrlData } = supabase.storage
                    .from('organization-assets')
                    .getPublicUrl(filePath)

                uploadedLogoUrl = publicUrlData.publicUrl
            }

            // Upsert / Update data profil ke tabel organization_profile
            const { error: dbError } = await supabase
                .from('organization_profile')
                .upsert({
                    id: 1,
                    name: form.name,
                    short_name: form.shortName,
                    founded: form.founded,
                    description: form.description,
                    address: form.address,
                    email: form.email,
                    instagram: form.instagram,
                    whatsapp: form.whatsapp,
                    logo_url: uploadedLogoUrl,
                    updated_at: new Date().toISOString()
                })

            if (dbError) throw dbError

            setLogoPreview(uploadedLogoUrl)
            setSaved(true)
            setTimeout(() => setSaved(false), 4000)
        } catch (err: any) {
            setErrorMessage(err.message || 'Gagal menyimpan perubahan profil.')
        } finally {
            setLoading(false)
        }
    }

    if (fetching) {
        return (
            <div className="p-12 flex flex-col items-center justify-center text-[var(--text-muted)] font-display font-bold">
                <RefreshCw className="w-6 h-6 animate-spin mb-2 text-[var(--primary)]" />
                Memuat profil organisasi...
            </div>
        )
    }

    return (
        <div className="p-4 md:p-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[var(--card)] p-4 md:p-6 rounded-2xl border border-[var(--border)] shadow-sm mb-6">
                <div>
                    <h2 className="text-xl font-black text-[var(--text-primary)] font-display flex items-center gap-2">
                        Profil Organisasi
                    </h2>
                    <p className="text-sm text-[var(--text-muted)] mt-1">Kelola informasi dasar, kontak, dan identitas resmi komisariat</p>
                </div>
            </div>

            {saved && (
                <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20 font-medium flex items-center gap-3 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold">Berhasil Disimpan</h4>
                        <p className="text-xs opacity-90">Profil organisasi telah berhasil diperbarui di database.</p>
                    </div>
                </div>
            )}

            {errorMessage && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 border border-red-200 font-medium text-xs">
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleSave}>
                <div className="bg-[var(--card)] rounded-2xl p-6 md:p-8 border border-[var(--border)] shadow-sm">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">

                        <div className="space-y-6">
                            <h3 className="font-black text-xs uppercase tracking-widest mb-4 text-[var(--text-secondary)] font-display flex items-center gap-2 border-b border-[var(--border)] pb-2">
                                Identitas Visual
                            </h3>
                            <div className="flex flex-col items-center justify-center p-6 bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl">
                                <div className="relative group cursor-pointer mb-4">
                                    <div className="w-36 h-36 rounded-2xl overflow-hidden border-4 border-white dark:border-[var(--surface)] shadow-lg bg-white flex items-center justify-center relative transition-transform group-hover:scale-105 duration-300">
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Logo Organisasi" className="w-full h-full object-contain p-2" />
                                        ) : (
                                            <div className="text-center p-4">
                                                <Building className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-2" />
                                                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Tanpa Logo</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera className="w-8 h-8 text-white mb-2" />
                                            <span className="text-xs text-white font-bold uppercase tracking-wider">Ubah Logo</span>
                                        </div>
                                    </div>
                                    <input id="logo-upload" name="logo-upload" type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
                                    <label htmlFor="logo-upload" className="absolute inset-0 cursor-pointer rounded-2xl"></label>
                                </div>
                                <p className="text-[11px] text-[var(--text-muted)] text-center font-medium leading-relaxed">
                                    Rekomendasi ukuran 512x512px.<br />Format PNG transparan.
                                </p>
                            </div>
                        </div>

                        <div className="lg:col-span-2 space-y-8">

                            <div className="space-y-5">
                                <h3 className="font-black text-xs uppercase tracking-widest mb-4 text-[var(--text-secondary)] font-display flex items-center gap-2 border-b border-[var(--border)] pb-2">
                                    <Building className="w-4 h-4 text-[var(--primary)]" /> Informasi Dasar
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">Nama Resmi Organisasi</label>
                                        <input
                                            className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm font-semibold"
                                            value={form.name}
                                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">Nama Singkat / Alias</label>
                                        <input
                                            className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm"
                                            value={form.shortName}
                                            onChange={e => setForm(f => ({ ...f, shortName: e.target.value }))}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">Tahun Berdiri</label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm"
                                            value={form.founded}
                                            onChange={e => setForm(f => ({ ...f, founded: e.target.value }))}
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">Deskripsi Singkat (Tentang Kami)</label>
                                        <textarea
                                            className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm leading-relaxed"
                                            rows={4}
                                            value={form.description}
                                            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                            style={{ resize: 'vertical' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <h3 className="font-black text-xs uppercase tracking-widest mb-4 text-[var(--text-secondary)] font-display flex items-center gap-2 border-b border-[var(--border)] pb-2">
                                    <Share2 className="w-4 h-4 text-[var(--primary)]" /> Kontak & Media Sosial
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="sm:col-span-2">
                                        <label className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">
                                            <MapPin className="w-3.5 h-3.5" /> Alamat Sekretariat
                                        </label>
                                        <textarea
                                            className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm leading-relaxed"
                                            rows={3}
                                            value={form.address}
                                            onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                                            style={{ resize: 'vertical' }}
                                        />
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">
                                            <Mail className="w-3.5 h-3.5" /> Email Resmi
                                        </label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm"
                                            value={form.email}
                                            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                        />
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">
                                            <Phone className="w-3.5 h-3.5" /> WhatsApp Center
                                        </label>
                                        <input
                                            className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm font-medium"
                                            value={form.whatsapp}
                                            onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))}
                                            placeholder="+62 8xx..."
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">
                                            <AtSign className="w-3.5 h-3.5" /> Instagram Username
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[var(--text-muted)]">@</span>
                                            <input
                                                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm font-medium"
                                                value={form.instagram.replace('@', '')}
                                                onChange={e => setForm(f => ({ ...f, instagram: `@${e.target.value.replace('@', '')}` }))}
                                                placeholder="imm_kaizen"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="mt-10 pt-6 border-t border-[var(--border)] flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto py-3 px-6 bg-[var(--primary)] text-white text-xs font-bold tracking-widest uppercase rounded-xl shadow-md shadow-[var(--primary)]/20 hover:bg-[var(--primary-dark)] transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                        >
                            <Save className="w-4 h-4" /> {loading ? 'Memproses & Menyimpan...' : 'Simpan Perubahan Profil'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
