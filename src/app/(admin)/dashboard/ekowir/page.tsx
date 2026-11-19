'use client'

import { useState, useEffect, useMemo } from 'react'
import { Plus, Edit2, Trash2, ArrowLeft, Search, Image as ImageIcon, Tag, RefreshCw, Clock, Package, AlertTriangle } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import Swal from 'sweetalert2'

type ViewMode = 'list' | 'create' | 'edit'

export interface Product {
    id: string
    name: string
    description: string
    price: number
    category: string
    available: boolean
    image: string
    isPreorder: boolean
    poDuration?: string
    dpAmount?: number
    createdAt?: string
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

export default function AdminEkowirPage() {
    const [items, setItems] = useState<Product[]>([])
    const [view, setView] = useState<ViewMode>('list')
    const [editItem, setEditItem] = useState<Product | null>(null)
    const [search, setSearch] = useState('')

    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [deleteId, setDeleteId] = useState<string | null>(null)

    const [form, setForm] = useState({
        name: '',
        description: '',
        price: 0,
        category: 'Pakaian',
        available: true,
        image: '',
        isPreorder: false,
        poDuration: '',
        dpAmount: 0
    })

    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string>('')

    const supabase = useMemo(() => createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    ), [])

    useEffect(() => {
        fetchProducts()
    }, [supabase])

    const fetchProducts = async () => {
        setIsLoading(true)
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error

            if (data) {
                const formattedData: Product[] = data.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    category: item.category,
                    available: item.available,
                    image: item.image,
                    isPreorder: item.is_preorder,
                    poDuration: item.po_duration || '',
                    dpAmount: item.dp_amount || 0,
                    createdAt: item.created_at
                }))
                setItems(formattedData)
            }
        } catch (error: any) {
            console.error('Error fetching products:', error.message)
            Toast.fire({
                icon: 'error',
                title: 'Gagal Memuat Data'
            })
        } finally {
            setIsLoading(false)
        }
    }

    const filtered = items.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

    const startCreate = () => {
        setForm({
            name: '', description: '', price: 0, category: 'Pakaian',
            available: true, image: '', isPreorder: false, poDuration: '', dpAmount: 0
        })
        setImageFile(null)
        setImagePreview('')
        setEditItem(null)
        setView('create')
    }

    const startEdit = (item: Product) => {
        setEditItem(item)
        setForm({
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            available: item.available,
            image: item.image || '',
            isPreorder: item.isPreorder || false,
            poDuration: item.poDuration || '',
            dpAmount: item.dpAmount || 0
        })
        setImageFile(null)
        setImagePreview(item.image || '')
        setView('edit')
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handleSave = async () => {
        if (!form.name || form.price <= 0) {
            Toast.fire({
                icon: 'warning',
                title: 'Data Tidak Lengkap',
                text: 'Nama dan harga produk wajib diisi!'
            })
            return
        }

        setIsSaving(true)
        try {
            let finalImageUrl = form.image

            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop()
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
                const filePath = `products/${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from('ekowir_images')
                    .upload(filePath, imageFile)

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('ekowir_images')
                    .getPublicUrl(filePath)

                finalImageUrl = publicUrl
            }

            const payload = {
                name: form.name,
                description: form.description,
                price: form.price,
                category: form.category,
                available: form.available,
                image: finalImageUrl,
                is_preorder: form.isPreorder,
                po_duration: form.isPreorder ? form.poDuration : null,
                dp_amount: form.dpAmount || 0
            }

            if (view === 'create') {
                const { error } = await supabase.from('products').insert([payload])
                if (error) throw error
            } else if (editItem) {
                const { error } = await supabase
                    .from('products')
                    .update(payload)
                    .eq('id', editItem.id)
                if (error) throw error
            }

            await fetchProducts()
            setView('list')

            Toast.fire({
                icon: 'success',
                title: `Produk ${view === 'create' ? 'ditambahkan' : 'diperbarui'}.`
            })
        } catch (error: any) {
            console.error('Error saving:', error.message)
            Toast.fire({ icon: 'error', title: 'Gagal Menyimpan' })
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const { error } = await supabase.from('products').delete().eq('id', id)
            if (error) throw error

            setItems(prev => prev.filter(p => p.id !== id))
            setDeleteId(null)

            Toast.fire({
                icon: 'success',
                title: 'Produk berhasil dihapus.'
            })
        } catch (error: any) {
            Toast.fire({
                icon: 'error',
                title: 'Gagal Menghapus',
                text: error.message
            })
        }
    }

    if (view === 'create' || view === 'edit') {
        return (
            <div className="space-y-5 sm:space-y-6 font-sans animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[var(--card)] p-5 sm:p-6 rounded-2xl border-2 border-[var(--border-strong)] shadow-[4px_4px_0_var(--surface-2)]">
                    <div>
                        <h2 className="text-lg sm:text-xl font-black text-[var(--text-primary)] font-display uppercase tracking-tight flex items-center gap-2.5">
                            <span className="w-1.5 h-5 rounded-full bg-[var(--primary)] inline-block" />
                            {view === 'create' ? 'Tambah Produk' : 'Edit Produk'}
                        </h2>
                        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5 font-medium ml-4">
                            Lengkapi informasi produk merchandise atau kewirausahaan
                        </p>
                    </div>
                    <button
                        onClick={() => setView('list')}
                        disabled={isSaving}
                        className="py-2.5 px-4 bg-[var(--surface)] border-2 border-[var(--border-strong)] text-[var(--text-primary)] font-black text-xs uppercase tracking-widest rounded-xl hover:border-[var(--mk-ink)] transition-all flex items-center gap-2 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--mk-ink)] cursor-pointer font-display"
                    >
                        <ArrowLeft className="w-4 h-4" /> Kembali
                    </button>
                </div>

                <div className="bg-[var(--card)] rounded-2xl border-2 border-[var(--border-strong)] shadow-[4px_4px_0_var(--surface-2)] flex flex-col relative p-6 md:p-8">
                    <div className="h-1 w-full bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--accent-light)] absolute top-0 left-0 rounded-t-xl" />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-2">
                        <div className="lg:col-span-2 space-y-5">
                            <div>
                                <label className="text-[10px] font-black text-[var(--text-primary)] uppercase block mb-2 font-display tracking-widest">Nama Produk</label>
                                <input
                                    className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--background)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all text-sm font-medium"
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="Masukkan nama produk..."
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-[var(--text-primary)] uppercase block mb-2 font-display tracking-widest">Deskripsi Produk</label>
                                <textarea
                                    className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--background)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all text-sm leading-relaxed font-medium"
                                    rows={4}
                                    value={form.description}
                                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    placeholder="Jelaskan detail bahan, ukuran, dan keunggulan produk..."
                                    style={{ resize: 'vertical' }}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="text-[10px] font-black text-[var(--text-primary)] uppercase block mb-2 font-display tracking-widest">Harga Produk (Rp)</label>
                                    <div className="relative group">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-[var(--text-muted)] group-focus-within:text-[var(--primary)] transition-colors">Rp</span>
                                        <input
                                            type="number"
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all text-sm font-black tracking-wide"
                                            value={form.price || ''}
                                            onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-[var(--text-primary)] uppercase block mb-2 font-display tracking-widest">Kategori</label>
                                    <select
                                        className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all text-sm font-bold appearance-none cursor-pointer"
                                        value={form.category}
                                        onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                    >
                                        {['Pakaian', 'Aksesori', 'Stationery', 'Lainnya'].map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="p-5 border-2 border-[var(--border-strong)] rounded-xl bg-[var(--surface)] space-y-4">
                                <div className="flex items-center justify-between cursor-pointer" onClick={() => setForm(f => ({ ...f, isPreorder: !f.isPreorder }))}>
                                    <div>
                                        <h4 className="text-xs font-black text-[var(--text-primary)] flex items-center gap-2 font-display uppercase tracking-widest">
                                            <Clock className="w-4 h-4 text-orange-500" /> Sistem Pre-Order
                                        </h4>
                                        <p className="text-[11px] text-[var(--text-secondary)] font-medium mt-1">Aktifkan jika produk perlu dipesan (PO)</p>
                                    </div>
                                    <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors border-2 ${form.isPreorder ? 'bg-orange-500 border-orange-600' : 'bg-[var(--border-strong)] border-[var(--border-strong)]'}`}>
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.isPreorder ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                    </div>
                                </div>

                                {form.isPreorder && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t-2 border-dashed border-[var(--border-strong)]">
                                        <div>
                                            <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase block mb-1.5 font-display tracking-widest">Estimasi Lama PO</label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2.5 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--background)] focus:outline-none focus:border-orange-500 focus:shadow-[3px_3px_0_rgba(249,115,22,0.15)] transition-all text-xs font-medium text-[var(--text-primary)]"
                                                value={form.poDuration}
                                                onChange={e => setForm(f => ({ ...f, poDuration: e.target.value }))}
                                                placeholder="Contoh: 7-14 Hari"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase block mb-1.5 font-display tracking-widest">Minimal DP (Rp)</label>
                                            <div className="relative group">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-[var(--text-muted)] group-focus-within:text-orange-500">Rp</span>
                                                <input
                                                    type="number"
                                                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--background)] focus:outline-none focus:border-orange-500 focus:shadow-[3px_3px_0_rgba(249,115,22,0.15)] transition-all text-xs font-bold text-[var(--text-primary)]"
                                                    value={form.dpAmount || ''}
                                                    onChange={e => setForm(f => ({ ...f, dpAmount: Number(e.target.value) }))}
                                                    placeholder="0"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="text-[10px] font-black text-[var(--text-primary)] uppercase block mb-2 font-display tracking-widest flex items-center gap-2">
                                    <ImageIcon className="w-3.5 h-3.5" /> Foto Produk
                                </label>
                                <div className="mt-2 flex justify-center rounded-xl border-2 border-dashed border-[var(--border-strong)] px-6 py-8 bg-[var(--surface)] hover:bg-[var(--surface-2)] transition-all">
                                    <div className="text-center w-full">
                                        {imagePreview ? (
                                            <div className="mb-4 relative w-full aspect-square rounded-xl overflow-hidden border-2 border-[var(--border-strong)] bg-[var(--background)] shadow-[3px_3px_0_var(--border)]">
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                                            </div>
                                        ) : (
                                            <div className="mx-auto h-16 w-16 bg-[var(--background)] rounded-xl border-2 border-[var(--border-strong)] flex items-center justify-center mb-4 shadow-[3px_3px_0_var(--border)]">
                                                <ImageIcon className="h-8 w-8 text-[var(--text-muted)]" />
                                            </div>
                                        )}
                                        <div className="flex justify-center">
                                            <label htmlFor="file-upload" className="cursor-pointer rounded-lg px-4 py-2 bg-[var(--background)] border-2 border-[var(--border-strong)] text-xs font-black uppercase tracking-widest text-[var(--text-primary)] hover:border-[var(--primary)] hover:text-[var(--primary)] hover:shadow-[2px_2px_0_var(--primary)] transition-all font-display">
                                                <span>Pilih Gambar</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--surface)] flex items-center justify-between cursor-pointer transition-all" onClick={() => setForm(f => ({ ...f, available: !f.available }))}>
                                <div>
                                    <h4 className="text-xs font-black text-[var(--text-primary)] font-display uppercase tracking-wider">Tersedia</h4>
                                    <p className="text-[10px] font-medium text-[var(--text-secondary)] mt-0.5">Tampil di katalog utama</p>
                                </div>
                                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors border-2 ${form.available ? 'bg-green-500 border-green-600' : 'bg-[var(--border-strong)] border-[var(--border-strong)]'}`}>
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.available ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                </div>
                            </div>

                            <div className="pt-4 border-t-2 border-dashed border-[var(--border-strong)]">
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="w-full py-3.5 px-4 bg-[var(--primary)] text-white text-xs font-black tracking-widest uppercase rounded-xl border-2 border-[var(--primary)] hover:border-[var(--mk-ink)] shadow-[3px_3px_0_rgba(200,16,46,0.2)] hover:shadow-[3px_3px_0_var(--mk-ink)] transition-all flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 disabled:hover:translate-y-0 font-display"
                                >
                                    {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Package className="w-4 h-4" />}
                                    {isSaving ? 'Menyimpan...' : 'Simpan Produk'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-5 sm:space-y-6 font-sans">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-5 bg-[var(--card)] p-5 sm:p-6 rounded-2xl border-2 border-[var(--border-strong)] shadow-[4px_4px_0_var(--surface-2)]">
                <div>
                    <h2 className="text-lg sm:text-xl font-black text-[var(--text-primary)] font-display uppercase tracking-tight flex items-center gap-2.5">
                        <span className="w-1.5 h-5 rounded-full bg-[var(--primary)] inline-block" />
                        Katalog Ekowir
                        <span className="bg-[var(--accent-light)] text-[var(--mk-ink)] text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border border-[var(--mk-ink)]">
                            {items.length} Total
                        </span>
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5 font-medium ml-4">
                        Kelola data produk merchandise dan kewirausahaan
                    </p>
                </div>
                <div className="flex gap-2.5 w-full sm:w-auto">
                    <button
                        onClick={fetchProducts}
                        className="p-3 bg-[var(--surface)] border-2 border-[var(--border-strong)] text-[var(--text-secondary)] hover:text-[var(--primary)] hover:border-[var(--primary)] rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_rgba(200,16,46,0.15)] cursor-pointer"
                        title="Segarkan Data"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={startCreate}
                        className="flex-1 sm:flex-none py-3 px-5 bg-[var(--primary)] text-white text-xs font-bold tracking-widest uppercase rounded-xl border-2 border-[var(--primary)] hover:border-[var(--mk-ink)] shadow-[3px_3px_0_rgba(200,16,46,0.2)] hover:shadow-[3px_3px_0_var(--mk-ink)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer font-display"
                    >
                        <Plus className="w-4 h-4" /> Tambah
                    </button>
                </div>
            </div>

            {deleteId !== null && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-[var(--card)] rounded-2xl p-6 sm:p-8 max-w-sm w-full border-2 border-[var(--mk-ink)] shadow-[8px_8px_0_var(--mk-ink)] animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-14 h-14 rounded-2xl bg-[var(--error)]/10 border-2 border-[var(--error)]/30 flex items-center justify-center mb-5 rotate-3">
                            <AlertTriangle className="w-7 h-7 text-[var(--error)]" />
                        </div>
                        <h3 className="font-black text-xl font-display text-[var(--text-primary)] mb-2 uppercase tracking-tight">Hapus Produk?</h3>
                        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-6 font-medium">
                            Data produk beserta gambarnya akan dihapus secara permanen dari sistem.
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

                <div className="p-4 sm:p-5 border-b border-[var(--border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[var(--surface)]">
                    <div className="relative w-full sm:w-80 group">
                        <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[var(--primary)] transition-colors" />
                        <input
                            type="text"
                            placeholder="Cari nama produk..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 sm:py-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--background)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:shadow-[3px_3px_0_rgba(200,16,46,0.15)] transition-all text-xs sm:text-sm font-medium"
                        />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] font-bold font-display uppercase tracking-wider shrink-0 bg-[var(--background)] px-4 py-2.5 border-2 border-[var(--border-strong)] rounded-xl">
                        <Tag className="w-4 h-4 text-[var(--primary)]" /> {filtered.length} Ditemukan
                    </div>
                </div>

                <div className="overflow-x-auto w-full scrollbar-none">
                    {isLoading ? (
                        <div className="text-center py-16 text-[var(--text-muted)] font-display text-xs font-bold flex items-center justify-center gap-2 uppercase tracking-widest">
                            <RefreshCw className="w-5 h-5 animate-spin text-[var(--primary)]" />
                            Memuat data produk...
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-14 h-14 bg-[var(--surface)] rounded-2xl flex items-center justify-center mb-3 text-[var(--text-muted)] border-2 border-[var(--border-strong)] shadow-[3px_3px_0_var(--border)] mx-auto">
                                <Package className="w-7 h-7" />
                            </div>
                            <h3 className="font-black text-xs sm:text-sm text-[var(--text-primary)] font-display uppercase tracking-wide mb-1">Tidak Ada Produk</h3>
                            <p className="text-xs text-[var(--text-secondary)] font-medium">Belum ada data atau tidak sesuai pencarian.</p>
                        </div>
                    ) : (
                        <table className="admin-table min-w-[700px]">
                            <thead>
                            <tr>
                                <th className="pl-5 sm:pl-6 w-[40%]">Info Produk</th>
                                <th>Harga</th>
                                <th>Kategori</th>
                                <th>Status</th>
                                <th className="text-right pr-5 sm:pr-6">Aksi</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filtered.map(p => (
                                <tr key={p.id} className="group">
                                    <td className="pl-5 sm:pl-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-[var(--surface)] overflow-hidden flex-shrink-0 border-2 border-[var(--border-strong)] p-0.5 shadow-[2px_2px_0_var(--border)] relative">
                                                <img src={p.image || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&auto=format'} alt={p.name} className="w-full h-full object-cover rounded-lg" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-black text-sm text-[var(--text-primary)] font-display uppercase tracking-tight">
                                                    {p.name}
                                                </span>
                                                <p className="text-xs mt-1 text-[var(--text-muted)] line-clamp-1 max-w-[220px] font-medium leading-relaxed">
                                                    {p.description}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 align-middle">
                                        <div className="flex flex-col gap-1.5 items-start">
                                            <span className="text-sm font-black text-[var(--primary)] whitespace-nowrap font-display tracking-tight bg-[var(--primary)]/10 px-2.5 py-1 rounded border border-[var(--primary)]/20 shadow-[2px_2px_0_rgba(200,16,46,0.15)]">
                                                Rp {p.price.toLocaleString('id-ID')}
                                            </span>
                                            {p.isPreorder && p.dpAmount ? (
                                                <span className="text-[10px] text-orange-700 font-bold bg-orange-100 px-2 py-0.5 rounded border border-orange-300 w-max uppercase tracking-wider font-display">
                                                    DP: Rp {p.dpAmount.toLocaleString('id-ID')}
                                                </span>
                                            ) : null}
                                        </div>
                                    </td>
                                    <td className="py-4 align-middle">
                                        <span className="text-[10px] font-black text-[var(--mk-ink)] font-display uppercase tracking-wider bg-[var(--accent-light)] px-2.5 py-1 rounded-md border border-[var(--mk-ink)] shadow-[2px_2px_0_var(--mk-ink)] whitespace-nowrap">
                                            {p.category}
                                        </span>
                                    </td>
                                    <td className="py-4 align-middle">
                                        <div className="flex flex-col gap-2 items-start">
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border-2 font-display ${
                                                p.available
                                                    ? 'bg-green-100 text-green-800 border-green-500 shadow-[2px_2px_0_#22c55e]'
                                                    : 'bg-red-100 text-red-800 border-red-500 shadow-[2px_2px_0_#ef4444]'
                                            }`}>
                                                {p.available ? 'Tersedia' : 'Habis'}
                                            </span>
                                            {p.isPreorder && (
                                                <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border-2 bg-orange-100 text-orange-800 border-orange-500 shadow-[2px_2px_0_#f97316] flex items-center gap-1.5 font-display">
                                                    <Clock className="w-3 h-3" /> PO {p.poDuration}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="pr-5 sm:pr-6 py-4 text-right align-middle">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => startEdit(p)}
                                                className="p-2 text-[var(--text-muted)] hover:text-blue-600 hover:bg-blue-500/10 rounded-xl transition-colors cursor-pointer border-2 border-transparent hover:border-blue-500/30"
                                                title="Edit Produk"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setDeleteId(p.id)}
                                                className="p-2 text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[var(--error)]/10 rounded-xl transition-colors cursor-pointer border-2 border-transparent hover:border-[var(--error)]/30"
                                                title="Hapus Produk"
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
        </div>
    )
}