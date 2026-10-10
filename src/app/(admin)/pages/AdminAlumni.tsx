'use client'

import { useState } from 'react'
import { alumniData, type Alumni } from '../../(public)/data'
import { Plus, Edit2, Trash2, ArrowLeft, AlertTriangle } from 'lucide-react'

type ViewMode = 'list' | 'create' | 'edit'

export default function AdminAlumni() {
    const [items, setItems] = useState<Alumni[]>(alumniData)
    const [view, setView] = useState<ViewMode>('list')
    const [editItem, setEditItem] = useState<Alumni | null>(null)
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [form, setForm] = useState({ name: '', batch: '', bio: '', achievement: '', role: '' })

    const startCreate = () => {
        setForm({ name: '', batch: '', bio: '', achievement: '', role: '' })
        setEditItem(null)
        setView('create')
    }

    const startEdit = (item: Alumni) => {
        setEditItem(item)
        setForm({ name: item.name, batch: item.batch, bio: item.bio, achievement: item.achievement, role: item.role })
        setView('edit')
    }

    const handleSave = () => {
        if (view === 'create') {
            setItems(prev => [...prev, {
                id: Date.now(), ...form,
                photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&auto=format',
            }])
        } else if (editItem) {
            setItems(prev => prev.map(a => a.id === editItem.id ? { ...a, ...form } : a))
        }
        setView('list')
    }

    const handleDelete = (id: number) => {
        setItems(prev => prev.filter(a => a.id !== id))
        setDeleteId(null)
    }

    if (view === 'create' || view === 'edit') {
        return (
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={() => setView('list')}
                        className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--primary)] flex items-center gap-1 font-display transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Kembali
                    </button>
                    <span className="text-[var(--border-strong)]">/</span>
                    <h2 className="text-sm font-black text-[var(--text-primary)] font-display">
                        {view === 'create' ? 'Tambah Page' : 'Edit Page'}
                    </h2>
                </div>

                <div className="bg-[var(--card)] rounded-[var(--radius)] p-6 border border-[var(--border)] max-w-xl shadow-sm">
                    <div className="space-y-4">
                        <div>
                            <label className="form-label">Nama Lengkap</label>
                            <input
                                className="form-input"
                                value={form.name}
                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                placeholder="Masukkan nama alumni"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="form-label">Angkatan</label>
                                <input
                                    className="form-input"
                                    value={form.batch}
                                    onChange={e => setForm(f => ({ ...f, batch: e.target.value }))}
                                    placeholder="Contoh: 2018"
                                />
                            </div>
                            <div>
                                <label className="form-label">Peran / Profesi</label>
                                <input
                                    className="form-input"
                                    value={form.role}
                                    onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                                    placeholder="Contoh: Software Engineer"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="form-label">Biografi Singkat</label>
                            <textarea
                                className="form-input"
                                rows={3}
                                value={form.bio}
                                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                                style={{ resize: 'vertical' }}
                                placeholder="Tuliskan cerita singkat atau rekam jejak alumni..."
                            />
                        </div>

                        <div>
                            <label className="form-label">Prestasi / Kontribusi</label>
                            <input
                                className="form-input"
                                value={form.achievement}
                                onChange={e => setForm(f => ({ ...f, achievement: e.target.value }))}
                                placeholder="Contoh: Founder Tech Startup / Ketua BEM FT 2020"
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button onClick={handleSave} className="btn-primary">
                                {view === 'create' ? 'Simpan' : 'Perbarui'}
                            </button>
                            <button onClick={() => setView('list')} className="btn-outline">
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-black text-[var(--text-primary)] font-display">
                    Kelola Alumni Inspiratif
                </h2>
                <button onClick={startCreate} className="btn-primary text-xs flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Tambah Alumni
                </button>
            </div>

            {deleteId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-[var(--card)] rounded-[var(--radius)] p-6 max-w-sm w-full mx-4 border border-[var(--border)] shadow-xl">
                        <div className="flex items-center gap-2 text-[var(--error)] mb-2">
                            <AlertTriangle className="w-5 h-5" />
                            <h3 className="font-black text-sm font-display text-[var(--text-primary)]">
                                Hapus Data Alumni?
                            </h3>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                            Data alumni yang telah dihapus tidak dapat dikembalikan lagi.
                        </p>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => handleDelete(deleteId)} className="btn-primary flex-1 justify-center bg-[var(--error)] hover:bg-[var(--primary-dark)]">
                                Hapus
                            </button>
                            <button onClick={() => setDeleteId(null)} className="btn-outline flex-1 justify-center">
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-[var(--card)] rounded-[var(--radius)] border border-[var(--border)] overflow-hidden shadow-sm">
                <table className="admin-table">
                    <thead>
                    <tr>
                        <th>Alumni</th>
                        <th>Angkatan</th>
                        <th>Peran</th>
                        <th>Prestasi</th>
                        <th>Aksi</th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="text-center py-8 text-[var(--text-muted)] text-xs">
                                Belum ada data alumni. Klik tombol Tambah Alumni di atas untuk menambahkan data baru.
                            </td>
                        </tr>
                    ) : (
                        items.map(a => (
                            <tr key={a.id}>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={a.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&auto=format'}
                                            alt={a.name}
                                            className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-[var(--border)]"
                                        />
                                        <span className="font-semibold text-xs text-[var(--text-primary)] font-display">
                                                {a.name}
                                            </span>
                                    </div>
                                </td>
                                <td className="text-xs text-[var(--primary)] font-semibold font-display">
                                    {a.batch}
                                </td>
                                <td className="text-xs text-[var(--text-secondary)]">
                                    {a.role}
                                </td>
                                <td className="text-xs text-[var(--text-secondary)] line-clamp-1 max-w-[200px]">
                                    {a.achievement}
                                </td>
                                <td>
                                    <div className="flex gap-3 items-center">
                                        <button
                                            onClick={() => startEdit(a)}
                                            className="text-xs font-semibold text-[var(--info)] hover:underline flex items-center gap-1 font-display"
                                        >
                                            <Edit2 className="w-3 h-3" /> Edit
                                        </button>
                                        <button
                                            onClick={() => setDeleteId(a.id)}
                                            className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1 font-display"
                                        >
                                            <Trash2 className="w-3 h-3" /> Hapus
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
    )
}