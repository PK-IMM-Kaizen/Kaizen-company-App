'use client'

import { useState } from 'react'
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
    FileText,
    Calendar,
    Phone,
    Mail,
    Download,
    AlertTriangle,
    UserCheck,
    Building2
} from 'lucide-react'

export interface DadRegistrant {
    id: string
    fullName: string
    nim: string
    faculty: string
    studyProgram: string
    semester: number
    phone: string
    email: string
    gender: 'Laki-laki' | 'Perempuan'
    motivation: string
    status: 'pending' | 'verified' | 'rejected'
    paymentProofUrl?: string
    createdAt: string
}

// Data Dummy Pendaftar DAD
const DUMMY_REGISTRANTS: DadRegistrant[] = [
    {
        id: 'DAD-2026-001',
        fullName: 'Rian Hidayat',
        nim: '20231234001',
        faculty: 'Teknik',
        studyProgram: 'Teknik Informatika',
        semester: 3,
        phone: '081234567891',
        email: 'rian.hidayat@student.um-surabaya.ac.id',
        gender: 'Laki-laki',
        motivation: 'Ingin mengasah jiwa kepemimpinan dan menambah jaringan relasi di IMM Kaizen.',
        status: 'verified',
        createdAt: '11 Oktober 2026'
    },
    {
        id: 'DAD-2026-002',
        fullName: 'Nabila Az-Zahra',
        nim: '20241234015',
        faculty: 'Teknik',
        studyProgram: 'Teknik Sipil',
        semester: 1,
        phone: '085712345678',
        email: 'nabila.azzahra@student.um-surabaya.ac.id',
        gender: 'Perempuan',
        motivation: 'Tertarik mengikuti proses perkaderan dan ingin aktif di bidang riset IMM.',
        status: 'pending',
        createdAt: '12 Oktober 2026'
    },
    {
        id: 'DAD-2026-003',
        fullName: 'Bagas Prasetyo',
        nim: '20221234088',
        faculty: 'Teknik',
        studyProgram: 'Teknik Mesin',
        semester: 5,
        phone: '089612349999',
        email: 'bagas.p@student.um-surabaya.ac.id',
        gender: 'Laki-laki',
        motivation: 'Ingin belajar organisasi dan manajemen waktu kuliah.',
        status: 'rejected',
        createdAt: '09 Oktober 2026'
    }
]

export default function AdminDaftarDadPage() {
    const [registrants, setRegistrants] = useState<DadRegistrant[]>(DUMMY_REGISTRANTS)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [facultyFilter, setFacultyFilter] = useState<string>('all')

    // State Modal & Detail
    const [selectedItem, setSelectedItem] = useState<DadRegistrant | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)

    // Filtering Data
    const filteredList = registrants.filter(item => {
        const matchesSearch =
            item.fullName.toLowerCase().includes(search.toLowerCase()) ||
            item.nim.toLowerCase().includes(search.toLowerCase()) ||
            item.id.toLowerCase().includes(search.toLowerCase()) ||
            item.studyProgram.toLowerCase().includes(search.toLowerCase())

        const matchesStatus = statusFilter === 'all' || item.status === statusFilter
        const matchesFaculty = facultyFilter === 'all' || item.faculty === facultyFilter

        return matchesSearch && matchesStatus && matchesFaculty
    })

    // Update Status Verifikasi Pendaftar
    const handleUpdateStatus = (id: string, newStatus: 'pending' | 'verified' | 'rejected') => {
        setRegistrants(prev =>
            prev.map(item => (item.id === id ? { ...item, status: newStatus } : item))
        )
        if (selectedItem && selectedItem.id === id) {
            setSelectedItem(prev => (prev ? { ...prev, status: newStatus } : null))
        }
    }

    // Hapus Data Pendaftar
    const handleDelete = (id: string) => {
        setRegistrants(prev => prev.filter(item => item.id !== id))
        setDeleteId(null)
        if (selectedItem?.id === id) setSelectedItem(null)
    }

    // Simulasi Ekspor CSV
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
        a.download = `Pendaftar-DAD-IMM-Kaizen-${new Date().toISOString().slice(0, 10)}.csv`
        a.click()
    }

    return (
        <div className="space-y-6">

            {/* HEADER JUDUL & TOMBOL EKSPOR */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-black text-[var(--text-primary)] font-display tracking-wide flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-[var(--primary)]" /> Pendaftar DAD (Darul Arqam Dasar)
                    </h2>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                        Verifikasi berkas, kelayakan calon kader, dan konfirmasi kelulusan administrasi DAD.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleExportCSV}
                        className="py-2 px-3.5 bg-[var(--surface-2)] border border-[var(--border)] hover:bg-[var(--surface)] text-[var(--text-primary)] text-xs font-bold rounded-lg transition-all flex items-center gap-2 shadow-sm font-display"
                    >
                        <Download className="w-3.5 h-3.5 text-[var(--primary)]" /> Ekspor CSV
                    </button>
                </div>
            </div>

            {/* RINGKASAN KUOTA & STATUS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-[var(--card)] p-4 rounded-xl border border-[var(--border)] shadow-sm">
                    <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">Total Pendaftar</span>
                    <span className="text-xl font-black text-[var(--text-primary)] font-display mt-1 block">{registrants.length}</span>
                </div>
                <div className="bg-[var(--card)] p-4 rounded-xl border border-[var(--border)] shadow-sm">
                    <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider block">Lolos Verifikasi</span>
                    <span className="text-xl font-black text-green-600 font-display mt-1 block">
                        {registrants.filter(r => r.status === 'verified').length}
                    </span>
                </div>
                <div className="bg-[var(--card)] p-4 rounded-xl border border-[var(--border)] shadow-sm">
                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Menunggu Verifikasi</span>
                    <span className="text-xl font-black text-amber-600 font-display mt-1 block">
                        {registrants.filter(r => r.status === 'pending').length}
                    </span>
                </div>
                <div className="bg-[var(--card)] p-4 rounded-xl border border-[var(--border)] shadow-sm">
                    <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider block">Ditolak</span>
                    <span className="text-xl font-black text-red-600 font-display mt-1 block">
                        {registrants.filter(r => r.status === 'rejected').length}
                    </span>
                </div>
            </div>

            {/* FILTER & PENCARIAN */}
            <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-4 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">

                {/* Search Bar */}
                <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Cari Nama, NIM, Prodi..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-[var(--surface-2)] border border-[var(--border)] rounded-lg text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all"
                    />
                </div>

                {/* Dropdown Filters */}
                <div className="flex items-center gap-3 w-full md:w-auto flex-wrap sm:flex-nowrap">
                    <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] shrink-0 font-medium">
                        <Filter className="w-3.5 h-3.5" /> Filter:
                    </div>

                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="bg-[var(--surface-2)] border border-[var(--border)] text-xs text-[var(--text-primary)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                    >
                        <option value="all">Semua Status</option>
                        <option value="pending">Menunggu Verifikasi</option>
                        <option value="verified">Lolos Verifikasi</option>
                        <option value="rejected">Ditolak</option>
                    </select>

                    <select
                        value={facultyFilter}
                        onChange={e => setFacultyFilter(e.target.value)}
                        className="bg-[var(--surface-2)] border border-[var(--border)] text-xs text-[var(--text-primary)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                    >
                        <option value="all">Semua Fakultas</option>
                        <option value="Teknik">Fakultas Teknik</option>
                        <option value="FKIP">FKIP</option>
                        <option value="FIK">FIK</option>
                        <option value="FEB">FEB</option>
                        <option value="Lainnya">Lainnya</option>
                    </select>
                </div>
            </div>

            {/* TABEL DATA PENDAFTAR */}
            <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-[var(--surface-2)] border-b border-[var(--border)] text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-display">
                            <th className="p-4">NIM & Nama</th>
                            <th className="p-4">Program Studi</th>
                            <th className="p-4">Kontak</th>
                            <th className="p-4">Tanggal Daftar</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-center">Aksi</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                        {filteredList.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-12 text-[var(--text-muted)] text-xs">
                                    Tidak ada data pendaftar DAD yang ditemukan.
                                </td>
                            </tr>
                        ) : (
                            filteredList.map(item => (
                                <tr key={item.id} className="hover:bg-[var(--surface)] transition-colors">
                                    <td className="p-4 whitespace-nowrap">
                                            <span className="font-bold text-xs text-[var(--text-primary)] block font-display">
                                                {item.fullName}
                                            </span>
                                        <span className="text-[10px] text-[var(--text-muted)] font-mono">
                                                NIM: {item.nim} • ({item.gender})
                                            </span>
                                    </td>
                                    <td className="p-4 whitespace-nowrap">
                                            <span className="text-xs font-semibold text-[var(--primary)] font-display block">
                                                {item.studyProgram}
                                            </span>
                                        <span className="text-[10px] text-[var(--text-muted)]">
                                                {item.faculty} • Sem {item.semester}
                                            </span>
                                    </td>
                                    <td className="p-4 whitespace-nowrap">
                                            <span className="text-xs text-[var(--text-secondary)] block flex items-center gap-1">
                                                <Phone className="w-3 h-3 text-[var(--text-muted)]" /> {item.phone}
                                            </span>
                                        <span className="text-[10px] text-[var(--text-muted)] block truncate max-w-[180px]">
                                                {item.email}
                                            </span>
                                    </td>
                                    <td className="p-4 whitespace-nowrap text-xs text-[var(--text-muted)]">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" /> {item.createdAt}
                                            </span>
                                    </td>
                                    <td className="p-4 whitespace-nowrap">
                                        {item.status === 'pending' && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-700 border border-orange-200">
                                                    <Clock className="w-3 h-3" /> Menunggu
                                                </span>
                                        )}
                                        {item.status === 'verified' && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-700 border border-green-200">
                                                    <CheckCircle2 className="w-3 h-3" /> Terverifikasi
                                                </span>
                                        )}
                                        {item.status === 'rejected' && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">
                                                    <XCircle className="w-3 h-3" /> Ditolak
                                                </span>
                                        )}
                                    </td>
                                    <td className="p-4 whitespace-nowrap text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => setSelectedItem(item)}
                                                className="p-1.5 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                                title="Lihat Detail Berkas"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setDeleteId(item.id)}
                                                className="p-1.5 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
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
                </div>
            </div>

            {/* MODAL DETAIL PENDAFTAR & VERIFIKASI */}
            {selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl max-w-lg w-full p-6 shadow-xl relative space-y-5 max-h-[90vh] overflow-y-auto">

                        <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
                            <div>
                                <span className="text-[10px] font-mono font-bold text-[var(--primary)] uppercase tracking-wider">
                                    {selectedItem.id}
                                </span>
                                <h3 className="text-sm font-black text-[var(--text-primary)] font-display">
                                    Detail Calon Peserta DAD
                                </h3>
                            </div>
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--surface-2)]"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Info Akademik */}
                        <div className="bg-[var(--surface)] p-4 rounded-lg border border-[var(--border)] space-y-3">
                            <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                                <div>
                                    <h4 className="font-bold text-sm text-[var(--text-primary)] font-display">
                                        {selectedItem.fullName}
                                    </h4>
                                    <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">NIM: {selectedItem.nim}</p>
                                </div>
                                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[var(--surface-2)] text-[var(--primary)] border border-[var(--border)] font-display">
                                    {selectedItem.gender}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                    <span className="text-[var(--text-muted)] text-[10px] font-bold uppercase block">Fakultas / Prodi</span>
                                    <span className="text-[var(--text-primary)] font-semibold block">{selectedItem.faculty}</span>
                                    <span className="text-[var(--text-secondary)]">{selectedItem.studyProgram} (Sem {selectedItem.semester})</span>
                                </div>
                                <div>
                                    <span className="text-[var(--text-muted)] text-[10px] font-bold uppercase block">Kontak</span>
                                    <span className="text-[var(--text-primary)] font-semibold block flex items-center gap-1">
                                        <Phone className="w-3 h-3 text-[var(--primary)]" /> {selectedItem.phone}
                                    </span>
                                    <span className="text-[var(--text-secondary)] flex items-center gap-1 text-[11px]">
                                        <Mail className="w-3 h-3" /> {selectedItem.email}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Esai Motivasi */}
                        <div>
                            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase block mb-1">Motivasi Mengikuti DAD:</span>
                            <p className="text-xs text-[var(--text-primary)] leading-relaxed bg-[var(--surface-2)] p-4 rounded-lg border border-[var(--border)] italic">
                                "{selectedItem.motivation}"
                            </p>
                        </div>

                        {/* Status Pendaftaran & Aksi Verifikasi */}
                        <div className="pt-2 border-t border-[var(--border)]">
                            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase block mb-2">Verifikasi Kelayakan:</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleUpdateStatus(selectedItem.id, 'verified')}
                                    className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg border transition-all flex items-center justify-center gap-1.5 ${
                                        selectedItem.status === 'verified'
                                            ? 'bg-green-600 text-white border-green-600 shadow-sm'
                                            : 'bg-[var(--surface-2)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--surface)]'
                                    }`}
                                >
                                    <CheckCircle2 className="w-4 h-4" /> Loloskan
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus(selectedItem.id, 'rejected')}
                                    className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg border transition-all flex items-center justify-center gap-1.5 ${
                                        selectedItem.status === 'rejected'
                                            ? 'bg-red-600 text-white border-red-600 shadow-sm'
                                            : 'bg-[var(--surface-2)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--surface)]'
                                    }`}
                                >
                                    <XCircle className="w-4 h-4" /> Tolak
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {/* MODAL KONFIRMASI HAPUS */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl max-w-sm w-full p-6 shadow-xl text-center space-y-4">
                        <div className="w-10 h-10 bg-red-50 border border-red-200 text-red-600 rounded-full flex items-center justify-center mx-auto">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-[var(--text-primary)] font-display">Hapus Pendaftar?</h3>
                            <p className="text-xs text-[var(--text-muted)] mt-1">
                                Data pendaftar ID <strong>{deleteId}</strong> akan dihapus permanen.
                            </p>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => handleDelete(deleteId)}
                                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase rounded-lg transition-all"
                            >
                                Hapus
                            </button>
                            <button
                                onClick={() => setDeleteId(null)}
                                className="flex-1 py-2.5 bg-transparent border border-[var(--border)] text-[var(--text-primary)] text-xs font-bold uppercase rounded-lg hover:bg-[var(--surface-2)] transition-all"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}
