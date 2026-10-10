'use client'

import { useState } from 'react'
import { products, type Product } from '../../../lib/data'
import { Plus, Edit2, Trash2, ArrowLeft, AlertTriangle, Search } from 'lucide-react'

type ViewMode = 'list' | 'create' | 'edit'

export default function Page() {
    const [items, setItems] = useState<Product[]>(products)
    const [view, setView] = useState<ViewMode>('list')
    const [editItem, setEditItem] = useState<Product | null>(null)
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [search, setSearch] = useState('')
    const [form, setForm] = useState({ name: '', description: '', price: 0, category: 'Pakaian', available: true })

    const filtered = items.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

    const startCreate = () => {
        setForm({ name: '', description: '', price: 0, category: 'Pakaian', available: true })
        setEditItem(null)
        setView('create')
    }

    const startEdit = (item: Product) => {
        setEditItem(item)
        setForm({ name: item.name, description: item.description, price: item.price, category: item.category, available: item.available })
        setView('edit')
    }

    const handleSave = () => {
        if (view === 'create') {
            const newItem: Product = {
                id: Date.now(),
                ...form,
                image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&auto=format',
            }
            setItems(prev => [newItem, ...prev])
        } else if (editItem) {
            setItems(prev => prev.map(p => p.id === editItem.id ? { ...p, ...form } : p))
        }
        setView('list')
    }

    const handleDelete = (id: number) => {
        setItems(prev => prev.filter(p => p.id !== id))
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
                        {view === 'create' ? 'Tambah Produk' : 'Edit Produk'}
                    </h2>
                </div>

                <div className="bg-[var(--card)] rounded-[var(--radius)] p-6 border border-[var(--border)] max-w-xl shadow-sm">
                    <div className="space-y-4">
                        <div>
                            <label className="form-label">Nama Produk</label>
                            <input
                                className="form-input"
                                value={form.name}
                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                placeholder="Nama produk..."
                            />
                        </div>

                        <div>
                            <label className="form-label">Deskripsi</label>
                            <textarea
                                className="form-input"
                                rows={3}
                                value={form.description}
                                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                placeholder="Deskripsi produk..."
                                style={{ resize: 'vertical' }}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="form-label">Harga (Rp)</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={form.price}
                                    onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                                />
                            </div>
                            <div>
                                <label className="form-label">Kategori</label>
                                <select
                                    className="form-input"
                                    value={form.category}
                                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                >
                                    {['Pakaian', 'Aksesori', 'Stationery', 'Lainnya'].map(c => <option key={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-1">
                            <input
                                type="checkbox"
                                id="available"
                                checked={form.available}
                                onChange={e => setForm(f => ({ ...f, available: e.target.checked }))}
                                className="w-4 h-4 rounded border-[var(--border)] accent-[var(--primary)] cursor-pointer"
                            />
                            <label htmlFor="available" className="form-label mb-0 cursor-pointer font-medium text-[var(--text-primary)]">
                                Produk tersedia
                            </label>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button onClick={handleSave} className="btn-primary">
                                {view === 'create' ? 'Simpan Produk' : 'Perbarui'}
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
                    Kelola Produk Ekowir
                </h2>
                <button onClick={startCreate} className="btn-primary text-xs flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Tambah Produk
                </button>
            </div>

            {deleteId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-[var(--card)] rounded-[var(--radius)] p-6 max-w-sm w-full mx-4 border border-[var(--border)] shadow-xl">
                        <div className="flex items-center gap-2 text-[var(--error)] mb-2">
                            <AlertTriangle className="w-5 h-5" />
                            <h3 className="font-black text-sm font-display text-[var(--text-primary)]">
                                Hapus Produk?
                            </h3>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                            Produk ini akan dihapus secara permanen dari etalase Ekowir.
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
                            placeholder="Cari produk..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="form-input text-xs pl-8 py-1.5"
                            style={{ width: '220px' }}
                        />
                    </div>
                    <span className="text-xs text-[var(--text-muted)] font-display font-medium">
                        {filtered.length} produk
                    </span>
                </div>

                <table className="admin-table">
                    <thead>
                    <tr>
                        <th>Produk</th>
                        <th>Kategori</th>
                        <th>Harga</th>
                        <th>Status</th>
                        <th>Aksi</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="text-center py-8 text-[var(--text-muted)] text-xs">
                                Tidak ada produk yang ditemukan.
                            </td>
                        </tr>
                    ) : (
                        filtered.map(p => (
                            <tr key={p.id}>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={p.image}
                                            alt={p.name}
                                            className="w-10 h-10 rounded-[var(--radius)] object-cover flex-shrink-0 border border-[var(--border)] bg-[#111111]"
                                        />
                                        <div>
                                            <p className="font-semibold text-xs line-clamp-1 text-[var(--text-primary)] font-display">
                                                {p.name}
                                            </p>
                                            <p className="text-xs mt-0.5 line-clamp-1 text-[var(--text-muted)]">
                                                {p.description}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="text-xs text-[var(--text-secondary)]">
                                    {p.category}
                                </td>
                                <td className="text-xs font-bold text-[var(--primary)] whitespace-nowrap font-display">
                                    Rp {p.price.toLocaleString('id-ID')}
                                </td>
                                <td>
                                        <span className={p.available ? 'badge-available' : 'badge-unavailable'}>
                                            {p.available ? 'Tersedia' : 'Habis'}
                                        </span>
                                </td>
                                <td>
                                    <div className="flex gap-3 items-center">
                                        <button
                                            onClick={() => startEdit(p)}
                                            className="text-xs font-semibold text-[var(--info)] hover:underline flex items-center gap-1 font-display"
                                        >
                                            <Edit2 className="w-3 h-3" /> Edit
                                        </button>
                                        <button
                                            onClick={() => setDeleteId(p.id)}
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