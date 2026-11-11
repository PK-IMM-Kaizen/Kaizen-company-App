import Paper from './Paper'
import { timeline } from './Schedule'

export default function Timeline() {
    const last = timeline.length - 1

    return (
        <Paper>
            <h2 className="text-xl font-bold text-[#6b1b1b] sm:text-2xl md:text-3xl">
                <span className="bg-[linear-gradient(transparent_62%,#f4b82e_62%)] px-1">Timeline</span> pendaftaran
            </h2>

            {/* --- TAMPILAN MOBILE & TABLET (< lg): Vertical Timeline (Bebas Terpotong & Sangat Rapi) --- */}
            <div className="mt-6 block lg:hidden">
                <ol className="relative ml-3 space-y-6 border-l-2 border-[#6b1b1b]/30">
                    {timeline.map((item, i) => (
                        <li key={`${item.label}-${i}`} className="relative pl-6">
                            {/* Lingkaran Nomor Stepper */}
                            <span className="absolute -left-[15px] top-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#6b1b1b] text-xs font-bold text-white ring-4 ring-[#fcf8f5]">
                                {i + 1}
                            </span>

                            {/* Tanggal & Deskripsi */}
                            <div className="flex flex-col items-start gap-1">
                                <span className="inline-block rounded-md bg-[#f4b82e] px-2 py-0.5 text-[11px] font-bold text-[#4d1010] shadow-sm">
                                    {item.date}
                                </span>
                                <p className="text-sm font-bold text-[#2b1414]">{item.label}</p>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>

            {/* --- TAMPILAN DESKTOP (>= lg): Horizontal Timeline --- */}
            <div
                role="region"
                aria-label="Timeline pendaftaran"
                tabIndex={0}
                className="mt-6 hidden lg:block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6b1b1b]/40"
            >
                <ol className="flex min-w-full">
                    {timeline.map((item, i) => (
                        <li
                            key={`${item.label}-${i}`}
                            className="group flex flex-1 flex-col items-center text-center"
                        >
                            <span className="mx-1 inline-block rounded-md bg-[#f4b82e] px-2 py-0.5 text-xs font-bold text-[#4d1010] shadow-sm">
                                {item.date}
                            </span>

                            <div className="relative mt-3 flex h-8 w-full items-center justify-center">
                                {i > 0 && (
                                    <span
                                        aria-hidden
                                        className="absolute left-0 right-1/2 top-1/2 h-0.5 -translate-y-1/2 bg-[#6b1b1b]/30"
                                    />
                                )}
                                {i < last && (
                                    <span
                                        aria-hidden
                                        className="absolute left-1/2 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-[#6b1b1b]/30"
                                    />
                                )}
                                <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#6b1b1b] text-xs font-bold text-white ring-4 ring-[#fcf8f5] transition-transform duration-200 group-hover:scale-110 motion-reduce:transition-none">
                                    {i + 1}
                                </span>
                            </div>

                            <p className="mx-1 mt-2.5 text-sm font-bold text-[#2b1414]">{item.label}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </Paper>
    )
}