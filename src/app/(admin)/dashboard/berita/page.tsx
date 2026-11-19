'use client'

import { useState, useEffect, useMemo } from 'react'
import { Plus, Edit2, Trash2, ArrowLeft, AlertTriangle, Search, Calendar, Link as LinkIcon, Image as ImageIcon, RefreshCw } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import Swal from 'sweetalert2'

export interface AppNewsItem {
    id: number
    title: string
    excerpt: string
    content: string
    category: string
    date: string
    publishDate: string
    cover: string
    gallery: string[]
    status: 'draft' | 'published'
    pwmuUrl: string
}

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});

export default function AdminBeritaPage() {
    const [role, setRole] = useState<string>('superadmin')
    const [news, setNews] = useState<AppNewsItem[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [view, setView] = useState<'list' | 'create' | 'edit'>('list')
    const [editItem, setEditItem] = useState<AppNewsItem | null>(null)
    const [search, setSearch] = useState('')
    const [deleteId, setDeleteId] = useState<number | null>(null)

    const supabase = useMemo(
        () =>
            createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            ),
        []
    )

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

    useEffect(() => {
        const savedRole = localStorage.getItem('userRole')
        if (savedRole) setRole(savedRole)
        fetchNews()
    }, [supabase])

    const fetchNews = async () => {
        setIsLoading(true)
        try {
            const { data, error } = await supabase
                .from('news')
                .select('*')
                .order('id', { ascending: false })

            if (error) throw error

            if (data) {
                const formattedNews: AppNewsItem[] = data.map((item: any) => ({
                    id: item.id,
                    title: item.title || '',
                    excerpt: item.excerpt || '',
                    content: item.content || '',
                    category: item.category || 'Bidang HPKP',
                    date: item.date || '',
                    publishDate: item.publish_date || '',
                    cover: item.cover || '',
                    gallery: item.gallery || [],
                    status: item.status || 'draft',
                    pwmuUrl: item.pwmu_url || ''
                }))
                setNews(formattedNews)
            }
        } catch (error: any) {
            console.error('Gagal mengambil berita:', error.message)
            Toast.fire({
                icon: 'error',
                title: 'Gagal memuat data berita'
            })
        } finally {
            setIsLoading(false)
        }
    }

    const logActivity = async (action: string, target: string, type: string) => {
        try {
            const savedRole = localStorage.getItem('userRole')
            const adminName = savedRole === 'superadmin'
                ? 'Super Admin'
                : savedRole ? `Admin (${savedRole.toUpperCase()})` : 'Admin'

            const { error } = await supabase.from('system_logs').insert([
                {
                    admin_name: adminName,
                    action: action,
                    target: target,
                    type: type
                }
            ])

            if (error) throw error
        } catch (error: any) {
            console.error('Gagal merekam log berita ke Supabase:', error.message || error)
        }
    }

    const filtered = news.filter(n => n.title.toLowerCase().includes(search.toLowerCase()))
    const canPublish = role === 'superadmin' || role === 'bpi' || role === 'medkom'

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

    const handleSave = async () => {
        if (!form.title.trim()) {
            Toast.fire({
                icon: 'warning',
                title: 'Judul berita wajib diisi!'
            })
            return
        }

        setIsSaving(true)
        const galleryArray = form.galleryUrls
            .split('\n')
            .map(url => url.trim())
            .filter(url => url !== '')

        const payload = {
            title: form.title,
            excerpt: form.excerpt,
            content: form.content,
            category: form.category,
            date: form.date,
            publish_date: form.publishDate,
            cover: form.cover,
            gallery: galleryArray,
            status: form.status,
            pwmu_url: form.pwmuUrl,
            updated_at: new Date().toISOString()
        }

        try {
            if (view === 'create') {
                const { error } = await supabase.from('news').insert([payload])
                if (error) throw error

                await logActivity('menerbitkan berita', `Judul: "${form.title}"`, 'news')

                Toast.fire({
                    icon: 'success',
                    title: 'Berita berhasil ditambahkan!'
                })

            } else if (editItem) {
                const { error } = await supabase
                    .from('news')
                    .update(payload)
                    .eq('id', editItem.id)
                if (error) throw error

                await logActivity('memperbarui berita', `Judul: "${form.title}"`, 'news')

                Toast.fire({
                    icon: 'success',
                    title: 'Perubahan berhasil disimpan!'
                })
            }

            await fetchNews()
            setView('list')
        } catch (error: any) {
            Toast.fire({
                icon: 'error',
                title: `Gagal menyimpan: ${error.message}`
            })
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (id: number) => {
        try {
            const itemToDelete = news.find(n => n.id === id)
            const targetName = itemToDelete ? itemToDelete.title : 'Data Berita'

            const { error } = await supabase.from('news').delete().eq('id', id)
            if (error) throw error

            setNews(prev => prev.filter(n => n.id !== id))
            setDeleteId(null)

            await logActivity('menghapus berita', `Judul: "${targetName}"`, 'news')

            Toast.fire({
                icon: 'success',
                title: 'Berita berhasil dihapus!'
            })

        } catch (error: any) {
            Toast.fire({
                icon: 'error',
                title: `Gagal menghapus: ${error.message}`
            })
        }
    }

    if (view === 'create' || view === 'edit') {
        return (
            <div className="animate-in fade-in duration-300 space-y-5 sm:space-y-6 font-sans">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setView('list')}
                        className="text-xs font-black text-[var(--text-primary)] uppercase tracking-widest hover:border-[var(--mk-ink)] hover:shadow-[2px_2px_0_var(--border)] flex items-center gap-2 font-display transition-all bg-[var(--surface)] px-4 py-2 rounded-xl border-2 border-[var(--border-strong)] cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4 text-[var(--primary)]" /> Kembali
                    </button>
                    <span className="text-[var(--border-strong)] font-black text-xl">/</span>
                    <h2 className="text-sm sm:text-base font-black text-[var(--text-primary)] font-display uppercase tracking-tight truncate">
                        {view === 'create' ? 'Input Berita Baru' : 'Edit Berita'}
                    </h2>
                </div>

                <div className="bg-[var(--card)] rounded-2xl p-5 sm:p-8 border-2 border-[var(--border-strong)] shadow-[4px_4px_0_var(--surface-2)] flex flex-col relative overflow-hidden">
                    <div className="h-1 w-full bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--accent-light)] absolute top-0 left-0" />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mt-2">
                        <div className="lg:col-span-2 space-y-5 sm:space-y-6">
                            <div className="p-4 sm:p-5 bg-blue-50/50 border-2 border-blue-200 shadow-[3px_3px_0_#bfdbfe] rounded-xl space-y-4 mb-4 sm:mb-6">
                                <h3 className="text-xs font-black uppercase tracking-widest text-blue-700 font-display flex items-center gap-2.5">
                                    <div className="bg-blue-600 text-white p-1 rounded-md">
                                        <LinkIcon className="w-4 h-4 shrink-0" />
                                    </div>
                                    Sumber PWMU.CO
                                </h3>
                                <div>
                                    <label className="block text-[10px] font-black text-blue-900 mb-2 uppercase tracking-widest">
                                        URL Berita Asli
                                    </label>
                                    <input
                                        className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 bg-white text-blue-900 focus:outline-none focus:border-blue-500 focus:shadow-[3px_3px_0_#93c5fd] transition-all text-xs sm:text-sm font-medium placeholder-blue-300"
                                        value={form.pwmuUrl}
                                        onChange={e => setForm(f => ({ ...f, pwmuUrl: e.target.value }))}
                                        placeholder="https://pwmu.co/..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-blue-900 mb-2 uppercase tracking-widest">
                                        URL Gambar Cover
                                    </label>
                                    <input
                                        className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 bg-white text-blue-900 focus:outline-none focus:border-blue-500 focus:shadow-[3px_3px_0_#93c5fd] transition-all text-xs sm:text-sm font-medium placeholder-blue-300"
                                        value={form.cover}
                                        onChange={e => setForm(f => ({ ...f, cover: e.target.value }))}
                                        placeholder="https://pwmu.co/wp-content/uploads/..."
                                    />
                                    {form.cover && (
                                        <div className="mt-3 relative w-32 aspect-[16/9] rounded-lg overflow-hidden border-2 border-blue-200 shadow-[2px_2px_0_#bfdbfe]">
                                            <img src={form.cover} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-[var(--text-primary)] mb-2 font-display uppercase tracking-widest">
                                    Judul Berita <span className="text-[var(--primary)]">*</span>
                                </label>
                                <input
                                    className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all text-xs sm:text-sm font-bold placeholder-[var(--text-muted)]"
                                    value={form.title}
                                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                    placeholder="Masukkan judul berita..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-[var(--text-primary)] mb-2 font-display uppercase tracking-widest">
                                    Ringkasan (Excerpt)
                                </label>
                                <textarea
                                    className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all text-xs sm:text-sm font-medium placeholder-[var(--text-muted)] leading-relaxed"
                                    rows={3}
                                    value={form.excerpt}
                                    onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                                    placeholder="Ringkasan singkat atau paragraf pertama berita..."
                                    style={{ resize: 'vertical' }}
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-[var(--text-primary)] mb-2 font-display uppercase tracking-widest">
                                    Isi Berita
                                </label>
                                <textarea
                                    className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all text-xs sm:text-sm font-medium placeholder-[var(--text-muted)] leading-relaxed"
                                    rows={10}
                                    value={form.content}
                                    onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                                    placeholder="Tuliskan isi berita di sini..."
                                    style={{ resize: 'vertical' }}
                                />
                            </div>
                        </div>

                        <div className="space-y-5 sm:space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-[var(--text-primary)] mb-2 font-display uppercase tracking-widest">
                                    Kategori
                                </label>
                                <select
                                    className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all text-xs sm:text-sm font-bold cursor-pointer outline-none"
                                    value={form.category}
                                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                >
                                    {['Bidang HPKP', 'Bidang Kader', 'Organisasi', 'Medkom', 'Kewirausahaan', 'Keilmuan'].map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
                                <div>
                                    <label className="block text-[10px] font-black text-[var(--text-primary)] mb-2 font-display uppercase tracking-widest flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" /> Tanggal Kegiatan
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all text-xs sm:text-sm font-medium placeholder-[var(--text-muted)]"
                                        value={form.date}
                                        onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                                        placeholder="Misal: 30 September 2026"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-[var(--text-primary)] mb-2 font-display uppercase tracking-widest flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" /> Tanggal Rilis PWMU
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all text-xs sm:text-sm font-medium placeholder-[var(--text-muted)]"
                                        value={form.publishDate}
                                        onChange={e => setForm(f => ({ ...f, publishDate: e.target.value }))}
                                        placeholder="Misal: 01 Oktober 2026"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-[var(--text-primary)] mb-2 font-display uppercase tracking-widest flex items-center gap-1.5">
                                    <ImageIcon className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" /> URL Galeri Tambahan
                                </label>
                                <textarea
                                    className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all text-xs font-mono font-medium placeholder-[var(--text-muted)]"
                                    rows={4}
                                    value={form.galleryUrls}
                                    onChange={e => setForm(f => ({ ...f, galleryUrls: e.target.value }))}
                                    placeholder="https://...&#10;https://..."
                                    style={{ resize: 'vertical' }}
                                />
                                <p className="text-[10px] text-[var(--text-secondary)] mt-1.5 font-medium">
                                    Masukkan 1 URL gambar per baris (tekan Enter untuk URL baru).
                                </p>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-[var(--text-primary)] mb-2 font-display uppercase tracking-widest">
                                    Status Terbit
                                </label>
                                <select
                                    className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all text-xs sm:text-sm font-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed outline-none"
                                    value={form.status}
                                    onChange={e => setForm(f => ({ ...f, status: e.target.value as 'draft' | 'published' }))}
                                    disabled={!canPublish}
                                >
                                    <option value="draft">Draft (Simpan Sementara)</option>
                                    {canPublish && <option value="published">Terbit (Publish ke Web)</option>}
                                </select>
                            </div>

                            <div className="pt-6 space-y-3 border-t-2 border-dashed border-[var(--border-strong)]">
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="w-full py-3.5 px-4 bg-[var(--primary)] text-white text-xs font-black tracking-widest uppercase rounded-xl border-2 border-transparent hover:border-[var(--mk-ink)] shadow-[3px_3px_0_rgba(200,16,46,0.2)] hover:shadow-[3px_3px_0_var(--mk-ink)] transition-all flex justify-center items-center gap-2 cursor-pointer font-display hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                                >
                                    {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                                    {isSaving ? 'Memproses...' : (view === 'create' ? 'Simpan Berita' : 'Simpan Perubahan')}
                                </button>
                                <button
                                    onClick={() => setView('list')}
                                    disabled={isSaving}
                                    className="w-full py-3.5 px-4 bg-[var(--surface)] text-[var(--text-primary)] text-xs font-black tracking-widest uppercase rounded-xl border-2 border-[var(--border-strong)] hover:border-[var(--mk-ink)] hover:shadow-[3px_3px_0_var(--mk-ink)] transition-all cursor-pointer font-display hover:-translate-y-0.5"
                                >
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
        <div className="space-y-6 font-sans">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[var(--card)] p-5 sm:p-6 rounded-2xl border-2 border-[var(--border-strong)] shadow-[4px_4px_0_var(--surface-2)] relative overflow-hidden">
                <div className="h-1 w-full bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--accent-light)] absolute top-0 left-0" />
                <div>
                    <h2 className="text-lg sm:text-xl font-black text-[var(--text-primary)] font-display flex items-center gap-3">
                        Kelola Berita
                        <span className="bg-[var(--primary)] text-white text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider border-2 border-[var(--primary-dark)] shadow-[2px_2px_0_rgba(200,16,46,0.3)]">
                            {news.length} Total
                        </span>
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5 font-medium">
                        Sinkronisasi data berita dengan PWMU.CO
                    </p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button
                        onClick={fetchNews}
                        className="p-3 bg-[var(--surface)] border-2 border-[var(--border-strong)] text-[var(--text-primary)] hover:text-[var(--primary)] hover:border-[var(--primary)] hover:shadow-[3px_3px_0_rgba(200,16,46,0.15)] rounded-xl transition-all cursor-pointer hover:-translate-y-0.5"
                        title="Segarkan Data"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={startCreate}
                        className="flex-1 sm:flex-none py-3 px-5 sm:px-6 bg-[var(--primary)] text-white text-xs font-black tracking-widest uppercase rounded-xl border-2 border-transparent hover:border-[var(--mk-ink)] shadow-[3px_3px_0_rgba(200,16,46,0.2)] hover:shadow-[3px_3px_0_var(--mk-ink)] transition-all flex items-center justify-center gap-2 cursor-pointer font-display hover:-translate-y-0.5"
                    >
                        <Plus className="w-4 h-4 stroke-[3px]" /> Input Berita
                    </button>
                </div>
            </div>

            {deleteId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-[var(--card)] rounded-2xl p-6 sm:p-8 max-w-sm w-full border-2 border-[var(--border-strong)] shadow-[8px_8px_0_var(--mk-ink)] animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-12 h-12 rounded-xl bg-red-100 border-2 border-red-500 flex items-center justify-center mb-5 shadow-[3px_3px_0_#ef4444]">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="font-black text-xl font-display text-[var(--text-primary)] mb-2 uppercase tracking-wide">Hapus Berita?</h3>
                        <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium leading-relaxed mb-6">
                            Berita ini akan dihapus dari sistem website Kaizen secara permanen. Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="flex-1 py-3 bg-[var(--surface-2)] border-2 border-[var(--border-strong)] text-[var(--text-primary)] text-xs font-black tracking-widest uppercase rounded-xl hover:border-[var(--mk-ink)] hover:shadow-[3px_3px_0_var(--mk-ink)] transition-all cursor-pointer font-display hover:-translate-y-0.5"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => handleDelete(deleteId)}
                                className="flex-1 py-3 bg-red-600 text-white text-xs font-black tracking-widest uppercase rounded-xl border-2 border-red-700 hover:border-black hover:shadow-[3px_3px_0_#000] transition-all cursor-pointer font-display hover:-translate-y-0.5"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-[var(--card)] rounded-2xl border-2 border-[var(--border-strong)] overflow-hidden shadow-[4px_4px_0_var(--surface-2)]">
                <div className="p-4 sm:p-5 border-b-2 border-[var(--border-strong)] flex items-center bg-[var(--surface)]">
                    <div className="relative w-full sm:w-80 group">
                        <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[var(--primary)] transition-colors" />
                        <input
                            type="text"
                            placeholder="Cari judul berita..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--background)] text-[var(--text-primary)] font-bold placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all text-xs sm:text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto w-full scrollbar-none">
                    {isLoading ? (
                        <div className="text-center py-16 text-[var(--text-muted)] font-display text-sm font-black flex items-center justify-center gap-3 uppercase tracking-widest">
                            <RefreshCw className="w-5 h-5 animate-spin text-[var(--primary)]" />
                            Memuat Data...
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-sm text-[var(--text-muted)] font-black uppercase tracking-widest">Tidak ada berita yang ditemukan.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse min-w-[650px]">
                            <thead>
                            <tr className="bg-[var(--surface)] border-b-2 border-[var(--border-strong)] text-[10px] sm:text-xs text-[var(--text-primary)] uppercase tracking-widest font-display">
                                <th className="p-4 sm:p-5 font-black pl-5 sm:pl-6 min-w-[260px]">Detail Berita</th>
                                <th className="p-4 sm:p-5 font-black">Kategori</th>
                                <th className="p-4 sm:p-5 font-black hidden md:table-cell">Tanggal Rilis</th>
                                <th className="p-4 sm:p-5 font-black">Status</th>
                                <th className="p-4 sm:p-5 font-black text-right pr-5 sm:pr-6">Aksi</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filtered.map(n => (
                                <tr key={n.id} className="border-b-2 border-[var(--border-strong)] last:border-b-0 hover:bg-[var(--surface-2)] transition-colors group">
                                    <td className="p-4 sm:p-5 pl-5 sm:pl-6">
                                        <div className="flex gap-4 items-start">
                                            <div className="w-16 h-12 sm:w-20 sm:h-14 rounded-xl bg-[var(--background)] overflow-hidden shrink-0 border-2 border-[var(--border-strong)] shadow-[2px_2px_0_var(--border-strong)] flex items-center justify-center">
                                                {n.cover ? (
                                                    <img src={n.cover} alt={n.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon className="w-5 h-5 text-[var(--text-muted)]" />
                                                )}
                                            </div>
                                            <div className="min-w-0 pt-0.5">
                                                <a
                                                    href={n.pwmuUrl || '#'}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="font-black text-xs sm:text-sm line-clamp-2 text-[var(--text-primary)] hover:text-[var(--primary)] font-display transition-colors"
                                                >
                                                    {n.title}
                                                </a>
                                                <p className="text-[10px] mt-1.5 text-[var(--text-secondary)] font-bold flex items-center gap-1.5 uppercase tracking-wide">
                                                    <LinkIcon className="w-3 h-3 shrink-0" /> {n.pwmuUrl ? 'Sumber Terlampir' : 'Tidak Ada Link'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 sm:p-5">
                                        <span className="text-[9px] sm:text-[10px] font-black text-[var(--primary)] font-display uppercase tracking-widest bg-[var(--primary)]/10 px-3 py-1.5 rounded-lg border-2 border-[var(--primary)] shadow-[2px_2px_0_rgba(200,16,46,0.2)] whitespace-nowrap">
                                            {n.category}
                                        </span>
                                    </td>
                                    <td className="p-4 sm:p-5 text-xs text-[var(--text-secondary)] font-bold hidden md:table-cell whitespace-nowrap">
                                        {n.publishDate || '-'}
                                    </td>
                                    <td className="p-4 sm:p-5 whitespace-nowrap">
                                        <span className={`px-3 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest border-2 shadow-[2px_2px_0_currentColor] ${
                                            n.status === 'published' ? 'bg-green-50 text-green-700 border-green-600'
                                                : 'bg-orange-50 text-orange-700 border-orange-500'
                                        }`}>
                                            {n.status === 'published' ? 'Terbit' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="p-4 sm:p-5 pr-5 sm:pr-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => startEdit(n)}
                                                className="p-2 sm:p-2.5 bg-white border-2 border-[var(--border-strong)] text-[var(--text-secondary)] hover:text-blue-600 hover:border-blue-600 hover:shadow-[2px_2px_0_#2563eb] rounded-xl transition-all cursor-pointer hover:-translate-y-0.5"
                                                title="Edit Data"
                                            >
                                                <Edit2 className="w-4 h-4 stroke-[3px]" />
                                            </button>
                                            <button
                                                onClick={() => setDeleteId(n.id)}
                                                className="p-2 sm:p-2.5 bg-white border-2 border-[var(--border-strong)] text-[var(--text-secondary)] hover:text-red-600 hover:border-red-600 hover:shadow-[2px_2px_0_#dc2626] rounded-xl transition-all cursor-pointer hover:-translate-y-0.5"
                                                title="Hapus Data"
                                            >
                                                <Trash2 className="w-4 h-4 stroke-[3px]" />
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