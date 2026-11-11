'use client'

import Link from 'next/link'
import { CheckCircle2, MessageCircle, ArrowUpRight } from 'lucide-react'
import IdCardResult from './IdCardResult'
import Paper from './Paper'
import StickerTitle from './StickerTitle'
import { secondaryBtn } from './Button'
import type { IdCardInput } from './idCard'

// Ganti link ini dengan link grup WA peserta DAD yang sebenarnya
const WHATSAPP_GROUP_LINK = 'https://chat.whatsapp.com/GrupDADIMMKaizen2026'

export default function SuccessScreen({ data }: { data: IdCardInput }) {
    return (
        <main className="mx-auto grid w-full max-w-5xl flex-1 items-center gap-10 px-4 pb-10 pt-2 sm:px-6 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] md:gap-14">
            <div className="flex flex-col items-center md:items-start">
                <StickerTitle
                    text={'Pendaftaran\nberhasil'}
                    className="text-center text-[2.3rem] sm:text-5xl md:text-left"
                />

                <Paper className="mt-8 w-full">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f4b82e] text-[#4d1010]">
                        <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <p className="mb-3 text-sm leading-relaxed text-[#2b1414] sm:text-base">
                        Terima kasih, <strong className="text-[#6b1b1b]">{data.nama}</strong>. Data dan bukti
                        pembayaranmu sudah kami terima.
                    </p>
                    <p className="mb-6 text-sm leading-relaxed text-[#5b4a47]">
                        Panitia akan memeriksa pembayaranmu. Wajib bergabung ke grup WhatsApp calon peserta untuk mendapatkan informasi teknis pelaksanaan DAD.
                    </p>

                    <Link href="/" className={`${secondaryBtn} w-full sm:w-auto`}>
                        Kembali ke beranda
                    </Link>
                </Paper>
            </div>

            <IdCardResult data={data} />
        </main>
    )
}