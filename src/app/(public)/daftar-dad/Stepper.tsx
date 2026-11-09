import { Check } from 'lucide-react'
import { steps } from './Form'

export default function Stepper({
                                    step,
                                    maxStep,
                                    onSelect
                                }: {
    step: number
    maxStep: number
    onSelect: (i: number) => void
}) {
    return (
        <ol className="flex gap-2 sm:gap-3 mb-6" aria-label="Langkah pendaftaran">
            {steps.map((s, i) => {
                const isDone = i < step
                const isActive = i === step
                return (
                    <li key={s.title} className="flex-1 min-w-0">
                        <button
                            type="button"
                            disabled={i > maxStep}
                            onClick={() => onSelect(i)}
                            aria-current={isActive ? 'step' : undefined}
                            className="w-full text-left disabled:cursor-not-allowed focus-visible:outline-none group"
                        >
                            <span
                                className={`block h-1.5 rounded-full transition-colors duration-300 group-focus-visible:ring-2 group-focus-visible:ring-[var(--primary)]/50 ${
                                    i <= step ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'
                                }`}
                            />
                            <span
                                className={`mt-2 flex items-center gap-1.5 text-xs sm:text-sm font-semibold min-w-0 ${
                                    isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'
                                }`}
                            >
                                {isDone ? (
                                    <Check className="w-3.5 h-3.5 shrink-0 text-[var(--primary)]" />
                                ) : (
                                    <span className="shrink-0">{i + 1}.</span>
                                )}
                                <span className="truncate">{s.title}</span>
                            </span>
                        </button>
                    </li>
                )
            })}
        </ol>
    )
}