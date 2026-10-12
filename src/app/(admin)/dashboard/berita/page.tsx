'use client'

import { useState } from 'react'
import { newsData, type NewsItem, type Role } from '../../../lib/data'
import { Plus, Edit2, Trash2, ArrowLeft, AlertTriangle, Search, Calendar, Link as LinkIcon, Image as ImageIcon } from 'lucide-react'

type AppNewsItem = NewsItem & { pwmuUrl?: string }

export default function AdminBeritaPage() {
    const role: Role = 'superadmin'

    const [news, setNews] = useState<AppNewsItem[]>(newsData as AppNewsItem[])
    const [view, setView] = useState<'list' | 'create' | 'edit'>('list')
    const [editItem, setEditItem] = useState<AppNewsItem | null>(null)
    const [search, setSearch] = useState('')
    const [deleteId, setDeleteId] = useState<number | null>(null)

    const [form, setForm] = useState({
        title: '',
        excerpt: '',
        content: '',
        category: 'Bidang HPKP',
        date: '',
        publishDate: '',
        cover: '',
        galleryUrls: '',
        status: 'draft' as 'draft' | 'published',
        pwmuUrl: ''
    })

    const filtered = news.filter(n => n.title.toLowerCase().includes(search.toLowerCase()))
    const canPublish = (role as string) === 'superadmin' || (role as string) === 'bpi'

    const startCreate = () => {
        setForm({
            title: '', excerpt: '', content: '', category: 'Bidang HPKP',
            date: '', publishDate: '', cover: '', galleryUrls: '',
            status: 'draft', pwmuUrl: ''
        })
        setEditItem(null)
        setView('create')
    }

    const startEdit = (item: AppNewsItem) => {
        setEditItem(item)
        setForm({
            title: item.title,
            excerpt: item.excerpt,
            content: item.content,
            category: item.category,
            date: item.date ?? '',
            publishDate: item.publishDate ?? '',
            cover: item.cover ?? '',
            galleryUrls: item.gallery ? item.gallery.join('\n') : '',
            status: item.status,
            pwmuUrl: item.pwmuUrl || ''
        })
        setView('edit')
    }

    const handleSave = () => {
        const galleryArray = form.galleryUrls
            .split('\n')
            .map(url => url.trim())
            .filter(url => url !== '')

        if (view === 'create') {
            const newItem: AppNewsItem = {
                id: Date.now(),
                title: form.title,
                excerpt: form.excerpt,
                content: form.content,
                category: form.category,
                date: form.date,
                publishDate: form.publishDate,
                cover: form.cover,
                gallery: galleryArray,
                status: form.status,
                pwmuUrl: form.pwmuUrl
            }
            setNews(prev => [newItem, ...prev])
        } else if (editItem) {
            setNews(prev => prev.map(n => n.id === editItem.id ? {
                ...n,
                title: form.title,
                excerpt: form.excerpt,
                content: form.content,
                category: form.category,
                date: form.date,
                publishDate: form.publishDate,
                cover: form.cover,
                gallery: galleryArray,
                status: form.status,
                pwmuUrl: form.pwmuUrl
            } : n))
        }
        setView('list')
    }

    const handleDelete = (id: number) => {
        setNews(prev => prev.filter(n => n.id !== id))
        setDeleteId(null)
    }

    if (view === 'create' || view === 'edit') {
        return (
            <div className="p-4 md:p-6 animate-in fade-in duration-300">
                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={() => setView('list')}
                        className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--primary)] flex items-center gap-1.5 font-display transition-colors bg-[var(--surface)] px-3 py-1.5 rounded-lg border border-[var(--border)]"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Kembali
                    </button>
                    <span className="text-[var(--border-strong)]">/</span>
                    <h2 className="text-sm font-black text-[var(--text-primary)] font-display uppercase tracking-wider">
                        {view === 'create' ? 'Input Berita Baru' : 'Edit Berita'}
                    </h2>
                </div>

                <div className="bg-[var(--card)] rounded-2xl p-6 md:p-8 border border-[var(--border)] shadow-sm">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-5">
                            <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-xl space-y-4 mb-6">
                                <h3 className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 font-display flex items-center gap-2">
                                    <LinkIcon className="w-4 h-4" /> Sumber PWMU.CO
                                </h3>
                                <div>
                                    <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">URL Berita Asli</label>
                                    <input
                                        className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-white dark:bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                                        value={form.pwmuUrl}
                                        onChange={e => setForm(f => ({ ...f, pwmuUrl: e.target.value }))}
                                        placeholder="https://pwmu.co/..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">URL Gambar Cover</label>
                                    <input
                                        className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-white dark:bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                                        value={form.cover}
                                        onChange={e => setForm(f => ({ ...f, cover: e.target.value }))}
                                        placeholder="https://pwmu.co/wp-content/uploads/..."
                                    />
                                    {form.cover && (
                                        <div className="mt-3 relative w-32 aspect-[16/9] rounded-md overflow-hidden border border-[var(--border)]">
                                            <img src={form.cover} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">Judul Berita</label>
                                <input
                                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm font-semibold"
                                    value={form.title}
                                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                    placeholder="Masukkan judul berita..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">Ringkasan (Excerpt)</label>
                                <textarea
                                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm"
                                    rows={3}
                                    value={form.excerpt}
                                    onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                                    placeholder="Ringkasan singkat atau paragraf pertama berita..."
                                    style={{ resize: 'vertical' }}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">Isi Berita</label>
                                <textarea
                                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm leading-relaxed"
                                    rows={12}
                                    value={form.content}
                                    onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                                    placeholder="Tuliskan isi berita di sini..."
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
                                    {['Bidang HPKP', 'Bidang Kader', 'Organisasi', 'Medkom'].map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3 lg:grid-cols-1 lg:gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5" /> Tanggal Kegiatan
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm"
                                        value={form.date}
                                        onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                                        placeholder="Misal: 30 September 2026"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5 text-[var(--primary)]" /> Tanggal Rilis PWMU
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm"
                                        value={form.publishDate}
                                        onChange={e => setForm(f => ({ ...f, publishDate: e.target.value }))}
                                        placeholder="Misal: 01 Oktober 2026"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide flex items-center gap-1.5">
                                    <ImageIcon className="w-3.5 h-3.5" /> URL Galeri Tambahan
                                </label>
                                <textarea
                                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-xs font-mono"
                                    rows={4}
                                    value={form.galleryUrls}
                                    onChange={e => setForm(f => ({ ...f, galleryUrls: e.target.value }))}
                                    placeholder="https://...&#10;https://..."
                                    style={{ resize: 'vertical' }}
                                />
                                <p className="text-[10px] text-[var(--text-muted)] mt-1.5">Masukkan 1 URL gambar per baris (tekan Enter untuk URL baru).</p>
                            </div>

                            <div className="pt-2">
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">Status Terbit</label>
                                <select
                                    className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                    value={form.status}
                                    onChange={e => setForm(f => ({ ...f, status: e.target.value as 'draft' | 'published' }))}
                                    disabled={!canPublish}
                                >
                                    <option value="draft">Draft (Simpan Sementara)</option>
                                    {canPublish && <option value="published">Terbit (Publish ke Web)</option>}
                                </select>
                            </div>

                            <div className="pt-6 space-y-3 border-t border-[var(--border)]">
                                <button onClick={handleSave} className="w-full py-3 px-4 bg-[var(--primary)] text-white text-xs font-bold tracking-widest uppercase rounded-xl shadow-md shadow-[var(--primary)]/20 hover:bg-[var(--primary-dark)] transition-all hover:-translate-y-0.5">
                                    {view === 'create' ? 'Simpan Berita' : 'Simpan Perubahan'}
                                </button>
                                <button onClick={() => setView('list')} className="w-full py-3 px-4 bg-transparent border border-[var(--border)] text-[var(--text-primary)] text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-[var(--surface-2)] transition-all">
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
        <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[var(--card)] p-4 md:p-6 rounded-2xl border border-[var(--border)] shadow-sm mb-6">
                <div>
                    <h2 className="text-xl font-black text-[var(--text-primary)] font-display flex items-center gap-2">
                        Kelola Berita <span className="bg-[var(--primary)]/10 text-[var(--primary)] text-xs px-2 py-1 rounded-md">{news.length} Total</span>
                    </h2>
                    <p className="text-sm text-[var(--text-muted)] mt-1">Sinkronisasi data berita dengan PWMU.CO</p>
                </div>
                <button onClick={startCreate} className="w-full sm:w-auto py-2.5 px-5 bg-[var(--primary)] text-white text-xs font-bold tracking-widest uppercase rounded-xl shadow-md shadow-[var(--primary)]/20 hover:bg-[var(--primary-dark)] transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5">
                    <Plus className="w-4 h-4" /> Input Berita
                </button>
            </div>

            {deleteId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="bg-[var(--card)] rounded-2xl p-6 md:p-8 max-w-sm w-full border border-[var(--border)] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-12 h-12 rounded-full bg-red-100/10 border border-red-500/20 flex items-center justify-center mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-500" />
                        </div>
                        <h3 className="font-black text-lg font-display text-[var(--text-primary)] mb-2">Hapus Berita?</h3>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-8">Berita ini akan dihapus dari sistem website Kaizen secara permanen.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteId(null)} className="flex-1 py-3 bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-primary)] text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-[var(--surface)] transition-all">Batal</button>
                            <button onClick={() => handleDelete(deleteId)} className="flex-1 py-3 bg-red-600 text-white text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-red-700 transition-all">Hapus</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-[var(--border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[var(--surface)]">
                    <div className="relative w-full sm:w-80 group">
                        <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[var(--primary)] transition-colors" />
                        <input
                            type="text"
                            placeholder="Cari berdasarkan judul berita..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {filtered.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-sm text-[var(--text-muted)] font-medium">Tidak ada berita yang ditemukan.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="bg-[var(--surface-2)] border-b border-[var(--border)] text-xs text-[var(--text-muted)] uppercase tracking-wider font-display">
                                <th className="p-4 font-bold pl-6 min-w-[300px]">Detail Berita</th>
                                <th className="p-4 font-bold">Kategori</th>
                                <th className="p-4 font-bold hidden md:table-cell">Tanggal Rilis</th>
                                <th className="p-4 font-bold">Status</th>
                                <th className="p-4 font-bold text-right pr-6">Aksi</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filtered.map(n => (
                                <tr key={n.id} className="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors group">
                                    <td className="p-4 pl-6">
                                        <div className="flex gap-4 items-start">
                                            <div className="w-16 h-12 rounded-lg bg-[var(--surface-2)] overflow-hidden flex-shrink-0 border border-[var(--border)]">
                                                <img src={n.cover} alt={n.title} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <a href={n.pwmuUrl || '#'} target="_blank" rel="noopener noreferrer" className="font-bold text-sm line-clamp-2 text-[var(--text-primary)] hover:text-[var(--primary)] font-display transition-colors">
                                                    {n.title}
                                                </a>
                                                <p className="text-[11px] mt-1 text-[var(--text-muted)] flex items-center gap-1">
                                                    <LinkIcon className="w-3 h-3" /> {n.pwmuUrl ? 'Sumber terlampir' : 'Tidak ada link'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-[10px] font-bold text-[var(--primary)] font-display uppercase tracking-wider bg-[var(--primary)]/10 px-2.5 py-1 rounded-md border border-[var(--primary)]/20">
                                            {n.category}
                                        </span>
                                    </td>
                                    <td className="p-4 text-xs text-[var(--text-secondary)] font-medium hidden md:table-cell">
                                        {n.publishDate}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${
                                            n.status === 'published' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20'
                                                : 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20'
                                        }`}>
                                            {n.status === 'published' ? 'Terbit' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="p-4 pr-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => startEdit(n)} className="p-2 text-[var(--text-muted)] hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors" title="Edit Data">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => setDeleteId(n.id)} className="p-2 text-[var(--text-muted)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors" title="Hapus Data">
                                                <Trash2 className="w-4 h-4" />
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