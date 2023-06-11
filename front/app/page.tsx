'use client'

import { Box, Typography, useMediaQuery, Theme } from '@mui/material'
import { Roboto } from 'next/font/google'
import { Rancho } from 'next/font/google'
import { InfoBanner } from './components/InfoBanner'
import Map from './components/map/Map'
import { CurrentFilterBanner } from './components/CurrentFilterBanner'
import { ChartsContainer } from './components/charts/ChartsContainer'
import { DealTable } from './components/DealTable'
import { ClipboardButton } from './components/ClipBoardButton'
import { DealCards } from './components/DealCards'

// https://nextjs.org/docs/app/building-your-application/optimizing/fonts#local-fonts

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    display: 'swap',
    style: ['normal', 'italic'],
    subsets: ['latin']
})
export const rancho = Rancho({
    weight: ['400'],
    display: 'swap',
    style: ['normal'],
    subsets: ['latin']
})

const Home: React.FC = () => {
    //const { mode, setMode } = useAppContext()
    const breakpointsMedium = useMediaQuery((theme: Theme) =>
        theme.breakpoints.up('md')
    )
    return (
        <Box
            component={'main'}
            sx={{
                width: {
                    xs: '92%',
                    sm: '90%',
                    md: '87%',
                    lg: '83%',
                    xl: '77%'
                },
                pb: 15,
                pt: {
                    xs: 1,
                    sm: 2
                },
                maxWidth: '1400px',
                color: (theme) => theme.palette.grey['200']
            }}
            className={roboto.className}
            display="flex"
            flexDirection="column"
            mx="auto"
        >
            <Box>
                <Typography
                    component="h1"
                    sx={{
                        fontSize: { xs: 50, sm: 90 }
                        /*  mb: { xs: 2 } */
                    }}
                    style={rancho.style}
                >
                    Immo Archive
                </Typography>
                <CurrentFilterBanner />
            </Box>
            <Map />
            <InfoBanner />
            <ChartsContainer />
            {breakpointsMedium ? <DealTable /> : <DealCards />}
            <ClipboardButton />
        </Box>
    )
}

export default Home
