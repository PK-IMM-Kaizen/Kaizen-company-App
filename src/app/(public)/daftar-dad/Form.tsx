import type { ChangeEvent } from 'react'

export type FieldName =
    | 'namaLengkap'
    | 'tempatLahir'
    | 'tanggalLahir'
    | 'nim'
    | 'prodi'
    | 'asal'
    | 'alamatSekarang'

export type FormValues = Record<FieldName, string>
export type FieldErrors = Partial<Record<FieldName, string>>

export type FieldBinding = {
    id: string
    name: string
    value: string
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    onBlur: () => void
    'aria-invalid': boolean
    'aria-describedby'?: string
}
export type BindFn = (name: FieldName) => FieldBinding

export const steps: { title: string; fields: FieldName[] }[] = [
    { title: 'Data diri', fields: ['namaLengkap', 'tempatLahir', 'tanggalLahir'] },
    { title: 'Kampus', fields: ['nim', 'prodi', 'asal', 'alamatSekarang'] },
    { title: 'Foto', fields: [] },
    { title: 'Pembayaran', fields: [] }
]

export const stepFoto = 2
export const stepBayar = 3
export const lastStep = steps.length - 1

export const maxFotoSize = 10 * 1024 * 1024
export const maxBuktiSize = 5 * 1024 * 1024

export const initialValues: FormValues = {
    namaLengkap: '',
    tempatLahir: '',
    tanggalLahir: '',
    nim: '',
    prodi: '',
    asal: '',
    alamatSekarang: ''
}

export const validators: Record<FieldName, (v: string) => string> = {
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
    nim: v => (/^[A-Za-z0-9.\-]{5,20}$/.test(v.trim()) ? '' : 'NIM tidak valid, periksa lagi (5 sampai 20 karakter).'),
    prodi: v => (!v.trim() ? 'Isi program studimu.' : ''),
    asal: v => (!v.trim() ? 'Isi daerah asalmu.' : ''),
    alamatSekarang: v =>
        v.trim().length < 5 ? 'Tulis alamat tinggal atau kos dengan lebih lengkap.' : ''
}