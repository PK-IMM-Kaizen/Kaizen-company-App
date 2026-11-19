'use client'

import { useState, useEffect } from 'react'
import { UserPlus, Shield, Mail, Lock, Trash2, Edit, Power, RefreshCw, Users, X } from 'lucide-react'
import Swal from 'sweetalert2'

interface User {
    id: string
    email: string
    role: string
    is_active: boolean
}

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer
        toast.onmouseleave = Swal.resumeTimer
    }
})

export default function UsersManagementPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('admin')
    const [loading, setLoading] = useState(false)
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
            Toast.fire({ icon: 'error', title: 'Gagal memuat data pengurus' })
        } finally {
            setIsLoadingUsers(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

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

            Toast.fire({
                icon: 'success',
                title: editingUserId ? 'Data pengurus diperbarui!' : 'Akun pengurus berhasil dibuat!'
            })

            setEmail('')
            setPassword('')
            setRole('admin')
            setEditingUserId(null)

            fetchUsers()
        } catch (err: any) {
            Toast.fire({
                icon: 'error',
                title: err.message || 'Terjadi kesalahan sistem.'
            })
        } finally {
            setLoading(false)
        }
    }

    const handleEditClick = (user: User) => {
        setEditingUserId(user.id)
        setEmail(user.email)
        setRole(user.role)
        setPassword('')

        Toast.fire({
            icon: 'info',
            title: 'Silakan ubah data pada form'
        })
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: 'Hapus akun permanen?',
            text: "Data pengurus yang dihapus tidak dapat dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#c8102e',
            cancelButtonColor: '#4b5563',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal',
            customClass: {
                popup: 'rounded-2xl border-2 border-gray-200',
                confirmButton: 'font-bold tracking-wider uppercase',
                cancelButton: 'font-bold tracking-wider uppercase'
            }
        })

        if (!result.isConfirmed) return

        try {
            const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('Gagal menghapus pengguna')

            Toast.fire({ icon: 'success', title: 'Akun berhasil dihapus.' })
            fetchUsers()
        } catch (error) {
            Toast.fire({ icon: 'error', title: 'Gagal menghapus akun.' })
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

            Toast.fire({
                icon: 'success',
                title: `Akun berhasil di${!currentStatus ? 'aktifkan' : 'nonaktifkan'}!`
            })
            fetchUsers()
        } catch (error) {
            Toast.fire({ icon: 'error', title: 'Gagal mengubah status akun.' })
        }
    }

    const cancelEdit = () => {
        setEditingUserId(null)
        setEmail('')
        setPassword('')
        setRole('admin')
    }

    return (
        <div className="space-y-6 sm:space-y-8 font-sans animate-in fade-in duration-300">
            <div className="bg-[var(--card)] p-5 sm:p-8 rounded-2xl border-2 border-[var(--border-strong)] shadow-[4px_4px_0_var(--surface-2)] relative overflow-hidden">
                <div className="h-1 w-full bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--accent-light)] absolute top-0 left-0" />

                <div className="flex items-center gap-4 mb-6 sm:mb-8 border-b-2 border-[var(--border-strong)] pb-5">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[var(--surface)] flex items-center justify-center text-[var(--primary)] shrink-0 border-2 border-[var(--border-strong)] shadow-[2px_2px_0_var(--border-strong)]">
                        {editingUserId ? <Edit className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
                    </div>
                    <div>
                        <h2 className="text-lg sm:text-xl font-black font-display text-[var(--text-primary)] uppercase tracking-tight">
                            {editingUserId ? 'Edit Pengurus' : 'Tambah Pengurus Baru'}
                        </h2>
                        <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium mt-1">
                            {editingUserId ? 'Ubah hak akses atau kata sandi pengurus' : 'Buat akun untuk pengurus portal web'}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="flex items-center gap-1.5 text-[10px] font-black text-[var(--text-primary)] mb-2 uppercase tracking-widest font-display">
                                    <Mail className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" /> Email Pengurus
                                </label>
                                <input
                                    type="email"
                                    required
                                    disabled={!!editingUserId}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--background)] text-[var(--text-primary)] text-xs sm:text-sm focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all font-medium placeholder-[var(--text-muted)] disabled:opacity-50 disabled:bg-[var(--surface-2)]"
                                    placeholder="bidang@kaizen.id"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-1.5 text-[10px] font-black text-[var(--text-primary)] mb-2 uppercase tracking-widest font-display">
                                    <Lock className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" /> {editingUserId ? 'Kata Sandi Baru (Opsional)' : 'Kata Sandi'}
                                </label>
                                <input
                                    type="password"
                                    required={!editingUserId}
                                    minLength={6}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--background)] text-[var(--text-primary)] text-xs sm:text-sm focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all font-medium placeholder-[var(--text-muted)]"
                                    placeholder="•••••••• (Min. 6 Karakter)"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="flex items-center gap-1.5 text-[10px] font-black text-[var(--text-primary)] mb-2 uppercase tracking-widest font-display">
                                    <Shield className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" /> Hak Akses (Role)
                                </label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--background)] text-[var(--text-primary)] text-xs sm:text-sm focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all cursor-pointer font-bold font-display"
                                >
                                    <option value="admin">Admin Bidang (Akses Terbatas)</option>
                                    <option value="superadmin">Super Admin (Akses Penuh)</option>
                                </select>
                            </div>

                            <div className="pt-2 h-full flex items-end">
                                <div className="flex flex-col sm:flex-row gap-3 w-full">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 py-3.5 px-4 bg-[var(--primary)] text-white text-[11px] font-black tracking-widest uppercase rounded-xl border-2 border-transparent hover:border-[var(--mk-ink)] shadow-[3px_3px_0_rgba(200,16,46,0.2)] hover:shadow-[3px_3px_0_var(--mk-ink)] transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none cursor-pointer font-display flex justify-center items-center gap-2 hover:-translate-y-0.5"
                                    >
                                        {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                                        {loading ? 'Memproses...' : (editingUserId ? 'Simpan Perubahan' : 'Buat Akun')}
                                    </button>

                                    {editingUserId && (
                                        <button
                                            type="button"
                                            onClick={cancelEdit}
                                            className="py-3.5 px-5 bg-[var(--surface)] border-2 border-[var(--border-strong)] text-[var(--text-primary)] text-[11px] font-black tracking-widest uppercase rounded-xl hover:text-[var(--primary)] hover:border-[var(--primary)] hover:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all cursor-pointer font-display flex items-center justify-center gap-2 hover:-translate-y-0.5"
                                        >
                                            <X className="w-4 h-4" /> Batal
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div className="bg-[var(--card)] rounded-2xl border-2 border-[var(--border-strong)] shadow-[4px_4px_0_var(--surface-2)] overflow-hidden">
                <div className="p-5 sm:p-6 flex items-center justify-between border-b-2 border-[var(--border-strong)] bg-[var(--surface)]">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[var(--background)] border-2 border-[var(--border-strong)] flex items-center justify-center text-[var(--text-primary)] shrink-0 shadow-[2px_2px_0_var(--border-strong)]">
                            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <div>
                            <h2 className="text-base sm:text-lg font-black font-display text-[var(--text-primary)] uppercase">Daftar Pengurus</h2>
                            <p className="text-xs text-[var(--text-secondary)] font-medium mt-0.5">Kelola akun dan status akses sistem</p>
                        </div>
                    </div>
                    <button
                        onClick={fetchUsers}
                        className="p-3 bg-[var(--background)] border-2 border-[var(--border-strong)] hover:text-[var(--primary)] hover:border-[var(--primary)] hover:shadow-[2px_2px_0_rgba(200,16,46,0.15)] rounded-xl transition-all cursor-pointer font-display flex items-center justify-center gap-2 hover:-translate-y-0.5"
                        title="Refresh Data"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoadingUsers ? 'animate-spin' : ''}`} />
                        <span className="hidden sm:inline text-[10px] font-black tracking-widest uppercase">Refresh</span>
                    </button>
                </div>

                <div className="overflow-x-auto w-full scrollbar-none bg-[var(--background)]">
                    <table className="w-full text-left border-collapse min-w-[650px]">
                        <thead>
                        <tr className="bg-[var(--surface)] border-b-2 border-[var(--border-strong)] text-[10px] sm:text-[11px] text-[var(--text-primary)] uppercase tracking-widest font-display">
                            <th className="p-4 sm:p-5 font-black pl-5 sm:pl-6">Email Akun</th>
                            <th className="p-4 sm:p-5 font-black">Role Akses</th>
                            <th className="p-4 sm:p-5 font-black">Status</th>
                            <th className="p-4 sm:p-5 font-black text-right pr-5 sm:pr-6">Aksi</th>
                        </tr>
                        </thead>
                        <tbody>
                        {isLoadingUsers ? (
                            <tr>
                                <td colSpan={4} className="text-center py-16 text-[var(--text-muted)] font-display text-sm font-black uppercase tracking-widest">
                                    <div className="flex items-center justify-center gap-3">
                                        <RefreshCw className="w-5 h-5 animate-spin text-[var(--primary)]" />
                                        Memuat data pengurus...
                                    </div>
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center py-16 text-[var(--text-muted)] text-sm font-black uppercase tracking-widest">
                                    Belum ada data pengurus terdaftar.
                                </td>
                            </tr>
                        ) : (
                            users.map((u) => (
                                <tr key={u.id} className="border-b-2 border-[var(--border-strong)] last:border-b-0 hover:bg-[var(--surface-2)] transition-colors group">
                                    <td className="p-4 sm:p-5 pl-5 sm:pl-6">
                                        <div className="font-black text-xs sm:text-sm text-[var(--text-primary)] font-display tracking-wide">
                                            {u.email}
                                        </div>
                                    </td>
                                    <td className="p-4 sm:p-5">
                                        <span className={`px-3 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest whitespace-nowrap font-display border-2 ${
                                            u.role === 'superadmin'
                                                ? 'bg-purple-100 text-purple-800 border-purple-300 shadow-[2px_2px_0_#d8b4fe] dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800'
                                                : 'bg-blue-100 text-blue-800 border-blue-300 shadow-[2px_2px_0_#93c5fd] dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800'
                                        }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="p-4 sm:p-5 whitespace-nowrap">
                                        <button
                                            onClick={() => handleToggleStatus(u.id, u.is_active)}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer font-display border-2 hover:-translate-y-0.5 ${
                                                u.is_active !== false
                                                    ? 'bg-[#dcfce7] text-[#166534] border-[#86efac] shadow-[2px_2px_0_#86efac] hover:bg-[#bbf7d0]'
                                                    : 'bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border-strong)] shadow-[2px_2px_0_var(--border-strong)] hover:text-red-600 hover:border-red-400 hover:bg-red-50'
                                            }`}
                                        >
                                            <Power className="w-3.5 h-3.5 shrink-0 stroke-[3px]" />
                                            {u.is_active !== false ? 'Aktif' : 'Nonaktif'}
                                        </button>
                                    </td>
                                    <td className="p-4 sm:p-5 pr-5 sm:pr-6 text-right">
                                        <div className="flex items-center justify-end gap-2 sm:gap-3">
                                            <button
                                                onClick={() => handleEditClick(u)}
                                                className="p-2 sm:p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white border-2 border-blue-200 hover:border-blue-700 rounded-xl transition-all cursor-pointer shadow-[2px_2px_0_#bfdbfe] hover:shadow-[2px_2px_0_#1d4ed8] hover:-translate-y-0.5"
                                                title="Edit Pengguna"
                                            >
                                                <Edit className="w-4 h-4 stroke-[2.5px]" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(u.id)}
                                                className="p-2 sm:p-2.5 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white border-2 border-red-200 hover:border-red-700 rounded-xl transition-all cursor-pointer shadow-[2px_2px_0_#fecaca] hover:shadow-[2px_2px_0_#b91c1c] hover:-translate-y-0.5"
                                                title="Hapus Pengguna"
                                            >
                                                <Trash2 className="w-4 h-4 stroke-[2.5px]" />
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