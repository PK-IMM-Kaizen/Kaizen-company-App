import Paper from './Paper'
import { timeline } from './Schedule'

const rows = [timeline.slice(0, 4), timeline.slice(4)]

export default function Timeline() {
    return (
        <Paper clip>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#6b1b1b] sm:text-4xl">
                    <span className="bg-[linear-gradient(transparent_62%,#f4b82e_62%)] px-1">Timeline</span>
                    <br />
                    Pendaftaran
                </h2>

                <p className="mt-3 rounded-md bg-yellow-50 px-3 py-2 text-xs font-medium text-[#6b1b1b] sm:text-sm">
                    *Note: Anda masih bisa mendaftar selagi sebelum pelaksanaan DAD (Pendaftaran ditutup 3 Desember 2026).
                </p>
            </div>

            <div className="space-y-8">
                {rows.map((row, r) => (
                    <ol key={r} className="flex w-full justify-center">
                        {row.map((item, i) => (
                            <li key={item.label} className="group flex w-1/4 flex-col items-center text-center">
                                <span className="whitespace-nowrap rounded bg-[#f4b82e] px-1.5 py-0.5 text-[10px] font-bold text-[#4d1010] sm:px-2 sm:text-xs">
                                    {item.date}
                                    <span className="hidden sm:inline"> 2026</span>
                                </span>

                                <div className="relative mt-3 flex h-5 w-full items-center justify-center">
                                    {i > 0 && (
                                        <span aria-hidden className="absolute left-0 right-1/2 top-1/2 h-[3px] -translate-y-1/2 bg-[#6b1b1b]" />
                                    )}
                                    {i < row.length - 1 && (
                                        <span aria-hidden className="absolute left-1/2 right-0 top-1/2 h-[3px] -translate-y-1/2 bg-[#6b1b1b]" />
                                    )}
                                    <span className="relative z-10 h-5 w-5 rounded-full bg-[#6b1b1b] transition-transform duration-200 group-hover:scale-125 motion-reduce:transition-none" />
                                </div>

                                <p className="mt-3 px-0.5 text-[11px] font-bold leading-snug text-[#2b1414] sm:text-sm">
                                    {item.label}
                                </p>
                            </li>
                        ))}
                    </ol>
                ))}
            </div>
        </Paper>
    )
}
