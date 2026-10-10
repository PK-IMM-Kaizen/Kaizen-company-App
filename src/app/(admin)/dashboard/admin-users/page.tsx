'use client'

import { useState } from 'react'
import { roleLabels, type Role } from '../../../lib/data'
import { UserPlus, Edit2, Trash2, ArrowLeft, AlertTriangle, UserCheck, UserX } from 'lucide-react'

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

export default function Page() {
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
        superadmin: 'var(--primary)',
        bpi: 'var(--info)',
        medkom: '#6B46C1',
        ekowir: 'var(--accent-dark)',
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
                        {view === 'create' ? 'Tambah Pengguna' : 'Edit Pengguna'}
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
                                placeholder="Masukkan nama akun..."
                            />
                        </div>

                        <div>
                            <label className="form-label">Email Organisasi</label>
                            <input
                                type="email"
                                className="form-input"
                                value={form.email}
                                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                placeholder="nama@kaizen.id"
                            />
                        </div>

                        <div>
                            <label className="form-label">Peran / Role</label>
                            <select
                                className="form-input"
                                value={form.role}
                                onChange={e => setForm(f => ({ ...f, role: e.target.value as Role }))}
                            >
                                {roles.map(r => <option key={r} value={r}>{roleLabels[r]}</option>)}
                            </select>
                        </div>

                        <div className="flex items-center gap-3 pt-1">
                            <input
                                type="checkbox"
                                id="active"
                                checked={form.active}
                                onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
                                className="w-4 h-4 rounded border-[var(--border)] accent-[var(--primary)] cursor-pointer"
                            />
                            <label htmlFor="active" className="form-label mb-0 cursor-pointer font-medium text-[var(--text-primary)]">
                                Akun aktif (Dapat Login)
                            </label>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button onClick={handleSave} className="btn-primary">
                                {view === 'create' ? 'Buat Akun' : 'Perbarui'}
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
                    Manajemen Pengguna & Akses
                </h2>
                <button onClick={startCreate} className="btn-primary text-xs flex items-center gap-1.5">
                    <UserPlus className="w-3.5 h-3.5" /> Tambah Pengguna
                </button>
            </div>

            {deleteId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-[var(--card)] rounded-[var(--radius)] p-6 max-w-sm w-full mx-4 border border-[var(--border)] shadow-xl">
                        <div className="flex items-center gap-2 text-[var(--error)] mb-2">
                            <AlertTriangle className="w-5 h-5" />
                            <h3 className="font-black text-sm font-display text-[var(--text-primary)]">
                                Hapus Pengguna?
                            </h3>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                            Akun pengguna ini akan dihapus secara permanen dari sistem administrasi.
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
                        <th>Pengguna</th>
                        <th>Peran / Role</th>
                        <th>Status Akun</th>
                        <th>Aksi</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(u => (
                        <tr key={u.id}>
                            <td>
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0 shadow-sm font-display"
                                        style={{ background: roleColors[u.role] }}
                                    >
                                        {u.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-xs text-[var(--text-primary)] font-display">
                                            {u.name}
                                        </p>
                                        <p className="text-xs text-[var(--text-muted)]">
                                            {u.email}
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                    <span
                                        className="text-xs font-bold px-2.5 py-1 rounded-full font-display border border-transparent inline-block"
                                        style={{
                                            background: `rgba(${u.role === 'superadmin' ? '200, 16, 46' : u.role === 'bpi' ? '26, 111, 168' : u.role === 'medkom' ? '107, 70, 193' : '212, 160, 23'}, 0.12)`,
                                            color: roleColors[u.role]
                                        }}
                                    >
                                        {roleLabels[u.role]}
                                    </span>
                            </td>
                            <td>
                                <button
                                    onClick={() => toggleActive(u.id)}
                                    className={`${u.active ? 'badge-available' : 'badge-unavailable'} flex items-center gap-1 cursor-pointer transition-all hover:scale-105`}
                                    title="Klik untuk mengubah status akun"
                                >
                                    {u.active ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                                    {u.active ? 'Aktif' : 'Nonaktif'}
                                </button>
                            </td>
                            <td>
                                <div className="flex gap-3 items-center">
                                    <button
                                        onClick={() => startEdit(u)}
                                        className="text-xs font-semibold text-[var(--info)] hover:underline flex items-center gap-1 font-display"
                                    >
                                        <Edit2 className="w-3 h-3" /> Edit
                                    </button>
                                    <button
                                        onClick={() => setDeleteId(u.id)}
                                        className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1 font-display"
                                    >
                                        <Trash2 className="w-3 h-3" /> Hapus
                                    </button>
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