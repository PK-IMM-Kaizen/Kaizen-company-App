import Field, { inputClass } from './Field'
import type { BindFn, FieldErrors } from './Form'

export default function StepDataDiri({
                                         bind,
                                         errors,
                                         maxDate
                                     }: {
    bind: BindFn
    errors: FieldErrors
    maxDate: string
}) {
    return (
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
                        max={maxDate}
                        className={inputClass(!!errors.tanggalLahir)}
                        {...bind('tanggalLahir')}
                    />
                </Field>
            </div>
        </>
    )
}