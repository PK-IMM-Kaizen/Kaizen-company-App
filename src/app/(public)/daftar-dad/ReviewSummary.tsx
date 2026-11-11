import { ChevronDown, Edit3 } from 'lucide-react'
import { formatTanggal } from './Format'
import type { FormValues } from './Form'

interface ReviewSummaryProps {
    values: FormValues
    onEdit: () => void
}

export default function ReviewSummary({ values, onEdit }: ReviewSummaryProps) {
    const items = [
        { label: 'Nama', value: values.namaLengkap.trim() },
        { label: 'No. WhatsApp/HP', value: values.nomorHp.trim() },
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
        <details className="group rounded-2xl border border-[#e9ddd7] bg-[#fcf8f5] transition-all">
            <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-bold text-[#2b1414] active:bg-[#f5ece7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6b1b1b]/40 sm:px-5 [&::-webkit-details-marker]:hidden">
                <span>Periksa kembali datamu</span>
                <ChevronDown className="h-4 w-4 shrink-0 text-[#6b1b1b] transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none" />
            </summary>

            <div className="border-t border-[#e9ddd7] px-4 pb-4 pt-3.5 sm:px-5">
                <dl className="space-y-3">
                    {items.map(item => (
                        <div
                            key={item.label}
                            className="grid grid-cols-1 gap-0.5 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-3"
                        >
                            <dt className="text-xs font-semibold text-[#7d6b68] sm:pt-0.5">{item.label}</dt>
                            <dd className="break-words text-xs font-bold text-[#2b1414] sm:text-sm">
                                {item.value || '-'}
                            </dd>
                        </div>
                    ))}
                </dl>

                <div className="mt-4 pt-2">
                    <button
                        type="button"
                        onClick={onEdit}
                        className="inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border border-[#6b1b1b]/30 bg-[#ffffff] px-3.5 py-1.5 text-xs font-bold text-[#6b1b1b] shadow-sm transition-all hover:border-[#6b1b1b] active:scale-95"
                    >
                        <Edit3 className="h-3.5 w-3.5" /> Ubah data diri
                    </button>
                </div>
            </div>
        </details>
    )
}
