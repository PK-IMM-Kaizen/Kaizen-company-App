'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { ArrowLeft, ArrowRight, Loader2, Send, ShieldCheck } from 'lucide-react'

import PageShell from './PageShell'
import PageHero from './PageHero'
import StatusOverlay from './StatusOverlay'
import Paper from './Paper'
import Stepper from './Stepper'
import StepDataDiri from './StepDataDiri'
import StepAsalKampus from './StepAsalKampus'
import StepFoto from './StepFoto'
import StepPembayaran from './StepPembayaran'
import Timeline from './Timeline'
import ContactPerson from './ContactPerson'
import SuccessScreen from './SuccessScreen'
import { primaryBtn, secondaryBtn } from './Button'

import {
    steps,
    stepFoto,
    stepBayar,
    lastStep,
    maxFotoSize,
    maxBuktiSize,
    initialValues,
    validators,
    type BindFn,
    type FieldErrors,
    type FieldName,
    type FormValues
} from './Form'
import { slugify, formatTanggal } from './Format'

const extOf = (file: File, fallback: string) =>
    (file.name.split('.').pop() || fallback).toLowerCase().replace(/[^a-z0-9]/g, '') || fallback

export default function DaftarDADPage() {
    const [isRegistrationOpen, setIsRegistrationOpen] = useState(false)
    const [isCheckingStatus, setIsCheckingStatus] = useState(true)

    const [step, setStep] = useState(0)
    const [maxStep, setMaxStep] = useState(0)
    const [values, setValues] = useState<FormValues>(initialValues)
    const [errors, setErrors] = useState<FieldErrors>({})

    const [foto, setFoto] = useState<File | null>(null)
    const [fotoUrl, setFotoUrl] = useState<string | null>(null)
    const [fotoError, setFotoError] = useState('')

    const [bukti, setBukti] = useState<File | null>(null)
    const [buktiUrl, setBuktiUrl] = useState<string | null>(null)
    const [buktiError, setBuktiError] = useState('')

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [submitError, setSubmitError] = useState('')

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

    useEffect(() => () => { if (fotoUrl) URL.revokeObjectURL(fotoUrl) }, [fotoUrl])
    useEffect(() => () => { if (buktiUrl) URL.revokeObjectURL(buktiUrl) }, [buktiUrl])

    const todayStr = new Date().toISOString().slice(0, 10)

    const setField = (name: FieldName, value: string) => {
        setValues(v => ({ ...v, [name]: value }))
        if (errors[name]) setErrors(e => ({ ...e, [name]: '' }))
    }

    const blurField = (name: FieldName) => {
        if (values[name].trim()) {
            setErrors(e => ({ ...e, [name]: validators[name](values[name]) }))
        }
    }

    const bind: BindFn = name => ({
        id: name,
        name,
        value: values[name],
        onChange: e => setField(name, e.target.value),
        onBlur: () => blurField(name),
        'aria-invalid': !!errors[name],
        'aria-describedby': errors[name] ? `${name}-error` : undefined
    })

    const pickFoto = (file?: File) => {
        setFotoError('')
        if (!file) return
        if (!file.type.startsWith('image/')) {
            setFotoError('File harus berupa gambar (JPG, PNG, atau WEBP).')
            return
        }
        if (file.size > maxFotoSize) {
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

    const pickBukti = (file?: File) => {
        setBuktiError('')
        if (!file) return
        const isImage = file.type.startsWith('image/')
        if (!isImage && file.type !== 'application/pdf') {
            setBuktiError('Bukti pembayaran harus berupa gambar atau PDF.')
            return
        }
        if (file.size > maxBuktiSize) {
            setBuktiError('Ukuran file maksimal 5MB.')
            return
        }
        setBukti(file)
        setBuktiUrl(isImage ? URL.createObjectURL(file) : null)
    }

    const removeBukti = () => {
        setBukti(null)
        setBuktiUrl(null)
        setBuktiError('')
    }

    const validateStep = (i: number) => {
        const next: FieldErrors = {}
        let firstInvalid: string | null = null

        steps[i].fields.forEach(f => {
            const msg = validators[f](values[f])
            if (msg) {
                next[f] = msg
                if (!firstInvalid) firstInvalid = f
            }
        })
        setErrors(e => ({ ...e, ...next }))

        if (i === stepFoto && !foto) {
            setFotoError('Foto wajib diunggah.')
            firstInvalid = 'foto'
        }
        if (i === stepBayar && !bukti) {
            setBuktiError('Bukti pembayaran wajib diunggah.')
            firstInvalid = 'bukti'
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
        if (step < lastStep) {
            goNext()
            return
        }

        for (let i = 0; i < steps.length; i++) {
            if (!validateStep(i)) {
                setStep(i)
                return
            }
        }
        if (!foto || !bukti) return

        setIsSubmitting(true)
        setSubmitError('')

        let fotoName: string | null = null
        let buktiName: string | null = null

        try {
            const base = `${Date.now()}-${slugify(values.namaLengkap)}`

            const fotoFile = `${base}.${extOf(foto, 'jpg')}`
            const { error: fotoErr } = await supabase.storage.from('dad_photos').upload(fotoFile, foto)
            if (fotoErr) throw new Error('Gagal mengunggah foto: ' + fotoErr.message)
            fotoName = fotoFile

            const { data: publicUrlData } = supabase.storage.from('dad_photos').getPublicUrl(fotoFile)

            const buktiFile = `${base}.${extOf(bukti, 'jpg')}`
            const { error: buktiErr } = await supabase.storage.from('dad_payments').upload(buktiFile, bukti)
            if (buktiErr) throw new Error('Gagal mengunggah bukti pembayaran: ' + buktiErr.message)
            buktiName = buktiFile

            const { error: insertError } = await supabase.from('dad_registrations').insert([
                {
                    nama_lengkap: values.namaLengkap.trim(),
                    tempat_tanggal_lahir: `${values.tempatLahir.trim()}, ${formatTanggal(values.tanggalLahir)}`,
                    nim: values.nim.trim(),
                    asal: values.asal.trim(),
                    alamat_sekarang: values.alamatSekarang.trim(),
                    prodi: values.prodi.trim(),
                    foto_url: publicUrlData.publicUrl,
                    bukti_pembayaran_path: buktiFile
                }
            ])
            if (insertError) throw new Error('Gagal menyimpan data: ' + insertError.message)

            setIsSuccess(true)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        } catch (error: any) {
            console.error('Error submitting form:', error?.message)
            if (fotoName) await supabase.storage.from('dad_photos').remove([fotoName]).catch(() => {})
            if (buktiName) await supabase.storage.from('dad_payments').remove([buktiName]).catch(() => {})
            setSubmitError(error?.message || 'Pendaftaran belum terkirim. Periksa koneksi lalu coba lagi.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSuccess && fotoUrl) {
        return (
            <PageShell>
                <SuccessScreen
                    data={{
                        nama: values.namaLengkap.trim(),
                        nim: values.nim.trim(),
                        prodi: values.prodi.trim(),
                        alamat: values.alamatSekarang.trim(),
                        ttl: `${values.tempatLahir.trim()}, ${formatTanggal(values.tanggalLahir)}`,
                        fotoUrl
                    }}
                />
            </PageShell>
        )
    }

    const formDisabled = !isRegistrationOpen || isCheckingStatus

    return (
        <PageShell>
            <StatusOverlay isChecking={isCheckingStatus} isOpen={isRegistrationOpen} />

            <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-12 pt-2 sm:px-6 sm:pt-6">
                <PageHero />

                <div className="mt-10">
                    <Timeline />
                </div>

                <div className="mt-12 grid items-start gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-14">
                    <div
                        ref={formTopRef}
                        className={`min-w-0 scroll-mt-4 transition-opacity duration-300 ${
                            formDisabled ? 'pointer-events-none select-none opacity-40' : ''
                        }`}
                        aria-hidden={formDisabled}
                    >
                        <Paper clip>
                            <Stepper step={step} maxStep={maxStep} onSelect={goTo} />

                            <form onSubmit={handleSubmit} noValidate>
                                <div
                                    key={step}
                                    className="space-y-5 animate-in fade-in slide-in-from-right-3 duration-200 motion-reduce:animate-none"
                                >
                                    {step === 0 && (
                                        <StepDataDiri bind={bind} errors={errors} maxDate={todayStr} />
                                    )}
                                    {step === 1 && <StepAsalKampus bind={bind} errors={errors} />}
                                    {step === stepFoto && (
                                        <StepFoto
                                            foto={foto}
                                            fotoUrl={fotoUrl}
                                            fotoError={fotoError}
                                            onPick={pickFoto}
                                            onRemove={removeFoto}
                                        />
                                    )}
                                    {step === stepBayar && (
                                        <StepPembayaran
                                            values={values}
                                            bukti={bukti}
                                            buktiUrl={buktiUrl}
                                            buktiError={buktiError}
                                            onPick={pickBukti}
                                            onRemove={removeBukti}
                                            onEditData={() => goTo(0)}
                                        />
                                    )}
                                </div>

                                {submitError && (
                                    <p
                                        role="alert"
                                        className="mt-5 rounded-xl border border-red-500/40 bg-red-50 px-4 py-3 text-sm text-red-700"
                                    >
                                        {submitError}
                                    </p>
                                )}

                                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row">
                                    {step > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => goTo(step - 1)}
                                            disabled={isSubmitting}
                                            className={`${secondaryBtn} w-full sm:w-auto`}
                                        >
                                            <ArrowLeft className="h-4 w-4" /> Kembali
                                        </button>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting || formDisabled}
                                        className={`${primaryBtn} flex-1`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" /> Mengirim pendaftaran...
                                            </>
                                        ) : step < lastStep ? (
                                            <>
                                                Lanjut <ArrowRight className="h-4 w-4" />
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-4 w-4" /> Kirim pendaftaran
                                            </>
                                        )}
                                    </button>
                                </div>

                                <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-xs leading-normal text-[#7d6b68]">
                                    <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                                    Datamu hanya dipakai untuk verifikasi pendaftaran DAD.
                                </p>
                            </form>
                        </Paper>
                    </div>

                    <aside className="min-w-0 lg:sticky lg:top-6">
                        <ContactPerson />
                    </aside>
                </div>
            </main>
        </PageShell>
    )
}
