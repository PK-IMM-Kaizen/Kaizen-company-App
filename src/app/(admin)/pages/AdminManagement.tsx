'use client'

import { useState } from 'react'
import { managementData, type Management } from '../../(public)/data'
import { Plus, Edit2, Trash2, ArrowLeft, AlertTriangle, Search } from 'lucide-react'

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

export default function AdminManagement() {
    const [items, setItems] = useState<Management[]>(managementData)
    const [view, setView] = useState<ViewMode>('list')
    const [editItem, setEditItem] = useState<Management | null>(null)
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [search, setSearch] = useState('')
    const [form, setForm] = useState({ name: '', position: '', division: 'BPH', isLeader: false })

    const filtered = items.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.position.toLowerCase().includes(search.toLowerCase()) ||
        m.division.toLowerCase().includes(search.toLowerCase())
    )

    const startCreate = () => {
        setForm({ name: '', position: '', division: 'BPH', isLeader: false })
        setEditItem(null)
        setView('create')
    }

    const startEdit = (item: Management) => {
        setEditItem(item)
        setForm({ name: item.name, position: item.position, division: item.division, isLeader: item.isLeader })
        setView('edit')
    }

    const handleSave = () => {
        if (view === 'create') {
            setItems(prev => [...prev, {
                id: Date.now(),
                ...form,
                photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format'
            }])
        } else if (editItem) {
            setItems(prev => prev.map(m => m.id === editItem.id ? { ...m, ...form } : m))
        }
        setView('list')
    }

    const handleDelete = (id: number) => {
        setItems(prev => prev.filter(m => m.id !== id))
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
                        {view === 'create' ? 'Tambah Pengurus' : 'Edit Pengurus'}
                    </h2>
                </div>

                <div className="bg-[var(--card)] rounded-[var(--radius)] p-6 border border-[var(--border)] max-w-md shadow-sm">
                    <div className="space-y-4">
                        <div>
                            <label className="form-label">Nama Lengkap</label>
                            <input
                                className="form-input"
                                value={form.name}
                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                placeholder="Nama pengurus..."
                            />
                        </div>

                        <div>
                            <label className="form-label">Jabatan</label>
                            <input
                                className="form-input"
                                value={form.position}
                                onChange={e => setForm(f => ({ ...f, position: e.target.value }))}
                                placeholder="Contoh: Ketua Umum / Kabid Perkaderan"
                            />
                        </div>

                        <div>
                            <label className="form-label">Bidang / Divisi</label>
                            <select
                                className="form-input"
                                value={form.division}
                                onChange={e => setForm(f => ({ ...f, division: e.target.value }))}
                            >
                                {divisionOptions.map(d => (
                                    <option key={d} value={d}>{d === 'BPH' ? 'BPH / Pimpinan' : d}</option>
                                ))}
                            </select>
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
                    Kelola Kepengurusan
                </h2>
                <button onClick={startCreate} className="btn-primary text-xs flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Tambah Pengurus
                </button>
            </div>

            {deleteId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-[var(--card)] rounded-[var(--radius)] p-6 max-w-sm w-full mx-4 border border-[var(--border)] shadow-xl">
                        <div className="flex items-center gap-2 text-[var(--error)] mb-2">
                            <AlertTriangle className="w-5 h-5" />
                            <h3 className="font-black text-sm font-display text-[var(--text-primary)]">
                                Hapus Pengurus?
                            </h3>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                            Data pengurus ini akan dihapus secara permanen dari struktur organisasi.
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
                <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between gap-4 bg-[var(--surface)]">
                    <div className="relative">
                        <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Cari pengurus..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="form-input text-xs pl-8 py-1.5"
                            style={{ width: '220px' }}
                        />
                    </div>
                    <span className="text-xs text-[var(--text-muted)] font-display font-medium">
                        {filtered.length} pengurus
                    </span>
                </div>

                <table className="admin-table">
                    <thead>
                    <tr>
                        <th>Pengurus</th>
                        <th>Jabatan</th>
                        <th>Bidang</th>
                        <th>Aksi</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="text-center py-8 text-[var(--text-muted)] text-xs">
                                Tidak ada data pengurus yang ditemukan.
                            </td>
                        </tr>
                    ) : (
                        filtered.map(m => (
                            <tr key={m.id}>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={m.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format'}
                                            alt={m.name}
                                            className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-[var(--border)] bg-[#111111]"
                                        />
                                        <span className="font-semibold text-xs text-[var(--text-primary)] font-display">
                                                {m.name}
                                            </span>
                                    </div>
                                </td>
                                <td className="text-xs text-[var(--text-secondary)]">
                                    {m.position}
                                </td>
                                <td>
                                        <span className="text-xs font-semibold text-[var(--primary)] font-display">
                                            {m.division}
                                        </span>
                                </td>
                                <td>
                                    <div className="flex gap-3 items-center">
                                        <button
                                            onClick={() => startEdit(m)}
                                            className="text-xs font-semibold text-[var(--info)] hover:underline flex items-center gap-1 font-display"
                                        >
                                            <Edit2 className="w-3 h-3" /> Edit
                                        </button>
                                        <button
                                            onClick={() => setDeleteId(m.id)}
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