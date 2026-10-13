'use client'

import { useState, useEffect } from 'react'
import { Edit2, ArrowLeft, Image as ImageIcon, Search, RefreshCw, Briefcase, Info } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

export interface Division {
    id: string
    name: string
    description: string
    color: string
    photo: string
}

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

            await fetchDivisions()
            setView('list')
        } catch (error: any) {
            alert(`Gagal menyimpan perubahan: ${error.message}`)
        } finally {
            setIsSaving(false)
        }
    }

    const filtered = items.filter(d => d.name.toLowerCase().includes(search.toLowerCase()))

    if (view === 'edit' && editItem) {
        return (
            <div className="p-4 md:p-6 animate-in fade-in duration-300">
                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={() => setView('list')}
                        className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--primary)] flex items-center gap-1.5 font-display transition-colors bg-[var(--surface)] px-3 py-1.5 rounded-lg border border-[var(--border)] cursor-pointer"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Kembali
                    </button>
                    <span className="text-[var(--border-strong)]">/</span>
                    <h2 className="text-sm font-black text-[var(--text-primary)] font-display uppercase tracking-wider">
                        Update Profil Bidang
                    </h2>
                </div>

                <div className="bg-[var(--card)] rounded-2xl p-6 md:p-8 border border-[var(--border)] max-w-3xl shadow-sm">
                    <div className="flex items-center gap-4 p-4 mb-6 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                        <div className="w-12 h-12 rounded-lg bg-[var(--surface-2)] flex items-center justify-center shrink-0 border border-[var(--border)]">
                            <Briefcase className="w-5 h-5 text-[var(--text-muted)]" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-0.5 font-display">Nama Bidang (Paten)</p>
                            <h3 className="text-lg font-black text-[var(--text-primary)] font-display flex items-center gap-2">
                                {editItem.name}
                                <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: editItem.color }}></div>
                            </h3>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">Deskripsi Bidang</label>
                                <textarea
                                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm leading-relaxed"
                                    rows={8}
                                    value={form.description}
                                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    style={{ resize: 'vertical' }}
                                    placeholder="Tuliskan gambaran dan cakupan kerja bidang..."
                                />
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide flex items-center gap-1.5">
                                    <ImageIcon className="w-4 h-4" /> URL Foto Identitas Bidang
                                </label>
                                <textarea
                                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-xs font-mono"
                                    rows={3}
                                    value={form.photo}
                                    onChange={e => setForm(f => ({ ...f, photo: e.target.value }))}
                                    placeholder="https://..."
                                    style={{ resize: 'vertical' }}
                                />
                                {form.photo && (
                                    <div className="mt-3 relative w-full aspect-video rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--surface)] shadow-sm">
                                        <img src={form.photo} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 flex gap-3 border-t border-[var(--border)] mt-6">
                                <button onClick={handleSave} disabled={isSaving} className="flex-1 py-3 px-4 bg-[var(--primary)] text-white text-xs font-bold tracking-widest uppercase rounded-xl shadow-md shadow-[var(--primary)]/20 hover:bg-[var(--primary-dark)] transition-all cursor-pointer disabled:opacity-50">
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
        <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[var(--card)] p-4 md:p-6 rounded-2xl border border-[var(--border)] shadow-sm mb-6">
                <div>
                    <h2 className="text-xl font-black text-[var(--text-primary)] font-display flex items-center gap-2">
                        Kelola Bidang <span className="bg-[var(--primary)]/10 text-[var(--primary)] text-xs px-2 py-1 rounded-md">{items.length} Paten</span>
                    </h2>
                    <p className="text-sm text-[var(--text-muted)] mt-1">Perbarui deskripsi dan foto visualisasi struktur bidang IMM Kaizen</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button
                        onClick={fetchDivisions}
                        className="p-2.5 bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--primary)] rounded-xl transition-colors cursor-pointer flex items-center gap-2 text-sm font-bold"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        <span className="hidden sm:inline">Refresh Data</span>
                    </button>
                </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 p-4 rounded-xl mb-6 flex gap-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                    <strong>Struktur Bidang Paten:</strong> Penambahan atau penghapusan bidang dinonaktifkan karena struktur Pimpinan Komisariat bersifat tetap (10 Bidang). Anda hanya dapat mengedit deskripsi tugas dan foto dokumentasi tiap bidang.
                </p>
            </div>

            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-[var(--border)] bg-[var(--surface)]">
                    <div className="relative w-full sm:w-80 group">
                        <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[var(--primary)] transition-colors" />
                        <input
                            type="text"
                            placeholder="Cari nama bidang..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-[var(--surface-2)] border-b border-[var(--border)] text-xs text-[var(--text-muted)] uppercase tracking-wider font-display">
                            <th className="p-4 font-bold pl-6">Detail Bidang</th>
                            <th className="p-4 font-bold hidden md:table-cell">Deskripsi Terkini</th>
                            <th className="p-4 font-bold text-right pr-6">Aksi</th>
                        </tr>
                        </thead>
                        <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={3} className="text-center py-12 text-[var(--text-muted)] font-display text-xs font-bold">
                                    <RefreshCw className="w-4 h-4 animate-spin text-[var(--primary)] mx-auto mb-2" />
                                    Memuat data bidang...
                                </td>
                            </tr>
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="text-center py-12 text-[var(--text-muted)] text-sm font-medium">
                                    Data bidang tidak ditemukan.
                                </td>
                            </tr>
                        ) : (
                            filtered.map(d => (
                                <tr key={d.id} className="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors group">
                                    <td className="p-4 pl-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-[var(--surface-2)] overflow-hidden flex-shrink-0 border border-[var(--border)] relative">
                                                {d.photo ? (
                                                    <img src={d.photo} alt={d.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Briefcase className="w-5 h-5 m-auto mt-3 text-[var(--text-muted)] opacity-50" />
                                                )}
                                                <div
                                                    className="absolute bottom-0 right-0 w-3 h-3 rounded-tl-md"
                                                    style={{ background: d.color || 'var(--primary)' }}
                                                />
                                            </div>
                                            <div>
                                                <span className="font-bold text-sm text-[var(--text-primary)] font-display block">
                                                    {d.name}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-xs text-[var(--text-secondary)] leading-relaxed hidden md:table-cell max-w-[400px]">
                                        <p className="line-clamp-2">{d.description || <span className="italic text-[var(--text-muted)]">Belum ada deskripsi.</span>}</p>
                                    </td>
                                    <td className="p-4 pr-6 text-right">
                                        <button
                                            onClick={() => startEdit(d)}
                                            className="px-3 py-1.5 text-[11px] font-bold font-display uppercase tracking-wider text-[var(--primary)] hover:text-white border border-[var(--primary)] hover:bg-[var(--primary)] rounded-lg transition-all cursor-pointer inline-flex items-center gap-1.5"
                                        >
                                            <Edit2 className="w-3 h-3" /> Edit Profil
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