'use client'

import { useState } from 'react'
import { divisions, type Division } from '../../../(public)/data'
import { Plus, Edit2, Trash2, ArrowLeft, AlertTriangle } from 'lucide-react'

type ViewMode = 'list' | 'create' | 'edit'

export default function Page() {
    const [items, setItems] = useState<Division[]>(divisions)
    const [view, setView] = useState<ViewMode>('list')
    const [editItem, setEditItem] = useState<Division | null>(null)
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [form, setForm] = useState({ name: '', description: '', color: '#C8102E' })

    const startCreate = () => {
        setForm({ name: '', description: '', color: '#C8102E' })
        setEditItem(null)
        setView('create')
    }

    const startEdit = (item: Division) => {
        setEditItem(item)
        setForm({ name: item.name, description: item.description, color: item.color || '#C8102E' })
        setView('edit')
    }

    const handleSave = () => {
        if (view === 'create') {
            setItems(prev => [...prev, {
                id: Date.now(), ...form,
                photo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop&auto=format',
            }])
        } else if (editItem) {
            setItems(prev => prev.map(d => d.id === editItem.id ? { ...d, ...form } : d))
        }
        setView('list')
    }

    const handleDelete = (id: number) => {
        setItems(prev => prev.filter(d => d.id !== id))
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
                        {view === 'create' ? 'Tambah Bidang' : 'Edit Bidang'}
                    </h2>
                </div>

                <div className="bg-[var(--card)] rounded-[var(--radius)] p-6 border border-[var(--border)] max-w-md shadow-sm">
                    <div className="space-y-4">
                        <div>
                            <label className="form-label">Nama Bidang</label>
                            <input
                                className="form-input"
                                value={form.name}
                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                placeholder="Nama bidang..."
                            />
                        </div>

                        <div>
                            <label className="form-label">Deskripsi</label>
                            <textarea
                                className="form-input"
                                rows={4}
                                value={form.description}
                                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                style={{ resize: 'vertical' }}
                                placeholder="Tuliskan gambaran dan cakupan kerja bidang..."
                            />
                        </div>

                        <div>
                            <label className="form-label">Warna Aksen</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={form.color}
                                    onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                                    className="w-10 h-10 rounded cursor-pointer border border-[var(--border)] p-1 bg-[var(--surface)]"
                                />
                                <input
                                    className="form-input flex-1 font-mono uppercase"
                                    value={form.color}
                                    onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                                />
                            </div>
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
                    Kelola Bidang
                </h2>
                <button onClick={startCreate} className="btn-primary text-xs flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Tambah Bidang
                </button>
            </div>

            {deleteId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-[var(--card)] rounded-[var(--radius)] p-6 max-w-sm w-full mx-4 border border-[var(--border)] shadow-xl">
                        <div className="flex items-center gap-2 text-[var(--error)] mb-2">
                            <AlertTriangle className="w-5 h-5" />
                            <h3 className="font-black text-sm font-display text-[var(--text-primary)]">
                                Hapus Bidang?
                            </h3>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                            Data bidang ini akan dihapus secara permanen dari sistem.
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
                        <th>Bidang</th>
                        <th>Deskripsi</th>
                        <th>Aksi</th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.length === 0 ? (
                        <tr>
                            <td colSpan={3} className="text-center py-8 text-[var(--text-muted)] text-xs">
                                Belum ada data bidang. Klik tombol Tambah Bidang di atas untuk menambahkan data baru.
                            </td>
                        </tr>
                    ) : (
                        items.map(d => (
                            <tr key={d.id}>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-3.5 h-3.5 rounded-full flex-shrink-0 shadow-sm border border-black/10"
                                            style={{ background: d.color || 'var(--primary)' }}
                                        />
                                        <span className="font-semibold text-xs text-[var(--text-primary)] font-display">
                                                {d.name}
                                            </span>
                                    </div>
                                </td>
                                <td className="text-xs text-[var(--text-secondary)] line-clamp-2 max-w-[360px]">
                                    {d.description}
                                </td>
                                <td>
                                    <div className="flex gap-3 items-center">
                                        <button
                                            onClick={() => startEdit(d)}
                                            className="text-xs font-semibold text-[var(--info)] hover:underline flex items-center gap-1 font-display"
                                        >
                                            <Edit2 className="w-3 h-3" /> Edit
                                        </button>
                                        <button
                                            onClick={() => setDeleteId(d.id)}
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