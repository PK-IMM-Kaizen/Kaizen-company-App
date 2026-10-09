'use client'

import { useState } from 'react'
import { products, type Product } from '../../(public)/data'

type ViewMode = 'list' | 'create' | 'edit'

export default function AdminEkowir() {
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
                    <button onClick={() => setView('list')} className="text-xs font-semibold" style={{ color: '#888' }}>← Kembali</button>
                    <span style={{ color: '#ddd' }}>/</span>
                    <h2 className="text-sm font-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {view === 'create' ? 'Tambah Produk' : 'Edit Produk'}
                    </h2>
                </div>
                <div className="bg-white rounded p-6" style={{ border: '1px solid #E0DEDC', maxWidth: '600px' }}>
                    <div className="space-y-4">
                        <div>
                            <label className="form-label">Nama Produk</label>
                            <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nama produk..." />
                        </div>
                        <div>
                            <label className="form-label">Deskripsi</label>
                            <textarea className="form-input" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Deskripsi produk..." style={{ resize: 'vertical' }} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="form-label">Harga (Rp)</label>
                                <input type="number" className="form-input" value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} />
                            </div>
                            <div>
                                <label className="form-label">Kategori</label>
                                <select className="form-input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                                    {['Pakaian', 'Aksesori', 'Stationery', 'Lainnya'].map(c => <option key={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <input type="checkbox" id="available" checked={form.available} onChange={e => setForm(f => ({ ...f, available: e.target.checked }))}
                                   className="w-4 h-4" style={{ accentColor: '#C8102E' }} />
                            <label htmlFor="available" className="form-label mb-0 cursor-pointer">Produk tersedia</label>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button onClick={handleSave} className="btn-primary">{view === 'create' ? 'Simpan Produk' : 'Perbarui'}</button>
                            <button onClick={() => setView('list')} className="btn-outline">Batal</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>Kelola Produk Ekowir</h2>
                <button onClick={startCreate} className="btn-primary text-xs">+ Tambah Produk</button>
            </div>

            {deleteId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                        <h3 className="font-black text-sm mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Hapus Produk?</h3>
                        <p className="text-xs mb-5" style={{ color: '#666' }}>Produk ini akan dihapus secara permanen.</p>
                        <div className="flex gap-3">
                            <button onClick={() => handleDelete(deleteId)} className="btn-primary flex-1 justify-center">Hapus</button>
                            <button onClick={() => setDeleteId(null)} className="btn-outline flex-1 justify-center">Batal</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded" style={{ border: '1px solid #E0DEDC' }}>
                <div className="px-5 py-4 border-b flex items-center justify-between gap-4" style={{ borderColor: '#E0DEDC' }}>
                    <input type="text" placeholder="Cari produk..." value={search} onChange={e => setSearch(e.target.value)}
                           className="form-input text-xs" style={{ width: '220px' }} />
                    <span className="text-xs" style={{ color: '#888' }}>{filtered.length} produk</span>
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
                    {filtered.map(p => (
                        <tr key={p.id}>
                            <td>
                                <div className="flex items-center gap-3">
                                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded object-cover flex-shrink-0"
                                         style={{ border: '1px solid #E0DEDC' }} />
                                    <div>
                                        <p className="font-semibold text-xs line-clamp-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{p.name}</p>
                                        <p className="text-xs mt-0.5 line-clamp-1" style={{ color: '#888' }}>{p.description}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="text-xs" style={{ color: '#666' }}>{p.category}</td>
                            <td className="text-xs font-bold" style={{ color: '#C8102E', fontFamily: 'Montserrat, sans-serif', whiteSpace: 'nowrap' }}>
                                Rp {p.price.toLocaleString('id-ID')}
                            </td>
                            <td><span className={p.available ? 'badge-available' : 'badge-unavailable'}>{p.available ? 'Tersedia' : 'Habis'}</span></td>
                            <td>
                                <div className="flex gap-2">
                                    <button onClick={() => startEdit(p)} className="text-xs font-semibold" style={{ color: '#1A6FA8', fontFamily: 'Montserrat, sans-serif' }}>Edit</button>
                                    <button onClick={() => setDeleteId(p.id)} className="text-xs font-semibold" style={{ color: '#C8102E', fontFamily: 'Montserrat, sans-serif' }}>Hapus</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
