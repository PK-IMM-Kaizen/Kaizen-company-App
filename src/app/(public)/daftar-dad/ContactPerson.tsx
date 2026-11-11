import { MessageCircle } from 'lucide-react'
import Paper from './Paper'
import { contacts } from './Schedule'

export default function ContactPerson() {
    return (
        <Paper>
            <h2 className="text-xl font-bold text-[#6b1b1b] sm:text-2xl">
                <span className="bg-[linear-gradient(transparent_62%,#f4b82e_62%)] px-1">Contact</span> person
            </h2>

            <ul className="mt-4 space-y-2.5 sm:mt-5 sm:space-y-3">
                {contacts.map(c => (
                    <li key={c.wa}>
                        <a
                            href={`https://wa.me/${c.wa}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex min-h-[52px] items-center gap-3 rounded-xl border border-[#e9ddd7] bg-[#fcf8f5] p-3 transition-all hover:border-[#6b1b1b] active:scale-[0.98] active:bg-[#f5ece7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6b1b1b]/40"
                        >
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6b1b1b] text-white transition-transform group-hover:scale-105 motion-reduce:transition-none">
                                <MessageCircle className="h-5 w-5" />
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-bold text-[#2b1414]">
                                    {c.name}
                                </span>
                                <span className="block truncate text-xs text-[#7d6b68]">
                                    {c.display}
                                </span>
                            </span>
                        </a>
                    </li>
                ))}
            </ul>

            <p className="mt-4 text-xs leading-relaxed text-[#7d6b68] sm:mt-5">
                Pastikan data kamu benar saat mengisi form. Jika ada kekeliruan, hubungi contact person di atas.
            </p>
        </Paper>
    )
}