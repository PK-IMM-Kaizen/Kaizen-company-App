'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import Logo from '../../../components/common/Logo'
import { createBrowserClient } from '@supabase/ssr'
import {
    CheckCircle2,
    Clock,
    ArrowLeft,
    ArrowRight,
    Send,
    Loader2,
    ShieldCheck,
    UploadCloud,
    Check,
    ImagePlus,
    Trash2
} from 'lucide-react'

type FieldName =
    | 'namaLengkap'
    | 'tempatLahir'
    | 'tanggalLahir'
    | 'asal'
    | 'alamatSekarang'
    | 'prodi'

type FormValues = Record<FieldName, string>
type FocusKey = FieldName | 'foto' | null

const STEPS: { title: string; fields: FieldName[] }[] = [
    { title: 'Data diri', fields: ['namaLengkap', 'tempatLahir', 'tanggalLahir'] },
    { title: 'Asal dan kampus', fields: ['asal', 'alamatSekarang', 'prodi'] },
    { title: 'Foto', fields: [] }
]

const MAX_FILE_SIZE = 10 * 1024 * 1024
const TOTAL_ITEMS = 7

const validators: Record<FieldName, (v: string) => string> = {
    namaLengkap: v =>
        v.trim().length < 3 ? 'Tulis nama lengkap sesuai identitas, minimal 3 huruf.' : '',
    tempatLahir: v => (!v.trim() ? 'Isi kota tempat kamu lahir.' : ''),
    tanggalLahir: v => {
        if (!v) return 'Pilih tanggal lahir.'
        const d = new Date(v)
        if (Number.isNaN(d.getTime()) || d > new Date() || d.getFullYear() < 1970)
            return 'Tanggal lahir tidak valid.'
        return ''
    },
    asal: v => (!v.trim() ? 'Isi daerah asalmu.' : ''),
    alamatSekarang: v =>
        v.trim().length < 5 ? 'Tulis alamat tinggal atau kos dengan lebih lengkap.' : '',
    prodi: v => (!v.trim() ? 'Isi program studimu.' : '')
}

function formatTanggal(iso: string) {
    if (!iso) return ''
    const [y, m, d] = iso.split('-').map(Number)
    if (!y || !m || !d) return ''
    return new Date(y, m - 1, d).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}

function formatSize(bytes: number) {
    return bytes < 1024 * 1024
        ? `${Math.max(1, Math.round(bytes / 1024))} KB`
        : `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 text-base sm:text-sm rounded-xl border bg-[var(--surface-2)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 focus:border-[var(--primary)] transition-colors ${
        hasError ? 'border-red-500' : 'border-[var(--border)]'
    }`

function Field({
                   label,
                   name,
                   error,
                   hint,
                   children
               }: {
    label: string
    name: string
    error?: string
    hint?: string
    children: React.ReactNode
}) {
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-semibold text-[var(--text-primary)] mb-1.5">
                {label}
            </label>
            {children}
            {error ? (
                <p id={`${name}-error`} role="alert" className="text-red-500 text-xs mt-1.5">
                    {error}
                </p>
            ) : hint ? (
                <p className="text-[var(--text-muted)] text-xs mt-1.5">{hint}</p>
            ) : null}
        </div>
    )
}

function Skeleton({ className = '' }: { className?: string }) {
    return <span aria-hidden className={`block h-3.5 rounded bg-[var(--border)] ${className}`} />
}

function CardRow({
                     label,
                     value,
                     active
                 }: {
    label: string
    value: string
    active: boolean
}) {
    return (
        <div
            className={`rounded-lg px-3 py-2 transition-colors duration-200 ${
                active ? 'bg-[var(--primary)]/10' : ''
            }`}
        >
            <p className="text-[11px] text-[var(--text-muted)] mb-0.5">{label}</p>
            {value ? (
                <p className="text-sm text-[var(--text-primary)] font-medium break-words">{value}</p>
            ) : (
                <Skeleton className="w-2/3" />
            )}
        </div>
    )
}

function ParticipantCard({
                             values,
                             fotoUrl,
                             focused,
                             filled,
                             done
                         }: {
    values: FormValues
    fotoUrl: string | null
    focused: FocusKey
    filled: number
    done: boolean
}) {
    const ttl = [values.tempatLahir.trim(), formatTanggal(values.tanggalLahir)]
        .filter(Boolean)
        .join(', ')

    return (
        <div
            aria-label="Pratinjau kartu peserta"
            className="relative rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xl overflow-hidden"
        >
            <div className="bg-[var(--primary)] text-white px-5 py-3.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-sm font-bold font-display leading-tight">Kartu Peserta DAD</p>
                    <p className="text-xs opacity-80 truncate">PK IMM Kaizen UMSURA</p>
                </div>
                <span aria-hidden className="h-2.5 w-12 rounded-full bg-black/25 shrink-0" />
            </div>

            <div className="p-5">
                <div className="flex gap-4">
                    <div
                        className={`w-24 sm:w-28 shrink-0 aspect-[3/4] rounded-lg overflow-hidden border bg-[var(--surface-2)] flex items-center justify-center transition-shadow duration-200 ${
                            focused === 'foto'
                                ? 'ring-2 ring-[var(--primary)] border-[var(--primary)]'
                                : 'border-[var(--border)]'
                        } ${fotoUrl ? '' : 'border-dashed'}`}
                    >
                        {fotoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={fotoUrl} alt="Foto peserta" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-center px-2">
                                <ImagePlus className="w-5 h-5 mx-auto text-[var(--text-muted)]" />
                                <p className="text-[10px] text-[var(--text-muted)] mt-1 leading-tight">Foto 3 x 4</p>
                            </div>
                        )}
                    </div>

                    <div className="min-w-0 flex-1 py-0.5">
                        <p className="text-[11px] text-[var(--text-muted)] mb-1">Nama</p>
                        <div
                            className={`rounded-lg -mx-2 px-2 py-1 transition-colors duration-200 ${
                                focused === 'namaLengkap' ? 'bg-[var(--primary)]/10' : ''
                            }`}
                        >
                            {values.namaLengkap.trim() ? (
                                <p className="font-display font-black text-lg sm:text-xl leading-snug text-[var(--text-primary)] break-words">
                                    {values.namaLengkap}
                                </p>
                            ) : (
                                <div className="space-y-2 py-1">
                                    <Skeleton className="w-full h-4" />
                                    <Skeleton className="w-1/2 h-4" />
                                </div>
                            )}
                        </div>
                        <div className="mt-2">
                            <CardRow label="Program studi" value={values.prodi.trim()} active={focused === 'prodi'} />
                        </div>
                    </div>
                </div>

                <div className="mt-3 pt-3 border-t border-[var(--border)] -mx-1 space-y-0.5">
                    <CardRow
                        label="Tempat, tanggal lahir"
                        value={ttl}
                        active={focused === 'tempatLahir' || focused === 'tanggalLahir'}
                    />
                    <CardRow label="Asal daerah" value={values.asal.trim()} active={focused === 'asal'} />
                    <CardRow
                        label="Tinggal sekarang"
                        value={values.alamatSekarang.trim()}
                        active={focused === 'alamatSekarang'}
                    />
                </div>
            </div>

            <div className="px-5 pb-5">
                <div className="flex gap-1" aria-hidden>
                    {Array.from({ length: TOTAL_ITEMS }).map((_, i) => (
                        <span
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                                i < filled ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'
                            }`}
                        />
                    ))}
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-2">
                    {done
                        ? 'Data sudah kami terima.'
                        : filled === TOTAL_ITEMS
                            ? 'Semua data terisi, siap dikirim.'
                            : `${filled} dari ${TOTAL_ITEMS} data terisi`}
                </p>
            </div>

            {done && (
                <div
                    aria-hidden
                    className="absolute right-4 top-20 -rotate-12 rounded-lg border-2 border-[var(--primary)] bg-[var(--card)]/90 px-3 py-1 text-sm font-black font-display text-[var(--primary)] animate-in zoom-in-50 duration-300 motion-reduce:animate-none"
                >
                    Terdaftar
                </div>
            )}
        </div>
    )
}

export default function DaftarDADPage() {
    const [isRegistrationOpen, setIsRegistrationOpen] = useState(false)
    const [isCheckingStatus, setIsCheckingStatus] = useState(true)

    const [step, setStep] = useState(0)
    const [maxStep, setMaxStep] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [submitError, setSubmitError] = useState('')

    const [values, setValues] = useState<FormValues>({
        namaLengkap: '',
        tempatLahir: '',
        tanggalLahir: '',
        asal: '',
        alamatSekarang: '',
        prodi: ''
    })
    const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({})
    const [focused, setFocused] = useState<FocusKey>(null)

    const [foto, setFoto] = useState<File | null>(null)
    const [fotoUrl, setFotoUrl] = useState<string | null>(null)
    const [fotoError, setFotoError] = useState('')
    const [isDragging, setIsDragging] = useState(false)

    const formTopRef = useRef<HTMLDivElement>(null)

    const supabase = useMemo(
        () =>
            createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            ),
        []
    )

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const { data, error } = await supabase
                    .from('site_settings')
                    .select('value')
                    .eq('key', 'is_dad_open')
                    .maybeSingle()

                if (error) throw error
                if (data) setIsRegistrationOpen(data.value === true || data.value === 'true')
            } catch (error) {
                console.error('Error fetching settings:', error)
            } finally {
                setIsCheckingStatus(false)
            }
        }
        fetchStatus()
    }, [supabase])

    useEffect(() => {
        return () => {
            if (fotoUrl) URL.revokeObjectURL(fotoUrl)
        }
    }, [fotoUrl])

    const todayStr = new Date().toISOString().slice(0, 10)

    const filled =
        (Object.keys(values) as FieldName[]).filter(k => values[k].trim() !== '').length +
        (foto ? 1 : 0)

    const setField = (name: FieldName, value: string) => {
        setValues(v => ({ ...v, [name]: value }))
        if (errors[name]) setErrors(e => ({ ...e, [name]: '' }))
    }

    const blurField = (name: FieldName) => {
        setFocused(null)
        if (values[name].trim()) {
            setErrors(e => ({ ...e, [name]: validators[name](values[name]) }))
        }
    }

    const bind = (name: FieldName) => ({
        id: name,
        name,
        value: values[name],
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setField(name, e.target.value),
        onFocus: () => setFocused(name),
        onBlur: () => blurField(name),
        'aria-invalid': !!errors[name],
        'aria-describedby': errors[name] ? `${name}-error` : undefined
    })

    const pickFile = (file?: File) => {
        setFotoError('')
        if (!file) return
        if (!file.type.startsWith('image/')) {
            setFotoError('File harus berupa gambar (JPG, PNG, atau WEBP).')
            return
        }
        if (file.size > MAX_FILE_SIZE) {
            setFotoError('Ukuran file maksimal 10MB.')
            return
        }
        setFoto(file)
        setFotoUrl(URL.createObjectURL(file))
    }

    const removeFoto = () => {
        setFoto(null)
        setFotoUrl(null)
        setFotoError('')
    }

    const validateStep = (i: number) => {
        const next: Partial<Record<FieldName, string>> = {}
        let firstInvalid: string | null = null

        STEPS[i].fields.forEach(f => {
            const msg = validators[f](values[f])
            if (msg) {
                next[f] = msg
                if (!firstInvalid) firstInvalid = f
            }
        })
        setErrors(e => ({ ...e, ...next }))

        if (i === 2 && !foto) {
            setFotoError('Foto wajib diunggah.')
            firstInvalid = 'foto'
        }

        if (firstInvalid) {
            requestAnimationFrame(() => document.getElementById(firstInvalid!)?.focus())
            return false
        }
        return true
    }

    const scrollToForm = () =>
        formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

    const goNext = () => {
        if (!validateStep(step)) return
        const n = step + 1
        setStep(n)
        setMaxStep(m => Math.max(m, n))
        scrollToForm()
    }

    const goTo = (i: number) => {
        if (i > maxStep) return
        setStep(i)
        scrollToForm()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (step < 2) {
            goNext()
            return
        }

        for (let i = 0; i < STEPS.length; i++) {
            if (!validateStep(i)) {
                setStep(i)
                return
            }
        }
        if (!foto) return

        setIsSubmitting(true)
        setSubmitError('')

        let uploadedName: string | null = null

        try {
            const slug =
                values.namaLengkap
                    .trim()
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-|-$/g, '') || 'peserta'
            const fileExt = (foto.name.split('.').pop() || 'jpg').toLowerCase()
            const fileName = `${Date.now()}-${slug}.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('dad_photos')
                .upload(fileName, foto)

            if (uploadError) throw new Error('Gagal mengunggah foto: ' + uploadError.message)
            uploadedName = fileName

            const { data: publicUrlData } = supabase.storage
                .from('dad_photos')
                .getPublicUrl(fileName)

            const { error: insertError } = await supabase.from('dad_registrations').insert([
                {
                    nama_lengkap: values.namaLengkap.trim(),
                    tempat_tanggal_lahir: `${values.tempatLahir.trim()}, ${formatTanggal(values.tanggalLahir)}`,
                    asal: values.asal.trim(),
                    alamat_sekarang: values.alamatSekarang.trim(),
                    prodi: values.prodi.trim(),
                    foto_url: publicUrlData.publicUrl
                }
            ])

            if (insertError) throw new Error('Gagal menyimpan data: ' + insertError.message)

            setIsSuccess(true)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        } catch (error: any) {
            console.error('Error submitting form:', error?.message)
            if (uploadedName) {
                await supabase.storage.from('dad_photos').remove([uploadedName]).catch(() => {})
            }
            setSubmitError(error?.message || 'Pendaftaran belum terkirim. Periksa koneksi lalu coba lagi.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const header = (
        <header className="p-4 sm:p-6 relative z-10 max-w-6xl mx-auto w-full flex items-center justify-between">
            <Logo size="md" />
            <Link
                href="/"
                className="text-xs sm:text-sm font-bold text-[var(--text-muted)] hover:text-[var(--primary)] flex items-center gap-1.5 font-display transition-colors"
            >
                <ArrowLeft className="w-4 h-4 text-[var(--primary)]" />
                <span className="hidden sm:inline">Kembali ke website</span>
                <span className="sm:hidden">Kembali</span>
            </Link>
        </header>
    )

    const footer = (
        <footer className="py-5 sm:py-6 border-t border-[var(--border)] text-center text-xs text-[var(--text-muted)] font-display relative z-10 px-4">
            © 2026 PK IMM Kaizen, Universitas Muhammadiyah Surabaya
        </footer>
    )

    const shell = 'min-h-screen bg-[var(--background)] flex flex-col font-sans selection:bg-[var(--primary)] selection:text-white'

    if (isSuccess) {
        return (
            <div className={shell}>
                {header}
                <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-12 grid md:grid-cols-2 gap-8 md:gap-14 items-center">
                    <div className="order-2 md:order-1 text-center md:text-left">
                        <div className="w-14 h-14 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mb-5 border border-[var(--primary)]/30 text-[var(--primary)] mx-auto md:mx-0">
                            <CheckCircle2 className="w-7 h-7" />
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black text-[var(--text-primary)] mb-3 font-display tracking-tight">
                            Pendaftaran berhasil
                        </h1>
                        <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed mb-7 max-w-md mx-auto md:mx-0">
                            Terima kasih, <strong className="text-[var(--text-primary)]">{values.namaLengkap}</strong>.
                            Data Darul Arqam Dasar (DAD) kamu sudah kami terima. Panitia akan menghubungimu untuk
                            informasi selanjutnya.
                        </p>
                        <Link
                            href="/"
                            className="btn-primary inline-flex w-full sm:w-auto justify-center items-center px-8 py-3.5 text-sm font-bold font-display rounded-xl shadow-md transition-all hover:-translate-y-0.5"
                        >
                            Kembali ke beranda
                        </Link>
                    </div>
                    <div className="order-1 md:order-2 w-full max-w-sm mx-auto">
                        <ParticipantCard values={values} fotoUrl={fotoUrl} focused={null} filled={TOTAL_ITEMS} done />
                    </div>
                </main>
                {footer}
            </div>
        )
    }

    const formDisabled = !isRegistrationOpen || isCheckingStatus

    return (
        <div className={shell}>
            {isCheckingStatus ? (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4" role="status">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-9 h-9 animate-spin text-[var(--primary)]" />
                        <p className="text-sm font-bold text-white font-display">Mengecek status pendaftaran...</p>
                    </div>
                </div>
            ) : !isRegistrationOpen ? (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="closed-title"
                        className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 sm:p-10 max-w-md w-full text-center shadow-2xl animate-in fade-in zoom-in-95 duration-300 motion-reduce:animate-none"
                    >
                        <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-5 border border-[var(--primary)]/30 text-[var(--primary)]">
                            <Clock className="w-8 h-8" />
                        </div>
                        <h2 id="closed-title" className="text-xl sm:text-2xl font-black text-[var(--text-primary)] mb-3 font-display tracking-tight">
                            Pendaftaran belum dibuka
                        </h2>
                        <p className="text-[var(--text-secondary)] text-sm mb-7 leading-relaxed">
                            Pendaftaran Darul Arqam Dasar (DAD) belum dimulai. Jadwalnya akan diumumkan lewat media
                            sosial resmi IMM Kaizen UMSurabaya.
                        </p>
                        <Link
                            href="/"
                            className="btn-primary w-full justify-center py-3.5 text-sm font-bold font-display flex items-center rounded-xl shadow-md transition-all"
                        >
                            Kembali ke beranda
                        </Link>
                    </div>
                </div>
            ) : null}

            {header}

            <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8 lg:py-12 relative z-10">
                <div
                    className={`transition-opacity duration-300 ${
                        formDisabled ? 'pointer-events-none opacity-40 select-none' : ''
                    }`}
                    aria-hidden={formDisabled}
                >
                    <div className="max-w-2xl mb-8 lg:mb-10">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] leading-[1.1] font-display tracking-tight mb-3">
                            Daftar Darul Arqam Dasar
                        </h1>
                        <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed">
                            Isi tiga langkah singkat. Kartu pesertamu ikut terisi saat kamu mengetik, jadi kamu bisa
                            langsung memeriksa datanya.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-8 lg:gap-14 items-start">
                        <aside className="order-first lg:order-last lg:sticky lg:top-8 w-full max-w-sm mx-auto lg:max-w-none">
                            <ParticipantCard
                                values={values}
                                fotoUrl={fotoUrl}
                                focused={focused}
                                filled={filled}
                                done={false}
                            />
                        </aside>

                        <div ref={formTopRef} className="scroll-mt-4 min-w-0">
                            <ol className="flex gap-2 sm:gap-3 mb-6" aria-label="Langkah pendaftaran">
                                {STEPS.map((s, i) => {
                                    const isDone = i < step
                                    const isActive = i === step
                                    return (
                                        <li key={s.title} className="flex-1 min-w-0">
                                            <button
                                                type="button"
                                                disabled={i > maxStep}
                                                onClick={() => goTo(i)}
                                                aria-current={isActive ? 'step' : undefined}
                                                className="w-full text-left disabled:cursor-not-allowed focus-visible:outline-none group"
                                            >
                                                <span
                                                    className={`block h-1.5 rounded-full transition-colors duration-300 group-focus-visible:ring-2 group-focus-visible:ring-[var(--primary)]/50 ${
                                                        i <= step ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'
                                                    }`}
                                                />
                                                <span
                                                    className={`mt-2 flex items-center gap-1.5 text-xs sm:text-sm font-semibold min-w-0 ${
                                                        isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'
                                                    }`}
                                                >
                                                    {isDone ? (
                                                        <Check className="w-3.5 h-3.5 shrink-0 text-[var(--primary)]" />
                                                    ) : (
                                                        <span className="shrink-0">{i + 1}.</span>
                                                    )}
                                                    <span className="truncate">{s.title}</span>
                                                </span>
                                            </button>
                                        </li>
                                    )
                                })}
                            </ol>

                            <form
                                onSubmit={handleSubmit}
                                noValidate
                                className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 sm:p-8 shadow-xl"
                            >
                                <div
                                    key={step}
                                    className="space-y-5 animate-in fade-in slide-in-from-right-3 duration-200 motion-reduce:animate-none"
                                >
                                    {step === 0 && (
                                        <>
                                            <Field label="Nama lengkap" name="namaLengkap" error={errors.namaLengkap}>
                                                <input
                                                    type="text"
                                                    autoComplete="name"
                                                    placeholder="Masukkan nama lengkap"
                                                    className={inputClass(!!errors.namaLengkap)}
                                                    {...bind('namaLengkap')}
                                                />
                                            </Field>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                                <Field label="Tempat lahir" name="tempatLahir" error={errors.tempatLahir}>
                                                    <input
                                                        type="text"
                                                        placeholder="Contoh: Surabaya"
                                                        className={inputClass(!!errors.tempatLahir)}
                                                        {...bind('tempatLahir')}
                                                    />
                                                </Field>
                                                <Field label="Tanggal lahir" name="tanggalLahir" error={errors.tanggalLahir}>
                                                    <input
                                                        type="date"
                                                        max={todayStr}
                                                        className={inputClass(!!errors.tanggalLahir)}
                                                        {...bind('tanggalLahir')}
                                                    />
                                                </Field>
                                            </div>
                                        </>
                                    )}

                                    {step === 1 && (
                                        <>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                                <Field label="Asal daerah" name="asal" error={errors.asal}>
                                                    <input
                                                        type="text"
                                                        placeholder="Contoh: Surabaya"
                                                        className={inputClass(!!errors.asal)}
                                                        {...bind('asal')}
                                                    />
                                                </Field>
                                                <Field label="Program studi" name="prodi" error={errors.prodi}>
                                                    <input
                                                        type="text"
                                                        placeholder="Contoh: S1 Informatika"
                                                        className={inputClass(!!errors.prodi)}
                                                        {...bind('prodi')}
                                                    />
                                                </Field>
                                            </div>
                                            <Field
                                                label="Alamat tinggal sekarang"
                                                name="alamatSekarang"
                                                error={errors.alamatSekarang}
                                                hint="Alamat rumah atau kos yang kamu tempati saat ini."
                                            >
                                                <textarea
                                                    rows={3}
                                                    autoComplete="street-address"
                                                    placeholder="Jalan, nomor, kelurahan"
                                                    className={`${inputClass(!!errors.alamatSekarang)} resize-none`}
                                                    {...bind('alamatSekarang')}
                                                />
                                            </Field>
                                        </>
                                    )}

                                    {step === 2 && (
                                        <div>
                                            <p className="block text-sm font-semibold text-[var(--text-primary)] mb-1.5">
                                                Foto memakai almamater, 3 x 4
                                            </p>

                                            <div
                                                onDragOver={e => {
                                                    e.preventDefault()
                                                    setIsDragging(true)
                                                }}
                                                onDragLeave={() => setIsDragging(false)}
                                                onDrop={e => {
                                                    e.preventDefault()
                                                    setIsDragging(false)
                                                    pickFile(e.dataTransfer.files?.[0])
                                                }}
                                            >
                                                <input
                                                    type="file"
                                                    id="foto"
                                                    name="foto"
                                                    accept="image/*"
                                                    className="peer sr-only"
                                                    onChange={e => {
                                                        pickFile(e.target.files?.[0])
                                                        e.target.value = ''
                                                    }}
                                                    onFocus={() => setFocused('foto')}
                                                    onBlur={() => setFocused(null)}
                                                    aria-describedby={fotoError ? 'foto-error' : undefined}
                                                />
                                                <label
                                                    htmlFor="foto"
                                                    className={`flex flex-col sm:flex-row items-center gap-4 w-full cursor-pointer rounded-xl border-2 border-dashed p-5 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--primary)]/50 ${
                                                        isDragging
                                                            ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                                                            : fotoError
                                                                ? 'border-red-500 bg-[var(--surface-2)]'
                                                                : 'border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--primary)]/60'
                                                    }`}
                                                >
                                                    {fotoUrl ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img
                                                            src={fotoUrl}
                                                            alt="Pratinjau foto"
                                                            className="w-20 aspect-[3/4] rounded-lg object-cover border border-[var(--border)] shrink-0"
                                                        />
                                                    ) : (
                                                        <span className="w-12 h-12 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0">
                                                            <UploadCloud className="w-6 h-6" />
                                                        </span>
                                                    )}
                                                    <span className="text-center sm:text-left min-w-0">
                                                        <span className="block text-sm font-semibold text-[var(--text-primary)] truncate">
                                                            {foto
                                                                ? foto.name
                                                                : isDragging
                                                                    ? 'Lepaskan untuk mengunggah'
                                                                    : 'Pilih foto atau seret ke sini'}
                                                        </span>
                                                        <span className="block text-xs text-[var(--text-muted)] mt-0.5">
                                                            {foto
                                                                ? `${formatSize(foto.size)}. Ketuk untuk mengganti.`
                                                                : 'JPG, PNG, atau WEBP. Maksimal 10MB.'}
                                                        </span>
                                                    </span>
                                                </label>
                                            </div>

                                            {foto && (
                                                <button
                                                    type="button"
                                                    onClick={removeFoto}
                                                    className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" /> Hapus foto
                                                </button>
                                            )}
                                            {fotoError && (
                                                <p id="foto-error" role="alert" className="text-red-500 text-xs mt-1.5">
                                                    {fotoError}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {submitError && (
                                    <p
                                        role="alert"
                                        className="mt-5 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-500"
                                    >
                                        {submitError}
                                    </p>
                                )}

                                <div className="mt-7 flex flex-col-reverse sm:flex-row gap-3">
                                    {step > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => goTo(step - 1)}
                                            disabled={isSubmitting}
                                            className="sm:w-auto w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold font-display rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--primary)]/60 hover:text-[var(--text-primary)] transition-colors disabled:opacity-50"
                                        >
                                            <ArrowLeft className="w-4 h-4" /> Kembali
                                        </button>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting || formDisabled}
                                        className="btn-primary flex-1 justify-center py-3.5 text-sm font-bold font-display shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50 rounded-xl transition-all hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" /> Mengirim pendaftaran...
                                            </>
                                        ) : step < 2 ? (
                                            <>
                                                Lanjut <ArrowRight className="w-4 h-4" />
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" /> Kirim pendaftaran
                                            </>
                                        )}
                                    </button>
                                </div>

                                <p className="text-center text-xs text-[var(--text-muted)] mt-5 flex items-center justify-center gap-1.5 leading-normal">
                                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                                    Datamu hanya dipakai untuk verifikasi pendaftaran DAD.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            {footer}
        </div>
    )
}
