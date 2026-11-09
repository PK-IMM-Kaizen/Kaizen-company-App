import { formatTanggal } from './Format'
import type { FormValues } from './Form'

export default function ReviewSummary({
                                          values,
                                          onEdit
                                      }: {
    values: FormValues
    onEdit: () => void
}) {
    const items = [
        { label: 'Nama', value: values.namaLengkap.trim() },
        {
            label: 'Tempat, tanggal lahir',
            value: `${values.tempatLahir.trim()}, ${formatTanggal(values.tanggalLahir)}`
        },
        { label: 'Asal daerah', value: values.asal.trim() },
        { label: 'Tinggal sekarang', value: values.alamatSekarang.trim() },
        { label: 'Program studi', value: values.prodi.trim() }
    ]

    return (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
            <p className="text-sm font-semibold text-[var(--text-primary)] mb-3">Periksa datamu</p>
            <dl className="space-y-2.5">
                {items.map(item => (
                    <div
                        key={item.label}
                        className="grid grid-cols-1 sm:grid-cols-[170px_minmax(0,1fr)] gap-0.5 sm:gap-3"
                    >
                        <dt className="text-xs text-[var(--text-muted)] sm:pt-0.5">{item.label}</dt>
                        <dd className="text-sm text-[var(--text-primary)] break-words">{item.value}</dd>
                    </div>
                ))}
            </dl>
            <button
                type="button"
                onClick={onEdit}
                className="mt-3 text-xs font-semibold text-[var(--primary)] hover:underline"
            >
                Ubah data
            </button>
        </div>
    )
}