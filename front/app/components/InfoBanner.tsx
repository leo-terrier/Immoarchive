import React, { useEffect, useState } from 'react'
import axios from 'axios'

import { Box, Typography } from '@mui/material'
import { useAppContext } from '../context/Context'

export const InfoBanner = () => {
    const { center, length } = useAppContext()

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

    const { lat, lng } = center

    useEffect(() => {
        reverseGeoCoding(lat, lng)
    }, [lat, lng])

    return (
        <Box
            display="flex"
            gap={'20px'}
            justifyContent="center"
            alignItems="center"
        >
            <Typography variant="mapLgTypo">{text}</Typography>
            <Typography
                variant="mapLgTypo"
                display={length && text ? 'initial' : 'none'}
            >
                -
            </Typography>
            <Typography
                variant="mapLgTypo"
                display={length ? 'initial' : 'none'}
            >
                {length === '500'
                    ? 'Trop de résultats (filtrer ou zoomer)'
                    : length === '0'
                    ? 'Aucun résultat'
                    : `Nombre de transactions: ${length}`}
            </Typography>
        </Box>
    )
}
