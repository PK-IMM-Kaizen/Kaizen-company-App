'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, ArrowLeft, AlertTriangle, GraduationCap, RefreshCw, Camera, Search } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

type ViewMode = 'list' | 'create' | 'edit'

export interface Alumni {
    id: string
    name: string
    batch: string
    role: string
    achievement: string
    bio: string
    photo: string
    createdAt?: string
}

export default function AdminAlumniPage() {
    const [items, setItems] = useState<Alumni[]>([])
    const [view, setView] = useState<ViewMode>('list')
    const [editItem, setEditItem] = useState<Alumni | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [search, setSearch] = useState('')

    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    const [form, setForm] = useState({ name: '', batch: '', bio: '', achievement: '', role: '', photo: '' })
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string>('')

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        fetchAlumni()
    }, [])

    const fetchAlumni = async () => {
        setIsLoading(true)
        try {
            const { data, error } = await supabase
                .from('alumni')
                .select('*')
                .order('batch', { ascending: false })

            if (error) throw error

            if (data) {
                const formattedData: Alumni[] = data.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    batch: item.batch,
                    role: item.role,
                    achievement: item.achievement,
                    bio: item.bio,
                    photo: item.photo,
                    createdAt: item.created_at
                }))
                setItems(formattedData)
            }
        } catch (error: any) {
            console.error('Error fetching alumni:', error.message)
            alert('Gagal mengambil data alumni')
        } finally {
            setIsLoading(false)
        }
    }

    const filtered = items.filter(a =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.batch.toLowerCase().includes(search.toLowerCase()) ||
        a.role.toLowerCase().includes(search.toLowerCase())
    )

    const startCreate = () => {
        setForm({ name: '', batch: '', bio: '', achievement: '', role: '', photo: '' })
        setImageFile(null)
        setImagePreview('')
        setEditItem(null)
        setView('create')
    }

    const startEdit = (item: Alumni) => {
        setEditItem(item)
        setForm({
            name: item.name,
            batch: item.batch,
            bio: item.bio,
            achievement: item.achievement,
            role: item.role,
            photo: item.photo || ''
        })
        setImageFile(null)
        setImagePreview(item.photo || '')
        setView('edit')
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!form.name || !form.batch || !form.role) {
            alert('Nama, Angkatan, dan Peran wajib diisi.')
            return
        }

        setIsSaving(true)
        try {
            let finalImageUrl = form.photo

            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop()
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
                const filePath = `profiles/${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from('alumni_photos')
                    .upload(filePath, imageFile)

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('alumni_photos')
                    .getPublicUrl(filePath)

                finalImageUrl = publicUrl
            }

            const payload = {
                name: form.name,
                batch: form.batch,
                role: form.role,
                achievement: form.achievement,
                bio: form.bio,
                photo: finalImageUrl
            }

            if (view === 'create') {
                const { error } = await supabase.from('alumni').insert([payload])
                if (error) throw error
            } else if (editItem) {
                const { error } = await supabase
                    .from('alumni')
                    .update(payload)
                    .eq('id', editItem.id)
                if (error) throw error
            }

            await fetchAlumni()
            setView('list')
        } catch (error: any) {
            console.error('Error saving alumni:', error.message)
            alert(`Gagal menyimpan data: ${error.message}`)
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const { error } = await supabase.from('alumni').delete().eq('id', id)
            if (error) throw error

            setItems(prev => prev.filter(a => a.id !== id))
            setDeleteId(null)
        } catch (error: any) {
            alert(`Gagal menghapus data: ${error.message}`)
        }
    }

    if (view === 'create' || view === 'edit') {
        return (
            <div className="animate-in fade-in duration-300 space-y-4 sm:space-y-6 font-sans">
                <div className="flex items-center gap-2.5 sm:gap-3">
                    <button
                        onClick={() => setView('list')}
                        className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--primary)] flex items-center gap-1.5 font-display transition-colors bg-[var(--surface)] px-3 py-1.5 rounded-lg border border-[var(--border)] cursor-pointer"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 text-[var(--primary)]" /> Kembali
                    </button>
                    <span className="text-[var(--border-strong)]">/</span>
                    <h2 className="text-xs sm:text-sm font-black text-[var(--text-primary)] font-display uppercase tracking-wider truncate">
                        {view === 'create' ? 'Tambah Alumni' : 'Edit Alumni'}
                    </h2>
                </div>

                <div className="bg-[var(--card)] rounded-2xl p-4 sm:p-6 md:p-8 border border-[var(--border)] max-w-4xl shadow-sm">
                    <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

                        <div className="space-y-3 sm:space-y-4">
                            <label className="block text-xs font-bold text-[var(--text-secondary)] font-display uppercase tracking-wide text-center">
                                Foto Alumni
                            </label>
                            <div className="flex flex-col items-center justify-center">
                                <div className="relative group cursor-pointer">
                                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-4 border-[var(--surface-2)] shadow-md bg-[var(--surface)] flex items-center justify-center relative">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <GraduationCap className="w-10 h-10 sm:w-12 sm:h-12 text-[var(--text-muted)]" />
                                        )}
                                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-white mb-1" />
                                            <span className="text-[9px] sm:text-[10px] text-white font-bold uppercase tracking-wider">Pilih Foto</span>
                                        </div>
                                    </div>
                                    <input id="photo-upload" name="photo-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                    <label htmlFor="photo-upload" className="absolute inset-0 cursor-pointer rounded-2xl"></label>
                                </div>
                                <p className="text-[10px] text-[var(--text-muted)] mt-2.5 text-center px-2">Disarankan rasio 1:1. Maksimal 2MB.</p>
                            </div>
                        </div>

                        <div className="lg:col-span-2 space-y-4 sm:space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">
                                    Nama Lengkap *
                                </label>
                                <input
                                    required
                                    className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-all text-xs sm:text-sm font-semibold placeholder-[var(--text-muted)]"
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="Masukkan nama alumni beserta gelar"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">
                                        Angkatan *
                                    </label>
                                    <input
                                        required
                                        className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-all text-xs sm:text-sm placeholder-[var(--text-muted)]"
                                        value={form.batch}
                                        onChange={e => setForm(f => ({ ...f, batch: e.target.value }))}
                                        placeholder="Contoh: 2018"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">
                                        Peran / Profesi *
                                    </label>
                                    <input
                                        required
                                        className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-all text-xs sm:text-sm placeholder-[var(--text-muted)]"
                                        value={form.role}
                                        onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                                        placeholder="Contoh: Software Engineer"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">
                                    Prestasi / Kontribusi
                                </label>
                                <input
                                    className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-all text-xs sm:text-sm placeholder-[var(--text-muted)]"
                                    value={form.achievement}
                                    onChange={e => setForm(f => ({ ...f, achievement: e.target.value }))}
                                    placeholder="Contoh: Founder Tech Startup / Ketua BEM FT 2020"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">
                                    Biografi Singkat
                                </label>
                                <textarea
                                    className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-all text-xs sm:text-sm placeholder-[var(--text-muted)]"
                                    rows={4}
                                    value={form.bio}
                                    onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                                    style={{ resize: 'vertical' }}
                                    placeholder="Tuliskan cerita singkat atau rekam jejak alumni..."
                                />
                            </div>

                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 pt-3.5 border-t border-[var(--border)]">
                                <button
                                    type="button"
                                    onClick={() => setView('list')}
                                    disabled={isSaving}
                                    className="w-full sm:w-auto py-2.5 sm:py-3 px-5 bg-transparent border border-[var(--border)] text-[var(--text-primary)] text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-[var(--surface-2)] transition-all cursor-pointer font-display"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full sm:w-auto py-2.5 sm:py-3 px-5 bg-[var(--primary)] text-white text-xs font-bold tracking-widest uppercase rounded-xl shadow-md shadow-[var(--primary)]/20 hover:bg-[var(--primary-dark)] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer font-display"
                                >
                                    {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                                    {isSaving ? 'Menyimpan...' : (view === 'create' ? 'Simpan Alumni' : 'Perbarui Data')}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4 sm:space-y-6 font-sans">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 bg-[var(--card)] p-4 sm:p-6 rounded-2xl border border-[var(--border)] shadow-sm">
                <div>
                    <h2 className="text-lg sm:text-xl font-black text-[var(--text-primary)] font-display flex items-center gap-2">
                        Kelola Alumni <span className="bg-[#6B46C1]/10 text-[#6B46C1] text-xs px-2.5 py-0.5 rounded-md font-bold">{items.length} Total</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5">
                        Daftar anggota dan rekam jejak alumni IMM Kaizen.
                    </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button
                        onClick={fetchAlumni}
                        className="p-2.5 bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--primary)] rounded-xl transition-colors cursor-pointer"
                        title="Segarkan Data"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={startCreate}
                        className="flex-1 sm:flex-none py-2.5 px-4 sm:px-5 bg-[var(--primary)] text-white text-xs font-bold tracking-widest uppercase rounded-xl shadow-md shadow-[var(--primary)]/20 hover:bg-[var(--primary-dark)] transition-all flex items-center justify-center gap-2 cursor-pointer font-display"
                    >
                        <Plus className="w-4 h-4" /> Tambah Alumni
                    </button>
                </div>
            </div>

            {deleteId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-[var(--card)] rounded-2xl p-6 sm:p-8 max-w-sm w-full border border-[var(--border)] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 border border-red-500/20 flex items-center justify-center mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-500" />
                        </div>
                        <h3 className="font-black text-lg font-display text-[var(--text-primary)] mb-1">Hapus Data Alumni?</h3>
                        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                            Tindakan ini tidak dapat dibatalkan. Data alumni yang terpilih akan dihapus secara permanen dari sistem.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="flex-1 py-2.5 sm:py-3 bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-primary)] text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-[var(--surface)] transition-all cursor-pointer font-display"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => handleDelete(deleteId)}
                                className="flex-1 py-2.5 sm:py-3 bg-red-600 text-white text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-red-700 transition-all cursor-pointer font-display shadow-md shadow-red-600/20"
                            >
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm">
                <div className="p-3.5 sm:p-4 border-b border-[var(--border)] bg-[var(--surface)]">
                    <div className="relative w-full max-w-md group">
                        <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-[var(--primary)] transition-colors" />
                        <input
                            type="text"
                            placeholder="Cari nama, angkatan, atau profesi..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all text-xs sm:text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto w-full scrollbar-none">
                    {isLoading ? (
                        <div className="text-center py-12 text-[var(--text-muted)] font-display text-xs font-bold flex items-center justify-center gap-2">
                            <RefreshCw className="w-4 h-4 animate-spin text-[var(--primary)]" />
                            Memuat data alumni...
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                            <tr className="bg-[var(--surface-2)] border-b border-[var(--border)] text-[10px] sm:text-xs text-[var(--text-muted)] uppercase tracking-wider font-display">
                                <th className="p-3.5 sm:p-4 font-bold pl-5 sm:pl-6">Profil Alumni</th>
                                <th className="p-3.5 sm:p-4 font-bold">Angkatan</th>
                                <th className="p-3.5 sm:p-4 font-bold">Peran/Profesi</th>
                                <th className="p-3.5 sm:p-4 font-bold hidden md:table-cell">Prestasi/Kontribusi</th>
                                <th className="p-3.5 sm:p-4 font-bold text-right pr-5 sm:pr-6">Aksi</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-12">
                                        <div className="flex flex-col items-center justify-center text-center">
                                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[var(--surface-2)] rounded-full flex items-center justify-center mb-3 text-[var(--text-muted)] border border-[var(--border)]">
                                                <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8" />
                                            </div>
                                            <h3 className="font-bold text-xs sm:text-sm text-[var(--text-primary)] mb-0.5">Belum Ada Data Alumni</h3>
                                            <p className="text-xs text-[var(--text-muted)] max-w-sm">Tidak ada data alumni yang cocok dengan pencarian Anda.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map(a => (
                                    <tr key={a.id} className="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors group">
                                        <td className="p-3.5 sm:p-4 pl-5 sm:pl-6">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={a.photo || '/img/profile/imm.jpeg'}
                                                    alt={a.name}
                                                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover shrink-0 border-2 border-[var(--border)] shadow-sm p-0.5 bg-[var(--surface-2)]"
                                                />
                                                <span className="font-bold text-xs sm:text-sm text-[var(--text-primary)] font-display group-hover:text-[var(--primary)] transition-colors line-clamp-1">
                                                        {a.name}
                                                    </span>
                                            </div>
                                        </td>
                                        <td className="p-3.5 sm:p-4">
                                                <span className="text-[10px] sm:text-xs font-black text-[#6B46C1] bg-[#6B46C1]/10 px-2.5 py-1 rounded-md border border-[#6B46C1]/20 font-display tracking-widest shadow-sm whitespace-nowrap">
                                                    {a.batch}
                                                </span>
                                        </td>
                                        <td className="p-3.5 sm:p-4 text-xs font-semibold text-[var(--text-secondary)] font-display">
                                            {a.role}
                                        </td>
                                        <td className="p-3.5 sm:p-4 text-xs text-[var(--text-secondary)] hidden md:table-cell">
                                                <span className="line-clamp-2 max-w-[250px] leading-relaxed">
                                                    {a.achievement || '-'}
                                                </span>
                                        </td>
                                        <td className="p-3.5 sm:p-4 pr-5 sm:pr-6 text-right">
                                            <div className="flex gap-1.5 justify-end items-center">
                                                <button
                                                    onClick={() => startEdit(a)}
                                                    className="p-1.5 sm:p-2 text-[var(--text-muted)] hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                                                    title="Edit Data"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteId(a.id)}
                                                    className="p-1.5 sm:p-2 text-[var(--text-muted)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                                                    title="Hapus Data"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    )
}