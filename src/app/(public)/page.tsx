import Link from "next/link";

export default function HomePage() {
    return (
        <section className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center text-center px-4 py-20 bg-surface">
            <div className="max-w-3xl space-y-6">
                <span className="section-label">Komisariat Kaizen</span>
                <h1 className="text-4xl md:text-6xl font-extrabold text-imm-dark tracking-tight">
                    Ikatan Mahasiswa Muhammadiyah <span className="text-primary">Kaizen</span>
                </h1>
                <p className="text-imm-secondary text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                    Pusat informasi, media pergerakan, dan dokumentasi kegiatan PK IMM Kaizen Universitas Muhammadiyah Surabaya.
                </p>
                <div className="flex flex-wrap justify-center gap-4 pt-4">
                    <Link href="/profile" className="btn-primary">
                        Jelajahi Profil
                    </Link>
                    <Link href="/news" className="btn-outline">
                        Berita Terbaru
                    </Link>
                </div>
            </div>
        </section>
    );
}