'use client'

import { useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Download, X, Copy, Check, QrCode } from 'lucide-react'

interface QrCodeModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function QrCodeModal({ isOpen, onClose }: QrCodeModalProps) {
    const [copied, setCopied] = useState(false)

    if (!isOpen) return null

    const registrationUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/`
        : 'https://imm-kaizen.org/'

    const handleDownloadQR = () => {
        const canvas = document.getElementById('dad-qrcode-canvas') as HTMLCanvasElement
        if (!canvas) return

        const posterCanvas = document.createElement('canvas')
        const ctx = posterCanvas.getContext('2d')
        if (!ctx) return

        const padding = 60
        const width = 800
        const height = 1000

        posterCanvas.width = width
        posterCanvas.height = height

        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, width, height)

        ctx.strokeStyle = '#6b1b1b'
        ctx.lineWidth = 12
        ctx.strokeRect(20, 20, width - 40, height - 40)

        ctx.fillStyle = '#6b1b1b'
        ctx.font = 'bold 38px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('DARUL ARQAM DASAR 2026', width / 2, 110)

        ctx.fillStyle = '#f4b82e'
        ctx.font = 'bold 26px sans-serif'
        ctx.fillText('PK IMM KAIZEN', width / 2, 160)

        ctx.drawImage(canvas, (width - 500) / 2, 220, 500, 500)

        ctx.fillStyle = '#2b1414'
        ctx.font = 'bold 28px sans-serif'
        ctx.fillText('SCAN UNTUK MENDAFTAR', width / 2, 780)

        ctx.fillStyle = '#7d6b68'
        ctx.font = '20px sans-serif'
        ctx.fillText(registrationUrl, width / 2, 830)

        const link = document.createElement('a')
        link.download = `QR-Pendaftaran-DAD-IMM-Kaizen.png`
        link.href = posterCanvas.toDataURL('image/png', 1.0)
        link.click()
    }

    const handleCopyLink = () => {
        navigator.clipboard.writeText(registrationUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl max-w-sm w-full p-6 shadow-2xl relative flex flex-col items-center text-center space-y-5">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-xl hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="space-y-1 font-display">
                    <h3 className="text-base font-black text-[#6b1b1b] dark:text-[#f4b82e] uppercase tracking-wider flex items-center justify-center gap-2">
                        <QrCode className="w-5 h-5" /> QR Code Pendaftaran
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">Pindai langsung untuk masuk ke alur pendaftaran DAD</p>
                </div>

                <div className="p-5 bg-white rounded-2xl border-2 border-[#f4b82e] shadow-lg flex flex-col items-center">
                    <QRCodeCanvas
                        id="dad-qrcode-canvas"
                        value={registrationUrl}
                        size={220}
                        bgColor="#ffffff"
                        fgColor="#6b1b1b"
                        level="H"
                        marginSize={2}
                        imageSettings={{
                            src: '/img/logo/logo.png',
                            x: undefined,
                            y: undefined,
                            height: 44,
                            width: 44,
                            excavate: true
                        }}
                    />
                    <span className="mt-3 text-[11px] font-extrabold text-[#6b1b1b] tracking-wider uppercase">
                        PK IMM KAIZEN
                    </span>
                </div>

                <div className="w-full flex items-center justify-between gap-2 bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2 rounded-xl text-xs font-mono text-[var(--text-secondary)]">
                    <span className="truncate">{registrationUrl}</span>
                    <button
                        onClick={handleCopyLink}
                        className="p-1.5 text-[var(--primary)] hover:bg-[var(--surface)] rounded-lg transition-colors cursor-pointer shrink-0"
                        title="Salin Tautan"
                    >
                        {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                </div>

                <button
                    onClick={handleDownloadQR}
                    className="w-full py-3 px-4 bg-[#6b1b1b] hover:bg-[#521414] text-white text-xs font-extrabold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 font-display cursor-pointer"
                >
                    <Download className="w-4 h-4 text-[#f4b82e]" /> Unduh QR Poster (PNG)
                </button>
            </div>
        </div>
    )
}