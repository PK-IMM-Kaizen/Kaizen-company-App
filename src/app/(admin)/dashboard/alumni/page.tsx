'use client'

import { useState, useEffect, useMemo } from 'react'
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

    const supabase = useMemo(
        () =>
            createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            ),
        []
    )

    useEffect(() => {
        fetchAlumni()
    }, [supabase])

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

    const filtered = useMemo(() => {
        return items.filter(a =>
            a.name.toLowerCase().includes(search.toLowerCase()) ||
            a.batch.toLowerCase().includes(search.toLowerCase()) ||
            a.role.toLowerCase().includes(search.toLowerCase())
        )
    }, [items, search])

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
                        className="text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--primary)] flex items-center gap-1.5 font-display transition-colors bg-[var(--surface)] px-3.5 py-2 rounded-xl border-2 border-[var(--border-strong)] shadow-[2px_2px_0_var(--border)] hover:shadow-[2px_2px_0_var(--mk-ink)] hover:border-[var(--mk-ink)] hover:-translate-y-0.5 cursor-pointer uppercase tracking-wider"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Kembali
                    </button>
                    <span className="text-[var(--border-strong)] font-bold">/</span>
                    <h2 className="text-sm sm:text-base font-black text-[var(--text-primary)] font-display uppercase tracking-wider truncate">
                        {view === 'create' ? 'Tambah Alumni' : 'Edit Alumni'}
                    </h2>
                </div>

                <div className="bg-[var(--card)] rounded-2xl border-2 border-[var(--border-strong)] shadow-[6px_6px_0_var(--surface-2)] max-w-4xl overflow-hidden relative">
                    <div className="h-1.5 w-full bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--accent-light)]" />

                    <form onSubmit={handleSave} className="p-5 sm:p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

                        <div className="space-y-3 sm:space-y-4 p-4 bg-[var(--surface)] rounded-xl border-2 border-[var(--border-strong)] flex flex-col items-center justify-center relative overflow-hidden">
                            <div className="absolute right-0 top-0 w-20 h-20 bg-[var(--accent-light)]/15 rounded-bl-full pointer-events-none" />
                            <label className="block text-xs font-bold text-[var(--text-primary)] font-display uppercase tracking-wide text-center">
                                Foto Alumni
                            </label>
                            <div className="flex flex-col items-center justify-center">
                                <div className="relative group cursor-pointer">
                                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-2 border-[var(--mk-ink)] shadow-[4px_4px_0_var(--accent-light)] bg-[var(--background)] flex items-center justify-center relative">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <GraduationCap className="w-10 h-10 sm:w-12 sm:h-12 text-[var(--text-muted)]" />
                                        )}
                                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--accent-light)] mb-1" />
                                            <span className="text-[9px] sm:text-[10px] text-white font-bold uppercase tracking-wider font-display">Pilih Foto</span>
                                        </div>
                                    </div>
                                    <input id="photo-upload" name="photo-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                    <label htmlFor="photo-upload" className="absolute inset-0 cursor-pointer rounded-2xl"></label>
                                </div>
                                <p className="text-[10px] text-[var(--text-secondary)] mt-3 text-center px-2 font-medium">Disarankan rasio 1:1. Maksimal 2MB.</p>
                            </div>
                        </div>

                        <div className="lg:col-span-2 space-y-4 sm:space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-primary)] mb-2 font-display uppercase tracking-wide">
                                    Nama Lengkap <span className="text-[var(--error)]">*</span>
                                </label>
                                <input
                                    required
                                    className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all text-xs sm:text-sm font-semibold placeholder-[var(--text-muted)]"
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="Masukkan nama alumni beserta gelar"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-[var(--text-primary)] mb-2 font-display uppercase tracking-wide">
                                        Angkatan <span className="text-[var(--error)]">*</span>
                                    </label>
                                    <input
                                        required
                                        className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all text-xs sm:text-sm font-medium placeholder-[var(--text-muted)]"
                                        value={form.batch}
                                        onChange={e => setForm(f => ({ ...f, batch: e.target.value }))}
                                        placeholder="Contoh: 2018"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[var(--text-primary)] mb-2 font-display uppercase tracking-wide">
                                        Peran / Profesi <span className="text-[var(--error)]">*</span>
                                    </label>
                                    <input
                                        required
                                        className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all text-xs sm:text-sm font-medium placeholder-[var(--text-muted)]"
                                        value={form.role}
                                        onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                                        placeholder="Contoh: Software Engineer"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[var(--text-primary)] mb-2 font-display uppercase tracking-wide">
                                    Prestasi / Kontribusi
                                </label>
                                <input
                                    className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all text-xs sm:text-sm font-medium placeholder-[var(--text-muted)]"
                                    value={form.achievement}
                                    onChange={e => setForm(f => ({ ...f, achievement: e.target.value }))}
                                    placeholder="Contoh: Founder Tech Startup / Ketua BEM FT 2020"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[var(--text-primary)] mb-2 font-display uppercase tracking-wide">
                                    Biografi Singkat
                                </label>
                                <textarea
                                    className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all text-xs sm:text-sm font-medium placeholder-[var(--text-muted)]"
                                    rows={4}
                                    value={form.bio}
                                    onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                                    style={{ resize: 'vertical' }}
                                    placeholder="Tuliskan cerita singkat atau rekam jejak alumni..."
                                />
                            </div>

                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-5 border-t-2 border-dashed border-[var(--border-strong)]">
                                <button
                                    type="button"
                                    onClick={() => setView('list')}
                                    disabled={isSaving}
                                    className="w-full sm:w-auto py-3 px-5 bg-[var(--surface)] border-2 border-[var(--border-strong)] text-[var(--text-primary)] text-xs font-bold tracking-widest uppercase rounded-xl hover:border-[var(--mk-ink)] hover:shadow-[3px_3px_0_var(--mk-ink)] transition-all cursor-pointer font-display"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full sm:w-auto py-3 px-6 bg-[var(--primary)] text-white text-xs font-bold tracking-widest uppercase rounded-xl border-2 border-transparent hover:border-[var(--mk-ink)] shadow-[4px_4px_0_rgba(0,0,0,0.1)] hover:shadow-[4px_4px_0_var(--mk-ink)] hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2 cursor-pointer font-display"
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
        <div className="space-y-5 sm:space-y-6 font-sans">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-5 bg-[var(--card)] p-5 sm:p-6 rounded-2xl border-2 border-[var(--border-strong)] shadow-[4px_4px_0_var(--surface-2)]">
                <div>
                    <h2 className="text-lg sm:text-xl font-black text-[var(--text-primary)] font-display uppercase tracking-tight flex items-center gap-2.5">
                        <span className="w-1.5 h-5 rounded-full bg-[var(--primary)] inline-block" />
                        Kelola Alumni
                        <span className="bg-[var(--accent-light)] text-[var(--mk-ink)] text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border border-[var(--mk-ink)]">
                            {items.length} Total
                        </span>
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5 font-medium ml-4">
                        Daftar anggota dan rekam jejak alumni IMM Kaizen.
                    </p>
                </div>
                <div className="flex gap-2.5 w-full sm:w-auto">
                    <button
                        onClick={fetchAlumni}
                        className="p-3 bg-[var(--surface)] border-2 border-[var(--border-strong)] text-[var(--text-secondary)] hover:text-[var(--primary)] hover:border-[var(--primary)] rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_rgba(200,16,46,0.15)] cursor-pointer"
                        title="Segarkan Data"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={startCreate}
                        className="flex-1 sm:flex-none py-3 px-4 sm:px-5 bg-[var(--primary)] text-white text-xs font-bold tracking-widest uppercase rounded-xl border-2 border-transparent hover:border-[var(--mk-ink)] shadow-[4px_4px_0_rgba(0,0,0,0.1)] hover:shadow-[4px_4px_0_var(--mk-ink)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer font-display"
                    >
                        <Plus className="w-4 h-4" /> Tambah Alumni
                    </button>
                </div>
            </div>

            {deleteId !== null && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-[var(--card)] rounded-2xl p-6 sm:p-8 max-w-sm w-full border-2 border-[var(--mk-ink)] shadow-[8px_8px_0_var(--mk-ink)] animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-14 h-14 rounded-2xl bg-[var(--error)]/10 border-2 border-[var(--error)]/30 flex items-center justify-center mb-5 rotate-3">
                            <AlertTriangle className="w-7 h-7 text-[var(--error)]" />
                        </div>
                        <h3 className="font-black text-xl font-display text-[var(--text-primary)] mb-2 uppercase tracking-tight">Hapus Data Alumni?</h3>
                        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-6 font-medium">
                            Tindakan ini tidak dapat dibatalkan. Data alumni yang terpilih akan dihapus secara permanen dari sistem.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="flex-1 py-3 bg-[var(--surface)] border-2 border-[var(--border-strong)] text-[var(--text-primary)] text-xs font-bold tracking-widest uppercase rounded-xl hover:border-[var(--mk-ink)] hover:shadow-[3px_3px_0_var(--mk-ink)] transition-all cursor-pointer font-display"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => handleDelete(deleteId)}
                                className="flex-1 py-3 bg-[var(--error)] text-white border-2 border-transparent hover:border-[var(--mk-ink)] text-xs font-bold tracking-widest uppercase rounded-xl shadow-[3px_3px_0_rgba(200,16,46,0.2)] hover:shadow-[3px_3px_0_var(--mk-ink)] transition-all cursor-pointer font-display"
                            >
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-[var(--card)] rounded-2xl border-2 border-[var(--border-strong)] overflow-hidden shadow-[4px_4px_0_var(--surface-2)] flex flex-col relative">
                <div className="h-1 w-full bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--accent-light)]" />

                <div className="p-4 sm:p-5 border-b border-[var(--border)] bg-[var(--surface)]">
                    <div className="relative w-full max-w-md group">
                        <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[var(--primary)] transition-colors" />
                        <input
                            type="text"
                            placeholder="Cari nama, angkatan, atau profesi..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 sm:py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--background)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all text-xs sm:text-sm font-medium"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto w-full scrollbar-none">
                    {isLoading ? (
                        <div className="text-center py-16 text-[var(--text-muted)] font-display text-xs font-bold flex items-center justify-center gap-2 uppercase tracking-widest">
                            <RefreshCw className="w-5 h-5 animate-spin text-[var(--primary)]" />
                            Memuat data alumni...
                        </div>
                    ) : (
                        <table className="admin-table min-w-[600px]">
                            <thead>
                            <tr>
                                <th className="pl-5 sm:pl-6">Profil Alumni</th>
                                <th>Angkatan</th>
                                <th>Peran/Profesi</th>
                                <th className="hidden md:table-cell">Prestasi/Kontribusi</th>
                                <th className="text-right pr-5 sm:pr-6">Aksi</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-12">
                                        <div className="flex flex-col items-center justify-center text-center">
                                            <div className="w-14 h-14 bg-[var(--surface)] rounded-2xl flex items-center justify-center mb-3 text-[var(--text-muted)] border-2 border-[var(--border-strong)] shadow-[3px_3px_0_var(--border)]">
                                                <GraduationCap className="w-7 h-7" />
                                            </div>
                                            <h3 className="font-black text-xs sm:text-sm text-[var(--text-primary)] font-display uppercase tracking-wide mb-1">Belum Ada Data Alumni</h3>
                                            <p className="text-xs text-[var(--text-secondary)] max-w-sm">Tidak ada data alumni yang cocok dengan pencarian Anda.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map(a => (
                                    <tr key={a.id} className="group">
                                        <td className="pl-5 sm:pl-6">
                                            <div className="flex items-center gap-3.5">
                                                <img
                                                    src={a.photo || '/img/profile/imm.jpeg'}
                                                    alt={a.name}
                                                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover shrink-0 border-2 border-[var(--border-strong)] group-hover:border-[var(--primary)] shadow-[2px_2px_0_var(--border)] transition-colors bg-[var(--surface)]"
                                                />
                                                <span className="font-bold text-xs sm:text-sm text-[var(--text-primary)] font-display group-hover:text-[var(--primary)] transition-colors line-clamp-1">
                                                    {a.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="text-[10px] sm:text-xs font-black text-[var(--mk-ink)] bg-[var(--accent-light)] px-2.5 py-1 rounded-md border border-[var(--mk-ink)] font-display tracking-widest shadow-[2px_2px_0_var(--mk-ink)] whitespace-nowrap">
                                                {a.batch}
                                            </span>
                                        </td>
                                        <td className="text-xs font-semibold text-[var(--text-secondary)] font-display">
                                            {a.role}
                                        </td>
                                        <td className="text-xs text-[var(--text-secondary)] hidden md:table-cell">
                                            <span className="line-clamp-2 max-w-[250px] leading-relaxed">
                                                {a.achievement || '-'}
                                            </span>
                                        </td>
                                        <td className="pr-5 sm:pr-6 text-right">
                                            <div className="flex gap-2 justify-end items-center">
                                                <button
                                                    onClick={() => startEdit(a)}
                                                    className="p-2 text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-xl transition-colors cursor-pointer border-2 border-transparent hover:border-[var(--primary)]/20"
                                                    title="Edit Data"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteId(a.id)}
                                                    className="p-2 text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[var(--error)]/10 rounded-xl transition-colors cursor-pointer border-2 border-transparent hover:border-[var(--error)]/20"
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