import Field, { inputClass } from './Field'
import type { BindFn, FieldErrors } from './Form'

interface StepDataDiriProps {
    bind: BindFn
    errors: FieldErrors
    maxDate: string
}

export default function StepDataDiri({ bind, errors, maxDate }: StepDataDiriProps) {
    return (
        <div className="space-y-4 sm:space-y-5">
            <Field label="Nama lengkap" name="namaLengkap" error={errors.namaLengkap}>
                <input
                    type="text"
                    autoComplete="name"
                    placeholder="Masukkan nama lengkap"
                    className={`${inputClass(!!errors.namaLengkap)} text-base sm:text-sm`}
                    {...bind('namaLengkap')}
                />
            </Field>

            <Field
                label="Nomor WhatsApp / HP"
                name="nomorHp"
                error={errors.nomorHp}
                hint="Gunakan nomor aktif yang terhubung dengan WhatsApp."
            >
                <input
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="Contoh: 081234567890"
                    className={`${inputClass(!!errors.nomorHp)} text-base sm:text-sm`}
                    {...bind('nomorHp')}
                />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                <Field label="Tempat lahir" name="tempatLahir" error={errors.tempatLahir}>
                    <input
                        type="text"
                        placeholder="Contoh: Surabaya"
                        className={`${inputClass(!!errors.tempatLahir)} text-base sm:text-sm`}
                        {...bind('tempatLahir')}
                    />
                </Field>
                <Field label="Tanggal lahir" name="tanggalLahir" error={errors.tanggalLahir}>
                    <input
                        type="date"
                        max={maxDate}
                        className={`${inputClass(!!errors.tanggalLahir)} text-base sm:text-sm min-h-[44px]`}
                        {...bind('tanggalLahir')}
                    />
                </Field>
            </div>
        </div>
    )
}
