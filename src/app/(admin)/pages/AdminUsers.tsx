'use client'

import { useState } from 'react'
import { roleLabels, type Role } from '../../(public)/data'

interface User {
    id: number
    name: string
    email: string
    role: Role
    active: boolean
}

const initialUsers: User[] = [
    { id: 1, name: 'Ahmad Super', email: 'superadmin@kaizen.id', role: 'superadmin', active: true },
    { id: 2, name: 'Fajar BPI', email: 'bpi@kaizen.id', role: 'bpi', active: true },
    { id: 3, name: 'Bagas Medkom', email: 'medkom@kaizen.id', role: 'medkom', active: true },
    { id: 4, name: 'Dicky Ekowir', email: 'ekowir@kaizen.id', role: 'ekowir', active: true },
]

type ViewMode = 'list' | 'create' | 'edit'

export default function AdminUsers() {
    const [users, setUsers] = useState<User[]>(initialUsers)
    const [view, setView] = useState<ViewMode>('list')
    const [editItem, setEditItem] = useState<User | null>(null)
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [form, setForm] = useState({ name: '', email: '', role: 'medkom' as Role, active: true })

    const startCreate = () => {
        setForm({ name: '', email: '', role: 'medkom', active: true })
        setEditItem(null)
        setView('create')
    }

    const startEdit = (u: User) => {
        setEditItem(u)
        setForm({ name: u.name, email: u.email, role: u.role, active: u.active })
        setView('edit')
    }

    const handleSave = () => {
        if (view === 'create') {
            setUsers(prev => [...prev, { id: Date.now(), ...form }])
        } else if (editItem) {
            setUsers(prev => prev.map(u => u.id === editItem.id ? { ...u, ...form } : u))
        }
        setView('list')
    }

    const handleDelete = (id: number) => {
        setUsers(prev => prev.filter(u => u.id !== id))
        setDeleteId(null)
    }

    const toggleActive = (id: number) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, active: !u.active } : u))
    }

    const roles: Role[] = ['superadmin', 'bpi', 'medkom', 'ekowir']
    const roleColors: Record<Role, string> = {
        superadmin: '#C8102E',
        bpi: '#1A6FA8',
        medkom: '#6B46C1',
        ekowir: '#D4A017',
    }

    if (view === 'create' || view === 'edit') {
        return (
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <button onClick={() => setView('list')} className="text-xs font-semibold" style={{ color: '#888' }}>← Kembali</button>
                    <span style={{ color: '#ddd' }}>/</span>
                    <h2 className="text-sm font-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {view === 'create' ? 'Tambah Pengguna' : 'Edit Pengguna'}
                    </h2>
                </div>
                <div className="bg-white rounded p-6" style={{ border: '1px solid #E0DEDC', maxWidth: '420px' }}>
                    <div className="space-y-4">
                        <div><label className="form-label">Nama Lengkap</label><input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
                        <div><label className="form-label">Email</label><input type="email" className="form-input" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
                        <div>
                            <label className="form-label">Role</label>
                            <select className="form-input" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as Role }))}>
                                {roles.map(r => <option key={r} value={r}>{roleLabels[r]}</option>)}
                            </select>
                        </div>
                        <div className="flex items-center gap-3">
                            <input type="checkbox" id="active" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
                                   className="w-4 h-4" style={{ accentColor: '#C8102E' }} />
                            <label htmlFor="active" className="form-label mb-0 cursor-pointer">Akun aktif</label>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button onClick={handleSave} className="btn-primary">{view === 'create' ? 'Buat Akun' : 'Perbarui'}</button>
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
                <h2 className="text-sm font-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>Manajemen Pengguna</h2>
                <button onClick={startCreate} className="btn-primary text-xs">+ Tambah Pengguna</button>
            </div>

            {deleteId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                        <h3 className="font-black text-sm mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Hapus Pengguna?</h3>
                        <p className="text-xs mb-5" style={{ color: '#666' }}>Akun pengguna ini akan dihapus secara permanen.</p>
                        <div className="flex gap-3">
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
                        <th>Pengguna</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Aksi</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(u => (
                        <tr key={u.id}>
                            <td>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                                         style={{ background: roleColors[u.role], fontFamily: 'Montserrat, sans-serif' }}>
                                        {u.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-xs" style={{ fontFamily: 'Montserrat, sans-serif' }}>{u.name}</p>
                                        <p className="text-xs" style={{ color: '#888' }}>{u.email}</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ background: `${roleColors[u.role]}20`, color: roleColors[u.role], fontFamily: 'Montserrat, sans-serif' }}>
                    {roleLabels[u.role]}
                  </span>
                            </td>
                            <td>
                                <button onClick={() => toggleActive(u.id)}
                                        className={u.active ? 'badge-available' : 'badge-unavailable'}
                                        style={{ cursor: 'pointer' }}>
                                    {u.active ? 'Aktif' : 'Nonaktif'}
                                </button>
                            </td>
                            <td>
                                <div className="flex gap-2">
                                    <button onClick={() => startEdit(u)} className="text-xs font-semibold" style={{ color: '#1A6FA8', fontFamily: 'Montserrat, sans-serif' }}>Edit</button>
                                    <button onClick={() => setDeleteId(u.id)} className="text-xs font-semibold" style={{ color: '#C8102E', fontFamily: 'Montserrat, sans-serif' }}>Hapus</button>
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
