import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { paymentConfig, formatRupiah } from './Payment'

function CopyButton({ text, label }: { text: string; label: string }) {
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
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[#6b1b1b]/25 bg-white px-3 py-1.5 text-xs font-bold text-[#6b1b1b] transition-colors hover:border-[#6b1b1b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6b1b1b]/40"
        >
            {done ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {done ? 'Tersalin' : 'Salin'}
        </button>
    )
}

export default function PaymentInfo() {
    const { amount, methods, qrisSrc, note } = paymentConfig

    return (
        <div className="rounded-2xl bg-[#fff3d1] p-4 sm:p-5">
            <p className="text-xs font-bold text-[#7d6b68]">Total pembayaran</p>
            <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
                <p className="text-3xl font-bold text-[#6b1b1b]">{formatRupiah(amount)}</p>
                <CopyButton text={String(amount)} label="Salin nominal" />
            </div>

            <ul className="mt-4 space-y-3">
                {methods.map(m => (
                    <li key={`${m.name}-${m.accountNumber}`} className="rounded-xl bg-white p-3.5 shadow-sm">
                        <p className="text-xs font-bold text-[#7d6b68]">{m.name}</p>
                        <div className="mt-1 flex items-center justify-between gap-3">
                            <p className="break-all text-lg font-bold tracking-wide text-[#2b1414]">{m.accountNumber}</p>
                            <CopyButton text={m.accountNumber} label={`Salin nomor ${m.name}`} />
                        </div>
                        <p className="mt-0.5 text-xs text-[#5b4a47]">a.n. {m.accountName}</p>
                    </li>
                ))}
            </ul>

            {qrisSrc && (
                <div className="mt-4 flex flex-col items-center rounded-xl bg-white p-4 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={qrisSrc} alt="QRIS pembayaran DAD" className="w-48 max-w-full" />
                    <p className="mt-2 text-xs text-[#7d6b68]">Atau bayar dengan scan QRIS</p>
                </div>
            )}

            {note && <p className="mt-4 text-xs leading-relaxed text-[#5b4a47]">{note}</p>}
        </div>
    )
}