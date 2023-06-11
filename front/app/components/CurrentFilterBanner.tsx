import { Box, Typography } from '@mui/material'
import { rancho } from '../page'
import CircleIcon from '@mui/icons-material/Circle'
import { useAppContext } from '../context/Context'

const filterLabels: { [key: string]: string } = {
    maxNbOfRooms: 'Pièces < ',
    maxPrice: 'Prix (€) < ',
    maxPricePerMeterSquare: 'Prix (€) / m² < ',
    maxSurface: 'Surface (m²) < ',
    maxSurfaceLand: 'Terrain (m²) < ',
    maxYear: 'Avant le 31/12/',
    minNbOfRooms: 'Pièces > ',
    minPrice: 'Prix (€) > ',
    minPricePerMeterSquare: 'Prix (€) / m² > ',
    minSurface: 'Surface (m²) > ',
    minSurfaceLand: 'Terrain (m²) > ',
    minYear: 'Après le 01/01/'
}

export const CurrentFilterBanner = () => {
    const { queryParams } = useAppContext()

    const mapParamsArr = ['lats', 'latn', 'lngw', 'lnge', 'zoom', 'isMobile']

    // Display from query state only filters params that are not empty strings
    const filtersArr = Object.entries(queryParams).filter(
        ([key, value]) => !mapParamsArr.includes(key) && value
    )

    return filtersArr.length ? (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'end',
                justifyContent: 'flex-start',
                flexWrap: 'wrap',
                mb: 3
            }}
        >
            <Typography
                sx={{
                    fontSize: { xs: 30, sm: 42 },
                    height: { xs: '35px', sm: '50px' },
                    width: { xs: '100%', sm: 'initial' },
                    mr: 5,
                    ...rancho.style,
                    textDecoration: 'underline',
                    textDecorationThickness: '2px',
                    textUnderlineOffset: '5px'
                }}
            >
                Filtres actifs :
            </Typography>
            {filtersArr.map(([key, value]) => (
                <Typography
                    sx={{
                        mr: 5,
                        whiteSpace: 'nowrap',
                        fontWeight: 'bold',
                        fontSize: '17px',
                        display: 'flex',
                        alignItems: 'end',
                        gap: '7px',
                        height: { xs: '35px', sm: '50px' }
                    }}
                    key={key}
                >
                    <CircleIcon
                        fontSize="inherit"
                        sx={{ marginBottom: '3.5%' }}
                    />
                    {filterLabels[key]}
                    {key.includes('Year')
                        ? value
                        : parseInt(value as string, 10).toLocaleString()}
                </Typography>
            ))}
        </Box>
    ) : (
        <></>
    )
}
