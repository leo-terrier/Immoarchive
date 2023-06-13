import { useEffect, useState } from 'react'
import {
    Box,
    Grid,
    Pagination,
    Paper,
    Typography,
    CircularProgress
} from '@mui/material'
import { format } from 'date-fns'
import styled from '@emotion/styled'
import { useAppContext } from '@/app/context/Context'
import { ListedDealType } from '@/app/types'
import { Lighter } from '../common/Lighter'
import { SeeOnMapButton } from '../common/SeeOnMapButton'
import { stripArrondissement } from '@/utils/utilityFunctions'

const StyledPagination = styled(Pagination)`
    ul {
        & .MuiPaginationItem-root {
            &.Mui-selected {
                background: rgba(255, 255, 255, 0.2);
            }
            color: #fff;
            font-weight: bold;
            cursor: pointer;
        }
    }
`

export const DealCards = () => {
    const { listedDeals, isLoading, isClustered, length } = useAppContext()

    const [cardItems, setCardItems] = useState<ListedDealType[]>([])
    const [page, setPage] = useState(0)

    const cardsPerPage = 10

    const isPagination = !isLoading && !isClustered && length > 10

    useEffect(() => {
        if (!isClustered && length) {
            setCardItems(listedDeals)
        } else setCardItems([])
        setPage(0)
    }, [listedDeals, isClustered, length])

    return (
        <>
            <Box
                sx={{
                    p: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    backgroundColor: 'rgba(255, 255, 255, .2)',
                    mt: 12,
                    py: 5,
                    minHeight: '400px',
                    mb: isPagination ? 0 : 15
                }}
            >
                {!isLoading && !isClustered && length > 0 ? (
                    cardItems
                        .slice(
                            page * cardsPerPage,
                            page * cardsPerPage + cardsPerPage
                        )
                        .map((deal) => (
                            <Paper
                                data-cy='dealCard'
                                key={deal.id_mutation}
                                sx={{
                                    p: 2,
                                    backgroundColor: (theme) =>
                                        theme.palette.grey[900],
                                    color: (theme) => theme.palette.grey[200],
                                    maxWidth: '455px',
                                    mx: 'auto'
                                }}
                            >
                                <Grid
                                    container
                                    spacing={{ sm: 2, xs: 1.4 }}
                                    textAlign={'center'}
                                >
                                    <Grid
                                        item
                                        xs={6}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Typography
                                            variant='tooltipTypo'
                                            sx={{
                                                fontSize: '22px',
                                                letterSpacing: 1.05,
                                                alignSelf: 'center',
                                                justifySelf: 'start'
                                            }}
                                        >
                                            {deal?.valeur_fonciere.toLocaleString()}{' '}
                                            €
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
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
                                            <span>{`${deal?.adresse_numero} ${deal?.adresse_suffixe} ${deal?.adresse_nom_voie}`}</span>
                                            <span>{`${
                                                deal?.code_postal
                                            } ${stripArrondissement(
                                                deal?.nom_commune
                                            )}`}</span>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant='tooltipTypo'>
                                            Surface :{' '}
                                            <Lighter>
                                                {deal?.total_surface_reelle_bati.toLocaleString()}{' '}
                                                m²
                                            </Lighter>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant='tooltipTypo'>
                                            Prix / m² :{' '}
                                            <Lighter>
                                                {deal?.prix_metre_carre.toLocaleString()}{' '}
                                                €
                                            </Lighter>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant='tooltipTypo'>
                                            Pièces :{' '}
                                            <Lighter>
                                                {deal?.total_nombre_pieces_principales.toLocaleString()}
                                            </Lighter>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant='tooltipTypo'>
                                            Terrain :{' '}
                                            <Lighter>
                                                {deal?.total_surface_terrain.toLocaleString()}{' '}
                                                m²
                                            </Lighter>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant='tooltipTypo'>
                                            <Lighter>
                                                {format(
                                                    new Date(
                                                        deal?.date_mutation
                                                    ),
                                                    'dd-MM-yyyy'
                                                )}
                                            </Lighter>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <SeeOnMapButton
                                            lnglat={deal.lnglat}
                                            idx={deal.agglomerateIdx}
                                            isDarkMode
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>
                        ))
                ) : isLoading ? (
                    <CircularProgress />
                ) : (
                    <Typography>
                        {isClustered
                            ? 'Trop de transactions'
                            : 'Aucune transaction'}
                    </Typography>
                )}
            </Box>
            {isPagination && (
                <StyledPagination
                    count={Math.ceil(listedDeals.length / 10)}
                    onChange={(_: unknown, pageNumber: number) =>
                        setPage(pageNumber - 1)
                    }
                    page={page + 1}
                    size='medium'
                    sx={{
                        mx: 'auto',
                        height: '120px',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                />
            )}
        </>
    )
}
