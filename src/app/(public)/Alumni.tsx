'use client'

export default function Alumni() {
    return (
        <div className="bg-[var(--background)] min-h-screen">
            <div className="relative bg-[var(--primary-dark)] pt-32 pb-20 overflow-hidden">
                <div
                    className="absolute top-0 left-0 w-full h-1"
                    style={{
                        background: 'linear-gradient(to right, var(--primary), var(--accent), var(--accent-light))'
                    }}
                />
                <div
                    className="absolute top-0 right-0 w-1/2 h-full opacity-10"
                    style={{
                        background: 'linear-gradient(to left, var(--primary), transparent)'
                    }}
                />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-8 h-[1px] bg-[var(--accent)]"></div>
                        <span className="text-[var(--accent)] text-xs sm:text-sm font-bold tracking-[0.2em] uppercase font-display">
                            Mereka yang Menginspirasi
                        </span>
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight font-display">
                        Alumni Inspiratif
                    </h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24">

                <div className="max-w-3xl mb-16">
                    <p className="text-lg text-[var(--text-secondary)] leading-relaxed font-medium">
                        IMM Kaizen bangga dengan jejaring alumni yang telah memberikan kontribusi nyata di berbagai sektor. Mereka adalah bukti konkret bahwa iklim kaderisasi yang tajam dan terarah mampu melahirkan tokoh-tokoh penggerak peradaban.
                    </p>
                </div>

                {/*{alumniData && alumniData.length > 0 ? (*/}
                {/*    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">*/}
                {/*        {alumniData.map(a => (*/}
                {/*            <div*/}
                {/*                key={a.id}*/}
                {/*                className="group flex flex-col sm:flex-row bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)] transition-colors duration-300 rounded-[var(--radius)] overflow-hidden"*/}
                {/*            >*/}
                {/*                /!* Photo Column *!/*/}
                {/*                <div className="w-full sm:w-48 relative aspect-[4/3] sm:aspect-auto overflow-hidden bg-[#111111] flex-shrink-0 flex items-center justify-center">*/}
                {/*                    {a.photo ? (*/}
                {/*                        <img*/}
                {/*                            src={a.photo}*/}
                {/*                            alt={a.name}*/}
                {/*                            className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105"*/}
                {/*                        />*/}
                {/*                    ) : (*/}
                {/*                        <div className="text-[10px] font-bold text-white/40 tracking-widest uppercase font-display">*/}
                {/*                            No Image*/}
                {/*                        </div>*/}
                {/*                    )}*/}
                {/*                </div>*/}

                {/*                /!* Content Column *!/*/}
                {/*                <div className="p-6 sm:p-8 flex flex-col justify-center w-full">*/}
                {/*                    <span className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-widest mb-2 block font-display">*/}
                {/*                        Angkatan {a.batch}*/}
                {/*                    </span>*/}
                {/*                    <h3 className="font-black text-xl text-[var(--text-primary)] mb-1 font-display">*/}
                {/*                        {a.name}*/}
                {/*                    </h3>*/}
                {/*                    <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-5 font-display">*/}
                {/*                        {a.role}*/}
                {/*                    </p>*/}

                {/*                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6 flex-grow">*/}
                {/*                        {a.bio}*/}
                {/*                    </p>*/}

                {/*                    /!* Achievement Accent *!/*/}
                {/*                    <div className="mt-auto pt-4 border-t border-[var(--border)] flex items-start gap-3">*/}
                {/*                        <span className="text-[var(--accent)] text-lg leading-none select-none">★</span>*/}
                {/*                        <p className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wide leading-snug font-display">*/}
                {/*                            {a.achievement}*/}
                {/*                        </p>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        ))}*/}
                {/*    </div>*/}
                {/*) : (*/}
                {/*    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">*/}
                {/*        {[1, 2, 3].map((i) => (*/}
                {/*            <div*/}
                {/*                key={i}*/}
                {/*                className="bg-[var(--surface)] border border-[var(--border)] p-8 rounded-[var(--radius)] flex flex-col items-center text-center group border-dashed"*/}
                {/*            >*/}
                {/*                <div className="w-20 h-20 rounded-full bg-[#111111] border border-[var(--border)] flex items-center justify-center mb-4 text-white/30 text-xs font-bold uppercase font-display">*/}
                {/*                    No Photo*/}
                {/*                </div>*/}
                {/*                <div className="h-4 w-28 bg-[var(--surface-2)] rounded mb-2" />*/}
                {/*                <div className="h-3 w-20 bg-[var(--surface-2)] rounded mb-4" />*/}
                {/*                <p className="text-xs text-[var(--text-muted)] italic mb-4">*/}
                {/*                    Data alumni sedang dalam tahap pendataan & pembaruan database.*/}
                {/*                </p>*/}
                {/*                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] font-display">*/}
                {/*                    Alumni Kaizen #{i}*/}
                {/*                </span>*/}
                {/*            </div>*/}
                {/*        ))}*/}
                {/*    </div>*/}
                {/*)}*/}

                <div className="mt-24 bg-[#111111] border-l-4 border-[var(--primary)] p-8 sm:p-12 relative overflow-hidden group rounded-[var(--radius)]">
                    <div
                        className="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none"
                        style={{
                            background: 'linear-gradient(to left, var(--primary), transparent)'
                        }}
                    />
                    <div className="absolute -right-10 -bottom-10 text-white/5 opacity-20 font-black text-9xl select-none group-hover:scale-105 transition-transform duration-700 font-display">
                        #
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                            <span className="text-[var(--accent)] text-xs font-bold tracking-[0.2em] uppercase mb-3 block font-display">
                                Jejaring Kaizen
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-black text-white mb-3 font-display">
                                Anda Alumni IMM Kaizen?
                            </h3>
                            <p className="text-[var(--text-muted)] text-sm leading-relaxed max-w-xl">
                                Mari perkuat simpul ikatan. Hubungi pimpinan aktif untuk pembaruan database, kolaborasi program, atau berbagi inspirasi di halaman etalase ini.
                            </p>
                        </div>
                        <a
                            href="#"
                            className="inline-flex items-center justify-center bg-[var(--primary)] text-white px-8 py-4 text-sm font-bold tracking-widest uppercase transition-all hover:bg-[var(--primary-dark)] whitespace-nowrap rounded-[var(--radius)] font-display group"
                        >
                            Hubungi Pengurus
                            <span className="ml-3 transition-transform group-hover:translate-x-1">→</span>
                        </a>
                    </div>
                </div>

            </div>
        </div>
    )
}