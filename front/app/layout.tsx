import './globals.css'
import { Metadata } from 'next'
import { AppContextProvider } from './context/Context'

export const metadata: Metadata = {
    title: 'ImmoArchive',
    description: `L'historique des transactions immobilières`,
    applicationName: 'ImmoArchive',
    keywords: [
        'etalab',
        'data',
        'prospection immobilière',
        'données immobilières',
        'carte',
        'transactions'
    ],
    authors: [{ name: 'Leo Terrier' }],
    viewport: {
        width: 'device-width',
        initialScale: 1
    },
    icons: {
        icon: '/icon.png',
        shortcut: '/icon.png',
        apple: '/icon.png'
    }
}

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                <AppContextProvider>{children}</AppContextProvider>
            </body>
        </html>
    )
}
