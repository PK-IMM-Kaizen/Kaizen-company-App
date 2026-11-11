import Paper from './Paper'
import { timeline } from './Schedule'

export default function Timeline() {
    const last = timeline.length - 1

    return (
        <Paper>
            <h2 className="text-2xl font-bold text-[#6b1b1b] sm:text-3xl">
                <span className="bg-[linear-gradient(transparent_62%,#f4b82e_62%)] px-1">Timeline</span> pendaftaran
            </h2>
            <p className="mt-1 text-xs text-[#7d6b68] lg:hidden">Geser ke samping untuk melihat semua jadwal.</p>

            <div
                role="region"
                aria-label="Timeline pendaftaran"
                tabIndex={0}
                className="-mx-2 mt-6 snap-x overflow-x-auto rounded-lg px-2 pb-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6b1b1b]/40 lg:overflow-visible"
            >
                <ol className="flex">
                    {timeline.map((item, i) => (
                        <li
                            key={`${item.label}-${i}`}
                            className="group flex min-w-[140px] flex-1 snap-start flex-col items-center text-center lg:min-w-0"
                        >
                            <span className="mx-2 inline-block rounded bg-[#f4b82e] px-2 py-0.5 text-xs font-bold text-[#4d1010]">
                                {item.date}
                            </span>

                            <div className="relative mt-3 flex h-8 w-full items-center justify-center">
                                {i > 0 && (
                                    <span aria-hidden className="absolute left-0 right-1/2 top-1/2 h-0.5 -translate-y-1/2 bg-[#6b1b1b]/30" />
                                )}
                                {i < last && (
                                    <span aria-hidden className="absolute left-1/2 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-[#6b1b1b]/30" />
                                )}
                                <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#6b1b1b] text-xs font-bold text-white ring-4 ring-white transition-transform duration-200 group-hover:scale-110 motion-reduce:transition-none">
                                    {i + 1}
                                </span>
                            </div>

                            <p className="mx-2 mt-3 text-sm font-bold text-[#2b1414]">{item.label}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </Paper>
    )
}