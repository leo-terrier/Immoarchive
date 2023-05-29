'use client'
import { Box, Typography } from '@mui/material'

import { InfoBanner } from './components/InfoBanner'
import Map from './components/map/Map'
import { Roboto } from 'next/font/google'
import { CurrentFilterBanner } from './components/CurrentFilterBanner'

// https://nextjs.org/docs/app/building-your-application/optimizing/fonts#local-fonts
//check if built with font already

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    display: 'swap',
    style: ['normal', 'italic'],
    subsets: ['latin']
})

const Home: React.FC = () => {
    //const { mode, setMode } = useAppContext()

    return (
        <Box
            component={'main'}
            sx={{
                p: {
                    xs: '24px',
                    sm: '75px'
                },
                backgroundColor: (theme) => theme.palette.grey['900'],
                color: (theme) => theme.palette.grey['200']
            }}
            className={roboto.className}
        >
            <Box display="flex" flexDirection="column" gap="30px">
                <Box>
                    <Typography variant="h1" sx={{ fontSize: 40 }}>
                        Immo Archive
                    </Typography>
                    <CurrentFilterBanner />
                </Box>
                <Map />
                <InfoBanner />
                {/*  <select value={mode} onChange={(e) => setMode(e.target.value)}>
                    <option value="tranctions">tranctions</option>
                    <option value="prix">prix</option>
                    <option value="evolution">evolution des prix</option>
                </select> */}
            </Box>
        </Box>
    )
}

export default Home
