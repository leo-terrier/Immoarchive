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
        'données immobilières',
        'carte',
        'transactions'
    ],
    authors: [{ name: 'Leo Terrier' }],
    viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1.1

        /* TODO prevent unzooming  minimumScale: 0.9,
        userScalable: false NOT WORKING*/
    }, // https://stackoverflow.com/questions/33979317/when-to-set-viewport-maximum-scale-1-and-user-scalable-yes
    //metadataBase: new URL('yoururl.com')/* -> TRY WITHOUT  https://nextjs.org/docs/app/api-reference/functions/generate-metadata#manifest */,
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
                {' '}
                <AppContextProvider>{children}</AppContextProvider>
            </body>
        </html>
    )
}
