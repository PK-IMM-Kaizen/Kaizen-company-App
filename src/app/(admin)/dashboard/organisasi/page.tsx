'use client'

import { useState, useEffect, useMemo } from 'react'
import { Building, Share2, Save, Camera, MapPin, Mail, AtSign, Phone, RefreshCw } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import Swal from 'sweetalert2'

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer
        toast.onmouseleave = Swal.resumeTimer
    }
})

export default function AdminOrganizationPage() {
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [logoFile, setLogoFile] = useState<File | null>(null)
    const [logoPreview, setLogoPreview] = useState<string>('')

    const supabase = useMemo(
        () =>
            createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            ),
        []
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

    useEffect(() => {
        fetchProfile()
    }, [supabase])

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
            Toast.fire({
                icon: 'error',
                title: 'Gagal memuat profil organisasi'
            })
        } finally {
            setFetching(false)
        }
    }

    const logActivity = async (action: string, target: string, type: string) => {
        try {
            const savedRole = localStorage.getItem('userRole')
            const adminName = savedRole === 'superadmin'
                ? 'Super Admin'
                : savedRole ? `Admin (${savedRole.toUpperCase()})` : 'Admin'

            await supabase.from('system_logs').insert([
                {
                    admin_name: adminName,
                    action: action,
                    target: target,
                    type: type
                }
            ])
        } catch (error: any) {
            console.error('Gagal merekam log ke Supabase:', error.message)
        }
    }

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setLogoFile(file)
            setLogoPreview(URL.createObjectURL(file))
        }
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            let uploadedLogoUrl = logoPreview

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
            await logActivity('memperbarui', 'Profil & Identitas Organisasi', 'organisasi')

            Toast.fire({
                icon: 'success',
                title: 'Profil organisasi berhasil disimpan!'
            })
        } catch (err: any) {
            Toast.fire({
                icon: 'error',
                title: err.message || 'Gagal menyimpan perubahan profil.'
            })
        } finally {
            setLoading(false)
        }
    }

    if (fetching) {
        return (
            <div className="p-12 sm:p-16 flex flex-col items-center justify-center text-[var(--text-muted)] font-display text-xs sm:text-sm font-black uppercase tracking-widest">
                <RefreshCw className="w-6 h-6 animate-spin mb-3 text-[var(--primary)]" />
                Memuat profil organisasi...
            </div>
        )
    }

    return (
        <div className="space-y-6 font-sans animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[var(--card)] p-5 sm:p-6 rounded-2xl border-2 border-[var(--border-strong)] shadow-[4px_4px_0_var(--surface-2)] relative overflow-hidden">
                <div className="h-1 w-full bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--accent-light)] absolute top-0 left-0" />
                <div>
                    <h2 className="text-lg sm:text-xl font-black text-[var(--text-primary)] font-display uppercase tracking-tight flex items-center gap-2.5">
                        <span className="w-1.5 h-5 rounded-full bg-[var(--primary)] inline-block" />
                        Profil Organisasi
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5 font-medium ml-4">
                        Kelola informasi dasar, kontak, dan identitas resmi komisariat
                    </p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button
                        type="button"
                        onClick={fetchProfile}
                        className="p-3 bg-[var(--surface)] border-2 border-[var(--border-strong)] text-[var(--text-primary)] hover:text-[var(--primary)] hover:border-[var(--primary)] hover:shadow-[3px_3px_0_rgba(200,16,46,0.15)] rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 text-xs font-black tracking-widest uppercase font-display hover:-translate-y-0.5 w-full sm:w-auto"
                        title="Segarkan Data"
                    >
                        <RefreshCw className={`w-4 h-4 ${fetching ? 'animate-spin' : ''}`} />
                        <span className="hidden sm:inline">Refresh</span>
                    </button>
                </div>
            </div>

            <form onSubmit={handleSave}>
                <div className="bg-[var(--card)] rounded-2xl p-5 sm:p-8 border-2 border-[var(--border-strong)] shadow-[4px_4px_0_var(--surface-2)] relative overflow-hidden">
                    <div className="h-1 w-full bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--accent-light)] absolute top-0 left-0" />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 mt-2">
                        <div className="space-y-4 sm:space-y-5">
                            <h3 className="font-black text-xs uppercase tracking-widest text-[var(--text-primary)] font-display flex items-center gap-2 border-b-2 border-[var(--border-strong)] pb-3">
                                Identitas Visual
                            </h3>
                            <div className="flex flex-col items-center justify-center p-6 sm:p-8 bg-[var(--surface)] border-2 border-[var(--border-strong)] shadow-[3px_3px_0_var(--border-strong)] rounded-2xl">
                                <div className="relative group cursor-pointer mb-4">
                                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-2 border-[var(--mk-ink)] shadow-[4px_4px_0_var(--mk-ink)] bg-white flex items-center justify-center relative transition-transform group-hover:-translate-y-1 duration-200">
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Logo Organisasi" className="w-full h-full object-contain p-3" />
                                        ) : (
                                            <div className="text-center p-3">
                                                <Building className="w-10 h-10 sm:w-12 sm:h-12 text-[var(--text-muted)] mx-auto mb-2" />
                                                <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest font-display">Tanpa Logo</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera className="w-7 h-7 sm:w-8 sm:h-8 text-white mb-1.5" />
                                            <span className="text-[10px] sm:text-xs text-white font-black uppercase tracking-widest font-display">Ubah Logo</span>
                                        </div>
                                    </div>
                                    <input id="logo-upload" name="logo-upload" type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
                                    <label htmlFor="logo-upload" className="absolute inset-0 cursor-pointer rounded-2xl"></label>
                                </div>
                                <p className="text-[11px] text-[var(--text-secondary)] text-center font-bold leading-relaxed">
                                    Rekomendasi ukuran 512x512px.<br />Format PNG transparan.
                                </p>
                            </div>
                        </div>

                        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                            <div className="space-y-4 sm:space-y-5">
                                <h3 className="font-black text-xs uppercase tracking-widest text-[var(--text-primary)] font-display flex items-center gap-2 border-b-2 border-[var(--border-strong)] pb-3">
                                    <Building className="w-4 h-4 text-[var(--primary)] stroke-[2.5px]" /> Informasi Dasar
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                    <div className="sm:col-span-2">
                                        <label className="block text-[10px] font-black text-[var(--text-primary)] mb-2 font-display uppercase tracking-widest">
                                            Nama Resmi Organisasi <span className="text-[var(--primary)]">*</span>
                                        </label>
                                        <input
                                            className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all text-xs sm:text-sm font-bold placeholder-[var(--text-muted)]"
                                            value={form.name}
                                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                            placeholder="Contoh: Pimpinan Komisariat IMM Kaizen"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-[var(--text-primary)] mb-2 font-display uppercase tracking-widest">
                                            Nama Singkat / Alias
                                        </label>
                                        <input
                                            className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all text-xs sm:text-sm font-medium placeholder-[var(--text-muted)]"
                                            value={form.shortName}
                                            onChange={e => setForm(f => ({ ...f, shortName: e.target.value }))}
                                            placeholder="Contoh: PK IMM Kaizen"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-[var(--text-primary)] mb-2 font-display uppercase tracking-widest">
                                            Tahun Berdiri
                                        </label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all text-xs sm:text-sm font-medium placeholder-[var(--text-muted)]"
                                            value={form.founded}
                                            onChange={e => setForm(f => ({ ...f, founded: e.target.value }))}
                                            placeholder="Contoh: 2018"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-[10px] font-black text-[var(--text-primary)] mb-2 font-display uppercase tracking-widest">
                                            Deskripsi Singkat (Tentang Kami)
                                        </label>
                                        <textarea
                                            className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all text-xs sm:text-sm font-medium leading-relaxed placeholder-[var(--text-muted)]"
                                            rows={4}
                                            value={form.description}
                                            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                            placeholder="Tuliskan deskripsi profil organisasi..."
                                            style={{ resize: 'vertical' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 sm:space-y-5">
                                <h3 className="font-black text-xs uppercase tracking-widest text-[var(--text-primary)] font-display flex items-center gap-2 border-b-2 border-[var(--border-strong)] pb-3">
                                    <Share2 className="w-4 h-4 text-[var(--primary)] stroke-[2.5px]" /> Kontak & Media Sosial
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                    <div className="sm:col-span-2">
                                        <label className="flex items-center gap-1.5 text-[10px] font-black text-[var(--text-primary)] mb-2 font-display uppercase tracking-widest">
                                            <MapPin className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" /> Alamat Sekretariat
                                        </label>
                                        <textarea
                                            className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all text-xs sm:text-sm font-medium leading-relaxed placeholder-[var(--text-muted)]"
                                            rows={3}
                                            value={form.address}
                                            onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                                            placeholder="Alamat lengkap sekretariat..."
                                            style={{ resize: 'vertical' }}
                                        />
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-1.5 text-[10px] font-black text-[var(--text-primary)] mb-2 font-display uppercase tracking-widest">
                                            <Mail className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" /> Email Resmi
                                        </label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all text-xs sm:text-sm font-medium placeholder-[var(--text-muted)]"
                                            value={form.email}
                                            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                            placeholder="email@kaizen.id"
                                        />
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-1.5 text-[10px] font-black text-[var(--text-primary)] mb-2 font-display uppercase tracking-widest">
                                            <Phone className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" /> WhatsApp Center
                                        </label>
                                        <input
                                            className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all text-xs sm:text-sm font-medium placeholder-[var(--text-muted)]"
                                            value={form.whatsapp}
                                            onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))}
                                            placeholder="+62 8xx..."
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="flex items-center gap-1.5 text-[10px] font-black text-[var(--text-primary)] mb-2 font-display uppercase tracking-widest">
                                            <AtSign className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" /> Instagram Username
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs sm:text-sm font-black text-[var(--text-muted)]">@</span>
                                            <input
                                                className="w-full pl-9 pr-4 py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all text-xs sm:text-sm font-bold placeholder-[var(--text-muted)]"
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

                    <div className="mt-8 pt-6 border-t-2 border-dashed border-[var(--border-strong)] flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto py-3.5 px-6 bg-[var(--primary)] text-white text-xs font-black tracking-widest uppercase rounded-xl border-2 border-transparent hover:border-[var(--mk-ink)] shadow-[3px_3px_0_rgba(200,16,46,0.2)] hover:shadow-[3px_3px_0_var(--mk-ink)] transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none cursor-pointer font-display hover:-translate-y-0.5"
                        >
                            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 stroke-[2.5px]" />}
                            {loading ? 'Memproses & Menyimpan...' : 'Simpan Perubahan Profil'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}