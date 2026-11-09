export const slugify = (s: string) =>
    s
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || 'peserta'

export function formatTanggal(iso: string) {
    if (!iso) return ''
    const [y, m, d] = iso.split('-').map(Number)
    if (!y || !m || !d) return ''
    return new Date(y, m - 1, d).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}

export function formatSize(bytes: number) {
    return bytes < 1024 * 1024
        ? `${Math.max(1, Math.round(bytes / 1024))} KB`
        : `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}