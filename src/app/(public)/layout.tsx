import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'

export default function PublicLayout({
                                         children,
                                     }: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex flex-col bg-[var(--background)]">
            <Navbar />

            <main className="flex-1 w-full flex flex-col">
                {children}
            </main>

            <Footer />
        </div>
    )
}