'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { ArrowLeft, ArrowRight, Loader2, Send, ShieldCheck } from 'lucide-react'

import PageShell from './Pageshell'
import Statusoverlay from './Statusoverlay'
import Stepper from './Stepper'
import StepDataDiri from './Stepdatadiri'
import StepAsalKampus from './Stepasalkampus'
import StepFoto from './Stepfoto'
import SuccessScreen from './Successcreen'

import {
    steps,
    LastStep,
    MaxFileSize,
    InitialValues,
    validators,
    type BindFn,
    type FieldErrors,
    type FieldName,
    type FormValues
} from './Form'
import { slugify, formatTanggal } from './Format'

export default function DaftarDADPage() {
    const [isRegistrationOpen, setIsRegistrationOpen] = useState(false)
    const [isCheckingStatus, setIsCheckingStatus] = useState(true)

    const [step, setStep] = useState(0)
    const [maxStep, setMaxStep] = useState(0)
    const [values, setValues] = useState<FormValues>(InitialValues)
    const [errors, setErrors] = useState<FieldErrors>({})

    const [foto, setFoto] = useState<File | null>(null)
    const [fotoUrl, setFotoUrl] = useState<string | null>(null)
    const [fotoError, setFotoError] = useState('')

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

    useEffect(() => {
        return () => {
            if (fotoUrl) URL.revokeObjectURL(fotoUrl)
        }
    }, [fotoUrl])

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

    const pickFile = (file?: File) => {
        setFotoError('')
        if (!file) return
        if (!file.type.startsWith('image/')) {
            setFotoError('File harus berupa gambar (JPG, PNG, atau WEBP).')
            return
        }
        if (file.size > MaxFileSize) {
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

        if (i === LastStep && !foto) {
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
        if (step < LastStep) {
            goNext()
            return
        }

        for (let i = 0; i < steps.length; i++) {
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
            const fileExt = (foto.name.split('.').pop() || 'jpg').toLowerCase()
            const fileName = `${Date.now()}-${slugify(values.namaLengkap)}.${fileExt}`

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

    if (isSuccess && fotoUrl) {
        return (
            <PageShell>
                <SuccessScreen
                    nama={values.namaLengkap.trim()}
                    prodi={values.prodi.trim()}
                    fotoUrl={fotoUrl}
                />
            </PageShell>
        )
    }

    const formDisabled = !isRegistrationOpen || isCheckingStatus

    return (
        <PageShell>
            <Statusoverlay isChecking={isCheckingStatus} isOpen={isRegistrationOpen} />

            <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10 lg:py-14 relative z-10">
                <div
                    className={`transition-opacity duration-300 ${
                        formDisabled ? 'pointer-events-none opacity-40 select-none' : ''
                    }`}
                    aria-hidden={formDisabled}
                >
                    <div className="mb-10 text-center sm:text-left">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] leading-[1.2] font-display tracking-tight mb-4">
                            Daftar Darul Arqam Dasar
                        </h1>
                        <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed max-w-xl">
                            Isi tiga langkah singkat. Setelah terkirim, kartu pesertamu langsung bisa diunduh.
                        </p>
                    </div>

                    <div ref={formTopRef} className="scroll-mt-6 min-w-0">
                        <Stepper step={step} maxStep={maxStep} onSelect={goTo} />

                        <form
                            onSubmit={handleSubmit}
                            noValidate
                            className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 shadow-xl mt-6"
                        >
                            <div
                                key={step}
                                className="space-y-6 animate-in fade-in slide-in-from-right-3 duration-200 motion-reduce:animate-none min-h-[300px]"
                            >
                                {step === 0 && (
                                    <StepDataDiri bind={bind} errors={errors} maxDate={todayStr} />
                                )}
                                {step === 1 && <StepAsalKampus bind={bind} errors={errors} />}
                                {step === 2 && (
                                    <StepFoto
                                        values={values}
                                        foto={foto}
                                        fotoUrl={fotoUrl}
                                        fotoError={fotoError}
                                        onPick={pickFile}
                                        onRemove={removeFoto}
                                        onEditData={() => goTo(0)}
                                    />
                                )}
                            </div>

                            {submitError && (
                                <p
                                    role="alert"
                                    className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-500 flex items-start gap-2"
                                >
                                    <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
                                    {submitError}
                                </p>
                            )}

                            <div className="mt-8 pt-6 border-t border-[var(--border)] flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
                                {step > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => goTo(step - 1)}
                                        disabled={isSubmitting}
                                        className="sm:w-auto w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold font-display rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:border-[var(--primary)]/50 hover:text-[var(--text-primary)] transition-all disabled:opacity-50"
                                    >
                                        <ArrowLeft className="w-4 h-4" /> Kembali
                                    </button>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting || formDisabled}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold font-display rounded-xl bg-[var(--primary)] text-white shadow-md hover:bg-[var(--primary-dark)] hover:-translate-y-0.5 transition-all disabled:opacity-50 cursor-pointer motion-reduce:hover:translate-y-0"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" /> Mengirim...
                                        </>
                                    ) : step < LastStep ? (
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

                            <p className="text-center text-xs text-[var(--text-muted)] mt-6 flex items-center justify-center gap-1.5 leading-normal">
                                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                                Datamu hanya dipakai untuk verifikasi pendaftaran DAD.
                            </p>
                        </form>
                    </div>
                </div>
            </main>
        </PageShell>
    )
}