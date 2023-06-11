import React, { useEffect, useState } from 'react'
import axios from 'axios'

import {
    Box,
    LinearProgress,
    Theme,
    Typography,
    useMediaQuery
} from '@mui/material'
import { useAppContext } from '../context/Context'
import FmdGoodIcon from '@mui/icons-material/FmdGood'

export const InfoBanner = () => {
    const { mapParams, length, isLoading, isClustered } = useAppContext()
    const breakpointsSmall = useMediaQuery((theme: Theme) =>
        theme.breakpoints.up('sm')
    )
    const [text, setText] = useState('')

    const reverseGeoCoding = async (
        lat: string | number,
        lng: string | number
    ) => {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&result_type=locality|postal_code&key=${process.env.NEXT_PUBLIC_API_GMAP}
    `
        const {
            data: { results }
        } = await axios.get(url)
        if (results.length) {
            const [town, zipCode] = results
            setText(
                `${town.address_components[0].long_name} ${zipCode.address_components[0].long_name}`
            )
        } else setText('')
    }

    const { lat, lng } = mapParams.center

    useEffect(() => {
        if (lat && lng) {
            reverseGeoCoding(lat, lng)
        }
    }, [lat, lng])

    const desc = () => {
        if (length === 0) return 'Aucun résultat'
        if (length === 1500)
            return 'Trop de résultats, filtrer ou zoomer (transactions : + de 1500)'
        if (isClustered)
            return `Trop résultat pour la carte, filtrer ou zoomer (transactions : ${length})`
        return `Nombre de transactions: ${length}`
    }

    return (
        <Box
            display="flex"
            gap={breakpointsSmall ? 2 : 1}
            justifyContent="center"
            alignItems="center"
            height="120px"
            width="100%"
            flexDirection={breakpointsSmall ? 'row' : 'column-reverse'}
            textAlign="center"
        >
            {isLoading ? (
                <LinearProgress color="inherit" sx={{ width: '30%' }} />
            ) : (
                <>
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        gap={1}
                    >
                        <FmdGoodIcon />
                        <Typography
                            sx={{
                                typography: {
                                    xs: 'mapLgTypo2',
                                    sm: 'mapLgTypo1',
                                    whiteSpace: 'nowrap'
                                }
                            }}
                        >
                            {text}
                        </Typography>
                    </Box>

                    {breakpointsSmall && (
                        <Typography
                            sx={{
                                typography: {
                                    xs: 'mapLgTypo2',
                                    sm: 'mapLgTypo1'
                                }
                            }}
                        >
                            —
                        </Typography>
                    )}
                    <Typography
                        sx={{
                            typography: { xs: 'mapLgTypo2', sm: 'mapLgTypo1' }
                        }}
                    >
                        {desc()}
                    </Typography>
                </>
            )}
        </Box>
    )
}
