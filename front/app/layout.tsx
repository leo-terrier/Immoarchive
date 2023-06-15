import { AppContextProvider } from './context/Context'
import './globals.css'
import { Metadata } from 'next'

const title = 'ImmoArchive'
const description = `Outil d'analyse des ventes immobilières passées.`

export const metadata: Metadata = {
    title,
    description,
    applicationName: title,
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
    },
    openGraph: {
        title,
        description,
        url: 'immoarchive.netlify.app',
        siteName: title,
        images: [
            {
                url: 'immoarchive.netlify.app/og-img.png',
                width: 440,
                height: 480
            }
        ],
        locale: 'fr-FR',
        type: 'website'
    }
}

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <html lang='en'>
            <body>
                <AppContextProvider>{children}</AppContextProvider>
            </body>
        </html>
    )
}
