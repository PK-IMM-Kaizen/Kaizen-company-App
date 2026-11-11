'use client'

import { useEffect, useState } from 'react'
import { CalendarClock } from 'lucide-react'
import StickerTitle from './StickerTitle'
import { getRegistrationPhase, type RegistrationPhase } from './Schedule'

function statusText(p: RegistrationPhase) {
    if (p.kind === 'before')
        return `Dibuka 12 November 2026, ${p.days} hari lagi`
    if (p.kind === 'open')
        return p.days <= 1 ? 'Hari terakhir pendaftaran!' : `Ditutup 26 November 2026, sisa ${p.days} hari`
    return 'Pendaftaran sudah ditutup'
}

export default function PageHero() {
    const [phase, setPhase] = useState<RegistrationPhase | null>(null)

    useEffect(() => {
        setPhase(getRegistrationPhase(new Date()))
    }, [])

    return (
        <div className="flex flex-col items-center text-center">
            <StickerTitle
                text={'Pendaftaran\nDAD 2026'}
                className="text-[2.2rem] leading-tight sm:text-5xl lg:text-6xl"
            />

            <p className="mt-4 max-w-md px-2 text-xs leading-relaxed text-white/90 sm:mt-5 sm:text-base">
                Darul Arqam Dasar PK IMM Kaizen. Isi data, lakukan pembayaran, lalu unduh kartu pesertamu.
            </p>

            <div className="mt-4 min-h-[38px] sm:mt-5" aria-live="polite">
                {phase && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#f4b82e] px-3.5 py-1.5 text-xs font-extrabold text-[#4d1010] shadow-lg sm:px-4 sm:py-2 sm:text-sm animate-in fade-in duration-300 motion-reduce:animate-none">
                        <CalendarClock className="h-4 w-4 shrink-0" />
                        {statusText(phase)}
                    </span>
                )}
            </div>
        </div>
    )
}
