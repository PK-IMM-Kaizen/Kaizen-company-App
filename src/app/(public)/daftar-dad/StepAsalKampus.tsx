import Field, { inputClass } from './Field'
import type { BindFn, FieldErrors } from './Form'

interface StepAsalKampusProps {
    bind: BindFn
    errors: FieldErrors
}

export default function StepAsalKampus({ bind, errors }: StepAsalKampusProps) {
    return (
        <div className="space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                <Field label="NIM" name="nim" error={errors.nim}>
                    <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        placeholder="Nomor induk mahasiswa"
                        className={`${inputClass(!!errors.nim)} text-base sm:text-sm`}
                        {...bind('nim')}
                    />
                </Field>
                <Field label="Program studi" name="prodi" error={errors.prodi}>
                    <input
                        type="text"
                        placeholder="Contoh: S1 Informatika"
                        className={`${inputClass(!!errors.prodi)} text-base sm:text-sm`}
                        {...bind('prodi')}
                    />
                </Field>
            </div>

            <Field label="Asal daerah" name="asal" error={errors.asal}>
                <input
                    type="text"
                    placeholder="Contoh: Surabaya"
                    className={`${inputClass(!!errors.asal)} text-base sm:text-sm`}
                    {...bind('asal')}
                />
            </Field>

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
                    className={`${inputClass(!!errors.alamatSekarang)} text-base sm:text-sm resize-none`}
                    {...bind('alamatSekarang')}
                />
            </Field>
        </div>
    )
}