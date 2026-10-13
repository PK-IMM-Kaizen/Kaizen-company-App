'use client'

import { useState } from 'react'
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
    UserCheck,
    UserX,
    Calendar
} from 'lucide-react'

// Tipe Data Aspirasi
export interface AspirasiItem {
    id: string
    name: string
    email?: string
    phone?: string
    category: 'Akademik' | 'Fasilitas' | 'Organisasi' | 'Kritik & Saran' | 'Lainnya'
    isAnonymous: boolean
    message: string
    createdAt: string
    status: 'pending' | 'process' | 'resolved'
    adminNote?: string
}

// Data Dummy Aspirasi Masuk
const DUMMY_ASPIRASI: AspirasiItem[] = [
    {
        id: 'ASP-001',
        name: 'Ahmad Fauzi',
        email: 'ahmad.fauzi@gmail.com',
        phone: '081234567890',
        category: 'Fasilitas',
        isAnonymous: false,
        message: 'Mohon agar ruang sekretariat IMM Kaizen diperbarui fasilitas AC dan koneksi WiFi-nya agar lebih nyaman untuk rapat pengurus.',
        createdAt: '12 Oktober 2026',
        status: 'pending'
    },
    {
        id: 'ASP-002',
        name: 'Hamba Allah',
        category: 'Organisasi',
        isAnonymous: true,
        message: 'Saran untuk kegiatan perkaderan selanjutnya agar publikasi dilakukan lebih awal minimal H-7 acara.',
        createdAt: '10 Oktober 2026',
        status: 'process',
        adminNote: 'Sedang didiskusikan oleh Bidang Medkom dan Perkaderan.'
    },
    {
        id: 'ASP-003',
        name: 'Siti Nurhaliza',
        email: 'siti.nur@gmail.com',
        category: 'Akademik',
        isAnonymous: false,
        message: 'Apakah ada program bimbingan belajar atau klinik skripsi dari Bidang RPK untuk mahasiswa tingkat akhir?',
        createdAt: '08 Oktober 2026',
        status: 'resolved',
        adminNote: 'Sudah ditindaklanjuti dan dihubungi via email terkait jadwal Bimbingan RPK.'
    }
]

export default function AdminAspirasiPage() {
    const [aspirasiList, setAspirasiList] = useState<AspirasiItem[]>(DUMMY_ASPIRASI)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [categoryFilter, setCategoryFilter] = useState<string>('all')

    // State Modal Detail & Action
    const [selectedItem, setSelectedItem] = useState<AspirasiItem | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [adminNoteInput, setAdminNoteInput] = useState('')

    // Filtering Data
    const filteredList = aspirasiList.filter(item => {
        const matchesSearch =
            item.message.toLowerCase().includes(search.toLowerCase()) ||
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.id.toLowerCase().includes(search.toLowerCase())

        const matchesStatus = statusFilter === 'all' || item.status === statusFilter
        const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter

        return matchesSearch && matchesStatus && matchesCategory
    })

    // Update Status Aspirasi
    const handleUpdateStatus = (id: string, newStatus: 'pending' | 'process' | 'resolved') => {
        setAspirasiList(prev =>
            prev.map(item =>
                item.id === id ? { ...item, status: newStatus, adminNote: adminNoteInput || item.adminNote } : item
            )
        )
        if (selectedItem && selectedItem.id === id) {
            setSelectedItem(prev => prev ? { ...prev, status: newStatus, adminNote: adminNoteInput || prev.adminNote } : null)
        }
    }

    // Hapus Aspirasi
    const handleDelete = (id: string) => {
        setAspirasiList(prev => prev.filter(item => item.id !== id))
        setDeleteId(null)
        if (selectedItem?.id === id) setSelectedItem(null)
    }

    return (
        <div className="space-y-6">

            {/* HEADER JUDUL */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-black text-[var(--text-primary)] font-display tracking-wide flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-[var(--primary)]" /> Kotak Aspirasi Masuk
                    </h2>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                        Kelola dan tindak lanjuti masukan, saran, serta keluhan dari kader dan mahasiswa.
                    </p>
                </div>

                {/* STATISTIK RINGKAS */}
                <div className="flex items-center gap-2">
                    <span className="text-xs px-3 py-1.5 bg-[var(--surface-2)] border border-[var(--border)] rounded-lg text-[var(--text-secondary)] font-medium">
                        Total: <strong className="text-[var(--text-primary)]">{aspirasiList.length}</strong>
                    </span>
                    <span className="text-xs px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 font-medium">
                        Belum: <strong>{aspirasiList.filter(a => a.status === 'pending').length}</strong>
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
                        placeholder="Cari kata kunci, nama, ID..."
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
                        <option value="pending">Menunggu</option>
                        <option value="process">Diproses</option>
                        <option value="resolved">Selesai</option>
                    </select>

                    <select
                        value={categoryFilter}
                        onChange={e => setCategoryFilter(e.target.value)}
                        className="bg-[var(--surface-2)] border border-[var(--border)] text-xs text-[var(--text-primary)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                    >
                        <option value="all">Semua Kategori</option>
                        <option value="Akademik">Akademik</option>
                        <option value="Fasilitas">Fasilitas</option>
                        <option value="Organisasi">Organisasi</option>
                        <option value="Kritik & Saran">Kritik & Saran</option>
                        <option value="Lainnya">Lainnya</option>
                    </select>
                </div>
            </div>

            {/* TABEL DATA ASPIRASI */}
            <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-[var(--surface-2)] border-b border-[var(--border)] text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-display">
                            <th className="p-4">ID & Tanggal</th>
                            <th className="p-4">Pengirim</th>
                            <th className="p-4">Kategori</th>
                            <th className="p-4">Pesan Aspirasi</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-center">Aksi</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                        {filteredList.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-12 text-[var(--text-muted)] text-xs">
                                    Tidak ada data aspirasi yang ditemukan.
                                </td>
                            </tr>
                        ) : (
                            filteredList.map(item => (
                                <tr key={item.id} className="hover:bg-[var(--surface)] transition-colors">
                                    <td className="p-4 whitespace-nowrap">
                                        <span className="font-mono text-xs font-bold text-[var(--text-primary)] block">{item.id}</span>
                                        <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                                                <Calendar className="w-3 h-3" /> {item.createdAt}
                                            </span>
                                    </td>
                                    <td className="p-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            {item.isAnonymous ? (
                                                <span className="text-xs font-semibold text-[var(--text-muted)] flex items-center gap-1 italic">
                                                        <UserX className="w-3.5 h-3.5 text-amber-600" /> Anonim
                                                    </span>
                                            ) : (
                                                <div>
                                                        <span className="text-xs font-bold text-[var(--text-primary)] block flex items-center gap-1">
                                                            <UserCheck className="w-3.5 h-3.5 text-[var(--primary)]" /> {item.name}
                                                        </span>
                                                    <span className="text-[10px] text-[var(--text-muted)]">
                                                            {item.email || item.phone || 'Tanpa Kontak'}
                                                        </span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 whitespace-nowrap">
                                            <span className="text-[11px] font-bold text-[var(--primary)] bg-[var(--surface-2)] border border-[var(--border)] px-2.5 py-1 rounded-md uppercase tracking-wider font-display">
                                                {item.category}
                                            </span>
                                    </td>
                                    <td className="p-4 max-w-xs sm:max-w-md">
                                        <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                                            {item.message}
                                        </p>
                                    </td>
                                    <td className="p-4 whitespace-nowrap">
                                        {item.status === 'pending' && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-700 border border-orange-200">
                                                    <Clock className="w-3 h-3" /> Menunggu
                                                </span>
                                        )}
                                        {item.status === 'process' && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                                                    <AlertTriangle className="w-3 h-3" /> Diproses
                                                </span>
                                        )}
                                        {item.status === 'resolved' && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-700 border border-green-200">
                                                    <CheckCircle2 className="w-3 h-3" /> Selesai
                                                </span>
                                        )}
                                    </td>
                                    <td className="p-4 whitespace-nowrap text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedItem(item)
                                                    setAdminNoteInput(item.adminNote || '')
                                                }}
                                                className="p-1.5 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                                title="Lihat Detail"
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

            {/* MODAL DETAIL ASPIRASI */}
            {selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl max-w-lg w-full p-6 shadow-xl relative space-y-5">

                        <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
                            <div>
                                <span className="text-[10px] font-mono font-bold text-[var(--primary)] uppercase tracking-wider">{selectedItem.id}</span>
                                <h3 className="text-sm font-black text-[var(--text-primary)] font-display">Detail Aspirasi</h3>
                            </div>
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--surface-2)]"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Pengirim & Kategori */}
                        <div className="grid grid-cols-2 gap-4 bg-[var(--surface)] p-4 rounded-lg border border-[var(--border)] text-xs">
                            <div>
                                <span className="text-[var(--text-muted)] block text-[10px] uppercase font-bold">Pengirim</span>
                                <span className="text-[var(--text-primary)] font-bold block mt-0.5">
                                    {selectedItem.isAnonymous ? 'Anonim' : selectedItem.name}
                                </span>
                                {!selectedItem.isAnonymous && (
                                    <span className="text-[11px] text-[var(--text-muted)] block">{selectedItem.email || selectedItem.phone || '-'}</span>
                                )}
                            </div>
                            <div>
                                <span className="text-[var(--text-muted)] block text-[10px] uppercase font-bold">Kategori & Tanggal</span>
                                <span className="text-[var(--primary)] font-bold block mt-0.5">{selectedItem.category}</span>
                                <span className="text-[11px] text-[var(--text-muted)] block">{selectedItem.createdAt}</span>
                            </div>
                        </div>

                        {/* Isi Pesan */}
                        <div>
                            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase block mb-1">Pesan / Masukan:</span>
                            <p className="text-xs text-[var(--text-primary)] leading-relaxed bg-[var(--surface-2)] p-4 rounded-lg border border-[var(--border)] whitespace-pre-line">
                                {selectedItem.message}
                            </p>
                        </div>

                        {/* Catatan Tindak Lanjut Admin */}
                        <div>
                            <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase block mb-1">
                                Catatan Tindak Lanjut Admin:
                            </label>
                            <textarea
                                rows={3}
                                value={adminNoteInput}
                                onChange={e => setAdminNoteInput(e.target.value)}
                                placeholder="Tuliskan catatan tindak lanjuti di sini..."
                                className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-lg p-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                            />
                        </div>

                        {/* Action Status Buttons */}
                        <div className="pt-2 border-t border-[var(--border)]">
                            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase block mb-2">Ubah Status Tindak Lanjut:</span>
                            <div className="flex gap-2 flex-wrap">
                                <button
                                    onClick={() => handleUpdateStatus(selectedItem.id, 'pending')}
                                    className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                                        selectedItem.status === 'pending'
                                            ? 'bg-orange-600 text-white border-orange-600'
                                            : 'bg-[var(--surface-2)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--surface)]'
                                    }`}
                                >
                                    Menunggu
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus(selectedItem.id, 'process')}
                                    className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                                        selectedItem.status === 'process'
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-[var(--surface-2)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--surface)]'
                                    }`}
                                >
                                    Diproses
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus(selectedItem.id, 'resolved')}
                                    className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                                        selectedItem.status === 'resolved'
                                            ? 'bg-green-600 text-white border-green-600'
                                            : 'bg-[var(--surface-2)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--surface)]'
                                    }`}
                                >
                                    Selesai
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
                            <h3 className="text-sm font-black text-[var(--text-primary)] font-display">Hapus Aspirasi?</h3>
                            <p className="text-xs text-[var(--text-muted)] mt-1">
                                Data aspirasi ID <strong>{deleteId}</strong> akan dihapus secara permanen.
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
