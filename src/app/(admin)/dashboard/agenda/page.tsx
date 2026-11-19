'use client'

import { useState, useEffect, useMemo } from 'react'
import {
    Plus, Edit2, Trash2, ArrowLeft, AlertTriangle, Search,
    RefreshCw, MapPin, Clock, Image as ImageIcon, Link as LinkIcon
} from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

type ViewMode = 'list' | 'create' | 'edit'

export interface Agenda {
    id: string
    title: string
    date: string
    month: string
    location: string
    time: string
    image_url?: string
    createdAt?: string
}

export default function AdminAgendaPage() {
    const [items, setItems] = useState<Agenda[]>([])
    const [view, setView] = useState<ViewMode>('list')
    const [editItem, setEditItem] = useState<Agenda | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)

    const [search, setSearch] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    const [form, setForm] = useState({
        title: '',
        date: '',
        month: '',
        location: '',
        time: '',
        imageUrl: ''
    })

    const supabase = useMemo(
        () =>
            createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            ),
        []
    )

    useEffect(() => {
        fetchAgendas()
    }, [supabase])

    const fetchAgendas = async () => {
        setIsLoading(true)
        try {
            const { data, error } = await supabase
                .from('agendas')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error

            if (data) {
                const formattedData: Agenda[] = data.map((item: any) => ({
                    id: item.id,
                    title: item.title,
                    date: item.date,
                    month: item.month || '',
                    location: item.location || '',
                    time: item.time || '',
                    image_url: item.image_url || '',
                    createdAt: item.created_at
                }))
                setItems(formattedData)
            }
        } catch (error: any) {
            console.error('Error fetching agendas:', error.message)
            alert('Gagal mengambil data agenda')
        } finally {
            setIsLoading(false)
        }
    }

    const filteredItems = useMemo(() => {
        return items.filter(m =>
            m.title.toLowerCase().includes(search.toLowerCase()) ||
            m.location.toLowerCase().includes(search.toLowerCase())
        )
    }, [items, search])

    const startCreate = () => {
        setForm({ title: '', date: '', month: '', location: '', time: '', imageUrl: '' })
        setEditItem(null)
        setView('create')
    }

    const startEdit = (item: Agenda) => {
        setEditItem(item)
        setForm({
            title: item.title,
            date: item.date,
            month: item.month,
            location: item.location,
            time: item.time,
            imageUrl: item.image_url || ''
        })
        setView('edit')
    }

    const handleSave = async () => {
        if (!form.title || !form.date) {
            alert('Harap isi judul kegiatan dan tanggal/keterangan waktu.')
            return
        }

        setIsSaving(true)
        try {
            const payload = {
                title: form.title,
                date: form.date,
                month: form.month,
                location: form.location,
                time: form.time,
                image_url: form.imageUrl
            }

            if (view === 'create') {
                const { error } = await supabase.from('agendas').insert([payload])
                if (error) throw error
            } else if (editItem) {
                const { error } = await supabase.from('agendas').update(payload).eq('id', editItem.id)
                if (error) throw error
            }

            await fetchAgendas()
            setView('list')
        } catch (error: any) {
            alert(`Gagal menyimpan data: ${error.message}`)
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const { error } = await supabase.from('agendas').delete().eq('id', id)
            if (error) throw error
            setItems(prev => prev.filter(m => m.id !== id))
            setDeleteId(null)
        } catch (error: any) {
            alert(`Gagal menghapus data: ${error.message}`)
        }
    }

    if (view === 'create' || view === 'edit') {
        return (
            <div className="animate-in fade-in duration-300 space-y-4 sm:space-y-6 font-sans">
                <div className="flex items-center gap-2.5 sm:gap-3">
                    <button
                        onClick={() => setView('list')}
                        className="text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--primary)] flex items-center gap-1.5 font-display transition-colors bg-[var(--surface)] px-3.5 py-2 rounded-xl border-2 border-[var(--border-strong)] shadow-[2px_2px_0_var(--border)] hover:shadow-[2px_2px_0_var(--mk-ink)] hover:border-[var(--mk-ink)] hover:-translate-y-0.5 cursor-pointer uppercase tracking-wider"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Kembali
                    </button>
                    <span className="text-[var(--border-strong)] font-bold">/</span>
                    <h2 className="text-sm sm:text-base font-black text-[var(--text-primary)] font-display uppercase tracking-wider truncate flex items-center gap-2">
                        {view === 'create' ? 'Tambah Agenda Baru' : 'Edit Agenda'}
                    </h2>
                </div>

                <div className="bg-[var(--card)] rounded-2xl border-2 border-[var(--border-strong)] shadow-[6px_6px_0_var(--surface-2)] max-w-3xl overflow-hidden relative">
                    <div className="h-1.5 w-full bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--accent-light)]" />

                    <div className="p-5 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
                        <div className="p-4 sm:p-5 bg-[var(--surface)] border-2 border-[var(--border-strong)] rounded-xl space-y-3 relative overflow-hidden">
                            <div className="absolute right-0 top-0 w-24 h-24 bg-[var(--accent-light)]/10 rounded-bl-full pointer-events-none" />
                            <label className="text-xs font-bold text-[var(--text-primary)] font-display uppercase tracking-wide flex items-center gap-1.5">
                                <ImageIcon className="w-4 h-4 text-[var(--primary)] shrink-0" /> Gambar / Flier Kegiatan (URL)
                            </label>
                            <div className="relative">
                                <LinkIcon className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all text-xs sm:text-sm placeholder-[var(--text-muted)] font-medium"
                                    value={form.imageUrl}
                                    onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                                    placeholder="https://... (Kosongkan jika tidak ada)"
                                />
                            </div>
                            {form.imageUrl && (
                                <div className="mt-3 relative w-32 aspect-video sm:w-40 rounded-xl overflow-hidden border-2 border-[var(--border-strong)] shadow-[3px_3px_0_var(--border)] bg-[var(--surface)]">
                                    <img
                                        src={form.imageUrl}
                                        alt="Preview Flier"
                                        className="w-full h-full object-cover"
                                        onError={(e) => (e.currentTarget.style.display = 'none')}
                                    />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[var(--text-primary)] mb-2 font-display uppercase tracking-wide">
                                Judul Kegiatan <span className="text-[var(--error)]">*</span>
                            </label>
                            <input
                                className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all text-xs sm:text-sm font-semibold placeholder-[var(--text-muted)]"
                                value={form.title}
                                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                placeholder="Cth: Darul Arqam Dasar"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-primary)] mb-2 font-display uppercase tracking-wide">
                                    Tanggal / Teks Tampilan <span className="text-[var(--error)]">*</span>
                                </label>
                                <input
                                    className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all text-xs sm:text-sm font-medium placeholder-[var(--text-muted)]"
                                    value={form.date}
                                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                                    placeholder="Cth: 31 atau Coming Soon"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-primary)] mb-2 font-display uppercase tracking-wide">
                                    Bulan / Keterangan
                                </label>
                                <input
                                    className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all text-xs sm:text-sm font-medium placeholder-[var(--text-muted)]"
                                    value={form.month}
                                    onChange={e => setForm(f => ({ ...f, month: e.target.value }))}
                                    placeholder="Cth: OKTOBER 2026"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-primary)] mb-2 font-display uppercase tracking-wide">
                                    Lokasi (Opsional)
                                </label>
                                <input
                                    className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all text-xs sm:text-sm font-medium placeholder-[var(--text-muted)]"
                                    value={form.location}
                                    onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                                    placeholder="Cth: Gedung Dakwah Muhammadiyah"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-primary)] mb-2 font-display uppercase tracking-wide">
                                    Waktu (Opsional)
                                </label>
                                <input
                                    className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all text-xs sm:text-sm font-medium placeholder-[var(--text-muted)]"
                                    value={form.time}
                                    onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                                    placeholder="Cth: 08:00 - Selesai"
                                />
                            </div>
                        </div>

                        <div className="pt-6 sm:pt-8 flex gap-3 border-t-2 border-dashed border-[var(--border-strong)]">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex-1 py-3.5 px-4 bg-[var(--primary)] text-white text-xs font-bold tracking-widest uppercase rounded-xl border-2 border-transparent hover:border-[var(--mk-ink)] shadow-[4px_4px_0_rgba(0,0,0,0.1)] hover:shadow-[4px_4px_0_var(--mk-ink)] hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 cursor-pointer font-display disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                            >
                                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                                {isSaving ? 'Menyimpan...' : 'Simpan Agenda'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-5 sm:space-y-6 font-sans">

            {/* Header / Top Action Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-5 bg-[var(--card)] p-5 sm:p-6 rounded-2xl border-2 border-[var(--border-strong)] shadow-[4px_4px_0_var(--surface-2)]">
                <div>
                    <h2 className="admin-title-line text-lg sm:text-xl font-black text-[var(--text-primary)] uppercase tracking-tight">
                        Kalender Kegiatan
                        <span className="ml-2 bg-[var(--accent-light)] text-[var(--mk-ink)] text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border border-[var(--mk-ink)]">
                            {items.length} Agenda
                        </span>
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5 font-medium ml-[18px]">
                        Kelola jadwal dan agenda kegiatan yang akan datang
                    </p>
                </div>
                <div className="flex gap-2.5 w-full sm:w-auto">
                    <button
                        onClick={fetchAgendas}
                        className="p-3 bg-[var(--surface)] border-2 border-[var(--border-strong)] text-[var(--text-secondary)] hover:text-[var(--primary)] hover:border-[var(--primary)] rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_rgba(200,16,46,0.15)] cursor-pointer"
                        title="Refresh Data"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={startCreate}
                        className="flex-1 sm:flex-none py-3 px-4 sm:px-5 bg-[var(--primary)] text-white text-xs font-bold tracking-widest uppercase rounded-xl border-2 border-transparent hover:border-[var(--mk-ink)] shadow-[4px_4px_0_rgba(0,0,0,0.1)] hover:shadow-[4px_4px_0_var(--mk-ink)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer font-display"
                    >
                        <Plus className="w-4 h-4" /> Tambah Agenda
                    </button>
                </div>
            </div>

            {/* Modal Konfirmasi Hapus */}
            {deleteId !== null && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-[var(--card)] rounded-2xl p-6 sm:p-8 max-w-sm w-full border-2 border-[var(--mk-ink)] shadow-[8px_8px_0_var(--mk-ink)] animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-14 h-14 rounded-2xl bg-[var(--error)]/10 border-2 border-[var(--error)]/30 flex items-center justify-center mb-5 rotate-3">
                            <AlertTriangle className="w-7 h-7 text-[var(--error)]" />
                        </div>
                        <h3 className="font-black text-xl font-display text-[var(--text-primary)] mb-2 uppercase tracking-tight">Hapus Agenda?</h3>
                        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-6 leading-relaxed font-medium">
                            Agenda ini akan dihapus permanen dari sistem dan tidak dapat dipulihkan.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="flex-1 py-3 bg-[var(--surface)] border-2 border-[var(--border-strong)] text-[var(--text-primary)] text-xs font-bold tracking-widest uppercase rounded-xl hover:border-[var(--mk-ink)] hover:shadow-[3px_3px_0_var(--mk-ink)] transition-all cursor-pointer font-display"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => handleDelete(deleteId)}
                                className="flex-1 py-3 bg-[var(--error)] text-white border-2 border-transparent hover:border-[var(--mk-ink)] text-xs font-bold tracking-widest uppercase rounded-xl shadow-[3px_3px_0_rgba(200,16,46,0.2)] hover:shadow-[3px_3px_0_var(--mk-ink)] transition-all cursor-pointer font-display"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Area Tabel */}
            <div className="bg-[var(--card)] rounded-2xl border-2 border-[var(--border-strong)] overflow-hidden shadow-[4px_4px_0_var(--surface-2)] flex flex-col relative">
                <div className="h-1 w-full bg-gradient-to-r from-[var(--accent)] via-[var(--primary)] to-[var(--accent-light)]" />

                <div className="p-4 sm:p-5 border-b border-[var(--border)] bg-[var(--surface)]">
                    <div className="relative w-full md:w-96 group">
                        <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[var(--primary)] transition-colors" />
                        <input
                            type="text"
                            placeholder="Cari agenda kegiatan atau lokasi..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 sm:py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--background)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all text-xs sm:text-sm font-medium"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto w-full scrollbar-none">
                    {isLoading ? (
                        <div className="text-center py-16 text-[var(--text-muted)] text-xs font-bold flex items-center justify-center gap-2 font-display uppercase tracking-widest">
                            <RefreshCw className="w-5 h-5 animate-spin text-[var(--primary)]" /> Memuat data agenda...
                        </div>
                    ) : (
                        <table className="admin-table min-w-[600px]">
                            <thead>
                            <tr>
                                <th className="pl-5 sm:pl-6">Detail Agenda</th>
                                <th>Waktu & Lokasi</th>
                                <th className="text-right pr-5 sm:pr-6">Aksi</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="text-center py-12 text-[var(--text-muted)] text-xs sm:text-sm font-medium">
                                        Tidak ada agenda yang ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map(m => (
                                    <tr key={m.id} className="group">
                                        <td className="pl-5 sm:pl-6">
                                            <div className="flex items-center gap-4">
                                                {m.image_url ? (
                                                    <div className="w-14 h-12 sm:w-16 sm:h-14 rounded-xl overflow-hidden border-2 border-[var(--border-strong)] bg-[var(--surface)] shrink-0 shadow-[2px_2px_0_var(--border)] group-hover:shadow-[2px_2px_0_var(--accent)] transition-shadow">
                                                        <img
                                                            src={m.image_url}
                                                            alt={m.title}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => (e.currentTarget.style.display = 'none')}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-14 h-12 sm:w-16 sm:h-14 rounded-xl bg-[var(--primary)] border-2 border-[var(--mk-ink)] text-white flex flex-col items-center justify-center p-1 shrink-0 text-center shadow-[2px_2px_0_var(--mk-ink)] rotate-1 group-hover:rotate-0 transition-transform">
                                                        <span className="text-sm sm:text-base font-black leading-none uppercase tracking-tight">{m.date}</span>
                                                        {m.month && (
                                                            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest mt-0.5 opacity-90 line-clamp-1">{m.month}</span>
                                                        )}
                                                    </div>
                                                )}
                                                <div>
                                                    <span className="font-black text-xs sm:text-sm text-[var(--text-primary)] font-display line-clamp-2 uppercase tracking-wide group-hover:text-[var(--primary)] transition-colors">{m.title}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex flex-col gap-1.5 text-xs text-[var(--text-secondary)] font-semibold">
                                                {m.location ? (
                                                    <span className="flex items-center gap-2">
                                                        <MapPin className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" /> {m.location}
                                                    </span>
                                                ) : (
                                                    <span className="text-[var(--text-muted)] italic text-[11px] flex items-center gap-2">
                                                        <MapPin className="w-3.5 h-3.5 shrink-0 opacity-50" /> Lokasi belum ditentukan
                                                    </span>
                                                )}
                                                {m.time && (
                                                    <span className="flex items-center gap-2">
                                                        <Clock className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" /> {m.time}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="pr-5 sm:pr-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => startEdit(m)}
                                                    className="p-2 text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-xl transition-colors cursor-pointer border-2 border-transparent hover:border-[var(--primary)]/20"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteId(m.id)}
                                                    className="p-2 text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[var(--error)]/10 rounded-xl transition-colors cursor-pointer border-2 border-transparent hover:border-[var(--error)]/20"
                                                    title="Hapus"
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
                    )}
                </div>
            </div>
        </div>
    )
}