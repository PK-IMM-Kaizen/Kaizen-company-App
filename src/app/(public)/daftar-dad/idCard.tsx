type Box = { x: number; y: number; width: number; height: number }

type FieldSpec = {
    box: Box
    padX: number
    padY: number
    fontSize: number
    minFontSize: number
    color: string
    maxLines: number
    lineHeight: number
    uppercase: boolean
}

const textColor = '#2b1010'

const field = (box: Box, over: Partial<FieldSpec> = {}): FieldSpec => ({
    box,
    padX: 34,
    padY: 14,
    fontSize: 58,
    minFontSize: 28,
    color: textColor,
    maxLines: 1,
    lineHeight: 1.15,
    uppercase: false,
    ...over
})

export const ID_CARD_CONFIG = {
    template: '/img/template/id-card.png',

    fontName: 'PoppinsCard',
    fontFile: '/fonts/Poppins-Medium.ttf',
    fontWeight: '500',
    fontFallback: 'system-ui, -apple-system, "Segoe UI", sans-serif',

    debug: false,

    photo: {
        x: 308,
        y: 934,
        width: 520,
        height: 760,
        radius: 36
    } as Box & { radius: number },

    fields: {
        nama: field(
            { x: 900, y: 1190, width: 1120, height: 160 },
            { fontSize: 52, minFontSize: 24, padX: 30, padY: 15, uppercase: true }
        ),
        nim: field(
            { x: 900, y: 1520, width: 1120, height: 160 },
            { fontSize: 48, minFontSize: 24, padX: 30, padY: 15 }
        ),
        prodi: field(
            { x: 308, y: 1895, width: 1712, height: 160 },
            { fontSize: 44, minFontSize: 22, padX: 40, padY: 15 }
        ),
        alamat: field(
            { x: 308, y: 2225, width: 1712, height: 160 },
            { fontSize: 40, minFontSize: 20, padX: 40, padY: 15 }
        ),
        ttl: field(
            { x: 308, y: 2555, width: 1712, height: 160 },
            { fontSize: 40, minFontSize: 20, padX: 40, padY: 15 }
        )
    }
}

export type IdCardInput = {
    nama: string
    nim: string
    prodi: string
    alamat: string
    ttl: string
    fotoUrl: string
}

const fontStack = () => `"${ID_CARD_CONFIG.fontName}", ${ID_CARD_CONFIG.fontFallback}`
const fontOf = (size: number) => `${ID_CARD_CONFIG.fontWeight} ${size}px ${fontStack()}`

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => resolve(img)
        img.onerror = () => reject(new Error('Gagal memuat gambar: ' + src))

        if (typeof window !== 'undefined' && src.startsWith('/')) {
            img.src = `${window.location.origin}${src}`
        } else {
            img.src = src
        }
    })
}

async function ensureFont() {
    const { fontName, fontFile, fontWeight } = ID_CARD_CONFIG
    if (typeof document === 'undefined' || !document.fonts || !fontFile) return
    try {
        const already = Array.from(document.fonts).some(f => f.family.replace(/"/g, '') === fontName)
        if (!already) {
            const fontUrl = fontFile.startsWith('/') && typeof window !== 'undefined'
                ? `${window.location.origin}${fontFile}`
                : fontFile
            const face = new FontFace(fontName, `url(${fontUrl})`, { weight: fontWeight })
            await face.load()
            document.fonts.add(face)
        }
        await document.fonts.ready
    } catch {
        // Fallback ke font bawaan jika gagal memuat font khusus
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

function drawFieldText(ctx: CanvasRenderingContext2D, raw: string, spec: FieldSpec) {
    const text = (spec.uppercase ? raw.toLocaleUpperCase('id-ID') : raw).trim()
    if (!text) return

    const maxW = spec.box.width - spec.padX * 2
    const maxH = spec.box.height - spec.padY * 2

    let size = spec.fontSize
    let lines: string[] = []
    for (; size >= spec.minFontSize; size -= 1) {
        ctx.font = fontOf(size)
        lines = wrap(ctx, text, maxW)
        const fits =
            lines.length <= spec.maxLines &&
            lines.length * size * spec.lineHeight <= maxH &&
            lines.every(l => ctx.measureText(l).width <= maxW)
        if (fits) break
    }
    size = Math.max(size, spec.minFontSize)
    ctx.font = fontOf(size)

    const overflow =
        lines.length > spec.maxLines ||
        lines.some(l => ctx.measureText(l).width > maxW) ||
        lines.length * size * spec.lineHeight > maxH

    if (overflow) {
        lines = wrap(ctx, text, maxW).slice(0, spec.maxLines)
        let last = lines[lines.length - 1] || ''
        while (last.length > 1 && ctx.measureText(last + '…').width > maxW) {
            last = last.slice(0, -1)
        }
        if (lines.length > 0) {
            lines[lines.length - 1] = last.trimEnd() + '…'
        }
    }

    const lh = size * spec.lineHeight
    const top = spec.box.y + (spec.box.height - lines.length * lh) / 2

    ctx.fillStyle = spec.color
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    lines.forEach((l, i) => ctx.fillText(l, spec.box.x + spec.padX, top + lh * (i + 0.5)))
}

function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    const rr = Math.min(r, w / 2, h / 2)
    ctx.beginPath()
    ctx.moveTo(x + rr, y)
    ctx.arcTo(x + w, y, x + w, y + h, rr)
    ctx.arcTo(x + w, y + h, x, y + h, rr)
    ctx.arcTo(x, y + h, x, y, rr)
    ctx.arcTo(x, y, x + w, y, rr)
    ctx.closePath()
}

function drawPhotoCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, box: typeof ID_CARD_CONFIG.photo) {
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

export async function generateIdCard(input: IdCardInput): Promise<Blob> {
    const cfg = ID_CARD_CONFIG

    await ensureFont()

    const [template, foto] = await Promise.all([
        loadImage(cfg.template),
        loadImage(input.fotoUrl)
    ])

    const canvas = document.createElement('canvas')
    canvas.width = template.naturalWidth
    canvas.height = template.naturalHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Browser tidak mendukung canvas.')

    ctx.drawImage(template, 0, 0)
    drawPhotoCover(ctx, foto, cfg.photo)

    drawFieldText(ctx, input.nama, cfg.fields.nama)
    drawFieldText(ctx, input.nim, cfg.fields.nim)
    drawFieldText(ctx, input.prodi, cfg.fields.prodi)
    drawFieldText(ctx, input.alamat, cfg.fields.alamat)
    drawFieldText(ctx, input.ttl, cfg.fields.ttl)

    if (cfg.debug) {
        ctx.save()
        ctx.lineWidth = 4
        ctx.strokeStyle = '#ef4444'
        ctx.strokeRect(cfg.photo.x, cfg.photo.y, cfg.photo.width, cfg.photo.height)
        ctx.strokeStyle = '#22c55e'
        Object.values(cfg.fields).forEach(f => ctx.strokeRect(f.box.x, f.box.y, f.box.width, f.box.height))
        ctx.restore()
    }

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            blob => (blob ? resolve(blob) : reject(new Error('Gagal membuat gambar kartu.'))),
            'image/png'
        )
    })
}