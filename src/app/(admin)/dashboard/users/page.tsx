'use client'

import { useState } from 'react'
import { roleLabels, type Role } from '../../../lib/data'
import { UserPlus, Edit2, Trash2, ArrowLeft, AlertTriangle, ShieldCheck, ShieldAlert, KeyRound } from 'lucide-react'

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

export default function AdminUsersPage() {
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
                        {view === 'create' ? 'Tambah Akun Pengguna' : 'Edit Akun Pengguna'}
                    </h2>
                </div>

                <div className="bg-[var(--card)] rounded-2xl p-6 md:p-8 border border-[var(--border)] max-w-2xl shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="md:col-span-2 space-y-5 border-b border-[var(--border)] pb-6">
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">Nama Pengguna</label>
                                <input
                                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm font-semibold"
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="Masukkan nama lengkap..."
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">Email Organisasi / Login</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm"
                                    value={form.email}
                                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                    placeholder="nama@kaizen.id"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">Hak Akses / Role</label>
                            <select
                                className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm font-medium"
                                value={form.role}
                                onChange={e => setForm(f => ({ ...f, role: e.target.value as Role }))}
                            >
                                {roles.map(r => (
                                    <option key={r} value={r}>{roleLabels[r]}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col justify-center">
                            <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 font-display uppercase tracking-wide">Status Login</label>
                            <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-between cursor-pointer hover:bg-[var(--surface)] transition-colors" onClick={() => setForm(f => ({ ...f, active: !f.active }))}>
                                <div>
                                    <h4 className="text-sm font-bold text-[var(--text-primary)]">
                                        Akun {form.active ? 'Aktif' : 'Ditangguhkan'}
                                    </h4>
                                </div>
                                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.active ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`}>
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.active ? 'translate-x-6' : 'translate-x-1'}`} />
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2 flex gap-3 pt-4 border-t border-[var(--border)]">
                            <button onClick={handleSave} className="flex-1 py-3 bg-[var(--primary)] text-white text-xs font-bold tracking-widest uppercase rounded-xl shadow-md shadow-[var(--primary)]/20 hover:bg-[var(--primary-dark)] transition-all flex items-center justify-center gap-2">
                                <KeyRound className="w-4 h-4" /> {view === 'create' ? 'Buat Akun Akses' : 'Simpan Perubahan'}
                            </button>
                            <button onClick={() => setView('list')} className="flex-1 py-3 bg-transparent border border-[var(--border)] text-[var(--text-primary)] text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-[var(--surface-2)] transition-all">
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[var(--card)] p-4 md:p-6 rounded-2xl border border-[var(--border)] shadow-sm mb-6">
                <div>
                    <h2 className="text-xl font-black text-[var(--text-primary)] font-display flex items-center gap-2">
                        Pengguna & Akses <span className="bg-[var(--primary)]/10 text-[var(--primary)] text-xs px-2 py-1 rounded-md">{users.length} Akun</span>
                    </h2>
                    <p className="text-sm text-[var(--text-muted)] mt-1">Kelola kredensial login dan hak akses dashboard</p>
                </div>
                <button onClick={startCreate} className="w-full sm:w-auto py-2.5 px-5 bg-[var(--primary)] text-white text-xs font-bold tracking-widest uppercase rounded-xl shadow-md shadow-[var(--primary)]/20 hover:bg-[var(--primary-dark)] transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5">
                    <UserPlus className="w-4 h-4" /> Tambah Pengguna
                </button>
            </div>

            {deleteId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="bg-[var(--card)] rounded-2xl p-6 md:p-8 max-w-sm w-full border border-[var(--border)] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-12 h-12 rounded-full bg-red-100/10 border border-red-500/20 flex items-center justify-center mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-500" />
                        </div>
                        <h3 className="font-black text-lg font-display text-[var(--text-primary)] mb-2">Hapus Akun Akses?</h3>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-8">
                            Pengguna ini tidak akan bisa lagi login atau mengakses dashboard administrasi. Tindakan ini permanen.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteId(null)} className="flex-1 py-3 bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-primary)] text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-[var(--surface)] transition-all">
                                Batal
                            </button>
                            <button onClick={() => handleDelete(deleteId)} className="flex-1 py-3 bg-red-600 text-white text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-red-700 transition-all">
                                Cabut Akses
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-[var(--surface-2)] border-b border-[var(--border)] text-xs text-[var(--text-muted)] uppercase tracking-wider font-display">
                            <th className="p-4 font-bold pl-6">Data Kredensial</th>
                            <th className="p-4 font-bold">Role Akses</th>
                            <th className="p-4 font-bold">Status Login</th>
                            <th className="p-4 font-bold text-right pr-6">Aksi</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                        {users.map(u => (
                            <tr key={u.id} className="hover:bg-[var(--surface)] transition-colors">
                                <td className="p-4 pl-6">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-black flex-shrink-0 shadow-sm font-display uppercase"
                                            style={{ background: roleColors[u.role] }}
                                        >
                                            {u.name.slice(0, 2)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-[var(--text-primary)] font-display">
                                                {u.name}
                                            </p>
                                            <p className="text-xs text-[var(--text-muted)] font-medium mt-0.5">
                                                {u.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span
                                        className="text-[11px] font-bold px-3 py-1.5 rounded-lg font-display border uppercase tracking-wider"
                                        style={{
                                            background: `rgba(${u.role === 'superadmin' ? '200, 16, 46' : u.role === 'bpi' ? '26, 111, 168' : u.role === 'medkom' ? '107, 70, 193' : '212, 160, 23'}, 0.1)`,
                                            borderColor: `rgba(${u.role === 'superadmin' ? '200, 16, 46' : u.role === 'bpi' ? '26, 111, 168' : u.role === 'medkom' ? '107, 70, 193' : '212, 160, 23'}, 0.2)`,
                                            color: roleColors[u.role]
                                        }}
                                    >
                                        {roleLabels[u.role]}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() => toggleActive(u.id)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105 border ${
                                            u.active
                                                ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20'
                                                : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
                                        }`}
                                        title="Klik untuk mengubah izin login"
                                    >
                                        {u.active ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                                        {u.active ? 'Diizinkan' : 'Ditangguhkan'}
                                    </button>
                                </td>
                                <td className="p-4 pr-6 text-right">
                                    <div className="flex gap-2 items-center justify-end">
                                        <button
                                            onClick={() => startEdit(u)}
                                            className="p-2 text-[var(--text-muted)] hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors" title="Edit Akun"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setDeleteId(u.id)}
                                            className="p-2 text-[var(--text-muted)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors" title="Hapus Akun"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
