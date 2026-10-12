'use client'

import { useState } from 'react'
import { managementData, type Management } from '../../../lib/data'
import { Plus, Edit2, Trash2, ArrowLeft, AlertTriangle, Search, UserCheck, Camera, Users } from 'lucide-react'

type ViewMode = 'list' | 'create' | 'edit'

const divisionOptions = [
    'BPH',
    'Organisasi',
    'Perkaderan',
    'Hikmah Politik & Kebijakan Publik',
    'Riset & Pengembangan Keilmuan',
    'Tabligh & Kajian Keislaman',
    'Sosial Pemberdayaan Masyarakat',
    'Ekonomi & Kewirausahaan',
    'IMMawati',
    'Seni Budaya & Olahraga',
    'Media Komunikasi & Informasi'
]

export default function AdminKepengurusanPage() {
    const [items, setItems] = useState<Management[]>(managementData)
    const [view, setView] = useState<ViewMode>('list')
    const [editItem, setEditItem] = useState<Management | null>(null)
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [search, setSearch] = useState('')

    // State form disesuaikan dengan tambahan field photo
    const [form, setForm] = useState({ name: '', position: '', division: 'BPH', isLeader: false, photo: '' })

    // State untuk upload foto profil
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string>('')

    const filtered = items.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.position.toLowerCase().includes(search.toLowerCase()) ||
        m.division.toLowerCase().includes(search.toLowerCase())
    )

    const startCreate = () => {
        setForm({ name: '', position: '', division: 'BPH', isLeader: false, photo: '' })
        setImageFile(null)
        setImagePreview('')
        setEditItem(null)
        setView('create')
    }

    const startEdit = (item: Management) => {
        setEditItem(item)
        setForm({
            name: item.name,
            position: item.position,
            division: item.division,
            isLeader: item.isLeader ?? false,
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

    const handleSave = () => {
        // Simulasi URL gambar (Nantinya diganti dengan URL asli dari API/Cloud Storage)
        const finalImageUrl = imageFile ? URL.createObjectURL(imageFile) : form.photo

        if (view === 'create') {
            const newItem: Management = {
                id: Date.now(),
                ...form,
                photo: finalImageUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format'
            }
            setItems(prev => [newItem, ...prev])
        } else if (editItem) {
            setItems(prev => prev.map(m => m.id === editItem.id ? { ...m, ...form, photo: finalImageUrl } : m))
        }
        setView('list')
    }

    const handleDelete = (id: number) => {
        setItems(prev => prev.filter(m => m.id !== id))
        setDeleteId(null)
    }

    if (view === 'create' || view === 'edit') {
        return (
            <div className="animate-in fade-in duration-300">
                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={() => setView('list')}
                        className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--primary)] flex items-center gap-1.5 font-display transition-colors bg-[var(--surface)] px-3 py-1.5 rounded-lg border border-[var(--border)]"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Kembali
                    </button>
                    <span className="text-[var(--border-strong)]">/</span>
                    <h2 className="text-sm font-black text-[var(--text-primary)] font-display uppercase tracking-wider">
                        {view === 'create' ? 'Tambah Pengurus Baru' : 'Edit Data Pengurus'}
                    </h2>
                </div>

                <div className="bg-[var(--card)] rounded-2xl p-6 md:p-8 border border-[var(--border)] shadow-sm">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* KOLOM KIRI: Detail Pengurus */}
                        <div className="lg:col-span-2 space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">Nama Lengkap</label>
                                <input
                                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm font-semibold"
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="Masukkan nama lengkap pengurus..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">Jabatan</label>
                                    <input
                                        className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm"
                                        value={form.position}
                                        onChange={e => setForm(f => ({ ...f, position: e.target.value }))}
                                        placeholder="Contoh: Ketua Umum / Anggota"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">Bidang / Divisi</label>
                                    <select
                                        className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm"
                                        value={form.division}
                                        onChange={e => setForm(f => ({ ...f, division: e.target.value }))}
                                    >
                                        {divisionOptions.map(d => (
                                            <option key={d} value={d}>{d === 'BPH' ? 'BPH / Pimpinan Harian' : d}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* KOLOM KANAN: Foto & Status */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 font-display uppercase tracking-wide text-center">
                                    Foto Profil
                                </label>
                                <div className="flex flex-col items-center justify-center">
                                    <div className="relative group cursor-pointer">
                                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[var(--surface-2)] shadow-md bg-[var(--surface)] flex items-center justify-center relative">
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <Users className="w-12 h-12 text-[var(--text-muted)]" />
                                            )}
                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Camera className="w-6 h-6 text-white mb-1" />
                                                <span className="text-[10px] text-white font-bold uppercase tracking-wider">Ubah Foto</span>
                                            </div>
                                        </div>
                                        <input id="photo-upload" name="photo-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                        <label htmlFor="photo-upload" className="absolute inset-0 cursor-pointer rounded-full"></label>
                                    </div>
                                    <p className="text-[10px] text-[var(--text-muted)] mt-3 text-center">Format: JPG, PNG (Rasio 1:1)</p>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-between cursor-pointer" onClick={() => setForm(f => ({ ...f, isLeader: !f.isLeader }))}>
                                <div>
                                    <h4 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                                        Pimpinan Bidang {form.isLeader && <UserCheck className="w-4 h-4 text-[var(--accent)]" />}
                                    </h4>
                                    <p className="text-[10px] text-[var(--text-muted)] mt-0.5 leading-tight max-w-[140px]">
                                        Tandai jika merupakan Ketua Umum atau Ketua Bidang
                                    </p>
                                </div>
                                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.isLeader ? 'bg-[var(--primary)]' : 'bg-gray-300 dark:bg-gray-700'}`}>
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.isLeader ? 'translate-x-6' : 'translate-x-1'}`} />
                                </div>
                            </div>

                            <div className="pt-4 space-y-3 border-t border-[var(--border)]">
                                <button onClick={handleSave} className="w-full py-3 px-4 bg-[var(--primary)] text-white text-xs font-bold tracking-widest uppercase rounded-xl shadow-md shadow-[var(--primary)]/20 hover:bg-[var(--primary-dark)] transition-all">
                                    {view === 'create' ? 'Simpan Pengurus' : 'Simpan Perubahan'}
                                </button>
                                <button onClick={() => setView('list')} className="w-full py-3 px-4 bg-transparent border border-[var(--border)] text-[var(--text-primary)] text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-[var(--surface-2)] transition-all">
                                    Batal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[var(--card)] p-4 md:p-6 rounded-2xl border border-[var(--border)] shadow-sm mb-6">
                <div>
                    <h2 className="text-xl font-black text-[var(--text-primary)] font-display flex items-center gap-2">
                        Struktur Kepengurusan <span className="bg-[var(--primary)]/10 text-[var(--primary)] text-xs px-2 py-1 rounded-md">{items.length} Orang</span>
                    </h2>
                    <p className="text-sm text-[var(--text-muted)] mt-1">Kelola daftar pimpinan harian dan anggota bidang</p>
                </div>
                <button onClick={startCreate} className="w-full sm:w-auto py-2.5 px-5 bg-[var(--primary)] text-white text-xs font-bold tracking-widest uppercase rounded-xl shadow-md shadow-[var(--primary)]/20 hover:bg-[var(--primary-dark)] transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5">
                    <Plus className="w-4 h-4" /> Tambah Pengurus
                </button>
            </div>

            {deleteId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="bg-[var(--card)] rounded-2xl p-6 md:p-8 max-w-sm w-full border border-[var(--border)] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-12 h-12 rounded-full bg-red-100/10 border border-red-500/20 flex items-center justify-center mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-500" />
                        </div>
                        <h3 className="font-black text-lg font-display text-[var(--text-primary)] mb-2">Hapus Pengurus?</h3>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-8">
                            Data pengurus ini akan dihapus secara permanen dari struktur organisasi.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteId(null)} className="flex-1 py-3 bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-primary)] text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-[var(--surface)] transition-all">
                                Batal
                            </button>
                            <button onClick={() => handleDelete(deleteId)} className="flex-1 py-3 bg-red-600 text-white text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-red-700 transition-all">
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-[var(--border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[var(--surface)]">
                    <div className="relative w-full sm:w-80 group">
                        <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[var(--primary)] transition-colors" />
                        <input
                            type="text"
                            placeholder="Cari nama, jabatan, atau bidang..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all text-sm"
                        />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] font-medium bg-[var(--surface-2)] px-3 py-1.5 rounded-lg border border-[var(--border)]">
                        <Users className="w-4 h-4" /> {filtered.length} ditemukan
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-[var(--surface-2)] border-b border-[var(--border)] text-xs text-[var(--text-muted)] uppercase tracking-wider font-display">
                            <th className="p-4 font-bold pl-6">Profil Pengurus</th>
                            <th className="p-4 font-bold">Jabatan</th>
                            <th className="p-4 font-bold">Bidang</th>
                            <th className="p-4 font-bold text-right pr-6">Aksi</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center py-16 text-[var(--text-muted)] text-sm font-medium">
                                    Tidak ada data pengurus yang ditemukan.
                                </td>
                            </tr>
                        ) : (
                            filtered.map(m => (
                                <tr key={m.id} className="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors group">
                                    <td className="p-4 pl-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-white overflow-hidden flex-shrink-0 border-2 border-[var(--border)] p-0.5">
                                                <img
                                                    src={m.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format'}
                                                    alt={m.name}
                                                    className="w-full h-full object-cover rounded-full"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm text-[var(--text-primary)] font-display flex items-center gap-1.5">
                                                    {m.name}
                                                    {(m.isLeader ?? false) && (
                                                        <span title="Pimpinan / Ketua Bidang" className="bg-[var(--accent)]/10 text-[var(--accent)] p-1 rounded-full">
                                                            <UserCheck className="w-3.5 h-3.5" />
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm font-medium text-[var(--text-secondary)]">
                                        {m.position}
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${
                                            m.division === 'BPH'
                                                ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                                                : 'bg-[var(--surface-2)] text-[var(--primary)] border-[var(--border)]'
                                        }`}>
                                            {m.division}
                                        </span>
                                    </td>
                                    <td className="p-4 pr-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => startEdit(m)} className="p-2 text-[var(--text-muted)] hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors" title="Edit Pengurus">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => setDeleteId(m.id)} className="p-2 text-[var(--text-muted)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors" title="Hapus Pengurus">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}