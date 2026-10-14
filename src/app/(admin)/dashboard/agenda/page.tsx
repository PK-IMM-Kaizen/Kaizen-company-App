'use client'

import { useState, useEffect, useMemo } from 'react'
import {
    Plus, Edit2, Trash2, ArrowLeft, AlertTriangle, Search,
    RefreshCw, Calendar, MapPin, Clock
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
        time: ''
    })

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        fetchAgendas()
    }, [])

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
        setForm({ title: '', date: '', month: '', location: '', time: '' })
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
            time: item.time
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
                time: form.time
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
                        className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--primary)] flex items-center gap-1.5 font-display transition-colors bg-[var(--surface)] px-3 py-1.5 rounded-lg border border-[var(--border)] cursor-pointer"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 text-[var(--primary)]" /> Kembali
                    </button>
                    <span className="text-[var(--border-strong)]">/</span>
                    <h2 className="text-xs sm:text-sm font-black text-[var(--text-primary)] font-display uppercase tracking-wider truncate">
                        {view === 'create' ? 'Tambah Agenda Baru' : 'Edit Agenda'}
                    </h2>
                </div>

                <div className="bg-[var(--card)] rounded-2xl p-4 sm:p-6 md:p-8 border border-[var(--border)] shadow-sm max-w-3xl">
                    <div className="space-y-4 sm:space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">
                                Judul Kegiatan *
                            </label>
                            <input
                                className="w-full px-3.5 sm:px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-xs sm:text-sm font-semibold placeholder-[var(--text-muted)]"
                                value={form.title}
                                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                placeholder="Cth: Darul Arqam Dasar"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">
                                    Tanggal / Teks *
                                </label>
                                <input
                                    className="w-full px-3.5 sm:px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-xs sm:text-sm placeholder-[var(--text-muted)]"
                                    value={form.date}
                                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                                    placeholder="Cth: 15-17 atau Coming Soon"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">
                                    Bulan (Opsional)
                                </label>
                                <input
                                    className="w-full px-3.5 sm:px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-xs sm:text-sm placeholder-[var(--text-muted)]"
                                    value={form.month}
                                    onChange={e => setForm(f => ({ ...f, month: e.target.value }))}
                                    placeholder="Cth: Okt"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">
                                    Lokasi (Opsional)
                                </label>
                                <input
                                    className="w-full px-3.5 sm:px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-xs sm:text-sm placeholder-[var(--text-muted)]"
                                    value={form.location}
                                    onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                                    placeholder="Cth: Gedung Dakwah Muhammadiyah"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">
                                    Waktu (Opsional)
                                </label>
                                <input
                                    className="w-full px-3.5 sm:px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-xs sm:text-sm placeholder-[var(--text-muted)]"
                                    value={form.time}
                                    onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                                    placeholder="Cth: 08:00 - Selesai"
                                />
                            </div>
                        </div>

                        <div className="pt-4 sm:pt-6 flex gap-3 border-t border-[var(--border)]">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex-1 py-3 px-4 bg-[var(--primary)] text-white text-xs font-bold tracking-widest uppercase rounded-xl shadow-md hover:bg-[var(--primary-dark)] transition-all flex justify-center items-center gap-2 cursor-pointer font-display disabled:opacity-50"
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
        <div className="space-y-4 sm:space-y-6 font-sans">

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 bg-[var(--card)] p-4 sm:p-6 rounded-2xl border border-[var(--border)] shadow-sm">
                <div>
                    <h2 className="text-lg sm:text-xl font-black text-[var(--text-primary)] font-display flex items-center gap-2">
                        Kalender Kegiatan <span className="bg-[var(--primary)]/10 text-[var(--primary)] text-xs px-2.5 py-0.5 rounded-md font-bold">{items.length} Agenda</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5">
                        Kelola jadwal dan agenda kegiatan yang akan datang
                    </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button
                        onClick={fetchAgendas}
                        className="p-2.5 bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--primary)] rounded-xl transition-colors cursor-pointer"
                        title="Refresh Data"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={startCreate}
                        className="flex-1 sm:flex-none py-2.5 px-4 sm:px-5 bg-[var(--primary)] text-white text-xs font-bold tracking-widest uppercase rounded-xl shadow-md hover:bg-[var(--primary-dark)] transition-all flex items-center justify-center gap-2 cursor-pointer font-display"
                    >
                        <Plus className="w-4 h-4" /> Tambah Agenda
                    </button>
                </div>
            </div>

            {deleteId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-[var(--card)] rounded-2xl p-6 sm:p-8 max-w-sm w-full border border-[var(--border)] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 border border-red-500/20 flex items-center justify-center mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-500" />
                        </div>
                        <h3 className="font-black text-lg font-display text-[var(--text-primary)] mb-1">Hapus Agenda?</h3>
                        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-6 leading-relaxed">
                            Agenda ini akan dihapus permanen dari sistem.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="flex-1 py-2.5 sm:py-3 bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-primary)] text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-[var(--surface)] transition-all cursor-pointer font-display"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => handleDelete(deleteId)}
                                className="flex-1 py-2.5 sm:py-3 bg-red-600 text-white text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-red-700 transition-all cursor-pointer font-display shadow-md shadow-red-600/20"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm">
                <div className="p-3.5 sm:p-4 border-b border-[var(--border)] flex items-center bg-[var(--surface)]">
                    <div className="relative w-full md:w-80 group">
                        <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-[var(--primary)] transition-colors" />
                        <input
                            type="text"
                            placeholder="Cari agenda kegiatan..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all text-xs sm:text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto w-full scrollbar-none">
                    {isLoading ? (
                        <div className="text-center py-12 text-[var(--text-muted)] text-xs font-bold flex items-center justify-center gap-2">
                            <RefreshCw className="w-4 h-4 animate-spin text-[var(--primary)]" /> Memuat data agenda...
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse min-w-[550px]">
                            <thead>
                            <tr className="bg-[var(--surface-2)] border-b border-[var(--border)] text-[10px] sm:text-xs text-[var(--text-muted)] uppercase tracking-wider font-display">
                                <th className="p-3.5 sm:p-4 font-bold pl-5 sm:pl-6">Detail Agenda</th>
                                <th className="p-3.5 sm:p-4 font-bold">Waktu & Lokasi</th>
                                <th className="p-3.5 sm:p-4 font-bold text-right pr-5 sm:pr-6">Aksi</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="text-center py-12 text-[var(--text-muted)] text-xs sm:text-sm">
                                        Tidak ada agenda yang ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map(m => (
                                    <tr key={m.id} className="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors">
                                        <td className="p-3.5 sm:p-4 pl-5 sm:pl-6">
                                            <div className="flex items-center gap-3.5">
                                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex flex-col items-center justify-center border border-[var(--primary)]/20 shrink-0">
                                                    <span className="text-base sm:text-lg font-black leading-none">{m.date}</span>
                                                    {m.month && <span className="text-[9px] sm:text-[10px] font-bold uppercase mt-0.5">{m.month}</span>}
                                                </div>
                                                <div>
                                                    <span className="font-bold text-xs sm:text-sm text-[var(--text-primary)] font-display line-clamp-2">{m.title}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-3.5 sm:p-4">
                                            <div className="flex flex-col gap-1 text-xs text-[var(--text-secondary)] font-medium">
                                                {m.location ? (
                                                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" /> {m.location}</span>
                                                ) : <span className="text-[var(--text-muted)] italic text-[11px]">Lokasi belum ditentukan</span>}
                                                {m.time && (
                                                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" /> {m.time}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-3.5 sm:p-4 pr-5 sm:pr-6 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    onClick={() => startEdit(m)}
                                                    className="p-1.5 sm:p-2 text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-lg transition-colors cursor-pointer"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteId(m.id)}
                                                    className="p-1.5 sm:p-2 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
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