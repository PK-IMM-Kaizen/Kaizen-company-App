import Field, { inputClass } from './Field'
import type { BindFn, FieldErrors } from './Form'

export default function StepAsalKampus({
                                           bind,
                                           errors
                                       }: {
    bind: BindFn
    errors: FieldErrors
}) {
    return (
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
    )
}