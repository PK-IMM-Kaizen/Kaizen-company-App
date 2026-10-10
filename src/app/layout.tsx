import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
    variable: "--font-plus-jakarta",
    subsets: ["latin"],
    display: "swap",
});

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Website Resmi PK IMM Kaizen",
    description: "Pusat Informasi dan Media PK IMM Kaizen",
    icons: {
        icon: '/img/logo/logo.jpg'
    }
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="id" className={`${plusJakartaSans.variable} ${inter.variable}`}>
        <body className="antialiased font-sans">
        {children}
        </body>
        </html>
    );
}
