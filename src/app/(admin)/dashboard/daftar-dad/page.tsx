'use client'

import { useState, useEffect } from 'react'
import {
    Search,
    Trash2,
    CheckCircle2,
    Clock,
    XCircle,
    Eye,
    X,
    Filter,
    Calendar,
    RefreshCw,
    Download,
    AlertTriangle,
    MapPin,
    Home,
    Settings
} from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

export interface DadRegistrant {
    id: string
    namaLengkap: string
    asal: string
    tempatTanggalLahir: string
    domisili: string
    asalKomisariat: string
    prodi: string
    status: 'pending' | 'verified' | 'rejected'
    createdAt: string
}

export default function AdminDaftarDadPage() {
    const [registrants, setRegistrants] = useState<DadRegistrant[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')

    const [isRegistrationOpen, setIsRegistrationOpen] = useState<boolean>(false)
    const [isToggling, setIsToggling] = useState<boolean>(false)

    const [selectedItem, setSelectedItem] = useState<DadRegistrant | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        fetchRegistrants()
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('site_settings')
                .select('value')
                .eq('key', 'is_dad_open')
                .maybeSingle()

            if (error) {
                console.warn('Peringatan: Tabel site_settings belum ada atau akses ditolak.', error.message || error)
                return
            }

            if (data) {
                setIsRegistrationOpen(data.value)
            }
        } catch (error: any) {
            console.error('Gagal memuat pengaturan pendaftaran:', error.message || error)
        }
    }

    const logActivity = async (action: string, target: string, type: string) => {
        try {
            const savedRole = localStorage.getItem('userRole')
            const adminName = savedRole === 'superadmin' ? 'Super Admin' : (savedRole?.toUpperCase() || 'Admin')

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

    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value === 'open'
        setIsToggling(true)
        try {
            const { error } = await supabase
                .from('site_settings')
                .upsert({ key: 'is_dad_open', value: newStatus })

            if (error) throw error
            setIsRegistrationOpen(newStatus)

            await logActivity(
                newStatus ? 'membuka' : 'menutup',
                'Pendaftaran DAD',
                'settings'
            )

        } catch (error: any) {
            alert(`Gagal mengubah status pendaftaran: ${error.message}`)
        } finally {
            setIsToggling(false)
        }
    }

    const fetchRegistrants = async () => {
        setIsLoading(true)
        try {
            const { data, error } = await supabase
                .from('dad_registrations')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error

            if (data) {
                const formattedData: DadRegistrant[] = data.map((item: any) => ({
                    id: item.id,
                    namaLengkap: item.nama_lengkap || '-',
                    asal: item.asal || '-',
                    tempatTanggalLahir: item.tempat_tanggal_lahir || '-',
                    domisili: item.domisili || '-',
                    asalKomisariat: item.asal_komisariat || '-',
                    prodi: item.prodi || '-',
                    status: item.status || 'pending',
                    createdAt: item.created_at
                        ? new Date(item.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })
                        : '-'
                }))
                setRegistrants(formattedData)
            }
        } catch (error: any) {
            console.error('Gagal mengambil data pendaftar DAD:', error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const filteredList = registrants.filter(item => {
        const matchesSearch =
            item.namaLengkap.toLowerCase().includes(search.toLowerCase()) ||
            item.asalKomisariat.toLowerCase().includes(search.toLowerCase()) ||
            item.prodi.toLowerCase().includes(search.toLowerCase())

        const matchesStatus = statusFilter === 'all' || item.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const handleUpdateStatus = async (id: string, newStatus: 'pending' | 'verified' | 'rejected') => {
        setIsSaving(true)
        try {
            const { error } = await supabase
                .from('dad_registrations')
                .update({ status: newStatus })
                .eq('id', id)

            if (error) throw error

            setRegistrants(prev =>
                prev.map(item => (item.id === id ? { ...item, status: newStatus } : item))
            )

            const targetName = selectedItem?.namaLengkap || 'Pendaftar'
            const statusLabel = newStatus === 'pending' ? 'Menunggu' : newStatus === 'verified' ? 'Lolos Verifikasi' : 'Ditolak'
            await logActivity('mengubah status', `Peserta DAD (${targetName}) menjadi ${statusLabel}`, 'users')

            if (selectedItem && selectedItem.id === id) {
                setSelectedItem(prev => (prev ? { ...prev, status: newStatus } : null))
            }
        } catch (error: any) {
            alert(`Gagal memperbarui status verifikasi: ${error.message}`)
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const itemToDelete = registrants.find(item => item.id === id)
            const targetName = itemToDelete ? itemToDelete.namaLengkap : 'Data Pendaftar DAD'

            const { error } = await supabase.from('dad_registrations').delete().eq('id', id)
            if (error) throw error

            setRegistrants(prev => prev.filter(item => item.id !== id))
            setDeleteId(null)
            if (selectedItem?.id === id) setSelectedItem(null)

            await logActivity('menghapus', `Peserta DAD: ${targetName}`, 'users')

        } catch (error: any) {
            alert(`Gagal menghapus data pendaftar: ${error.message}`)
        }
    }

    const handleExportCSV = () => {
        const headers = 'ID,Nama Lengkap,Asal,Tempat & Tanggal Lahir,Domisili,Asal Komisariat,Prodi,Status,Tanggal Daftar\n'
        const rows = filteredList
            .map(
                r =>
                    `"${r.id}","${r.namaLengkap}","${r.asal}","${r.tempatTanggalLahir}","${r.domisili}","${r.asalKomisariat}","${r.prodi}","${r.status}","${r.createdAt}"`
            )
            .join('\n')

        const blob = new Blob([headers + rows], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `Pendaftar-DAD-${new Date().toISOString().slice(0, 10)}.csv`
        a.click()
    }

    return (
        <div className="space-y-4 sm:space-y-6 font-sans">

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 sm:gap-4 bg-[var(--card)] p-4 sm:p-6 rounded-2xl border border-[var(--border)] shadow-sm">
                <div>
                    <h2 className="text-lg sm:text-xl font-black text-[var(--text-primary)] font-display flex items-center gap-2">
                        Pendaftar DAD <span className="bg-[var(--primary)]/10 text-[var(--primary)] text-xs px-2.5 py-0.5 rounded-md font-bold">{registrants.length} Total</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5">
                        Kelola data dan verifikasi calon peserta Darul Arqam Dasar
                    </p>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-3 w-full lg:w-auto items-center">

                    <div className="flex items-center gap-2 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-3 py-2 shadow-sm shrink-0">
                        {isToggling ? (
                            <RefreshCw className="w-3.5 h-3.5 text-[var(--text-muted)] animate-spin" />
                        ) : (
                            <Settings className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                        )}
                        <select
                            value={isRegistrationOpen ? 'open' : 'closed'}
                            onChange={handleStatusChange}
                            disabled={isToggling}
                            className={`text-xs font-bold bg-transparent focus:outline-none cursor-pointer disabled:opacity-50 font-display outline-none ${isRegistrationOpen ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                        >
                            <option value="open" className="text-[var(--text-primary)] bg-[var(--card)]">Buka Pendaftaran</option>
                            <option value="closed" className="text-[var(--text-primary)] bg-[var(--card)]">Tutup Pendaftaran</option>
                        </select>
                    </div>

                    <div className="h-6 w-px bg-[var(--border)] hidden sm:block"></div>

                    <button
                        onClick={handleExportCSV}
                        className="flex-1 sm:flex-none py-2 sm:py-2.5 px-3.5 sm:px-4 bg-[var(--surface-2)] border border-[var(--border)] hover:bg-[var(--surface)] text-[var(--text-primary)] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm font-display cursor-pointer"
                    >
                        <Download className="w-3.5 h-3.5 text-[var(--primary)]" /> Ekspor CSV
                    </button>
                    <button
                        onClick={fetchRegistrants}
                        className="p-2 sm:p-2.5 bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--primary)] rounded-xl transition-colors cursor-pointer"
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
                        <h3 className="font-black text-lg font-display text-[var(--text-primary)] mb-1">Hapus Pendaftar?</h3>
                        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                            Data ini akan dihapus secara permanen dari sistem database.
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
                            placeholder="Cari nama, prodi, asal..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all text-xs sm:text-sm"
                        />
                    </div>

                    <div className="flex items-center gap-2.5 w-full md:w-auto">
                        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] shrink-0 font-medium font-display">
                            <Filter className="w-3.5 h-3.5" /> Filter:
                        </div>

                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            className="bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--text-primary)] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 cursor-pointer outline-none font-display w-full sm:w-auto"
                        >
                            <option value="all">Semua Status</option>
                            <option value="pending">Menunggu Verifikasi</option>
                            <option value="verified">Lolos Verifikasi</option>
                            <option value="rejected">Ditolak</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto w-full scrollbar-none">
                    {isLoading ? (
                        <div className="text-center py-12 text-[var(--text-muted)] font-display text-xs font-bold flex items-center justify-center gap-2">
                            <RefreshCw className="w-4 h-4 animate-spin text-[var(--primary)]" />
                            Memuat data pendaftar DAD...
                        </div>
                    ) : filteredList.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-xs sm:text-sm text-[var(--text-muted)] font-medium">Tidak ada data pendaftar DAD yang ditemukan.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse min-w-[650px]">
                            <thead>
                            <tr className="bg-[var(--surface-2)] border-b border-[var(--border)] text-[10px] sm:text-xs text-[var(--text-muted)] uppercase tracking-wider font-display">
                                <th className="p-3.5 sm:p-4 font-bold pl-5 sm:pl-6">Nama Lengkap</th>
                                <th className="p-3.5 sm:p-4 font-bold">Asal / Domisili</th>
                                <th className="p-3.5 sm:p-4 font-bold">Asal Komisariat</th>
                                <th className="p-3.5 sm:p-4 font-bold">Tanggal Daftar</th>
                                <th className="p-3.5 sm:p-4 font-bold">Status</th>
                                <th className="p-3.5 sm:p-4 font-bold text-right pr-5 sm:pr-6">Aksi</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredList.map(item => (
                                <tr key={item.id} className="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors group">
                                    <td className="p-3.5 sm:p-4 pl-5 sm:pl-6">
                                        <div>
                                                <span className="text-xs sm:text-sm font-bold text-[var(--text-primary)] font-display block">
                                                    {item.namaLengkap}
                                                </span>
                                            <span className="text-[10px] sm:text-[11px] text-[var(--text-muted)] mt-0.5 block">
                                                    Prodi: {item.prodi}
                                                </span>
                                        </div>
                                    </td>
                                    <td className="p-3.5 sm:p-4">
                                        <div className="flex flex-col gap-0.5 text-[10px] sm:text-[11px]">
                                                <span className="flex items-center gap-1 text-[var(--text-secondary)]">
                                                    <Home className="w-3 h-3 text-[var(--text-muted)] shrink-0" /> {item.asal}
                                                </span>
                                            <span className="flex items-center gap-1 text-[var(--text-secondary)]">
                                                    <MapPin className="w-3 h-3 text-[var(--text-muted)] shrink-0" /> {item.domisili}
                                                </span>
                                        </div>
                                    </td>
                                    <td className="p-3.5 sm:p-4">
                                            <span className="text-[9px] sm:text-[10px] font-bold text-[var(--primary)] font-display uppercase tracking-wider bg-[var(--primary)]/10 px-2.5 py-1 rounded-md border border-[var(--primary)]/20 whitespace-nowrap">
                                                {item.asalKomisariat}
                                            </span>
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
                                        {item.status === 'verified' && (
                                            <span className="px-2.5 py-1 rounded-md text-[9px] sm:text-[10px] font-bold uppercase tracking-widest border bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20 inline-flex items-center gap-1">
                                                    <CheckCircle2 className="w-3 h-3" /> Terverifikasi
                                                </span>
                                        )}
                                        {item.status === 'rejected' && (
                                            <span className="px-2.5 py-1 rounded-md text-[9px] sm:text-[10px] font-bold uppercase tracking-widest border bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 inline-flex items-center gap-1">
                                                    <XCircle className="w-3 h-3" /> Ditolak
                                                </span>
                                        )}
                                    </td>
                                    <td className="p-3.5 sm:p-4 pr-5 sm:pr-6 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button
                                                onClick={() => setSelectedItem(item)}
                                                className="p-1.5 sm:p-2 text-[var(--text-muted)] hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                                                title="Detail & Verifikasi"
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
                    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl max-w-lg w-full p-5 sm:p-6 md:p-8 shadow-2xl relative space-y-4 sm:space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto scrollbar-none">

                        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[var(--border)]">
                            <div>
                                <h3 className="text-sm sm:text-base font-black text-[var(--text-primary)] font-display uppercase tracking-wider">Detail Calon Peserta DAD</h3>
                            </div>
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                            <div className="bg-[var(--surface)] p-3.5 sm:p-4 rounded-xl border border-[var(--border)] space-y-2.5 sm:space-y-3 font-display">
                                <div>
                                    <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">Nama Lengkap</span>
                                    <span className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">{selectedItem.namaLengkap}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">Tempat, Tanggal Lahir</span>
                                        <span className="text-xs font-bold text-[var(--text-secondary)] mt-0.5 block">{selectedItem.tempatTanggalLahir}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">Program Studi</span>
                                        <span className="text-xs font-bold text-[var(--text-secondary)] mt-0.5 block">{selectedItem.prodi}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[var(--surface)] p-3.5 sm:p-4 rounded-xl border border-[var(--border)] space-y-2.5 sm:space-y-3 font-display">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">Asal</span>
                                        <span className="text-xs font-bold text-[var(--text-secondary)] mt-0.5 block">{selectedItem.asal}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">Asal Komisariat</span>
                                        <span className="text-xs font-bold text-[var(--primary)] mt-0.5 block">{selectedItem.asalKomisariat}</span>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">Domisili Saat Ini</span>
                                    <span className="text-xs font-bold text-[var(--text-secondary)] mt-0.5 block">{selectedItem.domisili}</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-[var(--border)]">
                            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase block mb-2 sm:mb-3 font-display tracking-wide">Verifikasi Kelayakan Peserta:</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleUpdateStatus(selectedItem.id, 'verified')}
                                    disabled={isSaving}
                                    className={`flex-1 py-2 sm:py-2.5 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer font-display flex items-center justify-center gap-1.5 ${
                                        selectedItem.status === 'verified'
                                            ? 'bg-green-600 text-white border-green-600 shadow-sm'
                                            : 'bg-[var(--surface-2)] text-[var(--text-primary)] border-[var(--border)] hover:bg-[var(--surface)]'
                                    }`}
                                >
                                    <CheckCircle2 className="w-4 h-4" /> Loloskan
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus(selectedItem.id, 'rejected')}
                                    disabled={isSaving}
                                    className={`flex-1 py-2 sm:py-2.5 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer font-display flex items-center justify-center gap-1.5 ${
                                        selectedItem.status === 'rejected'
                                            ? 'bg-red-600 text-white border-red-600 shadow-sm'
                                            : 'bg-[var(--surface-2)] text-[var(--text-primary)] border-[var(--border)] hover:bg-[var(--surface)]'
                                    }`}
                                >
                                    <XCircle className="w-4 h-4" /> Tolak
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )}

        </div>
    )
}