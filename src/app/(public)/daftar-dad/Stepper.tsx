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
        <ol className="mb-7 flex gap-2 sm:gap-3" aria-label="Langkah pendaftaran">
            {steps.map((s, i) => {
                const isDone = i < step
                const isActive = i === step
                return (
                    <li key={s.title} className="min-w-0 flex-1">
                        <button
                            type="button"
                            disabled={i > maxStep}
                            onClick={() => onSelect(i)}
                            aria-current={isActive ? 'step' : undefined}
                            className="group w-full text-left focus-visible:outline-none disabled:cursor-not-allowed"
                        >
                            <span
                                className={`block h-2 rounded-full transition-colors duration-300 group-focus-visible:ring-2 group-focus-visible:ring-[#f4b82e] ${
                                    isActive ? 'bg-[#f4b82e]' : i < step ? 'bg-[#6b1b1b]' : 'bg-[#eadfd9]'
                                }`}
                            />
                            <span
                                className={`mt-2 flex min-w-0 items-center gap-1.5 text-xs font-bold sm:text-sm ${
                                    isActive ? 'text-[#2b1414]' : 'text-[#a8968f]'
                                }`}
                            >
                                {isDone ? (
                                    <Check className="h-3.5 w-3.5 shrink-0 text-[#6b1b1b]" />
                                ) : (
                                    <span className="shrink-0">{i + 1}</span>
                                )}
                                <span className={`truncate ${isActive ? '' : 'hidden sm:inline'}`}>{s.title}</span>
                            </span>
                        </button>
                    </li>
                )
            })}
        </ol>
    )
}