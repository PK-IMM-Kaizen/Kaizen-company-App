export default function Home() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
            <div className="p-6 bg-white rounded-xl shadow-md space-y-4 text-center">
                <h1 className="text-3xl font-bold text-primary">
                    PK IMM Kaizen
                </h1>
                <p className="text-muted">
                    Struktur folder & Design Tokens (Tailwind v4) Berhasil Dikonfigurasi!
                </p>
                <button className="px-4 py-2 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors">
                    Warna Utama IMM (#CC1021)
                </button>
            </div>
        </main>
    );
}
