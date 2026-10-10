'use client'

import { useState } from 'react'
import { alumniData, type Alumni } from '../../../(public)/data'
import { Plus, Edit2, Trash2, ArrowLeft, AlertTriangle } from 'lucide-react'

type ViewMode = 'list' | 'create' | 'edit'

export default function AdminAlumniPage() {
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
                        {view === 'create' ? 'Tambah Alumni' : 'Edit Alumni'}
                    </h2>
                </div>

                <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)] max-w-xl shadow-sm">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">Nama Lengkap</label>
                            <input
                                className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm"
                                value={form.name}
                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                placeholder="Masukkan nama alumni"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">Angkatan</label>
                                <input
                                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm"
                                    value={form.batch}
                                    onChange={e => setForm(f => ({ ...f, batch: e.target.value }))}
                                    placeholder="Contoh: 2018"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">Peran / Profesi</label>
                                <input
                                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm"
                                    value={form.role}
                                    onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                                    placeholder="Contoh: Software Engineer"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">Biografi Singkat</label>
                            <textarea
                                className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm"
                                rows={3}
                                value={form.bio}
                                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                                style={{ resize: 'vertical' }}
                                placeholder="Tuliskan cerita singkat atau rekam jejak alumni..."
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">Prestasi / Kontribusi</label>
                            <input
                                className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm"
                                value={form.achievement}
                                onChange={e => setForm(f => ({ ...f, achievement: e.target.value }))}
                                placeholder="Contoh: Founder Tech Startup / Ketua BEM FT 2020"
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button onClick={handleSave} className="py-2.5 px-4 bg-[var(--primary)] text-white text-xs font-bold tracking-widest uppercase rounded-lg shadow-sm hover:bg-[var(--primary-dark)] transition-all">
                                {view === 'create' ? 'Simpan' : 'Perbarui'}
                            </button>
                            <button onClick={() => setView('list')} className="py-2.5 px-4 bg-transparent border border-[var(--border)] text-[var(--text-primary)] text-xs font-bold tracking-widest uppercase rounded-lg hover:bg-[var(--surface-2)] transition-all">
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-lg font-black text-[var(--text-primary)] font-display">
                    Kelola Alumni Inspiratif
                </h2>
                <button onClick={startCreate} className="py-2.5 px-4 bg-[var(--primary)] text-white text-xs font-bold tracking-widest uppercase rounded-lg shadow-sm hover:bg-[var(--primary-dark)] transition-all flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Tambah Alumni
                </button>
            </div>

            {deleteId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="bg-[var(--card)] rounded-xl p-6 max-w-sm w-full border border-[var(--border)] shadow-xl">
                        <div className="flex items-center gap-2 text-red-600 mb-3">
                            <AlertTriangle className="w-5 h-5" />
                            <h3 className="font-black text-sm font-display text-[var(--text-primary)]">
                                Hapus Data Alumni?
                            </h3>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                            Data alumni yang telah dihapus tidak dapat dikembalikan lagi.
                        </p>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 bg-red-600 text-white text-xs font-bold tracking-widest uppercase rounded-lg hover:bg-red-700 transition-all text-center">
                                Hapus
                            </button>
                            <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 bg-transparent border border-[var(--border)] text-[var(--text-primary)] text-xs font-bold tracking-widest uppercase rounded-lg hover:bg-[var(--surface-2)] transition-all text-center">
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="admin-table w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-[var(--surface-2)] border-b border-[var(--border)] text-xs text-[var(--text-muted)] uppercase tracking-wider font-display">
                            <th className="p-4 font-bold">Alumni</th>
                            <th className="p-4 font-bold">Angkatan</th>
                            <th className="p-4 font-bold">Peran</th>
                            <th className="p-4 font-bold">Prestasi</th>
                            <th className="p-4 font-bold">Aksi</th>
                        </tr>
                        </thead>
                        <tbody>
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-[var(--text-muted)] text-sm">
                                    Belum ada data alumni. Klik tombol Tambah Alumni di atas untuk menambahkan data baru.
                                </td>
                            </tr>
                        ) : (
                            items.map(a => (
                                <tr key={a.id} className="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={a.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&auto=format'}
                                                alt={a.name}
                                                className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-[var(--border)] shadow-sm"
                                            />
                                            <span className="font-semibold text-sm text-[var(--text-primary)] font-display">
                                                    {a.name}
                                                </span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-[var(--primary)] font-bold font-display">
                                        {a.batch}
                                    </td>
                                    <td className="p-4 text-sm text-[var(--text-secondary)] whitespace-nowrap">
                                        {a.role}
                                    </td>
                                    <td className="p-4 text-sm text-[var(--text-secondary)]">
                                            <span className="line-clamp-2 max-w-[250px]">
                                                {a.achievement}
                                            </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-4 items-center">
                                            <button
                                                onClick={() => startEdit(a)}
                                                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 transition-colors"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" /> Edit
                                            </button>
                                            <button
                                                onClick={() => setDeleteId(a.id)}
                                                className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1.5 transition-colors"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" /> Hapus
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