/**
 * Generator kartu peserta DAD (client-side, canvas).
 * Isi kartu hanya: Nama, Prodi, Foto.
 *
 * FILE YANG DIBUTUHKAN (taruh di folder public/)
 *   public/id-card/template.png      template kartu 906 x 1280, tanpa foto, nama, dan prodi
 *   public/fonts/Poppins-Regular.ttf font untuk nama dan prodi
 *
 * MENGGANTI DESAIN
 * Ganti template.png dengan desain baru, lalu sesuaikan koordinat di
 * ID_CARD_CONFIG. Semua angka dalam PIXEL pada ukuran asli template.
 * Set `debug: true` sementara untuk melihat kotak penempatan.
 *
 * Jika template.png tidak ditemukan, dipakai desain bawaan sederhana.
 */

type TextSpec = {
    x: number
    y: number
    maxWidth: number
    fontSize: number
    minFontSize: number
    fontWeight: string
    color: string
    align: 'left' | 'center' | 'right'
    maxLines: number
    lineHeight: number
    uppercase: boolean
}

export const ID_CARD_CONFIG = {
    template: '/id-card/template.png',

    fontName: 'PoppinsCard',
    fontFile: '/fonts/Poppins-Regular.ttf',
    fontFallback: 'system-ui, -apple-system, "Segoe UI", sans-serif',

    debug: false,

    photo: { x: 273, y: 409, width: 360, height: 463, radius: 18 },

    name: {
        x: 310,
        y: 928,
        maxWidth: 378,
        fontSize: 29,
        minFontSize: 14,
        fontWeight: '400',
        color: '#1b1b1b',
        align: 'left',
        maxLines: 1,
        lineHeight: 1.2,
        uppercase: true
    } as TextSpec,

    prodi: {
        x: 310,
        y: 978,
        maxWidth: 378,
        fontSize: 29,
        minFontSize: 14,
        fontWeight: '400',
        color: '#1b1b1b',
        align: 'left',
        maxLines: 1,
        lineHeight: 1.2,
        uppercase: true
    } as TextSpec,

    fallback: {
        width: 906,
        height: 1280,
        background: '#ffffff',
        accent: '#b91c1c',
        title: 'PESERTA',
        subtitle: 'DARUL ARQAM DASAR'
    }
}

export type IdCardInput = {
    nama: string
    prodi: string
    fotoUrl: string
}

const fontStack = () => `"${ID_CARD_CONFIG.fontName}", ${ID_CARD_CONFIG.fontFallback}`

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = () => reject(new Error('Gagal memuat gambar: ' + src))
        img.src = src
    })
}

async function ensureFont() {
    const { fontName, fontFile } = ID_CARD_CONFIG
    if (typeof document === 'undefined' || !document.fonts || !fontFile) return
    try {
        const already = Array.from(document.fonts).some(f => f.family.replace(/"/g, '') === fontName)
        if (!already) {
            const face = new FontFace(fontName, `url(${fontFile})`)
            await face.load()
            document.fonts.add(face)
        }
        await document.fonts.ready
    } catch {
    }
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const words = text.trim().split(/\s+/)
    const lines: string[] = []
    let line = ''
    for (const word of words) {
        const test = line ? `${line} ${word}` : word
        if (ctx.measureText(test).width <= maxWidth || !line) {
            line = test
        } else {
            lines.push(line)
            line = word
        }
    }
    if (line) lines.push(line)
    return lines
}

function drawFittedText(ctx: CanvasRenderingContext2D, raw: string, spec: TextSpec) {
    const text = spec.uppercase ? raw.toLocaleUpperCase('id-ID') : raw
    let size = spec.fontSize
    let lines: string[] = []

    for (; size >= spec.minFontSize; size -= 1) {
        ctx.font = `${spec.fontWeight} ${size}px ${fontStack()}`
        lines = wrap(ctx, text, spec.maxWidth)
        if (lines.length <= spec.maxLines && lines.every(l => ctx.measureText(l).width <= spec.maxWidth)) break
    }
    size = Math.max(size, spec.minFontSize)
    ctx.font = `${spec.fontWeight} ${size}px ${fontStack()}`
    if (!lines.length) lines = wrap(ctx, text, spec.maxWidth)

    // Masih kepanjangan di ukuran terkecil: potong dan beri elipsis
    if (lines.length > spec.maxLines || lines.some(l => ctx.measureText(l).width > spec.maxWidth)) {
        lines = lines.slice(0, spec.maxLines)
        let last = lines[lines.length - 1]
        while (last.length > 1 && ctx.measureText(last + '…').width > spec.maxWidth) {
            last = last.slice(0, -1)
        }
        lines[lines.length - 1] = last.trimEnd() + '…'
    }

    ctx.fillStyle = spec.color
    ctx.textAlign = spec.align
    ctx.textBaseline = 'alphabetic'

    const anchorX =
        spec.align === 'left'
            ? spec.x
            : spec.align === 'center'
                ? spec.x + spec.maxWidth / 2
                : spec.x + spec.maxWidth

    lines.forEach((l, i) => ctx.fillText(l, anchorX, spec.y + i * size * spec.lineHeight))
}

function roundRectPath(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
) {
    const rr = Math.min(r, w / 2, h / 2)
    ctx.beginPath()
    ctx.moveTo(x + rr, y)
    ctx.arcTo(x + w, y, x + w, y + h, rr)
    ctx.arcTo(x + w, y + h, x, y + h, rr)
    ctx.arcTo(x, y + h, x, y, rr)
    ctx.arcTo(x, y, x + w, y, rr)
    ctx.closePath()
}

function drawPhotoCover(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    box: typeof ID_CARD_CONFIG.photo
) {
    const scale = Math.max(box.width / img.naturalWidth, box.height / img.naturalHeight)
    const sw = box.width / scale
    const sh = box.height / scale
    const sx = (img.naturalWidth - sw) / 2
    const sy = (img.naturalHeight - sh) / 2

    ctx.save()
    roundRectPath(ctx, box.x, box.y, box.width, box.height, box.radius)
    ctx.clip()
    ctx.drawImage(img, sx, sy, sw, sh, box.x, box.y, box.width, box.height)
    ctx.restore()
}

function drawFallback(ctx: CanvasRenderingContext2D) {
    const cfg = ID_CARD_CONFIG
    const f = cfg.fallback
    const { width: W, height: H } = f

    ctx.fillStyle = f.background
    ctx.fillRect(0, 0, W, H)

    ctx.fillStyle = f.accent
    roundRectPath(ctx, 148, 216, W - 296, 930, 48)
    ctx.fill()

    ctx.fillStyle = '#ffffff'
    roundRectPath(ctx, 195, 338, W - 390, 697, 44)
    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'alphabetic'
    ctx.fillStyle = '#ffffff'
    ctx.font = `800 96px ${fontStack()}`
    ctx.fillText(f.title, W / 2, 300)
    ctx.fillStyle = f.accent
    ctx.font = `700 34px ${fontStack()}`
    ctx.fillText(f.subtitle, W / 2, 382)

    ctx.textAlign = 'left'
    ctx.font = `700 36px ${fontStack()}`
    ctx.fillText('NAMA:', 216, 930)
    ctx.fillText('PRODI:', 216, 980)
    ctx.fillRect(316, 943, 370, 3)
    ctx.fillRect(316, 991, 370, 3)
}

export async function generateIdCard({ nama, prodi, fotoUrl }: IdCardInput): Promise<Blob> {
    const cfg = ID_CARD_CONFIG

    await ensureFont()

    const [template, foto] = await Promise.all([
        loadImage(cfg.template).catch(() => null),
        loadImage(fotoUrl)
    ])

    const canvas = document.createElement('canvas')
    canvas.width = template ? template.naturalWidth : cfg.fallback.width
    canvas.height = template ? template.naturalHeight : cfg.fallback.height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Browser tidak mendukung canvas.')

    if (template) ctx.drawImage(template, 0, 0)
    else drawFallback(ctx)

    drawPhotoCover(ctx, foto, cfg.photo)
    drawFittedText(ctx, nama, cfg.name)
    drawFittedText(ctx, prodi, cfg.prodi)

    if (cfg.debug) {
        ctx.save()
        ctx.lineWidth = 2
        ctx.strokeStyle = '#ef4444'
        ctx.strokeRect(cfg.photo.x, cfg.photo.y, cfg.photo.width, cfg.photo.height)
        ;([
            [cfg.name, '#22c55e'],
            [cfg.prodi, '#3b82f6']
        ] as [TextSpec, string][]).forEach(([s, color]) => {
            ctx.strokeStyle = color
            ctx.strokeRect(s.x, s.y - s.fontSize, s.maxWidth, s.fontSize * 1.25)
        })
        ctx.restore()
    }

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            blob => (blob ? resolve(blob) : reject(new Error('Gagal membuat gambar kartu.'))),
            'image/png'
        )
    })
}