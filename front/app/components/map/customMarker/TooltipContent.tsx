import { Box, Grid, IconButton, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ApartmentIcon from '@mui/icons-material/Apartment'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import HomeIcon from '@mui/icons-material/Home'
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork'
import { useAppContext } from '@/app/context/Context'
import { DealType } from '@/app/types'
import { stripArrondissement } from '../helpers'
import { CloseButton } from '@/app/components/common/CloseButton'
import { Lighter } from '../../common/Lighter'
import { format } from 'date-fns'
import { OpenDealsType } from '@/app/types'

export const TooltipContent = () => {
    const { openDeals: currentOpenDeals, setOpenDeals } = useAppContext()

    const openDeals = currentOpenDeals as OpenDealsType

    const [deal, setDeal] = useState<{ value: DealType; idx: number }>({
        value: openDeals.deals[openDeals.selectedDealIdx || 0],
        idx: openDeals.selectedDealIdx || 0
    })

    const handleNext = () => {
        const newIdx = deal.idx + 1
        setDeal({ value: openDeals.deals[newIdx], idx: newIdx })
    }

    const handlePrev = () => {
        const newIdx = deal.idx - 1
        setDeal({ value: openDeals.deals[newIdx], idx: newIdx })
    }

    const handleClose = () => {
        setOpenDeals(null)
    }

    // User  clicks on other marker while open => change content of tooltip

    const {
        lnglat: { lng, lat }
    } = openDeals

    useEffect(() => {
        const initialIndex = openDeals.selectedDealIdx
        if (!initialIndex) {
            setDeal({ value: openDeals.deals[0], idx: 0 })
        } else {
            setDeal({
                value: openDeals.deals[initialIndex],
                idx: initialIndex
            })
        }
    }, [lng, lat])

    const type =
        deal.value.total_nombre_locaux > 1
            ? 'Complexe'
            : deal.value.code_type_local === '1'
            ? 'Maison'
            : 'Appartement'

    const length = openDeals.deals.length

    return (
        <Grid
            container
            spacing={{ sm: 2, xs: 1.4 }}
            sx={{
                backgroundColor: (theme) => theme.palette.greish.main,
                position: 'relative',
                borderRadius: '20px',
                border: '1.5px solid',
                borderColor: (theme) => theme.palette.greish.dark,
                padding: {
                    sm: 2,
                    xs: 1.4
                },
                paddingLeft: 0,
                minWidth: '300px',
                maxWidth: '380px',
                marginRight: '-10px'
            }}
            id="tooltip"
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
                            <MapsHomeWorkIcon fontSize="inherit" />
                        ) : type === 'Maison' ? (
                            <HomeIcon fontSize="inherit" />
                        ) : (
                            <ApartmentIcon fontSize="inherit" />
                        )}
                    </Box>
                    <Typography variant="tooltipTypo">{type}</Typography>
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
                        variant="tooltipTypo"
                        sx={{
                            fontSize: '19px',
                            alignSelf: 'center',
                            justifySelf: 'start'
                        }}
                    >
                        {deal.value.valeur_fonciere.toLocaleString()} €
                    </Typography>
                    <Typography
                        variant="tooltipTypo"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            gap: '5px'
                        }}
                    >
                        <span>{`${deal.value.adresse_numero} ${deal.value.adresse_suffixe} ${deal.value.adresse_nom_voie}`}</span>
                        <span>{`${deal.value.code_postal} ${stripArrondissement(
                            deal.value.nom_commune
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
                <Typography variant="tooltipTypo">
                    Surface :{' '}
                    <Lighter>
                        {deal.value.total_surface_reelle_bati.toLocaleString()}{' '}
                        m²
                    </Lighter>
                </Typography>
            </Grid>
            <Grid
                item
                xs={6}
                sx={{ display: 'flex', justifyContent: 'center' }}
            >
                <Typography variant="tooltipTypo">
                    Prix / m² :{' '}
                    <Lighter>
                        {deal.value.prix_metre_carre.toLocaleString()} €
                    </Lighter>
                </Typography>
            </Grid>
            <Grid
                item
                xs={6}
                sx={{ display: 'flex', justifyContent: 'center' }}
            >
                <Typography variant="tooltipTypo">
                    Pièce(s) :{' '}
                    <Lighter>
                        {deal.value.total_nombre_pieces_principales.toLocaleString()}
                    </Lighter>
                </Typography>
            </Grid>
            <Grid
                item
                xs={6}
                sx={{ display: 'flex', justifyContent: 'center' }}
            >
                <Typography variant="tooltipTypo">
                    Terrain :{' '}
                    <Lighter>
                        {deal.value.total_surface_terrain.toLocaleString()} m²
                    </Lighter>
                </Typography>
            </Grid>
            <Grid
                item
                xs={12}
                sx={{ display: 'flex', justifyContent: 'center' }}
            >
                <Typography variant="tooltipTypo">
                    Vendu le{' '}
                    {format(new Date(deal.value.date_mutation), 'dd-MM-yyyy')}
                </Typography>
            </Grid>
            {length > 1 && (
                <Grid
                    item
                    xs={12}
                    justifySelf="center"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    maxHeight={'40px'}
                    gap="10px"
                >
                    <IconButton
                        disabled={deal.idx === 0}
                        onClick={handlePrev}
                        size="large"
                    >
                        <ArrowBackIosNewIcon />
                    </IconButton>
                    <Typography>
                        {deal.idx + 1}/{length}
                    </Typography>
                    <IconButton
                        disabled={deal.idx === length - 1}
                        onClick={handleNext}
                        size="large"
                    >
                        <ArrowForwardIosIcon />
                    </IconButton>
                </Grid>
            )}
        </Grid>
    )
}
