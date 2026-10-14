'use client'

import { useState, useEffect } from 'react'
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

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        fetchAspirasi()
    }, [])

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

    const filteredList = aspirasiList.filter(item => {
        const matchesSearch =
            item.message.toLowerCase().includes(search.toLowerCase()) ||
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            String(item.id).toLowerCase().includes(search.toLowerCase())

        const matchesStatus = statusFilter === 'all' || item.status === statusFilter
        const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter

        return matchesSearch && matchesStatus && matchesCategory
    })

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
        <div className="space-y-4 sm:space-y-6 font-sans">

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 bg-[var(--card)] p-4 sm:p-6 rounded-2xl border border-[var(--border)] shadow-sm">
                <div>
                    <h2 className="text-lg sm:text-xl font-black text-[var(--text-primary)] font-display flex items-center gap-2">
                        Kotak Aspirasi <span className="bg-[var(--primary)]/10 text-[var(--primary)] text-xs px-2.5 py-0.5 rounded-md font-bold">{aspirasiList.length} Total</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5">
                        Kelola masukan, kritik, dan saran publik dari civitas akademika
                    </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button
                        onClick={fetchAspirasi}
                        className="p-2.5 bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--primary)] rounded-xl transition-colors cursor-pointer"
                        title="Segarkan Data"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {deleteId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-[var(--card)] rounded-2xl p-6 sm:p-8 max-w-sm w-full border border-[var(--border)] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 border border-red-500/20 flex items-center justify-center mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-500" />
                        </div>
                        <h3 className="font-black text-lg font-display text-[var(--text-primary)] mb-1">Hapus Aspirasi?</h3>
                        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                            Data aspirasi ini akan dihapus secara permanen dari sistem website.
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
                <div className="p-3.5 sm:p-4 border-b border-[var(--border)] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4 bg-[var(--surface)]">
                    <div className="relative w-full md:w-80 group">
                        <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-[var(--primary)] transition-colors" />
                        <input
                            type="text"
                            placeholder="Cari nama, kata kunci..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all text-xs sm:text-sm"
                        />
                    </div>

                    <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] shrink-0 font-medium font-display">
                            <Filter className="w-3.5 h-3.5" /> Filter:
                        </div>

                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            className="bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--text-primary)] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 cursor-pointer outline-none shrink-0"
                        >
                            <option value="all">Semua Status</option>
                            <option value="pending">Menunggu</option>
                            <option value="process">Diproses</option>
                            <option value="resolved">Selesai</option>
                        </select>

                        <select
                            value={categoryFilter}
                            onChange={e => setCategoryFilter(e.target.value)}
                            className="bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--text-primary)] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 cursor-pointer outline-none max-w-[160px] truncate shrink-0"
                        >
                            <option value="all">Semua Kategori</option>
                            <option value="Kritik & Saran Organisasi">Kritik & Saran Organisasi</option>
                            <option value="Ide Program Kerja">Ide Program Kerja</option>
                            <option value="Fasilitas & Layanan">Fasilitas & Layanan</option>
                            <option value="Aduan Khusus">Aduan Khusus</option>
                            <option value="Lainnya">Lainnya</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto w-full scrollbar-none">
                    {isLoading ? (
                        <div className="text-center py-12 text-[var(--text-muted)] font-display text-xs font-bold flex items-center justify-center gap-2">
                            <RefreshCw className="w-4 h-4 animate-spin text-[var(--primary)]" />
                            Memuat data aspirasi...
                        </div>
                    ) : filteredList.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-xs sm:text-sm text-[var(--text-muted)] font-medium">Tidak ada data aspirasi yang ditemukan.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse min-w-[650px]">
                            <thead>
                            <tr className="bg-[var(--surface-2)] border-b border-[var(--border)] text-[10px] sm:text-xs text-[var(--text-muted)] uppercase tracking-wider font-display">
                                <th className="p-3.5 sm:p-4 font-bold pl-5 sm:pl-6">Pengirim</th>
                                <th className="p-3.5 sm:p-4 font-bold">Kategori</th>
                                <th className="p-3.5 sm:p-4 font-bold min-w-[240px]">Pesan</th>
                                <th className="p-3.5 sm:p-4 font-bold">Tanggal</th>
                                <th className="p-3.5 sm:p-4 font-bold">Status</th>
                                <th className="p-3.5 sm:p-4 font-bold text-right pr-5 sm:pr-6">Aksi</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredList.map(item => (
                                <tr key={item.id} className="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors group">
                                    <td className="p-3.5 sm:p-4 pl-5 sm:pl-6">
                                        {item.isAnonymous ? (
                                            <span className="text-xs font-semibold text-[var(--text-muted)] flex items-center gap-1.5 italic font-display whitespace-nowrap">
                                                    <UserX className="w-3.5 h-3.5 text-orange-500 shrink-0" /> Anonim
                                                </span>
                                        ) : (
                                            <span className="text-xs font-bold text-[var(--text-primary)] font-display flex items-center gap-1.5 whitespace-nowrap">
                                                    <UserCheck className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" /> {item.name}
                                                </span>
                                        )}
                                    </td>
                                    <td className="p-3.5 sm:p-4">
                                            <span className="text-[9px] sm:text-[10px] font-bold text-[var(--primary)] font-display uppercase tracking-wider bg-[var(--primary)]/10 px-2.5 py-1 rounded-md border border-[var(--primary)]/20 whitespace-nowrap">
                                                {item.category.replace('Fasilitas & Layanan Kemahasiswaan', 'Fasilitas')}
                                            </span>
                                    </td>
                                    <td className="p-3.5 sm:p-4">
                                        <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                                            {item.message}
                                        </p>
                                    </td>
                                    <td className="p-3.5 sm:p-4 text-xs text-[var(--text-muted)] font-medium whitespace-nowrap font-display">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" /> {item.createdAt}
                                            </span>
                                    </td>
                                    <td className="p-3.5 sm:p-4 whitespace-nowrap">
                                        {item.status === 'pending' && (
                                            <span className="px-2.5 py-1 rounded-md text-[9px] sm:text-[10px] font-bold uppercase tracking-widest border bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20 inline-flex items-center gap-1">
                                                    <Clock className="w-3 h-3" /> Menunggu
                                                </span>
                                        )}
                                        {item.status === 'process' && (
                                            <span className="px-2.5 py-1 rounded-md text-[9px] sm:text-[10px] font-bold uppercase tracking-widest border bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20 inline-flex items-center gap-1">
                                                    <AlertTriangle className="w-3 h-3" /> Diproses
                                                </span>
                                        )}
                                        {item.status === 'resolved' && (
                                            <span className="px-2.5 py-1 rounded-md text-[9px] sm:text-[10px] font-bold uppercase tracking-widest border bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20 inline-flex items-center gap-1">
                                                    <CheckCircle2 className="w-3 h-3" /> Selesai
                                                </span>
                                        )}
                                    </td>
                                    <td className="p-3.5 sm:p-4 pr-5 sm:pr-6 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button
                                                onClick={() => {
                                                    setSelectedItem(item)
                                                    setAdminNoteInput(item.adminNote || '')
                                                }}
                                                className="p-1.5 sm:p-2 text-[var(--text-muted)] hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                                                title="Lihat Detail & Tindak Lanjut"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setDeleteId(item.id)}
                                                className="p-1.5 sm:p-2 text-[var(--text-muted)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl max-w-lg w-full p-5 sm:p-6 md:p-8 shadow-2xl relative space-y-4 sm:space-y-5 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[var(--border)]">
                            <div>
                                <span className="text-[10px] font-mono font-bold text-[var(--primary)] uppercase tracking-wider">ID: {selectedItem.id}</span>
                                <h3 className="text-sm sm:text-base font-black text-[var(--text-primary)] font-display uppercase tracking-wider">Detail Aspirasi</h3>
                            </div>
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:gap-4 bg-[var(--surface)] p-3.5 sm:p-4 rounded-xl border border-[var(--border)] text-xs font-display">
                            <div>
                                <span className="text-[var(--text-muted)] block text-[10px] uppercase font-bold tracking-wider">Pengirim</span>
                                <span className="text-[var(--text-primary)] font-bold block mt-0.5 sm:mt-1">
                                    {selectedItem.isAnonymous ? 'Anonim' : selectedItem.name}
                                </span>
                            </div>
                            <div>
                                <span className="text-[var(--text-muted)] block text-[10px] uppercase font-bold tracking-wider">Kategori & Tanggal</span>
                                <span className="text-[var(--primary)] font-bold block mt-0.5 sm:mt-1 truncate">{selectedItem.category}</span>
                                <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">{selectedItem.createdAt}</span>
                            </div>
                        </div>

                        <div>
                            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase block mb-1.5 font-display tracking-wide">Pesan / Masukan:</span>
                            <p className="text-xs text-[var(--text-primary)] leading-relaxed bg-[var(--surface-2)] p-3.5 sm:p-4 rounded-xl border border-[var(--border)] whitespace-pre-line max-h-40 overflow-y-auto">
                                {selectedItem.message}
                            </p>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase block mb-1.5 font-display tracking-wide">
                                Catatan Tindak Lanjut Admin:
                            </label>
                            <textarea
                                rows={3}
                                value={adminNoteInput}
                                onChange={e => setAdminNoteInput(e.target.value)}
                                placeholder="Tuliskan catatan progres, penyelesaian, atau balasan..."
                                className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
                            />
                        </div>

                        <div className="pt-2 border-t border-[var(--border)]">
                            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase block mb-2 sm:mb-3 font-display tracking-wide">Ubah Status Progres:</span>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => handleUpdateStatus(selectedItem.id, 'pending')}
                                    disabled={isSaving}
                                    className={`flex-1 py-2 sm:py-2.5 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer font-display ${
                                        selectedItem.status === 'pending'
                                            ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                                            : 'bg-[var(--surface-2)] text-[var(--text-primary)] border-[var(--border)] hover:bg-[var(--surface)]'
                                    }`}
                                >
                                    Menunggu
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus(selectedItem.id, 'process')}
                                    disabled={isSaving}
                                    className={`flex-1 py-2 sm:py-2.5 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer font-display ${
                                        selectedItem.status === 'process'
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                            : 'bg-[var(--surface-2)] text-[var(--text-primary)] border-[var(--border)] hover:bg-[var(--surface)]'
                                    }`}
                                >
                                    Diproses
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus(selectedItem.id, 'resolved')}
                                    disabled={isSaving}
                                    className={`flex-1 py-2 sm:py-2.5 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer font-display ${
                                        selectedItem.status === 'resolved'
                                            ? 'bg-green-600 text-white border-green-600 shadow-sm'
                                            : 'bg-[var(--surface-2)] text-[var(--text-primary)] border-[var(--border)] hover:bg-[var(--surface)]'
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