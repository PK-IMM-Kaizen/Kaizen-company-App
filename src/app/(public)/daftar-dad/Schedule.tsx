export const timeline: { date: string; label: string }[] = [
    { date: '12 Nov 2026', label: 'Pendaftaran dibuka' },
    { date: '26 Nov 2026', label: 'Pendaftaran ditutup' },
    { date: '26 Nov 2026', label: 'Pra-DAD 2026' },
    { date: '27 Nov 2026', label: 'Seleksi berkas' },
    { date: '28-30 Nov 2026', label: 'Screening' },
    { date: '31 Nov 2026', label: 'Pengumuman' },
    { date: '4-6 Des 2026', label: 'DAD 2026' }
]

export const contacts: { name: string; display: string; wa: string }[] = [
    { name: 'Immawan Fatih', display: '+62 857-0476-1706', wa: '6285704761706' },
    { name: 'Immawan Azzam', display: '+62 813-3086-6169', wa: '6281330866169' }
]

export const registrationOpen = new Date('2026-11-12T00:00:00+07:00')
export const registrationClose = new Date('2026-11-26T23:59:59+07:00')

export type RegistrationPhase =
    | { kind: 'before'; days: number }
    | { kind: 'open'; days: number }
    | { kind: 'closed' }

const DAY = 86_400_000

export function getRegistrationPhase(now: Date): RegistrationPhase {
    if (now < registrationOpen)
        return { kind: 'before', days: Math.ceil((registrationOpen.getTime() - now.getTime()) / DAY) }
    if (now <= registrationClose)
        return { kind: 'open', days: Math.ceil((registrationClose.getTime() - now.getTime()) / DAY) }
    return { kind: 'closed' }
}