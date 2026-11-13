export const timeline: { date: string; label: string }[] = [
    { date: '12 Nov', label: 'Pendaftaran dibuka' },
    { date: '15 Nov', label: 'Pendaftaran ditutup' },
    { date: '16-18 Nov', label: 'Screening Batch 1' },
    { date: '26 Nov', label: 'Pra-DAD 2026' },
    { date: '27-29 Nov', label: 'Screening Batch 2' },
    { date: '30 Nov', label: 'Seleksi Berkas' },
    { date: '1 Des', label: 'Pengumuman' },
    { date: '4-6 Des', label: 'Pelaksanaan DAD 2026' }
]

export const contacts: { name: string; display: string; wa: string }[] = [
    { name: 'Immawan Fatih', display: '+62 857-0476-1706', wa: '6285704761706' },
    { name: 'Immawan Azzam', display: '+62 813-3086-6169', wa: '6281330866169' }
]

export const registrationOpen = new Date('2026-11-12T00:00:00+07:00')
export const registrationClose = new Date('2026-11-15T23:59:59+07:00')

export const formatDate = (d: Date) =>
    d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' })

export type RegistrationPhase =
    | { kind: 'before'; days: number }
    | { kind: 'open'; days: number }
    | { kind: 'closed' }

const day = 86_400_000

export function getRegistrationPhase(now: Date): RegistrationPhase {
    if (now < registrationOpen)
        return { kind: 'before', days: Math.ceil((registrationOpen.getTime() - now.getTime()) / day) }
    if (now <= registrationClose)
        return { kind: 'open', days: Math.ceil((registrationClose.getTime() - now.getTime()) / day) }
    return { kind: 'closed' }
}