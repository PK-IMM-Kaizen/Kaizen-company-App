import './globals.css'
import Navbar from '../components/common/Navbar'

export const metadata = {
    title: 'Nama Website Anda',
    description: 'Deskripsi website Anda',
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