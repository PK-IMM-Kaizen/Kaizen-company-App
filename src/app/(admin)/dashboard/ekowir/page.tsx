'use client'

import { useState } from 'react'
import { products, type Product } from '../../../lib/data'
import { Plus, Edit2, Trash2, ArrowLeft, AlertTriangle, Search, Image as ImageIcon, Tag } from 'lucide-react'

type ViewMode = 'list' | 'create' | 'edit'

export default function AdminEkowirPage() {
    const [items, setItems] = useState<Product[]>(products)
    const [view, setView] = useState<ViewMode>('list')
    const [editItem, setEditItem] = useState<Product | null>(null)
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [search, setSearch] = useState('')

    const [form, setForm] = useState({ name: '', description: '', price: 0, category: 'Pakaian', available: true, image: '' })

    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string>('')

    const filtered = items.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

    const startCreate = () => {
        setForm({ name: '', description: '', price: 0, category: 'Pakaian', available: true, image: '' })
        setImageFile(null)
        setImagePreview('')
        setEditItem(null)
        setView('create')
    }

    const startEdit = (item: Product) => {
        setEditItem(item)
        setForm({ name: item.name, description: item.description, price: item.price, category: item.category, available: item.available, image: item.image || '' })
        setImageFile(null)
        setImagePreview(item.image || '')
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
        const finalImageUrl = imageFile ? URL.createObjectURL(imageFile) : form.image

        if (view === 'create') {
            const newItem: Product = {
                id: Date.now(),
                ...form,
                image: finalImageUrl || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&auto=format',
            }
            setItems(prev => [newItem, ...prev])
        } else if (editItem) {
            setItems(prev => prev.map(p => p.id === editItem.id ? { ...p, ...form, image: finalImageUrl } : p))
        }
        setView('list')
    }

    const handleDelete = (id: number) => {
        setItems(prev => prev.filter(p => p.id !== id))
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
                        {view === 'create' ? 'Tambah Produk Baru' : 'Edit Produk'}
                    </h2>
                </div>

                <div className="bg-[var(--card)] rounded-2xl p-6 md:p-8 border border-[var(--border)] shadow-sm">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">Nama Produk</label>
                                <input
                                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm font-semibold"
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="Masukkan nama produk..."
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">Deskripsi Produk</label>
                                <textarea
                                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm leading-relaxed"
                                    rows={5}
                                    value={form.description}
                                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    placeholder="Jelaskan detail bahan, ukuran, dan keunggulan produk..."
                                    style={{ resize: 'vertical' }}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">Harga Produk (Rp)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[var(--text-muted)]">Rp</span>
                                        <input
                                            type="number"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm font-bold"
                                            value={form.price}
                                            onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">Kategori</label>
                                    <select
                                        className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm"
                                        value={form.category}
                                        onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                    >
                                        {['Pakaian', 'Aksesori', 'Stationery', 'Lainnya'].map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide flex items-center gap-1.5">
                                    <ImageIcon className="w-4 h-4" /> Foto Produk
                                </label>
                                <div className="mt-2 flex justify-center rounded-xl border border-dashed border-[var(--border-strong)] px-6 py-8 bg-[var(--surface-2)] hover:bg-[var(--surface)] transition-colors relative">
                                    <div className="text-center w-full">
                                        {imagePreview ? (
                                            <div className="mb-4 relative w-full aspect-square rounded-lg overflow-hidden border border-[var(--border)] bg-white">
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                                            </div>
                                        ) : (
                                            <ImageIcon className="mx-auto h-12 w-12 text-[var(--text-muted)] mb-4" />
                                        )}
                                        <div className="flex justify-center text-sm leading-6 text-gray-600">
                                            <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-semibold text-[var(--primary)] hover:text-[var(--primary-dark)] focus-within:outline-none">
                                                <span>Pilih gambar</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                                            </label>
                                        </div>
                                        <p className="text-[10px] text-[var(--text-muted)] mt-1">Rekomendasi rasio 1:1 (Square)</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-between cursor-pointer" onClick={() => setForm(f => ({ ...f, available: !f.available }))}>
                                <div>
                                    <h4 className="text-sm font-bold text-[var(--text-primary)]">Status Produk</h4>
                                    <p className="text-xs text-[var(--text-muted)]">Tampilkan di katalog web</p>
                                </div>
                                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.available ? 'bg-[var(--primary)]' : 'bg-gray-300 dark:bg-gray-700'}`}>
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.available ? 'translate-x-6' : 'translate-x-1'}`} />
                                </div>
                            </div>

                            <div className="pt-4 space-y-3 border-t border-[var(--border)]">
                                <button onClick={handleSave} className="w-full py-3 px-4 bg-[var(--primary)] text-white text-xs font-bold tracking-widest uppercase rounded-xl shadow-md shadow-[var(--primary)]/20 hover:bg-[var(--primary-dark)] transition-all">
                                    {view === 'create' ? 'Simpan Produk' : 'Simpan Perubahan'}
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
                        Katalog Ekowir <span className="bg-[var(--primary)]/10 text-[var(--primary)] text-xs px-2 py-1 rounded-md">{items.length} Total</span>
                    </h2>
                    <p className="text-sm text-[var(--text-muted)] mt-1">Kelola daftar produk merchandise dan kewirausahaan</p>
                </div>
                <button onClick={startCreate} className="w-full sm:w-auto py-2.5 px-5 bg-[var(--primary)] text-white text-xs font-bold tracking-widest uppercase rounded-xl shadow-md shadow-[var(--primary)]/20 hover:bg-[var(--primary-dark)] transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5">
                    <Plus className="w-4 h-4" /> Tambah Produk
                </button>
            </div>

            {deleteId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="bg-[var(--card)] rounded-2xl p-6 md:p-8 max-w-sm w-full border border-[var(--border)] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-12 h-12 rounded-full bg-red-100/10 border border-red-500/20 flex items-center justify-center mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-500" />
                        </div>
                        <h3 className="font-black text-lg font-display text-[var(--text-primary)] mb-2">Hapus Produk?</h3>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-8">
                            Produk ini akan dihapus secara permanen dari etalase Ekowir.
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
                            placeholder="Cari nama produk..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all text-sm"
                        />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] font-medium bg-[var(--surface-2)] px-3 py-1.5 rounded-lg border border-[var(--border)]">
                        <Tag className="w-4 h-4" /> {filtered.length} ditemukan
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-[var(--surface-2)] border-b border-[var(--border)] text-xs text-[var(--text-muted)] uppercase tracking-wider font-display">
                            <th className="p-4 font-bold pl-6">Produk</th>
                            <th className="p-4 font-bold">Kategori</th>
                            <th className="p-4 font-bold">Harga</th>
                            <th className="p-4 font-bold">Status</th>
                            <th className="p-4 font-bold text-right pr-6">Aksi</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-16 text-[var(--text-muted)] text-sm font-medium">
                                    Tidak ada produk yang ditemukan.
                                </td>
                            </tr>
                        ) : (
                            filtered.map(p => (
                                <tr key={p.id} className="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors group">
                                    <td className="p-4 pl-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-white overflow-hidden flex-shrink-0 border border-[var(--border)] p-0.5">
                                                <img src={p.image} alt={p.name} className="w-full h-full object-cover rounded-lg" />
                                            </div>
                                            <div>
                                                <span className="font-bold text-sm text-[var(--text-primary)] font-display block">
                                                    {p.name}
                                                </span>
                                                <p className="text-[11px] mt-0.5 text-[var(--text-muted)] line-clamp-1 max-w-[200px]">
                                                    {p.description}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-[11px] font-semibold text-[var(--text-secondary)] bg-[var(--surface-2)] px-2.5 py-1 rounded-md border border-[var(--border)]">
                                            {p.category}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-sm font-black text-[var(--primary)] whitespace-nowrap font-display">
                                            Rp {p.price.toLocaleString('id-ID')}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${
                                            p.available ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20'
                                                : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
                                        }`}>
                                            {p.available ? 'Tersedia' : 'Habis'}
                                        </span>
                                    </td>
                                    <td className="p-4 pr-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => startEdit(p)} className="p-2 text-[var(--text-muted)] hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors" title="Edit Produk">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => setDeleteId(p.id)} className="p-2 text-[var(--text-muted)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors" title="Hapus Produk">
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