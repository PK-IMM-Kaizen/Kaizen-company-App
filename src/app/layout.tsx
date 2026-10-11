import './globals.css'
import Navbar from '../components/common/Navbar'

export const metadata = {
    title: "Website Resmi PK IMM Kaizen",
    description: "Pusat Informasi dan Media PK IMM Kaizen",
    icons: {
        icon: '/img/logo/logo.jpg'
    }
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="id">
        <body>
        <Navbar />

        {children}
        </body>
        </html>
    )
}