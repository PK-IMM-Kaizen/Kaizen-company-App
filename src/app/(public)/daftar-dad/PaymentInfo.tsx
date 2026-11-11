import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { paymentConfig, formatRupiah } from './Payment'

interface CopyButtonProps {
    text: string
    label: string
}

function CopyButton({ text, label }: CopyButtonProps) {
    const [done, setDone] = useState(false)

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(text)
        } catch {
            const ta = document.createElement('textarea')
            ta.value = text
            ta.style.position = 'fixed'
            ta.style.opacity = '0'
            document.body.appendChild(ta)
            ta.select()
            document.execCommand('copy')
            document.body.removeChild(ta)
        }
        setDone(true)
        setTimeout(() => setDone(false), 2000)
    }

    return (
        <button
            type="button"
            onClick={copy}
            aria-label={label}
            className={`inline-flex shrink-0 min-h-[40px] items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6b1b1b]/40 ${
                done
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-[#6b1b1b]/25 bg-white text-[#6b1b1b] hover:border-[#6b1b1b] active:bg-[#fcf8f5]'
            }`}
        >
            {done ? <Check className="h-4 w-4 stroke-[2.5]" /> : <Copy className="h-4 w-4" />}
            {done ? 'Tersalin!' : 'Salin'}
        </button>
    )
}

export default function PaymentInfo() {
    const { amount, methods, qrisSrc, note } = paymentConfig

    return (
        <div className="rounded-2xl border border-[#f4b82e]/40 bg-[#fff3d1] p-4 sm:p-5">
            <p className="text-xs font-bold text-[#7d6b68]">Total Pembayaran</p>
            <div className="mt-1.5 flex flex-wrap items-center justify-between gap-3">
                <p className="text-2xl font-black tracking-tight text-[#6b1b1b] sm:text-3xl">
                    {formatRupiah(amount)}
                </p>
                <CopyButton text={String(amount)} label="Salin nominal pembayaran" />
            </div>

            <ul className="mt-4 space-y-3">
                {methods.map(m => (
                    <li
                        key={`${m.name}-${m.accountNumber}`}
                        className="rounded-xl border border-[#e9ddd7] bg-white p-3.5 shadow-sm transition-all sm:p-4"
                    >
                        <p className="text-xs font-bold text-[#7d6b68]">{m.name}</p>
                        <div className="mt-1 flex items-center justify-between gap-3">
                            <p className="select-all break-all font-mono text-base font-extrabold tracking-wider text-[#2b1414] sm:text-lg">
                                {m.accountNumber}
                            </p>
                            <CopyButton text={m.accountNumber} label={`Salin nomor rekening ${m.name}`} />
                        </div>
                        <p className="mt-1 text-xs font-medium text-[#5b4a47]">a.n. {m.accountName}</p>
                    </li>
                ))}
            </ul>

            {qrisSrc && (
                <div className="mt-4 flex flex-col items-center rounded-xl border border-[#e9ddd7] bg-white p-4 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={qrisSrc}
                        alt="QRIS pembayaran DAD"
                        className="w-44 max-w-full rounded-lg object-contain sm:w-48"
                    />
                    <p className="mt-2 text-xs font-semibold text-[#7d6b68]">
                        Atau bayar dengan scan QRIS di atas
                    </p>
                </div>
            )}

            {note && (
                <p className="mt-3.5 text-xs leading-relaxed text-[#5b4a47] sm:mt-4">
                    📌 {note}
                </p>
            )}
        </div>
    )
}