'use client'

import { usePathname } from 'next/navigation'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'

export default function PublicLayout({
                                         children,
                                     }: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    const hideNavFooter = ['/daftar-dad', '/aspirasi'].includes(pathname)

    if (hideNavFooter) {
        return <>{children}</>
    }

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