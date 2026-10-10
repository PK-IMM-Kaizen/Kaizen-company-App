'use client'

import { useState } from 'react'
import { newsData, type NewsItem, type Role, type Page } from '../../../(public)/data'
import { Plus, Edit2, Trash2, ArrowLeft, AlertTriangle, Search, Calendar } from 'lucide-react'

interface AdminBeritaProps { role: Role; onNavigate: (page: Page) => void }

type ViewMode = 'list' | 'create' | 'edit'

export default function AdminBerita({ role, onNavigate }: AdminBeritaProps) {
    const [news, setNews] = useState<NewsItem[]>(newsData)
    const [view, setView] = useState<ViewMode>('list')
    const [editItem, setEditItem] = useState<NewsItem | null>(null)
    const [search, setSearch] = useState('')
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [form, setForm] = useState({ title: '', excerpt: '', content: '', category: 'Organisasi', date: '', status: 'draft' as 'draft' | 'published' })

    const filtered = news.filter(n => n.title.toLowerCase().includes(search.toLowerCase()))
    const canPublish = role === 'superadmin' || role === 'bpi'

    const startCreate = () => {
        setForm({ title: '', excerpt: '', content: '', category: 'Organisasi', date: '', status: 'draft' })
        setEditItem(null)
        setView('create')
    }

    const startEdit = (item: NewsItem) => {
        setEditItem(item)
        setForm({ title: item.title, excerpt: item.excerpt, content: item.content, category: item.category, date: item.date, status: item.status })
        setView('edit')
    }

    const handleSave = () => {
        if (view === 'create') {
            const newItem: NewsItem = {
                id: Date.now(),
                ...form,
                publishDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
                cover: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop&auto=format',
                gallery: [],
            }
            setNews(prev => [newItem, ...prev])
        } else if (editItem) {
            setNews(prev => prev.map(n => n.id === editItem.id ? { ...n, ...form } : n))
        }
        setView('list')
    }

    const handleDelete = (id: number) => {
        setNews(prev => prev.filter(n => n.id !== id))
        setDeleteId(null)
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
                        {view === 'create' ? 'Buat Berita Baru' : 'Edit Berita'}
                    </h2>
                </div>

                <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)] shadow-sm">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">Judul Berita</label>
                                <input
                                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm"
                                    value={form.title}
                                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                    placeholder="Masukkan judul berita..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">Ringkasan</label>
                                <textarea
                                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm"
                                    rows={2}
                                    value={form.excerpt}
                                    onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                                    placeholder="Ringkasan singkat berita..."
                                    style={{ resize: 'vertical' }}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">Isi Berita</label>
                                <textarea
                                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm"
                                    rows={10}
                                    value={form.content}
                                    onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                                    placeholder="Tulis isi berita di sini..."
                                    style={{ resize: 'vertical' }}
                                />
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">Kategori</label>
                                <select
                                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm"
                                    value={form.category}
                                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                >
                                    {['Organisasi', 'Ekowir', 'Medkom', 'Sosial'].map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4 text-[var(--text-muted)]" /> Tanggal Kegiatan
                                </label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm"
                                    value={form.date}
                                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">Status Terbit</label>
                                <select
                                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    value={form.status}
                                    onChange={e => setForm(f => ({ ...f, status: e.target.value as 'draft' | 'published' }))}
                                    disabled={!canPublish}
                                >
                                    <option value="draft">Draft</option>
                                    {canPublish && <option value="published">Terbit (Published)</option>}
                                </select>
                                {!canPublish && (
                                    <p className="text-[11px] mt-2 text-[var(--text-muted)] leading-relaxed bg-[var(--surface)] p-2 rounded border border-[var(--border)]">
                                        Hanya BPI/Super Admin yang memiliki hak akses menerbitkan berita secara langsung.
                                    </p>
                                )}
                            </div>

                            <div className="pt-4 space-y-3">
                                <button onClick={handleSave} className="w-full py-2.5 px-4 bg-[var(--primary)] text-white text-xs font-bold tracking-widest uppercase rounded-lg shadow-sm hover:bg-[var(--primary-dark)] transition-all">
                                    {view === 'create' ? 'Simpan Berita' : 'Perbarui Berita'}
                                </button>
                                <button onClick={() => setView('list')} className="w-full py-2.5 px-4 bg-transparent border border-[var(--border)] text-[var(--text-primary)] text-xs font-bold tracking-widest uppercase rounded-lg hover:bg-[var(--surface-2)] transition-all">
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
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-lg font-black text-[var(--text-primary)] font-display">
                    Kelola Berita
                </h2>
                <button onClick={startCreate} className="py-2.5 px-4 bg-[var(--primary)] text-white text-xs font-bold tracking-widest uppercase rounded-lg shadow-sm hover:bg-[var(--primary-dark)] transition-all flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Buat Berita
                </button>
            </div>

            {deleteId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="bg-[var(--card)] rounded-xl p-6 max-w-sm w-full border border-[var(--border)] shadow-xl">
                        <div className="flex items-center gap-2 text-red-600 mb-3">
                            <AlertTriangle className="w-5 h-5" />
                            <h3 className="font-black text-sm font-display text-[var(--text-primary)]">
                                Hapus Berita?
                            </h3>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                            Berita ini akan dihapus secara permanen dan tidak dapat dipulihkan.
                        </p>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 bg-red-600 text-white text-xs font-bold tracking-widest uppercase rounded-lg hover:bg-red-700 transition-all text-center">
                                Hapus
                            </button>
                            <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 bg-transparent border border-[var(--border)] text-[var(--text-primary)] text-xs font-bold tracking-widest uppercase rounded-lg hover:bg-[var(--surface-2)] transition-all text-center">
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-[var(--border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[var(--surface)]">
                    <div className="relative w-full sm:w-72">
                        <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Cari judul berita..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm"
                        />
                    </div>
                    <span className="text-xs text-[var(--text-muted)] font-display font-bold uppercase tracking-wider">
                        {filtered.length} Berita
                    </span>
                </div>

                <div className="overflow-x-auto">
                    {filtered.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-sm text-[var(--text-muted)] font-medium">
                                Tidak ada berita yang ditemukan.
                            </p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="bg-[var(--surface-2)] border-b border-[var(--border)] text-xs text-[var(--text-muted)] uppercase tracking-wider font-display">
                                <th className="p-4 font-bold min-w-[250px]">Judul</th>
                                <th className="p-4 font-bold">Kategori</th>
                                <th className="p-4 font-bold">Tanggal</th>
                                <th className="p-4 font-bold">Status</th>
                                <th className="p-4 font-bold">Aksi</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filtered.map(n => (
                                <tr key={n.id} className="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors">
                                    <td className="p-4">
                                        <p className="font-bold text-sm line-clamp-1 text-[var(--text-primary)] font-display">
                                            {n.title}
                                        </p>
                                        <p className="text-xs mt-1 line-clamp-1 text-[var(--text-muted)] max-w-[300px]">
                                            {n.excerpt}
                                        </p>
                                    </td>
                                    <td className="p-4">
                                            <span className="text-xs font-bold text-[var(--primary)] font-display uppercase tracking-wider">
                                                {n.category}
                                            </span>
                                    </td>
                                    <td className="p-4 text-xs text-[var(--text-muted)] whitespace-nowrap font-medium">
                                        {n.publishDate}
                                    </td>
                                    <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                                                n.status === 'published'
                                                    ? 'bg-green-50 text-green-700 border-green-200'
                                                    : 'bg-orange-50 text-orange-700 border-orange-200'
                                            }`}>
                                                {n.status === 'published' ? 'Terbit' : 'Draft'}
                                            </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => startEdit(n)}
                                                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 transition-colors"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" /> Edit
                                            </button>
                                            <button
                                                onClick={() => setDeleteId(n.id)}
                                                className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1.5 transition-colors"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" /> Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    )
}