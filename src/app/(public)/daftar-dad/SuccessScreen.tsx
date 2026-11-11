'use client'

import Link from 'next/link'
import { CheckCircle2, MessageCircle, ArrowUpRight, Home } from 'lucide-react'
import IdCardResult from './IdCardResult'
import Paper from './Paper'
import StickerTitle from './StickerTitle'
import { secondaryBtn } from './Button'
import type { IdCardInput } from './idCard'

const whatsappGroup = 'https://chat.whatsapp.com/J5yDMT1C5jEBPJZf9pCZVJ?s=cl&p=a&iam=2'

export default function SuccessScreen({ data }: { data: IdCardInput }) {
    return (
        <main className="mx-auto grid w-full max-w-5xl flex-1 items-start gap-8 px-4 pb-12 pt-4 sm:px-6 sm:pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-12">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                <StickerTitle
                    text={'Pendaftaran\nberhasil'}
                    className="text-[2.2rem] leading-tight sm:text-5xl lg:text-6xl"
                />

                <Paper className="mt-6 w-full text-left sm:mt-8">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f4b82e] text-[#4d1010] shadow-md">
                        <CheckCircle2 className="h-6 w-6 stroke-[2.5]" />
                    </div>

                    <h2 className="text-lg font-extrabold text-[#2b1414] sm:text-xl">
                        Alhamdulillah, Pendaftaran Diterima!
                    </h2>

                    <p className="mt-2 text-sm leading-relaxed text-[#5b4a47] sm:text-base">
                        Terima kasih, <strong className="font-bold text-[#6b1b1b]">{data.nama}</strong>. Data registrasi dan bukti pembayaranmu sudah berhasil kami terima.
                    </p>

                    <p className="mt-3 text-xs leading-relaxed text-[#7d6b68] sm:text-sm">
                        Panitia akan memverifikasi berkas pendaftaranmu. <strong className="text-[#6b1b1b]">Wajib</strong> segera bergabung ke grup WhatsApp resmi calon peserta untuk menerima pengumuman & instruksi teknis DAD.
                    </p>

                    <a
                        href={whatsappGroup}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 flex min-h-[48px] w-full items-center justify-center gap-2.5 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#25D366]/20 transition-all hover:bg-[#20bd5a] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]/50"
                    >
                        <MessageCircle className="h-5 w-5 fill-white" />
                        <span>Gabung Grup WhatsApp Peserta</span>
                        <ArrowUpRight className="h-4 w-4" />
                    </a>

                    <div className="mt-3">
                        <Link
                            href="/"
                            className={`${secondaryBtn} min-h-[44px] w-full justify-center sm:w-auto`}
                        >
                            <Home className="h-4 w-4" /> Kembali ke beranda
                        </Link>
                    </div>
                </Paper>
            </div>

            <div className="w-full">
                <IdCardResult data={data} />
            </div>
        </main>
    )
}