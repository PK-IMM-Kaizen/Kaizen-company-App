'use client'

import { useRef, useState, useEffect } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { toPng } from 'html-to-image'
import { slugify } from './Format'
import { goldBtn } from './Button'
import type { IdCardInput } from './idCard'

async function imageUrlToBase64(url: string): Promise<string> {
    if (url.startsWith('data:')) return url
    const response = await fetch(url)
    const blob = await response.blob()
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(blob)
    })
}

function getNameFontSize(nama: string): string {
    const len = nama.trim().length
    if (len > 32) return 'text-[6.5px] sm:text-[7.5px]'
    if (len > 24) return 'text-[7.5px] sm:text-[8.5px]'
    if (len > 18) return 'text-[8.5px] sm:text-[9.5px]'
    return 'text-[9.5px] sm:text-[11px]'
}

function getAlamatFontSize(alamat: string): string {
    const len = alamat.trim().length
    if (len > 50) return 'text-[6px] sm:text-[7px]'
    if (len > 35) return 'text-[7px] sm:text-[8px]'
    if (len > 20) return 'text-[8px] sm:text-[9px]'
    return 'text-[8.5px] sm:text-[10px]'
}

export default function IdCardResult({ data }: { data: IdCardInput }) {
    const cardRef = useRef<HTMLDivElement>(null)
    const [isDownloading, setIsDownloading] = useState(false)
    const [templateBase64, setTemplateBase64] = useState<string>('')
    const [fotoBase64, setFotoBase64] = useState<string>('')

    useEffect(() => {
        let isMounted = true

        async function prepareImages() {
            try {
                const [templateData, fotoData] = await Promise.all([
                    imageUrlToBase64('/img/template/id-card.png'),
                    imageUrlToBase64(data.fotoUrl)
                ])
                if (isMounted) {
                    setTemplateBase64(templateData)
                    setFotoBase64(fotoData)
                }
            } catch (err) {
                console.error('Gagal mengonversi gambar ke Base64:', err)
            }
        }

        prepareImages()

        return () => {
            isMounted = false
        }
    }, [data.fotoUrl])

    const handleDownload = async () => {
        if (!cardRef.current) return
        setIsDownloading(true)
        try {
            if (typeof document !== 'undefined' && document.fonts) {
                await document.fonts.ready
            }

            const dataUrl = await toPng(cardRef.current, {
                cacheBust: false,
                pixelRatio: 3,
                skipFonts: true,
            })

            const link = document.createElement('a')
            link.download = `kartu-dad-${slugify(data.nama)}.png`
            link.href = dataUrl
            link.click()
        } catch (err: any) {
            console.error('Gagal mengunduh kartu:', err?.message || err)
            alert('Gagal mengunduh kartu. Silakan coba lagi.')
        } finally {
            setIsDownloading(false)
        }
    }

    return (
        <div className="mx-auto w-full max-w-xs sm:max-w-sm">
            <div className="overflow-hidden rounded-3xl bg-white/10 shadow-[0_24px_50px_-14px_rgba(0,0,0,0.6)] ring-4 ring-white">
                <div
                    ref={cardRef}
                    className="relative aspect-[2207/3125] w-full overflow-hidden bg-white text-black font-sans select-none"
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={templateBase64 || '/img/template/id-card.png'}
                        alt="Template Kartu DAD"
                        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
                    />

                    <div className="absolute top-[32.4%] left-[14%] w-[23.7%] h-[24.4%] rounded-[16px] overflow-hidden  bg-gray-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={fotoBase64 || data.fotoUrl}
                            alt={data.nama}
                            className="h-full w-full object-cover"
                        />
                    </div>

                    <div className="absolute top-[38.1%] left-[40.8%] right-[9.0%] h-[5.1%] flex items-center px-4 font-black uppercase tracking-wide text-black">
                        <span className={`w-full truncate ${getNameFontSize(data.nama)}`}>
                            {data.nama}
                        </span>
                    </div>

                    <div className="absolute top-[48.7%] left-[40.8%] right-[9.0%] h-[5.1%] flex items-center px-4 text-[9px] sm:text-[10.5px] font-black tracking-wider text-black">
                        <span className="w-full truncate">{data.nim}</span>
                    </div>

                    <div className="absolute top-[60.7%] left-[13.9%] right-[9.0%] h-[5.1%] flex items-center px-5 text-[8.5px] sm:text-[10px] font-black tracking-tight text-black">
                        <span className="w-full truncate">{data.prodi}</span>
                    </div>

                    <div className="absolute top-[71.3%] left-[13.9%] right-[9.0%] h-[5.1%] flex items-center px-5 font-black text-black">
                        <span className={`w-full truncate ${getAlamatFontSize(data.alamat)}`}>
                            {data.alamat}
                        </span>
                    </div>

                    <div className="absolute top-[81.9%] left-[13.9%] right-[9.0%] h-[5.1%] flex items-center px-5 text-[8px] sm:text-[9.5px] font-black tracking-tight text-black">
                        <span className="w-full truncate">{data.ttl}</span>
                    </div>
                </div>
            </div>

            <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                className={`${goldBtn} mt-5 w-full justify-center disabled:opacity-50 cursor-pointer`}
            >
                {isDownloading ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Mengunduh kartu...
                    </>
                ) : (
                    <>
                        <Download className="h-4 w-4" /> Unduh kartu (PNG)
                    </>
                )}
            </button>
        </div>
    )
}