import { Box, Grid, IconButton, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import ApartmentIcon from '@mui/icons-material/Apartment'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import HomeIcon from '@mui/icons-material/Home'
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork'
import { format } from 'date-fns'
import { useAppContext } from '@/app/context/Context'
import { AgglomeratedDealType, OpenDealsType } from '@/app/types'
import { CloseButton } from '@/app/components/common/CloseButton'
import { Lighter } from '../../common/Lighter'
import { TooltipContainer } from '../../common/TooltipContainer'
import { stripArrondissement } from '@/utils/utilityFunctions'

export const MapTooltip = () => {
    const { openDeals: deals, setOpenDeals } = useAppContext()

    const openDeals = deals as OpenDealsType

    const indexRef = useRef<number>(openDeals?.selectedDealIdx || 0)

    const [deal, setDeal] = useState<AgglomeratedDealType>(
        {} as AgglomeratedDealType
    )

    const handleNext = () => {
        indexRef.current++
        setDeal(openDeals.deals[indexRef.current])
    }

    const handlePrev = () => {
        indexRef.current--
        setDeal(openDeals.deals[indexRef.current])
    }

    const handleClose = () => {
        setOpenDeals(null)
    }

    // User  clicks on other marker while open => change content of tooltip

    const {
        lnglat: { lng, lat }
    } = openDeals

    useEffect(() => {
        setDeal(openDeals.deals[openDeals?.selectedDealIdx || 0])
        indexRef.current = openDeals?.selectedDealIdx || 0
    }, [lng, lat])

    const type =
        deal?.total_nombre_locaux > 1
            ? 'Complexe'
            : deal?.code_type_local === '1'
            ? 'Maison'
            : 'Appartement'

    const length = openDeals.deals.length

    return Object.keys(deal).length ? (
        <TooltipContainer p={{ xs: 1.4, sm: 2 }}>
            <Grid
                data-cy='mapTooltip'
                container
                spacing={{ xs: 1.4, sm: 2 }}
                sx={{
                    paddingLeft: 0,
                    minWidth: '320px',
                    maxWidth: '380px'
                }}
            >
                <CloseButton handleClose={handleClose} />
                <Grid item xs={4}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}
                    >
                        <Box
                            sx={{
                                fontSize: '60px',
                                display: 'flex'
                            }}
                        >
                            {type === 'Complexe' ? (
                                <MapsHomeWorkIcon fontSize='inherit' />
                            ) : type === 'Maison' ? (
                                <HomeIcon fontSize='inherit' />
                            ) : (
                                <ApartmentIcon fontSize='inherit' />
                            )}
                        </Box>
                        <Typography variant='tooltipTypo'>{type}</Typography>
                    </Box>
                </Grid>
                <Grid item xs={8}>
                    <Box
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }}
                    >
                        <Typography
                            variant='tooltipTypo'
                            sx={{
                                fontSize: '22px',
                                letterSpacing: 1.05,
                                alignSelf: 'center',
                                justifySelf: 'start',
                                color: (theme) => theme.palette.secondary.main
                            }}
                        >
                            {deal?.valeur_fonciere.toLocaleString()} €
                        </Typography>
                        <Typography
                            variant='tooltipTypo'
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                                textAlign: 'end',
                                gap: '5px',
                                fontSize: 14
                            }}
                        >
                            <span
                                style={{ marginTop: '10px' }}
                            >{`${deal?.adresse_numero} ${deal?.adresse_suffixe} ${deal?.adresse_nom_voie}`}</span>
                            <span>{`${deal?.code_postal} ${stripArrondissement(
                                deal?.nom_commune
                            )}`}</span>
                        </Typography>
                    </Box>
                </Grid>

                <Grid
                    item
                    xs={6}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                >
                    <Typography variant='tooltipTypo'>
                        Surface :{' '}
                        <Lighter>
                            {deal?.total_surface_reelle_bati.toLocaleString()}{' '}
                            m²
                        </Lighter>
                    </Typography>
                </Grid>
                <Grid
                    item
                    xs={6}
                    sx={{ display: 'flex', justifyContent: 'center' }}
                >
                    <Typography variant='tooltipTypo'>
                        Prix / m² :{' '}
                        <Lighter>
                            {deal?.prix_metre_carre.toLocaleString()} €
                        </Lighter>
                    </Typography>
                </Grid>
                <Grid
                    item
                    xs={6}
                    sx={{ display: 'flex', justifyContent: 'center' }}
                >
                    <Typography variant='tooltipTypo'>
                        Pièces :{' '}
                        <Lighter>
                            {deal?.total_nombre_pieces_principales.toLocaleString()}
                        </Lighter>
                    </Typography>
                </Grid>
                <Grid
                    item
                    xs={6}
                    sx={{ display: 'flex', justifyContent: 'center' }}
                >
                    <Typography variant='tooltipTypo'>
                        Terrain :{' '}
                        <Lighter>
                            {deal?.total_surface_terrain.toLocaleString()} m²
                        </Lighter>
                    </Typography>
                </Grid>
                <Grid
                    item
                    xs={12}
                    sx={{ display: 'flex', justifyContent: 'center' }}
                >
                    <Typography variant='tooltipTypo'>
                        <Lighter>
                            Vendu le{' '}
                            {format(
                                new Date(deal?.date_mutation),
                                'dd-MM-yyyy'
                            )}
                        </Lighter>
                    </Typography>
                </Grid>
                {length > 1 && (
                    <Grid
                        item
                        xs={12}
                        justifySelf='center'
                        display='flex'
                        justifyContent='center'
                        alignItems='center'
                        maxHeight={'40px'}
                        gap='10px'
                    >
                        <IconButton
                            disabled={indexRef.current === 0}
                            onClick={handlePrev}
                            size='large'
                        >
                            <ArrowBackIosNewIcon />
                        </IconButton>
                        <Typography>
                            {indexRef.current + 1}/{length}
                        </Typography>
                        <IconButton
                            disabled={indexRef.current === length - 1}
                            onClick={handleNext}
                            size='large'
                        >
                            <ArrowForwardIosIcon />
                        </IconButton>
                    </Grid>
                )}
            </Grid>
        </TooltipContainer>
    ) : (
        <></>
    )
}
