import { PriceHisto } from './PriceHisto'
import { IconButton } from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosNewIcon from '@mui/icons-material/ArrowForwardIos'
import Carousel from 'react-material-ui-carousel'
import { PricePerMeterHisto } from './PricePerMeterHisto'
import { SurfaceHisto } from './SurfaceHisto'
import { RoomsHisto } from './RoomsHisto'
import { PriceSurfaceScatter } from './PriceSurfaceScatter'
import { useAppContext } from '@/app/context/Context'
import { PlaceholderChart } from './PlaceholderChart'
import { PricePerMeterIncreaseLine } from './PricePerMeterIncreaseLine'
import { ChartContainer } from './ChartContainer'

// https://github.com/Learus/react-material-ui-carousel

export const ChartsContainer = () => {
    const { isClustered, length } = useAppContext()

    const charts = [
        {
            title: 'Répartition du prix au mètre carré',
            component: <PricePerMeterHisto />
        },
        {
            title: 'Répartition de la valeur foncière',
            component: <PriceHisto />
        },
        {
            title: 'Répartition de la surface totale',
            component: <SurfaceHisto />
        },
        {
            title: 'Répartition du nombre de pièces',
            component: <RoomsHisto />
        },
        {
            title: 'Relation Prix / Surface',
            component: <PriceSurfaceScatter />
        },
        {
            title: 'Evolution du prix au mètre carré',
            component: <PricePerMeterIncreaseLine />
        }
    ]

    return length === 0 || length === 1500 ? (
        <ChartContainer
            noDataDesc={
                length === 0 ? 'Pas de transactions' : 'Trop de transactions'
            }
            component={<PlaceholderChart />}
        />
    ) : (
        <Carousel
            autoPlay={false}
            animation="slide"
            swipe={false}
            navButtonsAlwaysVisible
            fullHeightHover={false}
            navButtonsWrapperProps={{
                className: 'carrousselNavContainer'
            }}
            NavButton={({ onClick, next }) => (
                <IconButton
                    disableFocusRipple
                    disableTouchRipple
                    sx={{
                        '&:hover': {
                            opacity: '1 !important',
                            color: 'inherit !important',
                            backgroundColor: 'transparent !important'
                        },
                        backgroundColor: 'transparent !important',
                        ml: next ? '-20px !important' : 0,
                        mr: !next ? '-20px !important' : 0
                    }}
                    onClick={() => onClick()}
                >
                    {next ? (
                        <ArrowForwardIosNewIcon color="inherit" />
                    ) : (
                        <ArrowBackIosNewIcon color="inherit" />
                    )}
                </IconButton>
            )}
        >
            {charts.map((chart, i) => {
                const isTooManyDataForScatter = i === 4 && isClustered
                return (
                    <ChartContainer
                        title={chart.title}
                        component={
                            isTooManyDataForScatter ? (
                                <PlaceholderChart />
                            ) : (
                                chart.component
                            )
                        }
                        key={chart.title}
                        noDataDesc={
                            isTooManyDataForScatter
                                ? 'Trop de transactions'
                                : ''
                        }
                    />
                )
            })}
        </Carousel>
    )
}
