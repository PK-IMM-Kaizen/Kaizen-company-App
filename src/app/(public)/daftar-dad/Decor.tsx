import { useId } from 'react'
import styles from '../../Dad.module.css'

function Star({ className = '' }: { className?: string }) {
    const id = useId().replace(/:/g, '')
    return (
        <svg viewBox="0 0 100 100" aria-hidden className={className}>
            <defs>
                <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#ffd567" />
                    <stop offset="1" stopColor="#e9a010" />
                </linearGradient>
            </defs>
            {[0, 60, 120].map(deg => (
                <rect
                    key={deg}
                    x="41"
                    y="6"
                    width="18"
                    height="88"
                    rx="9"
                    fill={`url(#${id})`}
                    transform={`rotate(${deg} 50 50)`}
                />
            ))}
        </svg>
    )
}

export default function Decor() {
    return (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <Star className="absolute -left-10 top-48 h-32 w-32 blur-[3px] animate-[spin_90s_linear_infinite] motion-reduce:animate-none" />
            <Star className="absolute -right-8 top-24 h-28 w-28 blur-[2px] animate-[spin_70s_linear_infinite_reverse] motion-reduce:animate-none" />
            <Star className="absolute right-[6%] top-[58%] hidden h-40 w-40 blur-[5px] lg:block" />
            <Star className="absolute -left-14 bottom-24 h-44 w-44 blur-[6px]" />
            <div className={`${styles.dots} absolute left-4 top-[34%] hidden h-28 w-16 opacity-70 sm:block`} />
            <div className={`${styles.dots} absolute bottom-40 right-4 hidden h-20 w-24 opacity-60 sm:block`} />
        </div>
    )
}