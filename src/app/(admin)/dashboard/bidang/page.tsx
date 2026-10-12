'use client'

import { useState } from 'react'
import { divisions, type Division } from '../../../lib/data'
import { Plus, Edit2, Trash2, ArrowLeft, AlertTriangle, Image as ImageIcon } from 'lucide-react'

type ViewMode = 'list' | 'create' | 'edit'

export default function AdminBidangPage() {
    const [items, setItems] = useState<Division[]>(divisions)
    const [view, setView] = useState<ViewMode>('list')
    const [editItem, setEditItem] = useState<Division | null>(null)
    const [deleteId, setDeleteId] = useState<number | null>(null)

    const [form, setForm] = useState({ name: '', description: '', color: '#C8102E', photo: '' })

    const [photoFile, setPhotoFile] = useState<File | null>(null)
    const [photoPreview, setPhotoPreview] = useState<string>('')

    const startCreate = () => {
        setForm({ name: '', description: '', color: '#C8102E', photo: '' })
        setPhotoFile(null)
        setPhotoPreview('')
        setEditItem(null)
        setView('create')
    }

    const startEdit = (item: Division) => {
        setEditItem(item)
        setForm({ name: item.name, description: item.description, color: item.color || '#C8102E', photo: item.photo || '' })
        setPhotoFile(null)
        setPhotoPreview(item.photo || '')
        setView('edit')
    }

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setPhotoFile(file)
            setPhotoPreview(URL.createObjectURL(file))
        }
    }

    const handleSave = async () => {
        try {
            const finalPhotoUrl = photoFile ? URL.createObjectURL(photoFile) : form.photo

            if (view === 'create') {
                const newItem = {
                    id: Date.now(),
                    ...form,
                    photo: finalPhotoUrl || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop&auto=format',
                }
                setItems(prev => [...prev, newItem])
            } else if (editItem) {
                setItems(prev => prev.map(d => d.id === editItem.id ? {
                    ...d,
                    ...form,
                    photo: finalPhotoUrl
                } : d))
            }
            setView('list')
        } catch (error) {
            console.error("Gagal menyimpan bidang", error)
        }
    }

    const handleDelete = async (id: number) => {
        try {
            setItems(prev => prev.filter(d => d.id !== id))
            setDeleteId(null)
        } catch (error) {
            console.error("Gagal menghapus bidang", error)
        }
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
                        {view === 'create' ? 'Tambah Bidang Baru' : 'Edit Data Bidang'}
                    </h2>
                </div>

                <div className="bg-[var(--card)] rounded-2xl p-6 md:p-8 border border-[var(--border)] max-w-2xl shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">Nama Bidang</label>
                                <input
                                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm font-semibold"
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="Misal: Bidang HPKP..."
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">Deskripsi</label>
                                <textarea
                                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm leading-relaxed"
                                    rows={5}
                                    value={form.description}
                                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    style={{ resize: 'vertical' }}
                                    placeholder="Tuliskan gambaran dan cakupan kerja bidang..."
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">Warna Aksen</label>
                                <div className="flex items-center gap-3 bg-[var(--surface-2)] p-2 rounded-lg border border-[var(--border)]">
                                    <input
                                        type="color"
                                        value={form.color}
                                        onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                                        className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent p-0"
                                    />
                                    <input
                                        className="flex-1 bg-transparent border-none focus:outline-none text-sm font-mono uppercase font-bold"
                                        value={form.color}
                                        onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide flex items-center gap-1.5">
                                    <ImageIcon className="w-4 h-4" /> Foto Identitas Bidang
                                </label>
                                <div className="mt-2 flex justify-center rounded-xl border border-dashed border-[var(--border-strong)] px-6 py-8 bg-[var(--surface-2)] hover:bg-[var(--surface)] transition-colors relative">
                                    <div className="text-center">
                                        {photoPreview ? (
                                            <div className="mb-4 relative w-full aspect-video rounded-lg overflow-hidden border border-[var(--border)]">
                                                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                            </div>
                                        ) : (
                                            <ImageIcon className="mx-auto h-12 w-12 text-[var(--text-muted)] mb-4" aria-hidden="true" />
                                        )}
                                        <div className="flex justify-center text-sm leading-6 text-gray-600">
                                            <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-semibold text-[var(--primary)] hover:text-[var(--primary-dark)] focus-within:outline-none">
                                                <span>Upload file gambar</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handlePhotoChange} />
                                            </label>
                                        </div>
                                        <p className="text-xs text-[var(--text-muted)] mt-1">PNG, JPG, GIF maksimal 2MB</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button onClick={handleSave} className="flex-1 py-3 px-4 bg-[var(--primary)] text-white text-xs font-bold tracking-widest uppercase rounded-xl shadow-md shadow-[var(--primary)]/20 hover:bg-[var(--primary-dark)] transition-all">
                                    {view === 'create' ? 'Simpan' : 'Perbarui'}
                                </button>
                                <button onClick={() => setView('list')} className="flex-1 py-3 px-4 bg-transparent border border-[var(--border)] text-[var(--text-primary)] text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-[var(--surface-2)] transition-all">
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
        <div>
            <div className="flex items-center justify-between bg-[var(--card)] p-4 md:p-6 rounded-2xl border border-[var(--border)] shadow-sm mb-6">
                <div>
                    <h2 className="text-xl font-black text-[var(--text-primary)] font-display flex items-center gap-2">
                        Kelola Bidang <span className="bg-[var(--primary)]/10 text-[var(--primary)] text-xs px-2 py-1 rounded-md">{items.length} Total</span>
                    </h2>
                    <p className="text-sm text-[var(--text-muted)] mt-1">Atur struktur organisasi dan bidang IMM Kaizen</p>
                </div>
                <button onClick={startCreate} className="py-2.5 px-5 bg-[var(--primary)] text-white text-xs font-bold tracking-widest uppercase rounded-xl shadow-md shadow-[var(--primary)]/20 hover:bg-[var(--primary-dark)] transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5">
                    <Plus className="w-4 h-4" /> Tambah Bidang
                </button>
            </div>

            {deleteId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="bg-[var(--card)] rounded-2xl p-6 md:p-8 max-w-sm w-full border border-[var(--border)] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-12 h-12 rounded-full bg-red-100/10 border border-red-500/20 flex items-center justify-center mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-500" />
                        </div>
                        <h3 className="font-black text-lg font-display text-[var(--text-primary)] mb-2">Hapus Bidang?</h3>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-8">
                            Data bidang ini akan dihapus secara permanen dari sistem. Aksi ini tidak dapat dibatalkan.
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
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-[var(--surface-2)] border-b border-[var(--border)] text-xs text-[var(--text-muted)] uppercase tracking-wider font-display">
                            <th className="p-4 font-bold pl-6">Detail Bidang</th>
                            <th className="p-4 font-bold hidden md:table-cell">Deskripsi</th>
                            <th className="p-4 font-bold text-right pr-6">Aksi</th>
                        </tr>
                        </thead>
                        <tbody>
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="text-center py-12 text-[var(--text-muted)] text-sm font-medium">
                                    Belum ada data bidang. Silakan tambah data baru.
                                </td>
                            </tr>
                        ) : (
                            items.map(d => (
                                <tr key={d.id} className="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors group">
                                    <td className="p-4 pl-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-[var(--surface-2)] overflow-hidden flex-shrink-0 border border-[var(--border)] relative">
                                                {d.photo ? (
                                                    <img src={d.photo} alt={d.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon className="w-5 h-5 m-auto mt-3 text-[var(--text-muted)]" />
                                                )}
                                                <div
                                                    className="absolute bottom-0 right-0 w-3 h-3 rounded-tl-md"
                                                    style={{ background: d.color || 'var(--primary)' }}
                                                />
                                            </div>
                                            <div>
                                                <span className="font-bold text-sm text-[var(--text-primary)] font-display block">
                                                    {d.name}
                                                </span>
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ background: d.color || 'var(--primary)' }} />
                                                    <span className="text-[10px] font-mono text-[var(--text-muted)]">{d.color || '#---'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-xs text-[var(--text-secondary)] leading-relaxed hidden md:table-cell max-w-[400px]">
                                        <p className="line-clamp-2">{d.description}</p>
                                    </td>
                                    <td className="p-4 pr-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => startEdit(d)}
                                                className="p-2 text-[var(--text-muted)] hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors" title="Edit Bidang"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setDeleteId(d.id)}
                                                className="p-2 text-[var(--text-muted)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors" title="Hapus Bidang"
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
                </div>
            </div>
        </div>
    )
}