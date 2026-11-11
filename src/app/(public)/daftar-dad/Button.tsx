const base = 'inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4b82e] focus-visible:ring-offset-2 disabled:cursor-not-allowed motion-reduce:transition-none'

export const primaryBtn = `${base} mb-1 bg-[#6b1b1b] text-white shadow-[0_5px_0_#f4b82e] hover:bg-[#561212] active:translate-y-[3px] active:shadow-[0_2px_0_#f4b82e] disabled:opacity-60 disabled:translate-y-0 disabled:shadow-[0_5px_0_#f4b82e]`

export const secondaryBtn = `${base} border-2 border-[#6b1b1b]/20 text-[#6b1b1b] hover:border-[#6b1b1b] disabled:opacity-50`

export const goldBtn = `${base} mb-1 bg-[#f4b82e] text-[#4d1010] shadow-[0_5px_0_rgba(0,0,0,0.35)] hover:bg-[#ffc845] active:translate-y-[3px] active:shadow-[0_2px_0_rgba(0,0,0,0.35)] focus-visible:ring-offset-[#5a1313]`