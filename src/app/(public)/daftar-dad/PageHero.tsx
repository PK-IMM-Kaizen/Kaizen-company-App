'use client'

import { useEffect, useState } from 'react'
import { CalendarClock } from 'lucide-react'
import StickerTitle from './StickerTitle'
import {
    getRegistrationPhase,
    formatDate,
    registrationOpen,
    registrationClose,
    type RegistrationPhase
} from './Schedule'

function statusText(p: RegistrationPhase) {
    if (p.kind === 'before')
        return `Dibuka ${formatDate(registrationOpen)}, ${p.days} hari lagi`
    if (p.kind === 'open')
        return p.days <= 1 ? 'Hari terakhir pendaftaran' : `Ditutup ${formatDate(registrationClose)}, sisa ${p.days} hari`
    return 'Pendaftaran sudah ditutup'
}

export default function PageHero() {
    const [phase, setPhase] = useState<RegistrationPhase | null>(null)
    useEffect(() => setPhase(getRegistrationPhase(new Date())), [])

    return (
        <div className="flex flex-col items-center text-center">
            <StickerTitle
                text={'Pendaftaran\nDAD 2026'}
                className="text-[2.6rem] sm:text-6xl lg:text-7xl"
            />
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
                Darul Arqam Dasar PK IMM Kaizen. Isi data, lakukan pembayaran, lalu unduh kartu pesertamu.
            </p>

            <div className="mt-4 h-9" aria-live="polite">
                {phase && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#f4b82e] px-4 py-2 text-xs font-bold text-[#4d1010] shadow-md sm:text-sm animate-in fade-in duration-300 motion-reduce:animate-none">
                        <CalendarClock className="h-4 w-4" />
                        {statusText(phase)}
                    </span>
                )}
            </div>
        </div>
    )
}