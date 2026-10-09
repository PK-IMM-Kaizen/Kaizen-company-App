'use client'

import { useState } from 'react'
import { managementData, type Management } from '../../(public)/data'

type ViewMode = 'list' | 'create' | 'edit'

export default function AdminManagement() {
    const [items, setItems] = useState<Management[]>(managementData)
    const [view, setView] = useState<ViewMode>('list')
    const [editItem, setEditItem] = useState<Management | null>(null)
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [search, setSearch] = useState('')
    const [form, setForm] = useState({ name: '', position: '', division: 'Pimpinan', isLeader: false })

    const filtered = items.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.position.toLowerCase().includes(search.toLowerCase())
    )

    const startCreate = () => {
        setForm({ name: '', position: '', division: 'Pimpinan', isLeader: false })
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
            setItems(prev => [...prev, { id: Date.now(), ...form, photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format' }])
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
                    <button onClick={() => setView('list')} className="text-xs font-semibold" style={{ color: '#888' }}>← Kembali</button>
                    <span style={{ color: '#ddd' }}>/</span>
                    <h2 className="text-sm font-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {view === 'create' ? 'Tambah Pengurus' : 'Edit Pengurus'}
                    </h2>
                </div>
                <div className="bg-white rounded p-6" style={{ border: '1px solid #E0DEDC', maxWidth: '480px' }}>
                    <div className="space-y-4">
                        <div>
                            <label className="form-label">Nama Lengkap</label>
                            <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nama pengurus..." />
                        </div>
                        <div>
                            <label className="form-label">Jabatan</label>
                            <input className="form-input" value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))} placeholder="Jabatan..." />
                        </div>
                        <div>
                            <label className="form-label">Bidang</label>
                            <select className="form-input" value={form.division} onChange={e => setForm(f => ({ ...f, division: e.target.value }))}>
                                {['Pimpinan', 'BPI', 'Medkom', 'Ekowir', 'Hikmah', 'SPM'].map(d => <option key={d}>{d}</option>)}
                            </select>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button onClick={handleSave} className="btn-primary">{view === 'create' ? 'Simpan' : 'Perbarui'}</button>
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
                <h2 className="text-sm font-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>Kelola Kepengurusan</h2>
                <button onClick={startCreate} className="btn-primary text-xs">+ Tambah Pengurus</button>
            </div>

            {deleteId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                        <h3 className="font-black text-sm mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Hapus Pengurus?</h3>
                        <p className="text-xs mb-5" style={{ color: '#666' }}>Data pengurus ini akan dihapus secara permanen.</p>
                        <div className="flex gap-3">
                            <button onClick={() => handleDelete(deleteId)} className="btn-primary flex-1 justify-center">Hapus</button>
                            <button onClick={() => setDeleteId(null)} className="btn-outline flex-1 justify-center">Batal</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded" style={{ border: '1px solid #E0DEDC' }}>
                <div className="px-5 py-4 border-b" style={{ borderColor: '#E0DEDC' }}>
                    <input type="text" placeholder="Cari pengurus..." value={search} onChange={e => setSearch(e.target.value)}
                           className="form-input text-xs" style={{ width: '220px' }} />
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
                    {filtered.map(m => (
                        <tr key={m.id}>
                            <td>
                                <div className="flex items-center gap-3">
                                    <img src={m.photo} alt={m.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                                    <span className="font-semibold text-xs" style={{ fontFamily: 'Montserrat, sans-serif' }}>{m.name}</span>
                                </div>
                            </td>
                            <td className="text-xs" style={{ color: '#444' }}>{m.position}</td>
                            <td>
                                <span className="text-xs font-semibold" style={{ color: '#C8102E', fontFamily: 'Montserrat, sans-serif' }}>{m.division}</span>
                            </td>
                            <td>
                                <div className="flex gap-2">
                                    <button onClick={() => startEdit(m)} className="text-xs font-semibold" style={{ color: '#1A6FA8', fontFamily: 'Montserrat, sans-serif' }}>Edit</button>
                                    <button onClick={() => setDeleteId(m.id)} className="text-xs font-semibold" style={{ color: '#C8102E', fontFamily: 'Montserrat, sans-serif' }}>Hapus</button>
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
