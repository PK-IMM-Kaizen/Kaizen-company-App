'use client'

import { useState, useEffect } from 'react'
import { UserPlus, Shield, Mail, Lock, Trash2, Edit, Power, RefreshCw, Users } from 'lucide-react'

interface User {
    id: string
    email: string
    role: string
    is_active: boolean
}

export default function UsersManagementPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('admin')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [editingUserId, setEditingUserId] = useState<string | null>(null)

    const [users, setUsers] = useState<User[]>([])
    const [isLoadingUsers, setIsLoadingUsers] = useState(true)

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        setIsLoadingUsers(true)
        try {
            const res = await fetch('/api/users')
            if (res.ok) {
                const data = await res.json()
                setUsers(data.users || [])
            }
        } catch (error) {
            console.error('Gagal mengambil data pengguna', error)
        } finally {
            setIsLoadingUsers(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage({ type: '', text: '' })

        try {
            const method = editingUserId ? 'PATCH' : 'POST'
            const payload = editingUserId
                ? { id: editingUserId, email, role, password: password || undefined }
                : { email, password, role }

            const res = await fetch('/api/users', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error)

            setMessage({ type: 'success', text: editingUserId ? 'Data pengurus diperbarui!' : 'Akun pengurus berhasil dibuat!' })

            setEmail('')
            setPassword('')
            setRole('admin')
            setEditingUserId(null)

            fetchUsers()
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Terjadi kesalahan sistem.' })
        } finally {
            setLoading(false)
        }
    }

    const handleEditClick = (user: User) => {
        setEditingUserId(user.id)
        setEmail(user.email)
        setRole(user.role)
        setPassword('')
        setMessage({ type: 'success', text: 'Silakan ubah data pada form di atas.' })
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleDelete = async (id: string) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus akun ini permanen?')) return

        try {
            const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('Gagal menghapus pengguna')

            setMessage({ type: 'success', text: 'Akun berhasil dihapus.' })
            fetchUsers()
        } catch (error) {
            alert('Gagal menghapus akun.')
        }
    }

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch('/api/users/status', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, is_active: !currentStatus })
            })
            if (!res.ok) throw new Error('Gagal mengubah status')

            fetchUsers()
        } catch (error) {
            alert('Gagal mengubah status akun.')
        }
    }

    const cancelEdit = () => {
        setEditingUserId(null)
        setEmail('')
        setPassword('')
        setRole('admin')
        setMessage({ type: '', text: '' })
    }

    return (
        <div className="space-y-6">
            <div className="bg-[var(--card)] p-6 rounded-2xl shadow-sm border border-[var(--border)]">
                <div className="flex items-center gap-3 mb-6 border-b border-[var(--border)] pb-4">
                    <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
                        {editingUserId ? <Edit className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                    </div>
                    <div>
                        <h2 className="text-lg font-black font-display text-[var(--text-primary)]">
                            {editingUserId ? 'Edit Pengurus' : 'Tambah Pengurus Baru'}
                        </h2>
                        <p className="text-xs text-[var(--text-muted)]">
                            {editingUserId ? 'Ubah hak akses atau kata sandi pengurus' : 'Buat akun untuk pengurus IMM Kaizen'}
                        </p>
                    </div>
                </div>

                {message.text && (
                    <div className={`p-3 mb-5 rounded-xl text-xs font-bold ${message.type === 'success' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
                    <div>
                        <label className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-muted)] mb-2 uppercase tracking-wider">
                            <Mail className="w-3.5 h-3.5" /> Email Pengurus
                        </label>
                        <input
                            type="email"
                            required
                            disabled={!!editingUserId}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] text-sm focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] outline-none transition-all disabled:opacity-50"
                            placeholder="bidang@kaizen.id"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-muted)] mb-2 uppercase tracking-wider">
                            <Lock className="w-3.5 h-3.5" /> {editingUserId ? 'Kata Sandi Baru (Kosongkan jika tidak diubah)' : 'Kata Sandi (Minimal 6 Karakter)'}
                        </label>
                        <input
                            type="password"
                            required={!editingUserId}
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] text-sm focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-muted)] mb-2 uppercase tracking-wider">
                            <Shield className="w-3.5 h-3.5" /> Hak Akses (Role)
                        </label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] text-sm focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] outline-none transition-all cursor-pointer appearance-none"
                        >
                            <option value="admin">Admin Bidang (Akses Standar)</option>
                            <option value="superadmin">Super Admin (Akses Penuh)</option>
                        </select>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3.5 px-4 bg-[var(--primary)] text-white text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-[var(--primary-dark)] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-[var(--primary)]/20"
                        >
                            {loading ? 'Memproses...' : (editingUserId ? 'Simpan Perubahan' : 'Buat Akun Sekarang')}
                        </button>

                        {editingUserId && (
                            <button
                                type="button"
                                onClick={cancelEdit}
                                className="py-3.5 px-6 bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                            >
                                Batal
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="bg-[var(--card)] p-6 rounded-2xl shadow-sm border border-[var(--border)]">
                <div className="flex items-center justify-between mb-6 border-b border-[var(--border)] pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black font-display text-[var(--text-primary)]">Daftar Pengurus</h2>
                            <p className="text-xs text-[var(--text-muted)]">Kelola akun dan akses sistem</p>
                        </div>
                    </div>
                    <button
                        onClick={fetchUsers}
                        className="p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] transition-colors text-[var(--text-muted)]"
                        title="Segarkan Data"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoadingUsers ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[var(--surface)] text-[var(--text-muted)] uppercase text-[10px] font-bold tracking-wider">
                        <tr>
                            <th className="px-4 py-3 rounded-l-xl">Email</th>
                            <th className="px-4 py-3">Hak Akses</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right rounded-r-xl">Aksi</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                        {isLoadingUsers ? (
                            <tr>
                                <td colSpan={4} className="text-center py-8 text-[var(--text-muted)] text-xs font-medium">
                                    Memuat data...
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center py-8 text-[var(--text-muted)] text-xs font-medium">
                                    Belum ada data pengurus.
                                </td>
                            </tr>
                        ) : (
                            users.map((u) => (
                                <tr key={u.id} className="hover:bg-[var(--surface)]/50 transition-colors">
                                    <td className="px-4 py-4 font-medium text-[var(--text-primary)]">{u.email}</td>
                                    <td className="px-4 py-4">
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${u.role === 'superadmin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                                                {u.role}
                                            </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <button
                                            onClick={() => handleToggleStatus(u.id, u.is_active)}
                                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors ${u.is_active !== false ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'}`}
                                        >
                                            <Power className="w-3 h-3" />
                                            {u.is_active !== false ? 'Aktif' : 'Nonaktif'}
                                        </button>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEditClick(u)}
                                                className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                title="Edit Pengguna"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(u.id)}
                                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="Hapus Pengguna"
                                            >
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