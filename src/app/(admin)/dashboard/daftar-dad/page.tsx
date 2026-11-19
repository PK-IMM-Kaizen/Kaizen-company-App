'use client'

import { useState, useEffect, useMemo } from 'react'
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
    MapPin,
    Home,
    Settings,
    Phone,
    FileText,
    IdCard,
    ExternalLink,
    QrCode,
    Image as ImageIcon,
    Users
} from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import Swal from 'sweetalert2'
import IdCardResult from '../../../(public)/daftar-dad/IdCardResult'
import type { IdCardInput } from '../../../(public)/daftar-dad/idCard'
import QrCodeModal from '../../../../components/modules/QrCodeModal'

export interface DadRegistrant {
    id: string
    namaLengkap: string
    nomorHp: string
    asal: string
    tempatLahir: string
    tanggalLahir: string
    tempatTanggalLahir: string
    nim: string
    alamat_sekarang: string
    prodi: string
    fotoUrl: string
    buktiPembayaranPath: string
    buktiPembayaranUrl: string | null
    status: 'pending' | 'verified' | 'rejected'
    createdAt: string
}

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

export default function AdminDaftarDadPage() {
    const [registrants, setRegistrants] = useState<DadRegistrant[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')

    const [isRegistrationOpen, setIsRegistrationOpen] = useState<boolean>(false)
    const [isToggling, setIsToggling] = useState<boolean>(false)

    const [selectedItem, setSelectedItem] = useState<DadRegistrant | null>(null)
    const [idCardItem, setIdCardItem] = useState<DadRegistrant | null>(null)
    const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null)
    const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false)

    const supabase = useMemo(
        () =>
            createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            ),
        []
    )

    useEffect(() => {
        fetchRegistrants()
        fetchSettings()
    }, [supabase])

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
            Toast.fire({ icon: 'error', title: `Gagal mengubah status pendaftaran: ${error.message}` })
        } finally {
            setIsToggling(false)
        }
    }

    const getPublicUrl = (bucket: string, path: string) => {
        if (!path) return ''
        if (path.startsWith('http://') || path.startsWith('https://')) return path
        const { data } = supabase.storage.from(bucket).getPublicUrl(path)
        return data.publicUrl
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
                const formattedData: DadRegistrant[] = data.map((item: any) => {
                    const fotoUrl = item.foto_url ? getPublicUrl('dad_photos', item.foto_url) : ''
                    const buktiUrl = item.bukti_pembayaran_path ? getPublicUrl('dad_payments', item.bukti_pembayaran_path) : null

                    return {
                        id: item.id,
                        namaLengkap: item.nama_lengkap || '-',
                        nomorHp: item.nomor_hp || '-',
                        asal: item.asal || '-',
                        tempatLahir: item.tempat_lahir || '',
                        tanggalLahir: item.tanggal_lahir || '',
                        tempatTanggalLahir: item.tempat_lahir && item.tanggal_lahir
                            ? `${item.tempat_lahir}, ${item.tanggal_lahir}`
                            : item.tempat_tanggal_lahir || '-',
                        nim: item.nim || '-',
                        alamat_sekarang: item.alamat_sekarang || '-',
                        prodi: item.prodi || '-',
                        fotoUrl: fotoUrl,
                        buktiPembayaranPath: item.bukti_pembayaran_path || '',
                        buktiPembayaranUrl: buktiUrl,
                        status: item.status || 'pending',
                        createdAt: item.created_at
                            ? new Date(item.created_at).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })
                            : '-'
                    }
                })
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
            item.nim.toLowerCase().includes(search.toLowerCase()) ||
            item.nomorHp.toLowerCase().includes(search.toLowerCase()) ||
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

            Toast.fire({ icon: 'success', title: 'Status berhasil diperbarui' })
        } catch (error: any) {
            Toast.fire({ icon: 'error', title: `Gagal memperbarui status: ${error.message}` })
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (id: string, namaLengkap: string) => {
        const confirm = await Swal.fire({
            title: 'Hapus Pendaftar?',
            text: `Data ${namaLengkap} akan dihapus secara permanen.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal'
        })

        if (!confirm.isConfirmed) return

        try {
            const { data, error } = await supabase
                .from('dad_registrations')
                .delete()
                .eq('id', id)
                .select()

            if (error) throw error

            if (!data || data.length === 0) {
                throw new Error('Akses ditolak oleh RLS Supabase. Tambahkan policy DELETE pada tabel.')
            }

            setRegistrants(prev => prev.filter(item => item.id !== id))
            if (selectedItem?.id === id) setSelectedItem(null)

            await logActivity('menghapus', `Peserta DAD: ${namaLengkap}`, 'users')

            Toast.fire({
                icon: 'success',
                title: 'Data berhasil dihapus'
            })
        } catch (error: any) {
            Toast.fire({
                icon: 'error',
                title: `Gagal menghapus data: ${error.message}`
            })
        }
    }

    const handleExportCSV = () => {
        const delimiter = ';'
        const headerArray = ['ID', 'Nama Lengkap', 'No. WhatsApp/HP', 'NIM', 'Asal', 'Tempat & Tanggal Lahir', 'Alamat Sekarang', 'Prodi', 'Status', 'Tanggal Daftar']
        const headers = headerArray.join(delimiter) + '\n'

        const rows = filteredList
            .map(r => {
                const clean = (text: string) => `"${String(text).replace(/"/g, '""')}"`
                return [
                    clean(r.id),
                    clean(r.namaLengkap),
                    clean(r.nomorHp),
                    clean(r.nim),
                    clean(r.asal),
                    clean(r.tempatTanggalLahir),
                    clean(r.alamat_sekarang),
                    clean(r.prodi),
                    clean(r.status),
                    clean(r.createdAt)
                ].join(delimiter)
            })
            .join('\n')

        const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' })

        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `Pendaftar-DAD-${new Date().toISOString().slice(0, 10)}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
    }

    const getIdCardData = (item: DadRegistrant): IdCardInput => ({
        nama: item.namaLengkap,
        nim: item.nim,
        prodi: item.prodi,
        alamat: item.alamat_sekarang,
        ttl: item.tempatTanggalLahir,
        fotoUrl: item.fotoUrl
    })

    return (
        <div className="space-y-6 font-sans animate-in fade-in duration-300">
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 bg-[var(--card)] p-5 sm:p-6 rounded-2xl border-2 border-[var(--border-strong)] shadow-[4px_4px_0_var(--surface-2)] relative overflow-hidden">
                <div className="h-1 w-full bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--accent-light)] absolute top-0 left-0" />
                <div>
                    <h2 className="text-lg sm:text-xl font-black text-[var(--text-primary)] font-display uppercase tracking-tight flex items-center gap-2.5">
                        <Users className="w-5 h-5 text-[var(--primary)] stroke-[2.5px]" />
                        Pendaftar DAD
                        <span className="bg-[var(--primary)]/10 border-2 border-[var(--primary)] text-[var(--primary)] text-[10px] px-2.5 py-1 rounded-lg font-black tracking-widest uppercase">
                            {registrants.length} Total
                        </span>
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5 font-medium ml-7">
                        Kelola data dan verifikasi calon peserta Darul Arqam Dasar
                    </p>
                </div>
                <div className="flex flex-wrap gap-3 w-full xl:w-auto items-center">
                    <div className="flex items-center gap-2 bg-[var(--surface)] border-2 border-[var(--border-strong)] rounded-xl px-3.5 py-2.5 shadow-[2px_2px_0_var(--surface-2)] shrink-0 h-[46px]">
                        {isToggling ? (
                            <RefreshCw className="w-4 h-4 text-[var(--text-muted)] animate-spin stroke-[2.5px]" />
                        ) : (
                            <Settings className="w-4 h-4 text-[var(--text-muted)] stroke-[2.5px]" />
                        )}
                        <select
                            value={isRegistrationOpen ? 'open' : 'closed'}
                            onChange={handleStatusChange}
                            disabled={isToggling}
                            className={`text-xs font-black bg-transparent focus:outline-none cursor-pointer disabled:opacity-50 font-display uppercase tracking-wider outline-none ${isRegistrationOpen ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                        >
                            <option value="open" className="text-[var(--text-primary)] bg-[var(--card)]">Buka Pendaftaran</option>
                            <option value="closed" className="text-[var(--text-primary)] bg-[var(--card)]">Tutup Pendaftaran</option>
                        </select>
                    </div>

                    <button
                        onClick={() => setIsQrModalOpen(true)}
                        className="flex-1 sm:flex-none h-[46px] px-4 bg-amber-500 text-white border-2 border-amber-600 hover:bg-amber-600 text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-[3px_3px_0_rgba(217,119,6,0.3)] hover:shadow-[3px_3px_0_var(--mk-ink)] font-display cursor-pointer hover:-translate-y-0.5"
                    >
                        <QrCode className="w-4 h-4 stroke-[2.5px]" /> <span className="hidden sm:inline">Cetak</span> QR Code
                    </button>

                    <button
                        onClick={handleExportCSV}
                        className="flex-1 sm:flex-none h-[46px] px-4 bg-[var(--surface)] border-2 border-[var(--border-strong)] text-[var(--text-primary)] hover:text-[var(--primary)] hover:border-[var(--primary)] text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-[3px_3px_0_rgba(200,16,46,0.1)] hover:shadow-[3px_3px_0_rgba(200,16,46,0.2)] font-display cursor-pointer hover:-translate-y-0.5"
                    >
                        <Download className="w-4 h-4 stroke-[2.5px]" /> Ekspor CSV
                    </button>

                    <button
                        onClick={fetchRegistrants}
                        className="h-[46px] w-[46px] flex items-center justify-center bg-[var(--surface)] border-2 border-[var(--border-strong)] text-[var(--text-primary)] hover:text-[var(--primary)] hover:border-[var(--primary)] rounded-xl transition-all cursor-pointer shadow-[3px_3px_0_rgba(0,0,0,0.05)] hover:-translate-y-0.5"
                        title="Segarkan Data"
                    >
                        <RefreshCw className={`w-4 h-4 stroke-[2.5px] ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            <div className="bg-[var(--card)] rounded-2xl border-2 border-[var(--border-strong)] overflow-hidden shadow-[4px_4px_0_var(--surface-2)]">
                <div className="p-4 sm:p-5 border-b-2 border-[var(--border-strong)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[var(--surface)] relative">
                    <div className="relative w-full md:w-96 group">
                        <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[var(--primary)] transition-colors stroke-[2.5px]" />
                        <input
                            type="text"
                            placeholder="Cari nama, NIM, no. HP, prodi..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--background)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all text-xs sm:text-sm font-bold"
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)] shrink-0 font-black uppercase tracking-widest font-display">
                            <Filter className="w-3.5 h-3.5 stroke-[2.5px]" /> Filter:
                        </div>
                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            className="bg-[var(--background)] border-2 border-[var(--border-strong)] text-xs font-bold text-[var(--text-primary)] rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] cursor-pointer outline-none font-display uppercase tracking-wider w-full sm:w-auto transition-all"
                        >
                            <option value="all">Semua Status</option>
                            <option value="pending">Menunggu</option>
                            <option value="verified">Terverifikasi</option>
                            <option value="rejected">Ditolak</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto w-full scrollbar-none">
                    {isLoading ? (
                        <div className="text-center py-16 text-[var(--text-muted)] font-display text-xs font-black uppercase tracking-widest flex flex-col items-center justify-center gap-3">
                            <RefreshCw className="w-6 h-6 animate-spin text-[var(--primary)] stroke-[2.5px]" />
                            Memuat data pendaftar DAD...
                        </div>
                    ) : filteredList.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-xs sm:text-sm text-[var(--text-muted)] font-black uppercase tracking-widest font-display">Tidak ada data pendaftar DAD yang ditemukan.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse min-w-[850px]">
                            <thead>
                            <tr className="bg-[var(--surface-2)] border-b-2 border-[var(--border-strong)] text-[10px] sm:text-xs text-[var(--text-primary)] uppercase tracking-widest font-black font-display">
                                <th className="p-4 sm:p-5 pl-5 sm:pl-6 w-[30%]">Nama & Kontak</th>
                                <th className="p-4 sm:p-5 w-[22%]">Kampus & Asal</th>
                                <th className="p-4 sm:p-5 w-[15%]">Tanggal Daftar</th>
                                <th className="p-4 sm:p-5 w-[15%]">Status</th>
                                <th className="p-4 sm:p-5 text-right pr-5 sm:pr-6 w-[18%]">Aksi</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredList.map(item => (
                                <tr key={item.id} className="border-b-2 border-dashed border-[var(--border-strong)] hover:bg-[var(--surface)] transition-colors group">
                                    <td className="p-4 sm:p-5 pl-5 sm:pl-6 align-top">
                                        <div className="flex items-start gap-3">
                                            {item.fotoUrl ? (
                                                <img
                                                    src={item.fotoUrl}
                                                    alt={item.namaLengkap}
                                                    className="w-12 h-12 rounded-xl object-cover shrink-0 border-2 border-[var(--border-strong)] shadow-[2px_2px_0_var(--border-strong)]"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-xl bg-[var(--surface-2)] flex items-center justify-center shrink-0 border-2 border-[var(--border-strong)] shadow-[2px_2px_0_var(--border-strong)] text-[var(--text-muted)] font-black text-sm uppercase">
                                                    {item.namaLengkap.charAt(0)}
                                                </div>
                                            )}
                                            <div>
                                                    <span className="text-sm font-black text-[var(--text-primary)] font-display block uppercase">
                                                        {item.namaLengkap}
                                                    </span>
                                                <a
                                                    href={`https://wa.me/${item.nomorHp.replace(/\D/g, '')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex mt-1.5 px-2 py-1 bg-green-500/10 border-2 border-green-500/30 text-green-700 dark:text-green-400 rounded-md text-[10px] font-black uppercase tracking-widest hover:bg-green-500 hover:text-white hover:border-green-600 transition-colors items-center gap-1.5"
                                                >
                                                    <Phone className="w-3 h-3 stroke-[2.5px]" /> {item.nomorHp}
                                                </a>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 sm:p-5 align-top">
                                        <div className="flex flex-col gap-1.5 text-[10px] sm:text-[11px] font-bold font-display tracking-wide uppercase">
                                                <span className="text-[var(--text-primary)]">
                                                    <span className="text-[var(--text-muted)] mr-1">NIM:</span> {item.nim}
                                                </span>
                                            <span className="text-[var(--text-secondary)]">
                                                    <span className="text-[var(--text-muted)] mr-1">PRODI:</span> {item.prodi}
                                                </span>
                                            <span className="flex items-center gap-1 text-[var(--text-secondary)] mt-1">
                                                    <Home className="w-3.5 h-3.5 shrink-0 stroke-[2.5px]" /> {item.asal}
                                                </span>
                                        </div>
                                    </td>
                                    <td className="p-4 sm:p-5 text-[11px] sm:text-xs text-[var(--text-primary)] font-bold whitespace-nowrap font-display align-top">
                                            <span className="flex items-center gap-2 mt-0.5 bg-[var(--surface-2)] px-2.5 py-1.5 rounded-lg border-2 border-[var(--border-strong)] inline-flex">
                                                <Calendar className="w-3.5 h-3.5 text-[var(--primary)] shrink-0 stroke-[2.5px]" /> {item.createdAt}
                                            </span>
                                    </td>
                                    <td className="p-4 sm:p-5 whitespace-nowrap align-top">
                                        <div className="mt-0.5">
                                            {item.status === 'pending' && (
                                                <span className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border-2 bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/40 inline-flex items-center gap-1.5 shadow-[2px_2px_0_rgba(249,115,22,0.2)]">
                                                        <Clock className="w-3.5 h-3.5 stroke-[2.5px]" /> Menunggu
                                                    </span>
                                            )}
                                            {item.status === 'verified' && (
                                                <span className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border-2 bg-green-100 text-green-800 border-green-300 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/40 inline-flex items-center gap-1.5 shadow-[2px_2px_0_rgba(34,197,94,0.2)]">
                                                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5px]" /> Lolos
                                                    </span>
                                            )}
                                            {item.status === 'rejected' && (
                                                <span className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border-2 bg-red-100 text-red-800 border-red-300 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/40 inline-flex items-center gap-1.5 shadow-[2px_2px_0_rgba(239,68,68,0.2)]">
                                                        <XCircle className="w-3.5 h-3.5 stroke-[2.5px]" /> Ditolak
                                                    </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 sm:p-5 pr-5 sm:pr-6 text-right align-top">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setIdCardItem(item)}
                                                className="p-2 bg-[var(--surface)] border-2 border-[var(--border-strong)] text-[var(--text-muted)] hover:text-amber-600 hover:border-amber-500 rounded-xl transition-all cursor-pointer shadow-[2px_2px_0_var(--surface-2)] hover:-translate-y-0.5"
                                                title="Lihat ID Card"
                                            >
                                                <IdCard className="w-4 h-4 stroke-[2.5px]" />
                                            </button>
                                            <button
                                                onClick={() => setSelectedItem(item)}
                                                className="p-2 bg-[var(--surface)] border-2 border-[var(--border-strong)] text-[var(--text-muted)] hover:text-blue-600 hover:border-blue-500 rounded-xl transition-all cursor-pointer shadow-[2px_2px_0_var(--surface-2)] hover:-translate-y-0.5"
                                                title="Detail & Verifikasi"
                                            >
                                                <Eye className="w-4 h-4 stroke-[2.5px]" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id, item.namaLengkap)}
                                                className="p-2 bg-[var(--surface)] border-2 border-[var(--border-strong)] text-[var(--text-muted)] hover:text-white hover:bg-[var(--primary)] hover:border-[var(--primary)] rounded-xl transition-all cursor-pointer shadow-[2px_2px_0_var(--surface-2)] hover:-translate-y-0.5"
                                                title="Hapus Data"
                                            >
                                                <Trash2 className="w-4 h-4 stroke-[2.5px]" />
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
                    <div className="bg-[var(--card)] border-2 border-[var(--border-strong)] rounded-2xl max-w-lg w-full p-5 sm:p-7 shadow-[8px_8px_0_var(--surface-2)] relative space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto scrollbar-none">
                        <div className="h-1.5 w-full bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--accent-light)] absolute top-0 left-0" />

                        <div className="flex items-center justify-between pb-4 border-b-2 border-dashed border-[var(--border-strong)]">
                            <div>
                                <h3 className="text-sm sm:text-base font-black text-[var(--text-primary)] font-display uppercase tracking-widest">Detail Calon Peserta</h3>
                            </div>
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] border-2 border-transparent hover:border-[var(--border-strong)] rounded-xl hover:bg-[var(--surface)] transition-all cursor-pointer"
                            >
                                <X className="w-5 h-5 stroke-[2.5px]" />
                            </button>
                        </div>

                        <div className="flex items-center gap-4 bg-[var(--surface)] p-4 rounded-xl border-2 border-[var(--border-strong)] shadow-[3px_3px_0_var(--surface-2)] font-display">
                            {selectedItem.fotoUrl ? (
                                <img
                                    src={selectedItem.fotoUrl}
                                    alt={selectedItem.namaLengkap}
                                    className="w-20 h-24 rounded-lg object-cover cursor-pointer border-2 border-[var(--border-strong)] shadow-sm hover:opacity-90 transition-opacity"
                                    onClick={() => setPreviewImage({ url: selectedItem.fotoUrl, title: `Foto ${selectedItem.namaLengkap}` })}
                                />
                            ) : (
                                <div className="w-20 h-24 rounded-lg bg-[var(--surface-2)] border-2 border-[var(--border-strong)] flex items-center justify-center text-[var(--text-muted)] font-black text-xs uppercase tracking-widest text-center">
                                    No Photo
                                </div>
                            )}
                            <div className="space-y-1.5 min-w-0 flex-1">
                                <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest block">Nama Lengkap</span>
                                <span className="text-sm sm:text-base font-black text-[var(--text-primary)] truncate block uppercase">{selectedItem.namaLengkap}</span>
                                <span className="inline-flex mt-1 px-2.5 py-1 bg-green-500/10 border-2 border-green-500/30 text-green-700 dark:text-green-400 rounded-md text-[10px] font-black uppercase tracking-widest items-center gap-1.5">
                                    <Phone className="w-3 h-3 stroke-[2.5px]" /> {selectedItem.nomorHp}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4 font-display">
                            <div className="bg-[var(--surface)] p-4 rounded-xl border-2 border-[var(--border-strong)] shadow-[3px_3px_0_var(--surface-2)] space-y-3">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest block mb-1">NIM</span>
                                        <span className="text-xs font-bold text-[var(--text-primary)] block uppercase">{selectedItem.nim}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest block mb-1">Program Studi</span>
                                        <span className="text-xs font-bold text-[var(--text-primary)] block uppercase">{selectedItem.prodi}</span>
                                    </div>
                                </div>
                                <div className="pt-3 border-t-2 border-dashed border-[var(--border-strong)]">
                                    <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest block mb-1">Tempat, Tanggal Lahir</span>
                                    <span className="text-xs font-bold text-[var(--text-secondary)] block uppercase">{selectedItem.tempatTanggalLahir}</span>
                                </div>
                            </div>

                            <div className="bg-[var(--surface)] p-4 rounded-xl border-2 border-[var(--border-strong)] shadow-[3px_3px_0_var(--surface-2)] space-y-3">
                                <div>
                                    <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest block mb-1">Asal Daerah</span>
                                    <span className="text-xs font-bold text-[var(--text-secondary)] block uppercase">{selectedItem.asal}</span>
                                </div>
                                <div className="pt-3 border-t-2 border-dashed border-[var(--border-strong)]">
                                    <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest block mb-1">Domisili Saat Ini</span>
                                    <span className="text-xs font-bold text-[var(--text-secondary)] block uppercase">{selectedItem.alamat_sekarang}</span>
                                </div>
                            </div>

                            <div className="bg-[var(--surface)] p-4 rounded-xl border-2 border-[var(--border-strong)] shadow-[3px_3px_0_var(--surface-2)] space-y-3 font-display">
                                <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest block">Bukti Pembayaran</span>
                                {selectedItem.buktiPembayaranUrl ? (
                                    <div className="flex items-center justify-between bg-[var(--background)] p-3 rounded-xl border-2 border-[var(--border-strong)]">
                                        <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-2 truncate uppercase">
                                            <FileText className="w-4 h-4 text-amber-500 shrink-0 stroke-[2.5px]" />
                                            Bukti Transfer
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setPreviewImage({ url: selectedItem.buktiPembayaranUrl!, title: `Bukti Pembayaran - ${selectedItem.namaLengkap}` })}
                                            className="px-3 py-1.5 bg-amber-500 text-white border-2 border-amber-600 hover:bg-amber-600 text-[10px] font-black rounded-lg transition-all flex items-center gap-1.5 shrink-0 cursor-pointer uppercase tracking-widest shadow-[2px_2px_0_rgba(217,119,6,0.3)] hover:-translate-y-0.5"
                                        >
                                            <ImageIcon className="w-3.5 h-3.5 stroke-[2.5px]" /> Lihat
                                        </button>
                                    </div>
                                ) : (
                                    <span className="text-xs text-[var(--text-muted)] italic font-bold block bg-[var(--background)] p-3 rounded-xl border-2 border-dashed border-[var(--border-strong)] text-center">Belum mengunggah bukti pembayaran</span>
                                )}
                            </div>
                        </div>

                        <div className="pt-4 border-t-2 border-dashed border-[var(--border-strong)] font-display">
                            <span className="text-[10px] font-black text-[var(--text-muted)] uppercase block mb-3 tracking-widest text-center">Verifikasi Kelayakan Peserta</span>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleUpdateStatus(selectedItem.id, 'verified')}
                                    disabled={isSaving}
                                    className={`flex-1 py-3 px-3 text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-xl border-2 transition-all cursor-pointer flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 ${
                                        selectedItem.status === 'verified'
                                            ? 'bg-green-600 text-white border-green-700 shadow-[3px_3px_0_var(--mk-ink)]'
                                            : 'bg-[var(--surface)] text-[var(--text-primary)] border-[var(--border-strong)] hover:border-green-600 hover:text-green-600 shadow-[3px_3px_0_rgba(0,0,0,0.05)]'
                                    }`}
                                >
                                    <CheckCircle2 className="w-4 h-4 stroke-[2.5px]" /> Loloskan
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus(selectedItem.id, 'rejected')}
                                    disabled={isSaving}
                                    className={`flex-1 py-3 px-3 text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-xl border-2 transition-all cursor-pointer flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 ${
                                        selectedItem.status === 'rejected'
                                            ? 'bg-red-600 text-white border-red-700 shadow-[3px_3px_0_var(--mk-ink)]'
                                            : 'bg-[var(--surface)] text-[var(--text-primary)] border-[var(--border-strong)] hover:border-[var(--primary)] hover:text-[var(--primary)] shadow-[3px_3px_0_rgba(0,0,0,0.05)]'
                                    }`}
                                >
                                    <XCircle className="w-4 h-4 stroke-[2.5px]" /> Tolak
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {idCardItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-[var(--card)] border-2 border-[var(--border-strong)] rounded-2xl max-w-sm w-full p-5 shadow-[8px_8px_0_var(--surface-2)] relative space-y-4 animate-in fade-in zoom-in-95 duration-200">
                        <div className="h-1.5 w-full bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--accent-light)] absolute top-0 left-0" />
                        <div className="flex items-center justify-between pb-4 border-b-2 border-dashed border-[var(--border-strong)] font-display">
                            <div>
                                <h3 className="text-xs sm:text-sm font-black text-[var(--text-primary)] uppercase tracking-widest">Pratinjau ID Card</h3>
                                <p className="text-[10px] font-bold text-[var(--text-muted)] mt-1 uppercase">{idCardItem.namaLengkap}</p>
                            </div>
                            <button
                                onClick={() => setIdCardItem(null)}
                                className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] border-2 border-transparent hover:border-[var(--border-strong)] rounded-xl hover:bg-[var(--surface)] transition-all cursor-pointer"
                            >
                                <X className="w-5 h-5 stroke-[2.5px]" />
                            </button>
                        </div>
                        <div className="py-2 flex justify-center">
                            <IdCardResult data={getIdCardData(idCardItem)} />
                        </div>
                    </div>
                </div>
            )}

            {previewImage && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
                    <div className="relative max-w-2xl w-full flex flex-col items-center">
                        <button
                            onClick={() => setPreviewImage(null)}
                            className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors cursor-pointer bg-black/50 rounded-full border-2 border-white/20 hover:border-white"
                        >
                            <X className="w-6 h-6 stroke-[2.5px]" />
                        </button>
                        <h4 className="text-white text-xs sm:text-sm font-black uppercase tracking-widest mb-4 font-display bg-black/50 px-4 py-2 rounded-xl border-2 border-white/20">{previewImage.title}</h4>
                        <img
                            src={previewImage.url}
                            alt={previewImage.title}
                            className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain border-4 border-white/20 shadow-2xl"
                        />
                        <a
                            href={previewImage.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 px-5 py-3 bg-white text-black hover:bg-gray-200 text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-xl transition-colors flex items-center gap-2 font-display border-2 border-transparent hover:border-gray-400 hover:-translate-y-0.5 shadow-[4px_4px_0_rgba(255,255,255,0.2)]"
                        >
                            <ExternalLink className="w-4 h-4 stroke-[2.5px]" /> Buka Ukuran Penuh
                        </a>
                    </div>
                </div>
            )}

            <QrCodeModal
                isOpen={isQrModalOpen}
                onClose={() => setIsQrModalOpen(false)}
            />
        </div>
    )
}