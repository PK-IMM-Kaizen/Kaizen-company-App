import type { ChangeEvent } from 'react'

export type FieldName =
    | 'namaLengkap'
    | 'tempatLahir'
    | 'tanggalLahir'
    | 'asal'
    | 'alamatSekarang'
    | 'prodi'

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
    { title: 'Asal dan kampus', fields: ['asal', 'alamatSekarang', 'prodi'] },
    { title: 'Foto', fields: [] }
]

export const LastStep = steps.length - 1
export const MaxFileSize = 10 * 1024 * 1024

export const InitialValues: FormValues = {
    namaLengkap: '',
    tempatLahir: '',
    tanggalLahir: '',
    asal: '',
    alamatSekarang: '',
    prodi: ''
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
    asal: v => (!v.trim() ? 'Isi daerah asalmu.' : ''),
    alamatSekarang: v =>
        v.trim().length < 5 ? 'Tulis alamat tinggal atau kos dengan lebih lengkap.' : '',
    prodi: v => (!v.trim() ? 'Isi program studimu.' : '')
}