'use client'

import { useState, useEffect, useMemo } from 'react'
import {
    Plus,
    Edit2,
    Trash2,
    ArrowLeft,
    AlertTriangle,
    Search,
    UserCheck,
    Camera,
    Users,
    RefreshCw,
    Filter,
    ChevronLeft,
    ChevronRight,
    Shield,
    UserCheck2
} from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

type ViewMode = 'list' | 'create' | 'edit'

export interface Management {
    id: string
    name: string
    position: string
    division: string
    isLeader: boolean
    photo: string
    createdAt?: string
}

const divisionOptions = [
    'BPH',
    'Organisasi',
    'Perkaderan',
    'Hikmah Politik & Kebijakan Publik',
    'Riset & Pengembangan Keilmuan',
    'Tabligh & Kajian Keislaman',
    'Sosial Pemberdayaan Masyarakat',
    'Ekonomi & Kewirausahaan',
    'IMMawati',
    'Seni Budaya & Olahraga',
    'Media Komunikasi & Informasi'
]

const positionPresets = [
    'Ketua Umum',
    'Sekretaris Umum',
    'Bendahara Umum',
    'Kabid (Ketua Bidang)',
    'Sekretaris Bidang',
    'Anggota Bidang',
    'Ketua Lembaga',
    'Anggota Lembaga',
    'Kustom / Lainnya'
]

export default function AdminKepengurusanPage() {
    const [items, setItems] = useState<Management[]>([])
    const [view, setView] = useState<ViewMode>('list')
    const [editItem, setEditItem] = useState<Management | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)

    const [search, setSearch] = useState('')
    const [selectedDivision, setSelectedDivision] = useState<string>('all')
    const [currentPage, setCurrentPage] = useState<number>(1)
    const itemsPerPage = 10

    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    const [form, setForm] = useState({
        name: '',
        positionPreset: 'Anggota Bidang',
        customPosition: '',
        division: 'BPH',
        isLeader: false,
        photo: ''
    })
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string>('')

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        fetchPengurus()
    }, [])

    useEffect(() => {
        setCurrentPage(1)
    }, [search, selectedDivision])

    const fetchPengurus = async () => {
        setIsLoading(true)
        try {
            const { data, error } = await supabase
                .from('pengurus')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error

            if (data) {
                const formattedData: Management[] = data.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    position: item.position,
                    division: item.division,
                    isLeader: item.is_leader,
                    photo: item.photo,
                    createdAt: item.created_at
                }))
                setItems(formattedData)
            }
        } catch (error: any) {
            console.error('Error fetching pengurus:', error.message)
            alert('Gagal mengambil data pengurus')
        } finally {
            setIsLoading(false)
        }
    }

    const filteredItems = useMemo(() => {
        return items.filter(m => {
            const matchesSearch =
                m.name.toLowerCase().includes(search.toLowerCase()) ||
                m.position.toLowerCase().includes(search.toLowerCase()) ||
                m.division.toLowerCase().includes(search.toLowerCase())

            const matchesDivision =
                selectedDivision === 'all' || m.division === selectedDivision

            return matchesSearch && matchesDivision
        })
    }, [items, search, selectedDivision])

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1

    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredItems.slice(start, start + itemsPerPage);
    }, [filteredItems, currentPage]);

    const stats = useMemo(() => {
        const bph = items.filter(i => i.division === 'BPH').length;
        const leaders = items.filter(i => i.isLeader).length;
        return { total: items.length, bph, leaders, members: items.length - leaders };
    }, [items]);

    const startCreate = () => {
        setForm({
            name: '',
            positionPreset: 'Anggota Bidang',
            customPosition: '',
            division: 'BPH',
            isLeader: false,
            photo: ''
        })
        setImageFile(null)
        setImagePreview('')
        setEditItem(null)
        setView('create')
    }

    const startEdit = (item: Management) => {
        setEditItem(item)
        const isPreset = positionPresets.includes(item.position)
        setForm({
            name: item.name,
            positionPreset: isPreset ? item.position : 'Kustom / Lainnya',
            customPosition: isPreset ? '' : item.position,
            division: item.division,
            isLeader: item.isLeader ?? false,
            photo: item.photo || ''
        })
        setImageFile(null)
        setImagePreview(item.photo || '')
        setView('edit')
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handlePositionChange = (preset: string) => {
        const isAutoLeader = ['Ketua Umum', 'Kabid (Ketua Bidang)', 'Ketua Lembaga'].includes(preset)
        setForm(f => ({
            ...f,
            positionPreset: preset,
            isLeader: isAutoLeader ? true : f.isLeader
        }))
    }

    const handleSave = async () => {
        const finalPosition = form.positionPreset === 'Kustom / Lainnya'
            ? form.customPosition
            : form.positionPreset

        if (!form.name || !finalPosition || !form.division) {
            alert('Harap isi nama lengkap, jabatan, dan bidang.')
            return
        }

        setIsSaving(true)
        try {
            let finalImageUrl = form.photo

            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop()
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
                const filePath = `profiles/${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from('pengurus_photos')
                    .upload(filePath, imageFile)

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('pengurus_photos')
                    .getPublicUrl(filePath)

                finalImageUrl = publicUrl
            }

            const payload = {
                name: form.name,
                position: finalPosition,
                division: form.division,
                is_leader: form.isLeader,
                photo: finalImageUrl || '/img/profile/imm.jpeg'
            }

            if (view === 'create') {
                const { error } = await supabase.from('pengurus').insert([payload])
                if (error) throw error
            } else if (editItem) {
                const { error } = await supabase
                    .from('pengurus')
                    .update(payload)
                    .eq('id', editItem.id)
                if (error) throw error
            }

            await fetchPengurus()
            setView('list')
        } catch (error: any) {
            console.error('Error saving:', error.message)
            alert(`Gagal menyimpan data: ${error.message}`)
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const { error } = await supabase.from('pengurus').delete().eq('id', id)
            if (error) throw error

            setItems(prev => prev.filter(m => m.id !== id))
            setDeleteId(null)
        } catch (error: any) {
            alert(`Gagal menghapus data: ${error.message}`)
        }
    }

    if (view === 'create' || view === 'edit') {
        return (
            <div className="animate-in fade-in duration-300">
                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={() => setView('list')}
                        className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--primary)] flex items-center gap-1.5 font-display transition-colors bg-[var(--surface)] px-3 py-1.5 rounded-lg border border-[var(--border)] cursor-pointer"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Kembali
                    </button>
                    <span className="text-[var(--border-strong)]">/</span>
                    <h2 className="text-sm font-black text-[var(--text-primary)] font-display uppercase tracking-wider">
                        {view === 'create' ? 'Tambah Pengurus Baru' : 'Edit Data Pengurus'}
                    </h2>
                </div>

                <div className="bg-[var(--card)] rounded-2xl p-6 md:p-8 border border-[var(--border)] shadow-sm">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">
                                    Nama Lengkap
                                </label>
                                <input
                                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm font-semibold"
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="Masukkan nama lengkap beserta gelar jika ada..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">
                                        Jabatan
                                    </label>
                                    <select
                                        className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm cursor-pointer mb-3"
                                        value={form.positionPreset}
                                        onChange={e => handlePositionChange(e.target.value)}
                                    >
                                        {positionPresets.map(p => (
                                            <option key={p} value={p}>{p}</option>
                                        ))}
                                    </select>

                                    {form.positionPreset === 'Kustom / Lainnya' && (
                                        <input
                                            className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm font-medium animate-in fade-in"
                                            value={form.customPosition}
                                            onChange={e => setForm(f => ({ ...f, customPosition: e.target.value }))}
                                            placeholder="Tuliskan nama jabatan kustom..."
                                        />
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 font-display uppercase tracking-wide">
                                        Bidang / Divisi
                                    </label>
                                    <select
                                        className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all text-sm cursor-pointer"
                                        value={form.division}
                                        onChange={e => setForm(f => ({ ...f, division: e.target.value }))}
                                    >
                                        {divisionOptions.map(d => (
                                            <option key={d} value={d}>{d === 'BPH' ? 'BPH / Pimpinan Harian' : d}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 font-display uppercase tracking-wide text-center">
                                    Foto Profil
                                </label>
                                <div className="flex flex-col items-center justify-center">
                                    <div className="relative group cursor-pointer">
                                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[var(--surface-2)] shadow-md bg-[var(--surface)] flex items-center justify-center relative">
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <Users className="w-12 h-12 text-[var(--text-muted)]" />
                                            )}
                                            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Camera className="w-6 h-6 text-white mb-1" />
                                                <span className="text-[10px] text-white font-bold uppercase tracking-wider">Ubah Foto</span>
                                            </div>
                                        </div>
                                        <input id="photo-upload" name="photo-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                        <label htmlFor="photo-upload" className="absolute inset-0 cursor-pointer rounded-full"></label>
                                    </div>
                                    <p className="text-[10px] text-[var(--text-muted)] mt-3 text-center">Format: JPG, PNG (Rasio 1:1)</p>
                                </div>
                            </div>

                            <div
                                className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-between cursor-pointer"
                                onClick={() => setForm(f => ({ ...f, isLeader: !f.isLeader }))}
                            >
                                <div>
                                    <h4 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                                        Pimpinan Bidang {form.isLeader && <UserCheck className="w-4 h-4 text-[var(--accent)]" />}
                                    </h4>
                                    <p className="text-[10px] text-[var(--text-muted)] mt-0.5 leading-tight max-w-[140px]">
                                        Tandai jika merupakan Ketua Umum atau Ketua Bidang
                                    </p>
                                </div>
                                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.isLeader ? 'bg-[var(--primary)]' : 'bg-gray-300 dark:bg-gray-700'}`}>
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.isLeader ? 'translate-x-6' : 'translate-x-1'}`} />
                                </div>
                            </div>

                            <div className="pt-4 space-y-3 border-t border-[var(--border)]">
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="w-full py-3 px-4 bg-[var(--primary)] text-white text-xs font-bold tracking-widest uppercase rounded-xl shadow-md shadow-[var(--primary)]/20 hover:bg-[var(--primary-dark)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 cursor-pointer"
                                >
                                    {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                                    {isSaving ? 'Menyimpan...' : (view === 'create' ? 'Simpan Pengurus' : 'Simpan Perubahan')}
                                </button>
                                <button
                                    onClick={() => setView('list')}
                                    disabled={isSaving}
                                    className="w-full py-3 px-4 bg-transparent border border-[var(--border)] text-[var(--text-primary)] text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-[var(--surface-2)] transition-all cursor-pointer"
                                >
                                    Batal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-6 space-y-6">

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[var(--card)] p-4 md:p-6 rounded-2xl border border-[var(--border)] shadow-sm">
                <div>
                    <h2 className="text-xl font-black text-[var(--text-primary)] font-display flex items-center gap-2">
                        Struktur Kepengurusan <span className="bg-[var(--primary)]/10 text-[var(--primary)] text-xs px-2.5 py-1 rounded-md font-bold">{items.length} Orang</span>
                    </h2>
                    <p className="text-sm text-[var(--text-muted)] mt-1">Kelola daftar pimpinan harian dan anggota bidang</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button
                        onClick={fetchPengurus}
                        className="p-2.5 bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--primary)] rounded-xl transition-colors cursor-pointer"
                        title="Segarkan Data"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={startCreate}
                        className="flex-1 sm:flex-none py-2.5 px-5 bg-[var(--primary)] text-white text-xs font-bold tracking-widest uppercase rounded-xl shadow-md shadow-[var(--primary)]/20 hover:bg-[var(--primary-dark)] transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 cursor-pointer"
                    >
                        <Plus className="w-4 h-4" /> Tambah Pengurus
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[var(--card)] p-3.5 rounded-xl border border-[var(--border)] shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block font-display">Total Pengurus</span>
                        <span className="text-lg font-black text-[var(--text-primary)] font-display">{stats.total}</span>
                    </div>
                </div>

                <div className="bg-[var(--card)] p-3.5 rounded-xl border border-[var(--border)] shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                        <Shield className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block font-display">BPH Harian</span>
                        <span className="text-lg font-black text-[var(--text-primary)] font-display">{stats.bph}</span>
                    </div>
                </div>

                <div className="bg-[var(--card)] p-3.5 rounded-xl border border-[var(--border)] shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                        <UserCheck2 className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block font-display">Ketua Bidang</span>
                        <span className="text-lg font-black text-[var(--text-primary)] font-display">{stats.leaders}</span>
                    </div>
                </div>

                <div className="bg-[var(--card)] p-3.5 rounded-xl border border-[var(--border)] shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block font-display">Anggota</span>
                        <span className="text-lg font-black text-[var(--text-primary)] font-display">{stats.members}</span>
                    </div>
                </div>
            </div>

            {deleteId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="bg-[var(--card)] rounded-2xl p-6 md:p-8 max-w-sm w-full border border-[var(--border)] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-12 h-12 rounded-full bg-red-100/10 border border-red-500/20 flex items-center justify-center mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-500" />
                        </div>
                        <h3 className="font-black text-lg font-display text-[var(--text-primary)] mb-2">Hapus Pengurus?</h3>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-8">
                            Data pengurus ini akan dihapus secara permanen dari struktur organisasi.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteId(null)} className="flex-1 py-3 bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-primary)] text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-[var(--surface)] transition-all cursor-pointer">
                                Batal
                            </button>
                            <button onClick={() => handleDelete(deleteId)} className="flex-1 py-3 bg-red-600 text-white text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-red-700 transition-all cursor-pointer">
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm">

                <div className="px-5 py-4 border-b border-[var(--border)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[var(--surface)]">
                    <div className="relative w-full md:w-80 group">
                        <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[var(--primary)] transition-colors" />
                        <input
                            type="text"
                            placeholder="Cari nama atau jabatan..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all text-sm"
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] shrink-0 font-medium font-display">
                            <Filter className="w-3.5 h-3.5" /> Filter Bidang:
                        </div>
                        <select
                            value={selectedDivision}
                            onChange={e => setSelectedDivision(e.target.value)}
                            className="bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--text-primary)] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 cursor-pointer w-full md:w-auto truncate"
                        >
                            <option value="all">Semua Bidang ({items.length})</option>
                            {divisionOptions.map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="text-center py-16 text-[var(--text-muted)] font-display text-xs font-bold flex items-center justify-center gap-2">
                            <RefreshCw className="w-4 h-4 animate-spin text-[var(--primary)]" />
                            Memuat data pengurus dari Supabase...
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="bg-[var(--surface-2)] border-b border-[var(--border)] text-xs text-[var(--text-muted)] uppercase tracking-wider font-display">
                                <th className="p-4 font-bold pl-6">Profil Pengurus</th>
                                <th className="p-4 font-bold">Jabatan</th>
                                <th className="p-4 font-bold">Bidang</th>
                                <th className="p-4 font-bold text-right pr-6">Aksi</th>
                            </tr>
                            </thead>
                            <tbody>
                            {paginatedItems.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-16 text-[var(--text-muted)] text-sm font-medium">
                                        Tidak ada data pengurus yang ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                paginatedItems.map(m => (
                                    <tr key={m.id} className="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors group">
                                        <td className="p-4 pl-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-11 h-11 rounded-full bg-[var(--surface-2)] overflow-hidden flex-shrink-0 border-2 border-[var(--border)] p-0.5 shadow-sm">
                                                    <img
                                                        src={m.photo || '/img/profile/imm.jpeg'}
                                                        alt={m.name}
                                                        className="w-full h-full object-cover rounded-full"
                                                    />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-sm text-[var(--text-primary)] font-display flex items-center gap-1.5">
                                                        {m.name}
                                                        {(m.isLeader ?? false) && (
                                                            <span title="Pimpinan / Ketua Bidang" className="bg-[var(--accent)]/10 text-[var(--accent)] p-1 rounded-full">
                                                                <UserCheck className="w-3.5 h-3.5" />
                                                            </span>
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-xs font-semibold text-[var(--text-primary)] font-display">
                                            {m.position}
                                        </td>
                                        <td className="p-4">
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border whitespace-nowrap ${
                                                m.division === 'BPH'
                                                    ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                                                    : 'bg-[var(--surface-2)] text-[var(--primary)] border-[var(--border)]'
                                            }`}>
                                                {m.division}
                                            </span>
                                        </td>
                                        <td className="p-4 pr-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => startEdit(m)} className="p-2 text-[var(--text-muted)] hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer" title="Edit Pengurus">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => setDeleteId(m.id)} className="p-2 text-[var(--text-muted)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer" title="Hapus Pengurus">
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

                {!isLoading && filteredItems.length > 0 && (
                    <div className="px-5 py-3.5 border-t border-[var(--border)] bg-[var(--surface)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--text-muted)] font-display">
                        <span>
                            Menampilkan <strong className="text-[var(--text-primary)]">{(currentPage - 1) * itemsPerPage + 1}</strong> - <strong className="text-[var(--text-primary)]">{Math.min(currentPage * itemsPerPage, filteredItems.length)}</strong> dari <strong className="text-[var(--text-primary)]">{filteredItems.length}</strong> data
                        </span>

                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--surface-2)] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            <span className="px-3 font-bold text-[var(--text-primary)]">
                                {currentPage} / {totalPages}
                            </span>

                            <button
                                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="p-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--surface-2)] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}