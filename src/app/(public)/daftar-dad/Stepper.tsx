import { Check } from 'lucide-react'
import { steps } from './Form'

interface StepperProps {
    step: number
    maxStep: number
    onSelect: (i: number) => void
}

export default function Stepper({ step, maxStep, onSelect }: StepperProps) {
    return (
        <ol className="mb-6 flex gap-1.5 sm:mb-8 sm:gap-3" aria-label="Langkah pendaftaran">
            {steps.map((s, i) => {
                const isDone = i < step
                const isActive = i === step
                const isDisabled = i > maxStep

                return (
                    <li key={s.title} className="min-w-0 flex-1">
                        <button
                            type="button"
                            disabled={isDisabled}
                            onClick={() => onSelect(i)}
                            aria-current={isActive ? 'step' : undefined}
                            className="group w-full py-1.5 text-left focus-visible:outline-none disabled:cursor-not-allowed"
                        >
                            <span
                                className={`block h-2 rounded-full transition-all duration-300 group-focus-visible:ring-2 group-focus-visible:ring-[#f4b82e] ${
                                    isActive
                                        ? 'bg-[#f4b82e] shadow-sm'
                                        : isDone
                                            ? 'bg-[#6b1b1b]'
                                            : 'bg-[#eadfd9]'
                                }`}
                            />

                            <span
                                className={`mt-2 flex min-w-0 items-center gap-1.5 text-xs font-bold transition-colors duration-200 sm:text-sm ${
                                    isActive
                                        ? 'text-[#2b1414]'
                                        : isDone
                                            ? 'text-[#6b1b1b]'
                                            : 'text-[#a8968f]'
                                }`}
                            >
                                {isDone ? (
                                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#6b1b1b]/10">
                                        <Check className="h-3 w-3 stroke-[3] text-[#6b1b1b]" />
                                    </span>
                                ) : (
                                    <span className="shrink-0">{i + 1}.</span>
                                )}
                                <span
                                    className={`truncate ${
                                        isActive ? 'inline' : 'hidden md:inline'
                                    }`}
                                >
                                    {s.title}
                                </span>
                            </span>
                        </button>
                    </li>
                )
            })}
        </ol>
    )
}