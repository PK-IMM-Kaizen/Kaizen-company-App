'use client'

import Image from 'next/image'
import logoImg from '../../../public/img/logo/logo.png'

interface LogoProps {
    size?: 'sm' | 'md' | 'lg'
    variant?: 'default' | 'white'
}

export default function Logo({ size = 'md', variant = 'default' }: LogoProps) {
    const imgSizes = { sm: 36, md: 44, lg: 60 }
    const s = imgSizes[size]

    const isWhite = variant === 'white'

    const textSizeClasses = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base'
    }

    return (
        <div className="flex items-center gap-2.5">
            <Image
                src={logoImg}
                alt="IMM Kaizen Logo"
                width={s}
                height={s}
                priority
                className={`object-contain shrink-0 ${
                    isWhite ? 'mix-blend-screen brightness-110' : ''
                }`}
            />

            <div className="leading-tight">
                <div
                    className={`font-montserrat font-extrabold uppercase tracking-[0.04em] ${
                        textSizeClasses[size]
                    } ${isWhite ? 'text-white' : 'text-gray-900'}`}
                >
                    IMM Kaizen
                </div>

                <div
                    className={`font-montserrat font-medium text-[0.6rem] uppercase tracking-[0.12em] mt-[1px] ${
                        isWhite ? 'text-white/65' : 'text-gray-500'
                    }`}
                >
                    Komisariat Kaizen
                </div>
            </div>
        </div>
    )
}