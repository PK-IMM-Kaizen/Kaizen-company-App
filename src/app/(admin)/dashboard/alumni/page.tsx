'use client'

import { useState } from 'react'
import { alumniData, type Alumni } from '../../../lib/data'
import { Plus, Edit2, Trash2, ArrowLeft, AlertTriangle, GraduationCap } from 'lucide-react'

type ViewMode = 'list' | 'create' | 'edit'

export default function AdminAlumniPage() {
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

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()

        if (view === 'create') {
            setItems(prev => [...prev, {
                id: Date.now(),
                ...form,
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
                        {view === 'create' ? 'Tambah Alumni' : 'Edit Alumni'}
                    </h2>
                </div>

                <div className="bg-[var(--card)] rounded-2xl p-6 md:p-8 border border-[var(--border)] max-w-2xl shadow-sm">
                    <form onSubmit={handleSave} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 font-display uppercase tracking-wide">Nama Lengkap</label>
                            <input
                                required
                                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-all text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                                value={form.name}
                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                placeholder="Masukkan nama alumni"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 font-display uppercase tracking-wide">Angkatan</label>
                                <input
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-all text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                                    value={form.batch}
                                    onChange={e => setForm(f => ({ ...f, batch: e.target.value }))}
                                    placeholder="Contoh: 2018"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 font-display uppercase tracking-wide">Peran / Profesi</label>
                                <input
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-all text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                                    value={form.role}
                                    onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                                    placeholder="Contoh: Software Engineer"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 font-display uppercase tracking-wide">Prestasi / Kontribusi</label>
                            <input
                                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-all text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                                value={form.achievement}
                                onChange={e => setForm(f => ({ ...f, achievement: e.target.value }))}
                                placeholder="Contoh: Founder Tech Startup / Ketua BEM FT 2020"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 font-display uppercase tracking-wide">Biografi Singkat</label>
                            <textarea
                                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-all text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                                rows={4}
                                value={form.bio}
                                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                                style={{ resize: 'vertical' }}
                                placeholder="Tuliskan cerita singkat atau rekam jejak alumni..."
                            />
                        </div>

                        <div className="flex flex-col-reverse md:flex-row gap-3 pt-4 border-t border-[var(--border)]">
                            <button type="button" onClick={() => setView('list')} className="w-full md:w-auto py-3 px-6 bg-transparent border border-[var(--border)] text-[var(--text-primary)] text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-[var(--surface-2)] transition-all">
                                Batal
                            </button>
                            <button type="submit" className="w-full md:w-auto py-3 px-6 bg-[var(--primary)] text-white text-xs font-bold tracking-widest uppercase rounded-xl shadow-md shadow-[var(--primary)]/20 hover:bg-[var(--primary-dark)] hover:-translate-y-0.5 transition-all">
                                {view === 'create' ? 'Simpan Alumni' : 'Perbarui Data'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[var(--card)] p-4 md:p-6 rounded-2xl border border-[var(--border)] shadow-sm">
                <div>
                    <h2 className="text-xl font-black text-[var(--text-primary)] font-display flex items-center gap-2">
                        Kelola Alumni <span className="bg-[#6B46C1]/10 text-[#6B46C1] text-xs px-2 py-1 rounded-md">{items.length} Total</span>
                    </h2>
                    <p className="text-sm text-[var(--text-muted)] mt-1">Daftar anggota dan rekam jejak alumni IMM Kaizen.</p>
                </div>
                <button onClick={startCreate} className="w-full sm:w-auto py-2.5 px-5 bg-[var(--primary)] text-white text-xs font-bold tracking-widest uppercase rounded-xl shadow-md shadow-[var(--primary)]/20 hover:bg-[var(--primary-dark)] transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5">
                    <Plus className="w-4 h-4" /> Tambah Alumni
                </button>
            </div>

            {deleteId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="bg-[var(--card)] rounded-2xl p-6 md:p-8 max-w-sm w-full border border-[var(--border)] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-12 h-12 rounded-full bg-red-100/10 border border-red-500/20 flex items-center justify-center mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-500" />
                        </div>
                        <h3 className="font-black text-lg font-display text-[var(--text-primary)] mb-2">
                            Hapus Data Alumni?
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-8">
                            Tindakan ini tidak dapat dibatalkan. Data alumni yang terpilih akan dihapus secara permanen dari sistem.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteId(null)} className="flex-1 py-3 bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-primary)] text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-[var(--surface)] transition-all text-center">
                                Batal
                            </button>
                            <button onClick={() => handleDelete(deleteId)} className="flex-1 py-3 bg-red-600 text-white text-xs font-bold tracking-widest uppercase rounded-xl shadow-md shadow-red-600/20 hover:bg-red-700 transition-all text-center hover:-translate-y-0.5">
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="admin-table w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-[var(--surface-2)] border-b border-[var(--border)] text-xs text-[var(--text-muted)] uppercase tracking-wider font-display">
                            <th className="p-4 font-bold pl-6">Profil Alumni</th>
                            <th className="p-4 font-bold">Angkatan</th>
                            <th className="p-4 font-bold">Peran/Profesi</th>
                            <th className="p-4 font-bold hidden md:table-cell">Prestasi/Kontribusi</th>
                            <th className="p-4 font-bold text-right pr-6">Aksi</th>
                        </tr>
                        </thead>
                        <tbody>
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-16">
                                    <div className="flex flex-col items-center justify-center text-center">
                                        <div className="w-16 h-16 bg-[var(--surface-2)] rounded-full flex items-center justify-center mb-4 text-[var(--text-muted)]">
                                            <GraduationCap className="w-8 h-8" />
                                        </div>
                                        <h3 className="font-bold text-[var(--text-primary)] mb-1">Belum Ada Data Alumni</h3>
                                        <p className="text-sm text-[var(--text-muted)] max-w-sm">Klik tombol "Tambah Alumni" di atas untuk mulai memasukkan rekam jejak alumni.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            items.map(a => (
                                <tr key={a.id} className="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors group">
                                    <td className="p-4 pl-6">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={a.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&auto=format'}
                                                alt={a.name}
                                                className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-[var(--border)] shadow-sm"
                                            />
                                            <span className="font-bold text-sm text-[var(--text-primary)] font-display group-hover:text-[var(--primary)] transition-colors">
                                                    {a.name}
                                                </span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                            <span className="text-xs font-black text-white bg-[#6B46C1] px-2.5 py-1 rounded-md font-display tracking-widest shadow-sm">
                                                {a.batch}
                                            </span>
                                    </td>
                                    <td className="p-4 text-sm text-[var(--text-secondary)] font-medium">
                                        {a.role}
                                    </td>
                                    <td className="p-4 text-sm text-[var(--text-secondary)] hidden md:table-cell">
                                            <span className="line-clamp-2 max-w-[250px] text-xs">
                                                {a.achievement || '-'}
                                            </span>
                                    </td>
                                    <td className="p-4 pr-6 text-right">
                                        <div className="flex gap-2 justify-end items-center">
                                            <button
                                                onClick={() => startEdit(a)}
                                                className="p-2 text-[var(--text-muted)] hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                                                title="Edit Data"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setDeleteId(a.id)}
                                                className="p-2 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                title="Hapus Data"
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