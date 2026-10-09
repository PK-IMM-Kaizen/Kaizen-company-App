'use client'

import { useState } from 'react'
import { alumniData, type Alumni } from '../../(public)/data'

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
                    <button onClick={() => setView('list')} className="text-xs font-semibold" style={{ color: '#888' }}>← Kembali</button>
                    <span style={{ color: '#ddd' }}>/</span>
                    <h2 className="text-sm font-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {view === 'create' ? 'Tambah Alumni' : 'Edit Alumni'}
                    </h2>
                </div>
                <div className="bg-white rounded p-6" style={{ border: '1px solid #E0DEDC', maxWidth: '520px' }}>
                    <div className="space-y-4">
                        <div><label className="form-label">Nama Lengkap</label><input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="form-label">Angkatan</label><input className="form-input" value={form.batch} onChange={e => setForm(f => ({ ...f, batch: e.target.value }))} placeholder="2018" /></div>
                            <div><label className="form-label">Peran / Profesi</label><input className="form-input" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} /></div>
                        </div>
                        <div><label className="form-label">Biografi Singkat</label><textarea className="form-input" rows={3} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} style={{ resize: 'vertical' }} /></div>
                        <div><label className="form-label">Prestasi / Kontribusi</label><input className="form-input" value={form.achievement} onChange={e => setForm(f => ({ ...f, achievement: e.target.value }))} /></div>
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
                <h2 className="text-sm font-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>Kelola Alumni Inspiratif</h2>
                <button onClick={startCreate} className="btn-primary text-xs">+ Tambah Alumni</button>
            </div>

            {deleteId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                        <h3 className="font-black text-sm mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Hapus Alumni?</h3>
                        <div className="flex gap-3 mt-5">
                            <button onClick={() => handleDelete(deleteId)} className="btn-primary flex-1 justify-center">Hapus</button>
                            <button onClick={() => setDeleteId(null)} className="btn-outline flex-1 justify-center">Batal</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded" style={{ border: '1px solid #E0DEDC' }}>
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
                    {items.map(a => (
                        <tr key={a.id}>
                            <td>
                                <div className="flex items-center gap-3">
                                    <img src={a.photo} alt={a.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                                    <span className="font-semibold text-xs" style={{ fontFamily: 'Montserrat, sans-serif' }}>{a.name}</span>
                                </div>
                            </td>
                            <td className="text-xs" style={{ color: '#C8102E', fontWeight: 600, fontFamily: 'Montserrat, sans-serif' }}>{a.batch}</td>
                            <td className="text-xs" style={{ color: '#666' }}>{a.role}</td>
                            <td className="text-xs line-clamp-1" style={{ color: '#666', maxWidth: '200px' }}>{a.achievement}</td>
                            <td>
                                <div className="flex gap-2">
                                    <button onClick={() => startEdit(a)} className="text-xs font-semibold" style={{ color: '#1A6FA8', fontFamily: 'Montserrat, sans-serif' }}>Edit</button>
                                    <button onClick={() => setDeleteId(a.id)} className="text-xs font-semibold" style={{ color: '#C8102E', fontFamily: 'Montserrat, sans-serif' }}>Hapus</button>
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
