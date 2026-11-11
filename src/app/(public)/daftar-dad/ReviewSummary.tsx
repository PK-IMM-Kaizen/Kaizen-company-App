import { ChevronDown } from 'lucide-react'
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
        { label: 'NIM', value: values.nim.trim() },
        { label: 'Program studi', value: values.prodi.trim() },
        { label: 'Asal daerah', value: values.asal.trim() },
        { label: 'Tinggal sekarang', value: values.alamatSekarang.trim() }
    ]

    return (
        <details className="group rounded-xl border border-[#e9ddd7] bg-[#fcf8f5]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-bold text-[#2b1414] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6b1b1b]/40 [&::-webkit-details-marker]:hidden">
                Periksa kembali datamu
                <ChevronDown className="h-4 w-4 text-[#6b1b1b] transition-transform group-open:rotate-180 motion-reduce:transition-none" />
            </summary>
            <div className="border-t border-[#e9ddd7] px-4 py-4">
                <dl className="space-y-2.5">
                    {items.map(item => (
                        <div
                            key={item.label}
                            className="grid grid-cols-1 gap-0.5 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-3"
                        >
                            <dt className="text-xs text-[#7d6b68] sm:pt-0.5">{item.label}</dt>
                            <dd className="break-words text-sm text-[#2b1414]">{item.value}</dd>
                        </div>
                    ))}
                </dl>
                <button
                    type="button"
                    onClick={onEdit}
                    className="mt-3 text-xs font-bold text-[#6b1b1b] hover:underline"
                >
                    Ubah data
                </button>
            </div>
        </details>
    )
}