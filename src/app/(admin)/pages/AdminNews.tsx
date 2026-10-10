'use client'

import { useState } from 'react'
import { newsData, type NewsItem, type Role, type Page } from '../../(public)/data'
import { Plus, Edit2, Trash2, ArrowLeft, AlertTriangle, Search, Calendar } from 'lucide-react'

interface AdminNewsProps { role: Role; onNavigate: (page: Page) => void }

type ViewMode = 'list' | 'create' | 'edit'

export default function AdminNews({ role, onNavigate }: AdminNewsProps) {
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

                <div className="bg-[var(--card)] rounded-[var(--radius)] p-6 border border-[var(--border)] shadow-sm">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-4">
                            <div>
                                <label className="form-label">Judul Berita</label>
                                <input
                                    className="form-input"
                                    value={form.title}
                                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                    placeholder="Masukkan judul berita..."
                                />
                            </div>
                            <div>
                                <label className="form-label">Ringkasan</label>
                                <textarea
                                    className="form-input"
                                    rows={2}
                                    value={form.excerpt}
                                    onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                                    placeholder="Ringkasan singkat berita..."
                                    style={{ resize: 'vertical' }}
                                />
                            </div>
                            <div>
                                <label className="form-label">Isi Berita</label>
                                <textarea
                                    className="form-input"
                                    rows={10}
                                    value={form.content}
                                    onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                                    placeholder="Tulis isi berita di sini..."
                                    style={{ resize: 'vertical' }}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="form-label">Kategori</label>
                                <select
                                    className="form-input"
                                    value={form.category}
                                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                >
                                    {['Organisasi', 'Ekowir', 'Medkom', 'Sosial'].map(c => <option key={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="form-label flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" /> Tanggal Kegiatan
                                </label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={form.date}
                                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="form-label">Status Terbit</label>
                                <select
                                    className="form-input"
                                    value={form.status}
                                    onChange={e => setForm(f => ({ ...f, status: e.target.value as 'draft' | 'published' }))}
                                    disabled={!canPublish}
                                >
                                    <option value="draft">Draft</option>
                                    {canPublish && <option value="published">Terbit (Published)</option>}
                                </select>
                                {!canPublish && (
                                    <p className="text-[11px] mt-1.5 text-[var(--text-muted)] leading-normal">
                                        Hanya BPI/Super Admin yang memiliki hak akses menerbitkan berita secara langsung.
                                    </p>
                                )}
                            </div>
                            <div className="pt-2 space-y-2">
                                <button onClick={handleSave} className="btn-primary w-full justify-center">
                                    {view === 'create' ? 'Simpan Berita' : 'Perbarui Berita'}
                                </button>
                                <button onClick={() => setView('list')} className="btn-outline w-full justify-center">
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
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-black text-[var(--text-primary)] font-display">
                    Kelola Berita
                </h2>
                <button onClick={startCreate} className="btn-primary text-xs flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Buat Berita
                </button>
            </div>

            {deleteId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-[var(--card)] rounded-[var(--radius)] p-6 max-w-sm w-full mx-4 border border-[var(--border)] shadow-xl">
                        <div className="flex items-center gap-2 text-[var(--error)] mb-2">
                            <AlertTriangle className="w-5 h-5" />
                            <h3 className="font-black text-sm font-display text-[var(--text-primary)]">
                                Hapus Berita?
                            </h3>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                            Berita ini akan dihapus secara permanen dan tidak dapat dipulihkan.
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
                <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between gap-4 bg-[var(--surface)]">
                    <div className="relative">
                        <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Cari berita..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="form-input text-xs pl-8 py-1.5"
                            style={{ width: '240px' }}
                        />
                    </div>
                    <span className="text-xs text-[var(--text-muted)] font-display font-medium">
                        {filtered.length} berita
                    </span>
                </div>

                {filtered.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-xs text-[var(--text-muted)] font-medium">
                            Tidak ada berita yang ditemukan.
                        </p>
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                        <tr>
                            <th>Judul</th>
                            <th>Kategori</th>
                            <th>Tanggal</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.map(n => (
                            <tr key={n.id}>
                                <td>
                                    <p className="font-semibold text-xs line-clamp-1 text-[var(--text-primary)] font-display max-w-[280px]">
                                        {n.title}
                                    </p>
                                    <p className="text-xs mt-0.5 line-clamp-1 text-[var(--text-muted)]">
                                        {n.excerpt}
                                    </p>
                                </td>
                                <td>
                                        <span className="text-xs font-semibold text-[var(--primary)] font-display">
                                            {n.category}
                                        </span>
                                </td>
                                <td className="text-xs text-[var(--text-muted)] whitespace-nowrap">
                                    {n.publishDate}
                                </td>
                                <td>
                                        <span className={n.status === 'published' ? 'badge-published' : 'badge-draft'}>
                                            {n.status === 'published' ? 'Terbit' : 'Draft'}
                                        </span>
                                </td>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => startEdit(n)}
                                            className="text-xs font-semibold text-[var(--info)] hover:underline flex items-center gap-1 font-display"
                                        >
                                            <Edit2 className="w-3 h-3" /> Edit
                                        </button>
                                        <button
                                            onClick={() => setDeleteId(n.id)}
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
                )}
            </div>
        </div>
    )
}