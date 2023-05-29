import { Box, Typography } from '@mui/material'
import { useAppContext } from '../context/Context'

const filterLabels: { [key: string]: string } = {
    maxNbOfRooms: 'Pièce(s) < ',
    maxPrice: 'Prix (€) < ',
    maxPricePerMeterSquare: 'Prix (€) / m² < ',
    maxSurface: 'Surface (m²) < ',
    maxSurfaceLand: 'Terrain (m²) < ',
    maxYear: 'Avant le 31/12/',
    minNbOfRooms: 'Pièce(s) > ',
    minPrice: 'Prix (€) > ',
    minPricePerMeterSquare: 'Prix (€) / m² > ',
    minSurface: 'Surface (m²) > ',
    minSurfaceLand: 'Terrain (m²) > ',
    minYear: 'Après le 01/01/'
}

export const CurrentFilterBanner = () => {
    const { queryParams } = useAppContext()

    const mapParamsArr = ['lats', 'latn', 'lngw', 'lnge', 'zoom', 'isMobile']

    // Take from param state only filters params, that are not empty strings
    const filtersArr: [string, string][] = Object.entries(queryParams).filter(
        ([key, value]) => !mapParamsArr.includes(key) && value
    )

    return filtersArr.length ? (
        <Box mt="20px">
            <Typography variant="mapLgTypo">
                Filtres des transactions :{' '}
            </Typography>{' '}
            <ul
                style={{
                    marginBottom: 0,
                    marginTop: '8px',
                    height: '80px',
                    display: 'flex',
                    flexDirection: 'column',
                    flexWrap: 'wrap',
                    alignItems: 'flex-start',
                    alignContent: 'start',
                    justifyContent: 'start'
                }}
            >
                {filtersArr.map(([key, value]) => (
                    <li style={{ margin: '0 20px' }} key={key}>
                        {filterLabels[key]}
                        {key.includes('Year') ? value : value.toLocaleString()}
                    </li>
                ))}
            </ul>
        </Box>
    ) : (
        <></>
    )
}
