'use client'

import { useState, useEffect } from 'react'
import { Edit2, ArrowLeft, Image as ImageIcon, Search, RefreshCw, Briefcase, Info } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import Swal from 'sweetalert2'

export interface Division {
    id: string
    name: string
    description: string
    color: string
    photo: string
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

export default function AdminBidangPage() {
    const [items, setItems] = useState<Division[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [view, setView] = useState<'list' | 'edit'>('list')
    const [editItem, setEditItem] = useState<Division | null>(null)
    const [search, setSearch] = useState('')

    const [form, setForm] = useState({ description: '', photo: '' })

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        fetchDivisions()
    }, [])

    const fetchDivisions = async () => {
        setIsLoading(true)
        try {
            const { data, error } = await supabase
                .from('divisions')
                .select('*')
                .order('created_at', { ascending: true })

            if (error) throw error

            if (data) {
                setItems(data)
            }
        } catch (error: any) {
            console.error('Gagal mengambil data bidang:', error.message)
            Toast.fire({
                icon: 'error',
                title: 'Gagal memuat data bidang'
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

            await supabase.from('system_logs').insert([
                {
                    admin_name: adminName,
                    action: action,
                    target: target,
                    type: type
                }
            ])
        } catch (error: any) {
            console.error('Gagal merekam log ke Supabase:', error.message)
        }
    }

    const startEdit = (item: Division) => {
        setEditItem(item)
        setForm({
            description: item.description || '',
            photo: item.photo || ''
        })
        setView('edit')
    }

    const handleSave = async () => {
        if (!editItem) return
        setIsSaving(true)

        const payload = {
            description: form.description,
            photo: form.photo
        }

        try {
            const { error } = await supabase
                .from('divisions')
                .update(payload)
                .eq('id', editItem.id)

            if (error) throw error

            await logActivity('memperbarui', `Deskripsi/Foto Bidang: ${editItem.name}`, 'bidang')

            Toast.fire({
                icon: 'success',
                title: 'Profil bidang berhasil diperbarui!'
            })

            await fetchDivisions()
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

    const filtered = items.filter(d => d.name.toLowerCase().includes(search.toLowerCase()))

    if (view === 'edit' && editItem) {
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
                        Update Profil Bidang
                    </h2>
                </div>

                <div className="bg-[var(--card)] rounded-2xl p-5 sm:p-8 border-2 border-[var(--border-strong)] shadow-[4px_4px_0_var(--surface-2)] flex flex-col relative overflow-hidden">
                    <div className="h-1 w-full bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--accent-light)] absolute top-0 left-0" />

                    <div className="flex items-center gap-4 p-4 sm:p-5 mb-5 sm:mb-8 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--surface)] shadow-[2px_2px_0_var(--border-strong)] mt-2">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[var(--background)] flex items-center justify-center shrink-0 border-2 border-[var(--border-strong)]">
                            <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--primary)]" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-1 font-display">
                                Nama Bidang (Paten)
                            </p>
                            <h3 className="text-lg sm:text-xl font-black text-[var(--text-primary)] font-display flex items-center gap-3">
                                {editItem.name}
                                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-[var(--border-strong)] shadow-[1px_1px_0_var(--border-strong)]" style={{ backgroundColor: editItem.color }}></div>
                            </h3>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                        <div className="space-y-5 sm:space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-[var(--text-primary)] mb-2 font-display uppercase tracking-widest">
                                    Deskripsi Bidang
                                </label>
                                <textarea
                                    className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all text-xs sm:text-sm font-medium placeholder-[var(--text-muted)] leading-relaxed"
                                    rows={8}
                                    value={form.description}
                                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    style={{ resize: 'vertical' }}
                                    placeholder="Tuliskan gambaran dan cakupan kerja bidang..."
                                />
                            </div>
                        </div>

                        <div className="space-y-5 sm:space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-[var(--text-primary)] mb-2 font-display uppercase tracking-widest flex items-center gap-1.5">
                                    <ImageIcon className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" /> URL Foto Identitas Bidang
                                </label>
                                <textarea
                                    className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all text-xs font-mono font-medium placeholder-[var(--text-muted)]"
                                    rows={3}
                                    value={form.photo}
                                    onChange={e => setForm(f => ({ ...f, photo: e.target.value }))}
                                    placeholder="https://..."
                                    style={{ resize: 'vertical' }}
                                />
                                {form.photo && (
                                    <div className="mt-4 relative w-full aspect-video rounded-xl overflow-hidden border-2 border-[var(--border-strong)] bg-[var(--surface)] shadow-[3px_3px_0_var(--surface-2)]">
                                        <img src={form.photo} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
                                    </div>
                                )}
                            </div>

                            <div className="pt-5 border-t-2 border-dashed border-[var(--border-strong)]">
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="w-full py-3.5 px-4 bg-[var(--primary)] text-white text-xs font-black tracking-widest uppercase rounded-xl border-2 border-transparent hover:border-[var(--mk-ink)] shadow-[3px_3px_0_rgba(200,16,46,0.2)] hover:shadow-[3px_3px_0_var(--mk-ink)] transition-all flex justify-center items-center gap-2 cursor-pointer font-display hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                                >
                                    {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                                    {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
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
                        Kelola Bidang
                        <span className="bg-[var(--primary)] text-white text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider border-2 border-[var(--primary-dark)] shadow-[2px_2px_0_rgba(200,16,46,0.3)]">
                            {items.length} Paten
                        </span>
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5 font-medium">
                        Perbarui deskripsi dan visualisasi struktur bidang
                    </p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button
                        onClick={fetchDivisions}
                        className="p-3 bg-[var(--surface)] border-2 border-[var(--border-strong)] text-[var(--text-primary)] hover:text-[var(--primary)] hover:border-[var(--primary)] hover:shadow-[3px_3px_0_rgba(200,16,46,0.15)] rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 text-xs font-black tracking-widest uppercase font-display hover:-translate-y-0.5 w-full sm:w-auto"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        <span className="hidden sm:inline">Refresh Data</span>
                    </button>
                </div>
            </div>

            <div className="bg-blue-50/50 border-2 border-blue-200 shadow-[3px_3px_0_#bfdbfe] p-4 sm:p-5 rounded-2xl flex gap-3.5 items-start">
                <div className="bg-blue-600 text-white p-1.5 rounded-lg shrink-0 border-2 border-blue-700">
                    <Info className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <p className="text-xs sm:text-sm text-blue-900 leading-relaxed font-medium mt-0.5">
                    <strong className="font-black uppercase tracking-wider text-blue-950 font-display text-[11px] sm:text-xs block mb-1">Struktur Bidang Paten</strong>
                    Penambahan atau penghapusan bidang dinonaktifkan karena struktur kepemimpinan bersifat tetap (10 Bidang). Anda hanya dapat mengedit deskripsi tugas dan foto dokumentasi tiap bidang.
                </p>
            </div>

            <div className="bg-[var(--card)] rounded-2xl border-2 border-[var(--border-strong)] overflow-hidden shadow-[4px_4px_0_var(--surface-2)]">
                <div className="p-4 sm:p-5 border-b-2 border-[var(--border-strong)] bg-[var(--surface)]">
                    <div className="relative w-full sm:w-80 group">
                        <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[var(--primary)] transition-colors" />
                        <input
                            type="text"
                            placeholder="Cari nama bidang..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--background)] text-[var(--text-primary)] font-bold placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all text-xs sm:text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto w-full scrollbar-none">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                        <tr className="bg-[var(--surface)] border-b-2 border-[var(--border-strong)] text-[10px] sm:text-xs text-[var(--text-primary)] uppercase tracking-widest font-display">
                            <th className="p-4 sm:p-5 font-black pl-5 sm:pl-6 min-w-[220px]">Detail Bidang</th>
                            <th className="p-4 sm:p-5 font-black hidden md:table-cell">Deskripsi Terkini</th>
                            <th className="p-4 sm:p-5 font-black text-right pr-5 sm:pr-6">Aksi</th>
                        </tr>
                        </thead>
                        <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={3} className="text-center py-16 text-[var(--text-muted)] font-display text-sm font-black uppercase tracking-widest">
                                    <div className="flex items-center justify-center gap-3">
                                        <RefreshCw className="w-5 h-5 animate-spin text-[var(--primary)]" />
                                        Memuat Data...
                                    </div>
                                </td>
                            </tr>
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="text-center py-16 text-[var(--text-muted)] text-sm font-black uppercase tracking-widest">
                                    Data bidang tidak ditemukan.
                                </td>
                            </tr>
                        ) : (
                            filtered.map(d => (
                                <tr key={d.id} className="border-b-2 border-[var(--border-strong)] last:border-b-0 hover:bg-[var(--surface-2)] transition-colors group">
                                    <td className="p-4 sm:p-5 pl-5 sm:pl-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[var(--background)] overflow-hidden shrink-0 border-2 border-[var(--border-strong)] shadow-[2px_2px_0_var(--border-strong)] relative flex items-center justify-center">
                                                {d.photo ? (
                                                    <img src={d.photo} alt={d.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Briefcase className="w-6 h-6 text-[var(--text-muted)] opacity-50" />
                                                )}
                                                <div
                                                    className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 rounded-tl-lg border-t-2 border-l-2 border-[var(--border-strong)]"
                                                    style={{ background: d.color || 'var(--primary)' }}
                                                />
                                            </div>
                                            <div>
                                                <span className="font-black text-xs sm:text-sm text-[var(--text-primary)] font-display block uppercase tracking-wide">
                                                    {d.name}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 sm:p-5 text-xs text-[var(--text-secondary)] leading-relaxed hidden md:table-cell max-w-[350px] font-medium">
                                        <p className="line-clamp-2">{d.description || <span className="italic text-[var(--text-muted)]">Belum ada deskripsi yang ditambahkan.</span>}</p>
                                    </td>
                                    <td className="p-4 sm:p-5 pr-5 sm:pr-6 text-right">
                                        <button
                                            onClick={() => startEdit(d)}
                                            className="px-4 py-2 text-[10px] sm:text-[11px] font-black font-display uppercase tracking-widest text-[var(--primary)] hover:text-white border-2 border-[var(--primary)] hover:bg-[var(--primary)] rounded-xl transition-all cursor-pointer inline-flex items-center gap-2 shadow-[2px_2px_0_rgba(200,16,46,0.2)] hover:shadow-[3px_3px_0_rgba(200,16,46,0.4)] hover:-translate-y-0.5"
                                        >
                                            <Edit2 className="w-3.5 h-3.5 stroke-[3px]" /> Edit
                                        </button>
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