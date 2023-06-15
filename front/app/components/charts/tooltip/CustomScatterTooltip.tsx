import { List, ListItem, Typography } from '@mui/material'
import { TooltipContainer } from '../../common/TooltipContainer'
import { ListedDealType } from '@/app/types'
import { SeeOnMapButton } from '../../common/SeeOnMapButton'

const CustomScatterTooltip = (props: any) => {
    const { payload } = props
    const deal = payload[0]?.payload as ListedDealType

    return deal ? (
        <TooltipContainer>
            <List
                sx={{
                    p: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                }}
            >
                <ListItem
                    sx={{
                        p: 0,
                        color: (theme) => theme.palette.primary.main
                    }}
                >
                    Prix : {deal.valeur_fonciere.toLocaleString('fr-FR') + ' €'}
                </ListItem>
                <ListItem
                    sx={{
                        p: 0,
                        color: (theme) => theme.palette.secondary.main
                    }}
                >
                    Surface :{' '}
                    {deal.total_surface_reelle_bati.toLocaleString('fr-FR') +
                        ' m²'}
                </ListItem>

                <ListItem sx={{ p: 0 }}>
                    <Typography
                        variant='subtitle2'
                        sx={{ width: '100%', textAlign: 'center' }}
                    >
                        &#8594;{' '}
                        {deal.prix_metre_carre.toLocaleString('fr-FR') +
                            ' € / m²'}
                    </Typography>
                </ListItem>
                <ListItem
                    sx={{
                        p: 0,
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                >
                    <SeeOnMapButton
                        lnglat={deal.lnglat}
                        idx={deal.agglomerateIdx}
                    />
                </ListItem>
            </List>
        </TooltipContainer>
    ) : (
        <></>
    )
}

export default CustomScatterTooltip
