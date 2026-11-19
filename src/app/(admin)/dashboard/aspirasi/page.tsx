'use client'

import { useState, useEffect, useMemo } from 'react'
import {
    MessageSquare,
    Search,
    Trash2,
    CheckCircle2,
    Clock,
    AlertTriangle,
    Eye,
    X,
    Filter,
    Calendar,
    RefreshCw,
    UserCheck,
    UserX
} from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

export interface AspirasiItem {
    id: string | number
    name: string
    category: string
    isAnonymous: boolean
    message: string
    createdAt: string
    status: 'pending' | 'process' | 'resolved'
    adminNote?: string
}

export default function AdminAspirasiPage() {
    const [aspirasiList, setAspirasiList] = useState<AspirasiItem[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [categoryFilter, setCategoryFilter] = useState<string>('all')

    const [selectedItem, setSelectedItem] = useState<AspirasiItem | null>(null)
    const [deleteId, setDeleteId] = useState<string | number | null>(null)
    const [adminNoteInput, setAdminNoteInput] = useState('')

    const supabase = useMemo(
        () =>
            createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            ),
        []
    )

    useEffect(() => {
        fetchAspirasi()
    }, [supabase])

    const fetchAspirasi = async () => {
        setIsLoading(true)
        try {
            const { data, error } = await supabase
                .from('aspirations')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error

            if (data) {
                const formattedData: AspirasiItem[] = data.map((item: any) => ({
                    id: item.id,
                    name: item.nama || 'Anonim',
                    category: item.kategori || 'Lainnya',
                    isAnonymous: !item.nama || item.nama.toLowerCase() === 'anonim',
                    message: item.pesan || '',
                    createdAt: item.created_at
                        ? new Date(item.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })
                        : '-',
                    status: item.status || 'pending',
                    adminNote: item.admin_note || ''
                }))
                setAspirasiList(formattedData)
            }
        } catch (error: any) {
            console.error('Gagal mengambil data aspirasi:', error.message)
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
            console.error('Gagal merekam log ke Supabase:', error.message || error)
        }
    }

    const filteredList = useMemo(() => {
        return aspirasiList.filter(item => {
            const matchesSearch =
                item.message.toLowerCase().includes(search.toLowerCase()) ||
                item.name.toLowerCase().includes(search.toLowerCase()) ||
                String(item.id).toLowerCase().includes(search.toLowerCase())

            const matchesStatus = statusFilter === 'all' || item.status === statusFilter
            const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter

            return matchesSearch && matchesStatus && matchesCategory
        })
    }, [aspirasiList, search, statusFilter, categoryFilter])

    const handleUpdateStatus = async (id: string | number, newStatus: 'pending' | 'process' | 'resolved') => {
        setIsSaving(true)
        try {
            const { error } = await supabase
                .from('aspirations')
                .update({
                    status: newStatus,
                    admin_note: adminNoteInput
                })
                .eq('id', id)

            if (error) throw error

            setAspirasiList(prev =>
                prev.map(item =>
                    item.id === id ? { ...item, status: newStatus, adminNote: adminNoteInput } : item
                )
            )

            const statusLabel = newStatus === 'pending' ? 'Menunggu' : newStatus === 'process' ? 'Diproses' : 'Selesai'
            const targetName = selectedItem?.isAnonymous ? 'Anonim' : selectedItem?.name || 'Seseorang'
            await logActivity('memperbarui status & catatan pada', `Aspirasi ${targetName} menjadi ${statusLabel}`, 'aspirasi')

            if (selectedItem && selectedItem.id === id) {
                setSelectedItem(prev => (prev ? { ...prev, status: newStatus, adminNote: adminNoteInput } : null))
            }
        } catch (error: any) {
            alert(`Gagal memperbarui status: ${error.message}`)
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (id: string | number) => {
        try {
            const itemToDelete = aspirasiList.find(item => item.id === id)
            const targetName = itemToDelete ? (itemToDelete.isAnonymous ? 'Anonim' : itemToDelete.name) : 'Data Aspirasi'

            const { error } = await supabase.from('aspirations').delete().eq('id', id)
            if (error) throw error

            setAspirasiList(prev => prev.filter(item => item.id !== id))
            setDeleteId(null)
            if (selectedItem?.id === id) setSelectedItem(null)

            await logActivity('menghapus', `Aspirasi dari ${targetName}`, 'aspirasi')

        } catch (error: any) {
            alert(`Gagal menghapus aspirasi: ${error.message}`)
        }
    }

    return (
        <div className="space-y-5 sm:space-y-6 font-sans">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-5 bg-[var(--card)] p-5 sm:p-6 rounded-2xl border-2 border-[var(--border-strong)] shadow-[4px_4px_0_var(--surface-2)]">
                <div>
                    <h2 className="text-lg sm:text-xl font-black text-[var(--text-primary)] font-display uppercase tracking-tight flex items-center gap-2.5">
                        <span className="w-1.5 h-5 rounded-full bg-[var(--primary)] inline-block" />
                        Kotak Aspirasi
                        <span className="bg-[var(--accent-light)] text-[var(--mk-ink)] text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border border-[var(--mk-ink)]">
                            {aspirasiList.length} Total
                        </span>
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5 font-medium ml-4">
                        Kelola masukan, kritik, dan saran publik dari civitas akademika
                    </p>
                </div>
                <div className="flex gap-2.5 w-full sm:w-auto">
                    <button
                        onClick={fetchAspirasi}
                        className="p-3 bg-[var(--surface)] border-2 border-[var(--border-strong)] text-[var(--text-secondary)] hover:text-[var(--primary)] hover:border-[var(--primary)] rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_rgba(200,16,46,0.15)] cursor-pointer"
                        title="Segarkan Data"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {deleteId !== null && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-[var(--card)] rounded-2xl p-6 sm:p-8 max-w-sm w-full border-2 border-[var(--mk-ink)] shadow-[8px_8px_0_var(--mk-ink)] animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-14 h-14 rounded-2xl bg-[var(--error)]/10 border-2 border-[var(--error)]/30 flex items-center justify-center mb-5 rotate-3">
                            <AlertTriangle className="w-7 h-7 text-[var(--error)]" />
                        </div>
                        <h3 className="font-black text-xl font-display text-[var(--text-primary)] mb-2 uppercase tracking-tight">Hapus Aspirasi?</h3>
                        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-6 font-medium">
                            Data aspirasi ini akan dihapus secara permanen dari sistem website.
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
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-[var(--card)] rounded-2xl border-2 border-[var(--border-strong)] overflow-hidden shadow-[4px_4px_0_var(--surface-2)] flex flex-col relative">
                <div className="h-1 w-full bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--accent-light)]" />

                <div className="p-4 sm:p-5 border-b border-[var(--border)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[var(--surface)]">
                    <div className="relative w-full md:w-80 group">
                        <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[var(--primary)] transition-colors" />
                        <input
                            type="text"
                            placeholder="Cari nama, kata kunci..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 sm:py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--background)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all text-xs sm:text-sm font-medium"
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] shrink-0 font-bold font-display uppercase tracking-wider">
                            <Filter className="w-4 h-4" /> Filter:
                        </div>

                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            className="bg-[var(--background)] border-2 border-[var(--border-strong)] text-xs text-[var(--text-primary)] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] cursor-pointer outline-none shrink-0 font-medium transition-all"
                        >
                            <option value="all">Semua Status</option>
                            <option value="pending">Menunggu</option>
                            <option value="process">Diproses</option>
                            <option value="resolved">Selesai</option>
                        </select>

                        <select
                            value={categoryFilter}
                            onChange={e => setCategoryFilter(e.target.value)}
                            className="bg-[var(--background)] border-2 border-[var(--border-strong)] text-xs text-[var(--text-primary)] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] cursor-pointer outline-none max-w-[180px] truncate shrink-0 font-medium transition-all"
                        >
                            <option value="all">Semua Kategori</option>
                            <option value="Kritik & Saran Organisasi">Kritik & Saran</option>
                            <option value="Ide Program Kerja">Ide Program Kerja</option>
                            <option value="Fasilitas & Layanan">Fasilitas</option>
                            <option value="Aduan Khusus">Aduan Khusus</option>
                            <option value="Lainnya">Lainnya</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto w-full scrollbar-none">
                    {isLoading ? (
                        <div className="text-center py-16 text-[var(--text-muted)] font-display text-xs font-bold flex items-center justify-center gap-2 uppercase tracking-widest">
                            <RefreshCw className="w-5 h-5 animate-spin text-[var(--primary)]" />
                            Memuat data aspirasi...
                        </div>
                    ) : filteredList.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-14 h-14 bg-[var(--surface)] rounded-2xl flex items-center justify-center mb-3 text-[var(--text-muted)] border-2 border-[var(--border-strong)] shadow-[3px_3px_0_var(--border)] mx-auto">
                                <MessageSquare className="w-7 h-7" />
                            </div>
                            <h3 className="font-black text-xs sm:text-sm text-[var(--text-primary)] font-display uppercase tracking-wide mb-1">Tidak Ada Data</h3>
                            <p className="text-xs text-[var(--text-secondary)] font-medium">Tidak ada data aspirasi yang ditemukan.</p>
                        </div>
                    ) : (
                        <table className="admin-table min-w-[700px]">
                            <thead>
                            <tr>
                                <th className="pl-5 sm:pl-6">Pengirim</th>
                                <th>Kategori</th>
                                <th className="min-w-[260px]">Pesan</th>
                                <th>Tanggal</th>
                                <th>Status</th>
                                <th className="text-right pr-5 sm:pr-6">Aksi</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredList.map(item => (
                                <tr key={item.id} className="group">
                                    <td className="pl-5 sm:pl-6">
                                        {item.isAnonymous ? (
                                            <span className="text-xs font-bold text-[var(--text-muted)] flex items-center gap-1.5 italic font-display whitespace-nowrap">
                                                <UserX className="w-4 h-4 text-orange-500 shrink-0" /> Anonim
                                            </span>
                                        ) : (
                                            <span className="text-xs font-bold text-[var(--text-primary)] font-display flex items-center gap-1.5 whitespace-nowrap">
                                                <UserCheck className="w-4 h-4 text-[var(--primary)] shrink-0" /> {item.name}
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        <span className="text-[10px] font-black text-[var(--mk-ink)] font-display uppercase tracking-wider bg-[var(--accent-light)] px-2.5 py-1 rounded-md border border-[var(--mk-ink)] shadow-[2px_2px_0_var(--mk-ink)] whitespace-nowrap">
                                            {item.category.replace('Fasilitas & Layanan Kemahasiswaan', 'Fasilitas')}
                                        </span>
                                    </td>
                                    <td>
                                        <p className="text-xs text-[var(--text-secondary)] font-medium line-clamp-2 leading-relaxed">
                                            {item.message}
                                        </p>
                                    </td>
                                    <td className="text-xs text-[var(--text-muted)] font-bold whitespace-nowrap font-display">
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" /> {item.createdAt}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap">
                                        {item.status === 'pending' && (
                                            <span className="px-2.5 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest border-2 bg-orange-100 text-orange-800 border-orange-500 shadow-[2px_2px_0_#f97316] inline-flex items-center gap-1.5 font-display">
                                                <Clock className="w-3 h-3" /> Menunggu
                                            </span>
                                        )}
                                        {item.status === 'process' && (
                                            <span className="px-2.5 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest border-2 bg-blue-100 text-blue-800 border-blue-500 shadow-[2px_2px_0_#3b82f6] inline-flex items-center gap-1.5 font-display">
                                                <AlertTriangle className="w-3 h-3" /> Diproses
                                            </span>
                                        )}
                                        {item.status === 'resolved' && (
                                            <span className="px-2.5 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest border-2 bg-green-100 text-green-800 border-green-500 shadow-[2px_2px_0_#22c55e] inline-flex items-center gap-1.5 font-display">
                                                <CheckCircle2 className="w-3 h-3" /> Selesai
                                            </span>
                                        )}
                                    </td>
                                    <td className="pr-5 sm:pr-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedItem(item)
                                                    setAdminNoteInput(item.adminNote || '')
                                                }}
                                                className="p-2 text-[var(--text-muted)] hover:text-blue-600 hover:bg-blue-500/10 rounded-xl transition-colors cursor-pointer border-2 border-transparent hover:border-blue-500/30"
                                                title="Lihat Detail & Tindak Lanjut"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setDeleteId(item.id)}
                                                className="p-2 text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[var(--error)]/10 rounded-xl transition-colors cursor-pointer border-2 border-transparent hover:border-[var(--error)]/30"
                                                title="Hapus Data"
                                            >
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

            {selectedItem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-[var(--card)] border-2 border-[var(--mk-ink)] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-[8px_8px_0_var(--mk-ink)] relative space-y-5 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-4 border-b-2 border-dashed border-[var(--border-strong)]">
                            <div>
                                <span className="text-[10px] font-mono font-bold text-[var(--primary)] uppercase tracking-wider bg-[var(--primary)]/10 px-2 py-0.5 rounded border border-[var(--primary)]/20">ID: {selectedItem.id}</span>
                                <h3 className="text-base sm:text-lg font-black text-[var(--text-primary)] font-display uppercase tracking-tight mt-1.5">Detail Aspirasi</h3>
                            </div>
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-xl hover:bg-[var(--surface-2)] transition-all cursor-pointer border-2 border-transparent hover:border-[var(--border-strong)] hover:shadow-[2px_2px_0_var(--border)]"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 bg-[var(--surface)] p-4 rounded-xl border-2 border-[var(--border-strong)] text-xs font-display">
                            <div>
                                <span className="text-[var(--text-secondary)] block text-[10px] uppercase font-bold tracking-widest">Pengirim</span>
                                <span className="text-[var(--text-primary)] font-black text-sm block mt-1">
                                    {selectedItem.isAnonymous ? 'Anonim' : selectedItem.name}
                                </span>
                            </div>
                            <div>
                                <span className="text-[var(--text-secondary)] block text-[10px] uppercase font-bold tracking-widest">Kategori & Tanggal</span>
                                <span className="text-[var(--primary)] font-black text-sm block mt-1 truncate">{selectedItem.category}</span>
                                <span className="text-[10px] text-[var(--text-muted)] font-bold block mt-1">{selectedItem.createdAt}</span>
                            </div>
                        </div>

                        <div>
                            <span className="text-[10px] font-black text-[var(--text-primary)] uppercase block mb-2 font-display tracking-widest">Pesan / Masukan:</span>
                            <p className="text-sm text-[var(--text-primary)] leading-relaxed bg-[var(--surface-2)] p-4 rounded-xl border-2 border-[var(--border-strong)] whitespace-pre-line max-h-40 overflow-y-auto font-medium">
                                {selectedItem.message}
                            </p>
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-[var(--text-primary)] uppercase block mb-2 font-display tracking-widest">
                                Catatan Tindak Lanjut Admin:
                            </label>
                            <textarea
                                rows={3}
                                value={adminNoteInput}
                                onChange={e => setAdminNoteInput(e.target.value)}
                                placeholder="Tuliskan catatan progres, penyelesaian, atau balasan..."
                                className="w-full bg-[var(--surface)] border-2 border-[var(--border-strong)] rounded-xl p-4 text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] font-medium focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all resize-y"
                            />
                        </div>

                        <div className="pt-4 border-t-2 border-dashed border-[var(--border-strong)]">
                            <span className="text-[10px] font-black text-[var(--text-primary)] uppercase block mb-3 font-display tracking-widest">Ubah Status Progres:</span>
                            <div className="flex flex-wrap gap-2.5">
                                <button
                                    onClick={() => handleUpdateStatus(selectedItem.id, 'pending')}
                                    disabled={isSaving}
                                    className={`flex-1 py-3 px-3 text-xs font-black rounded-xl border-2 transition-all cursor-pointer font-display uppercase tracking-widest ${
                                        selectedItem.status === 'pending'
                                            ? 'bg-orange-500 text-white border-orange-700 shadow-[3px_3px_0_#9a3412] -translate-y-0.5'
                                            : 'bg-[var(--surface)] text-[var(--text-primary)] border-[var(--border-strong)] hover:border-[var(--mk-ink)] hover:shadow-[3px_3px_0_var(--border)]'
                                    }`}
                                >
                                    Menunggu
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus(selectedItem.id, 'process')}
                                    disabled={isSaving}
                                    className={`flex-1 py-3 px-3 text-xs font-black rounded-xl border-2 transition-all cursor-pointer font-display uppercase tracking-widest ${
                                        selectedItem.status === 'process'
                                            ? 'bg-blue-600 text-white border-blue-800 shadow-[3px_3px_0_#1e40af] -translate-y-0.5'
                                            : 'bg-[var(--surface)] text-[var(--text-primary)] border-[var(--border-strong)] hover:border-[var(--mk-ink)] hover:shadow-[3px_3px_0_var(--border)]'
                                    }`}
                                >
                                    Diproses
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus(selectedItem.id, 'resolved')}
                                    disabled={isSaving}
                                    className={`flex-1 py-3 px-3 text-xs font-black rounded-xl border-2 transition-all cursor-pointer font-display uppercase tracking-widest ${
                                        selectedItem.status === 'resolved'
                                            ? 'bg-green-500 text-white border-green-700 shadow-[3px_3px_0_#15803d] -translate-y-0.5'
                                            : 'bg-[var(--surface)] text-[var(--text-primary)] border-[var(--border-strong)] hover:border-[var(--mk-ink)] hover:shadow-[3px_3px_0_var(--border)]'
                                    }`}
                                >
                                    Selesai
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}