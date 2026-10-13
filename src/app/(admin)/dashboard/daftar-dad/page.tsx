'use client'

import { useState, useEffect } from 'react'
import {
    GraduationCap,
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
    Phone,
    Mail,
    UserCheck,
    UserX,
    FileText
} from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

export interface DadRegistrant {
    id: string | number
    fullName: string
    nim: string
    faculty: string
    studyProgram: string
    semester: number
    phone: string
    email: string
    gender: string
    motivation: string
    status: 'pending' | 'verified' | 'rejected'
    createdAt: string
}

export default function AdminDaftarDadPage() {
    const [registrants, setRegistrants] = useState<DadRegistrant[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [facultyFilter, setFacultyFilter] = useState<string>('all')

    // State Modal Detail & Hapus
    const [selectedItem, setSelectedItem] = useState<DadRegistrant | null>(null)
    const [deleteId, setDeleteId] = useState<string | number | null>(null)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        fetchRegistrants()
    }, [])

    const fetchRegistrants = async () => {
        setIsLoading(true)
        try {
            const { data, error } = await supabase
                .from('dad_registrants')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error

            if (data) {
                const formattedData: DadRegistrant[] = data.map((item: any) => ({
                    id: item.id,
                    fullName: item.full_name || '',
                    nim: item.nim || '',
                    faculty: item.faculty || 'Teknik',
                    studyProgram: item.study_program || '',
                    semester: item.semester || 1,
                    phone: item.phone || '',
                    email: item.email || '',
                    gender: item.gender || 'Laki-laki',
                    motivation: item.motivation || '',
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

    // Filtering Data
    const filteredList = registrants.filter(item => {
        const matchesSearch =
            item.fullName.toLowerCase().includes(search.toLowerCase()) ||
            item.nim.toLowerCase().includes(search.toLowerCase()) ||
            item.studyProgram.toLowerCase().includes(search.toLowerCase()) ||
            String(item.id).toLowerCase().includes(search.toLowerCase())

        const matchesStatus = statusFilter === 'all' || item.status === statusFilter
        const matchesFaculty = facultyFilter === 'all' || item.faculty === facultyFilter

        return matchesSearch && matchesStatus && matchesFaculty
    })

    // Update Status Verifikasi ke Supabase
    const handleUpdateStatus = async (id: string | number, newStatus: 'pending' | 'verified' | 'rejected') => {
        setIsSaving(true)
        try {
            const { error } = await supabase
                .from('dad_registrants')
                .update({
                    status: newStatus,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)

            if (error) throw error

            setRegistrants(prev =>
                prev.map(item => (item.id === id ? { ...item, status: newStatus } : item))
            )

            if (selectedItem && selectedItem.id === id) {
                setSelectedItem(prev => (prev ? { ...prev, status: newStatus } : null))
            }
        } catch (error: any) {
            alert(`Gagal memperbarui status verifikasi: ${error.message}`)
        } finally {
            setIsSaving(false)
        }
    }

    // Hapus Data Pendaftar
    const handleDelete = async (id: string | number) => {
        try {
            const { error } = await supabase.from('dad_registrants').delete().eq('id', id)
            if (error) throw error

            setRegistrants(prev => prev.filter(item => item.id !== id))
            setDeleteId(null)
            if (selectedItem?.id === id) setSelectedItem(null)
        } catch (error: any) {
            alert(`Gagal menghapus data pendaftar: ${error.message}`)
        }
    }

    // Ekspor Data CSV
    const handleExportCSV = () => {
        const headers = 'ID,Nama Lengkap,NIM,Fakultas,Prodi,Semester,Gender,No HP,Email,Status,Tanggal Daftar\n'
        const rows = filteredList
            .map(
                r =>
                    `"${r.id}","${r.fullName}","${r.nim}","${r.faculty}","${r.studyProgram}",${r.semester},"${r.gender}","${r.phone}","${r.email}","${r.status}","${r.createdAt}"`
            )
            .join('\n')

        const blob = new Blob([headers + rows], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `Pendaftar-DAD-Kaizen-${new Date().toISOString().slice(0, 10)}.csv`
        a.click()
    }

    return (
        <div className="p-4 md:p-6 animate-in fade-in duration-300">

            {/* HEADER JUDUL */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[var(--card)] p-4 md:p-6 rounded-2xl border border-[var(--border)] shadow-sm mb-6">
                <div>
                    <h2 className="text-xl font-black text-[var(--text-primary)] font-display flex items-center gap-2">
                        Pendaftar DAD <span className="bg-[var(--primary)]/10 text-[var(--primary)] text-xs px-2.5 py-1 rounded-md font-bold">{registrants.length} Total</span>
                    </h2>
                    <p className="text-sm text-[var(--text-muted)] mt-1">Verifikasi berkas dan kelayakan calon kader Darul Arqam Dasar</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button
                        onClick={handleExportCSV}
                        className="py-2.5 px-4 bg-[var(--surface-2)] border border-[var(--border)] hover:bg-[var(--surface)] text-[var(--text-primary)] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm font-display cursor-pointer"
                    >
                        <Download className="w-4 h-4 text-[var(--primary)]" /> Ekspor CSV
                    </button>
                    <button
                        onClick={fetchRegistrants}
                        className="p-2.5 bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--primary)] rounded-xl transition-colors cursor-pointer"
                        title="Segarkan Data"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* MODAL KONFIRMASI HAPUS */}
            {deleteId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="bg-[var(--card)] rounded-2xl p-6 md:p-8 max-w-sm w-full border border-[var(--border)] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-12 h-12 rounded-full bg-red-100/10 border border-red-500/20 flex items-center justify-center mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-500" />
                        </div>
                        <h3 className="font-black text-lg font-display text-[var(--text-primary)] mb-2">Hapus Pendaftar?</h3>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-8">Data pendaftar DAD ini akan dihapus secara permanen dari sistem database.</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="flex-1 py-3 bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-primary)] text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-[var(--surface)] transition-all cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => handleDelete(deleteId)}
                                className="flex-1 py-3 bg-red-600 text-white text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-red-700 transition-all cursor-pointer"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* KONTEN TABEL & FILTER */}
            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm">

                {/* TOOLBAR FILTER */}
                <div className="px-5 py-4 border-b border-[var(--border)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[var(--surface)]">
                    <div className="relative w-full md:w-80 group">
                        <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[var(--primary)] transition-colors" />
                        <input
                            type="text"
                            placeholder="Cari nama, NIM, prodi..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all text-sm"
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] shrink-0 font-medium font-display">
                            <Filter className="w-3.5 h-3.5" /> Filter:
                        </div>

                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            className="bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--text-primary)] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 cursor-pointer"
                        >
                            <option value="all">Semua Status</option>
                            <option value="pending">Menunggu Verifikasi</option>
                            <option value="verified">Lolos Verifikasi</option>
                            <option value="rejected">Ditolak</option>
                        </select>

                        <select
                            value={facultyFilter}
                            onChange={e => setFacultyFilter(e.target.value)}
                            className="bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--text-primary)] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 cursor-pointer"
                        >
                            <option value="all">Semua Fakultas</option>
                            <option value="Teknik">Teknik</option>
                            <option value="FKIP">FKIP</option>
                            <option value="FIK">FIK</option>
                            <option value="FEB">FEB</option>
                            <option value="Lainnya">Lainnya</option>
                        </select>
                    </div>
                </div>

                {/* TABEL DATA */}
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="text-center py-16 text-[var(--text-muted)] font-display text-xs font-bold flex items-center justify-center gap-2">
                            <RefreshCw className="w-4 h-4 animate-spin text-[var(--primary)]" />
                            Memuat data pendaftar dari Supabase...
                        </div>
                    ) : filteredList.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-sm text-[var(--text-muted)] font-medium">Tidak ada data pendaftar DAD yang ditemukan.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="bg-[var(--surface-2)] border-b border-[var(--border)] text-xs text-[var(--text-muted)] uppercase tracking-wider font-display">
                                <th className="p-4 font-bold pl-6">NIM & Nama</th>
                                <th className="p-4 font-bold">Program Studi</th>
                                <th className="p-4 font-bold">Kontak</th>
                                <th className="p-4 font-bold">Tanggal Daftar</th>
                                <th className="p-4 font-bold">Status</th>
                                <th className="p-4 font-bold text-right pr-6">Aksi</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredList.map(item => (
                                <tr key={item.id} className="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors group">
                                    <td className="p-4 pl-6">
                                        <div>
                                                <span className="text-xs font-bold text-[var(--text-primary)] font-display block">
                                                    {item.fullName}
                                                </span>
                                            <span className="text-[11px] text-[var(--text-muted)] font-mono block mt-0.5">
                                                    NIM: {item.nim} • ({item.gender})
                                                </span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                            <span className="text-[10px] font-bold text-[var(--primary)] font-display uppercase tracking-wider bg-[var(--primary)]/10 px-2.5 py-1 rounded-md border border-[var(--primary)]/20 block w-fit">
                                                {item.studyProgram}
                                            </span>
                                        <span className="text-[11px] text-[var(--text-muted)] block mt-1">
                                                {item.faculty} • Sem {item.semester}
                                            </span>
                                    </td>
                                    <td className="p-4">
                                            <span className="text-xs text-[var(--text-secondary)] block flex items-center gap-1 font-medium">
                                                <Phone className="w-3 h-3 text-[var(--text-muted)]" /> {item.phone || '-'}
                                            </span>
                                        <span className="text-[11px] text-[var(--text-muted)] block truncate max-w-[160px]">
                                                {item.email || '-'}
                                            </span>
                                    </td>
                                    <td className="p-4 text-xs text-[var(--text-muted)] font-medium whitespace-nowrap font-display">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" /> {item.createdAt}
                                            </span>
                                    </td>
                                    <td className="p-4 whitespace-nowrap">
                                        {item.status === 'pending' && (
                                            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20 inline-flex items-center gap-1">
                                                    <Clock className="w-3 h-3" /> Menunggu
                                                </span>
                                        )}
                                        {item.status === 'verified' && (
                                            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20 inline-flex items-center gap-1">
                                                    <CheckCircle2 className="w-3 h-3" /> Terverifikasi
                                                </span>
                                        )}
                                        {item.status === 'rejected' && (
                                            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 inline-flex items-center gap-1">
                                                    <XCircle className="w-3 h-3" /> Ditolak
                                                </span>
                                        )}
                                    </td>
                                    <td className="p-4 pr-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setSelectedItem(item)}
                                                className="p-2 text-[var(--text-muted)] hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                                                title="Detail Berkas & Verifikasi"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setDeleteId(item.id)}
                                                className="p-2 text-[var(--text-muted)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
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

            {/* MODAL DETAIL PENDAFTAR & VERIFIKASI */}
            {selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">

                        <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
                            <div>
                                <span className="text-[10px] font-mono font-bold text-[var(--primary)] uppercase tracking-wider">ID: {selectedItem.id}</span>
                                <h3 className="text-base font-black text-[var(--text-primary)] font-display uppercase tracking-wider">Detail Calon Peserta DAD</h3>
                            </div>
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Profil Akademik */}
                        <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--border)] space-y-3 font-display">
                            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                                <div>
                                    <h4 className="font-bold text-sm text-[var(--text-primary)]">
                                        {selectedItem.fullName}
                                    </h4>
                                    <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">NIM: {selectedItem.nim}</p>
                                </div>
                                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[var(--surface-2)] text-[var(--primary)] border border-[var(--border)]">
                                    {selectedItem.gender}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div>
                                    <span className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-wider block">Fakultas / Prodi</span>
                                    <span className="text-[var(--text-primary)] font-bold block mt-0.5">{selectedItem.faculty}</span>
                                    <span className="text-[var(--text-secondary)]">{selectedItem.studyProgram} (Sem {selectedItem.semester})</span>
                                </div>
                                <div>
                                    <span className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-wider block">Kontak</span>
                                    <span className="text-[var(--text-primary)] font-bold block mt-0.5 flex items-center gap-1">
                                        <Phone className="w-3 h-3 text-[var(--primary)]" /> {selectedItem.phone || '-'}
                                    </span>
                                    <span className="text-[var(--text-secondary)] flex items-center gap-1 text-[11px] mt-0.5">
                                        <Mail className="w-3 h-3" /> {selectedItem.email || '-'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Esai Motivasi */}
                        <div>
                            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase block mb-1.5 font-display tracking-wide">Motivasi Mengikuti DAD:</span>
                            <p className="text-xs text-[var(--text-primary)] leading-relaxed bg-[var(--surface-2)] p-4 rounded-xl border border-[var(--border)] italic">
                                "{selectedItem.motivation || 'Tidak ada catatan motivasi'}"
                            </p>
                        </div>

                        {/* Action Status Buttons */}
                        <div className="pt-2 border-t border-[var(--border)]">
                            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase block mb-3 font-display tracking-wide">Verifikasi Kelayakan Peserta:</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleUpdateStatus(selectedItem.id, 'verified')}
                                    disabled={isSaving}
                                    className={`flex-1 py-2.5 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
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
                                    className={`flex-1 py-2.5 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
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