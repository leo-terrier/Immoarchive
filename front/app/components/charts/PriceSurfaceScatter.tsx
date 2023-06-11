import { useAppContext } from '@/app/context/Context'
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    CartesianGrid,
    Legend
} from 'recharts'
import CustomScatterTooltip from './tooltip/CustomScatterTooltip'
import { Box, Typography, useTheme, Theme, useMediaQuery } from '@mui/material'
import CircleIcon from '@mui/icons-material/Circle'
import { HorizontalRule } from '@mui/icons-material'

const CustomLegend = ({
    averagePricePerMeter
}: {
    averagePricePerMeter: number
}) => (
    <Box
        sx={{
            display: 'flex',
            gap: '30px',
            justifyContent: 'flex-end',
            mt: 3
        }}
    >
        <Box
            sx={{
                display: 'flex',
                gap: '5px',
                color: 'primary.main',
                alignItems: 'center'
            }}
        >
            <CircleIcon color={'inherit'} fontSize="small" />
            <Typography>Transactions</Typography>
        </Box>
        <Box
            sx={{
                display: 'flex',
                gap: '5px',
                color: 'red',
                alignItems: 'center'
            }}
        >
            <HorizontalRule color={'inherit'} />
            <Typography
                display="flex"
                sx={{
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: '3px', sm: '6px' }
                }}
            >
                <span style={{ whiteSpace: 'nowrap' }}>Prix moyen / m²</span>
                <span> ({averagePricePerMeter?.toLocaleString() + ' €'})</span>
            </Typography>
        </Box>
    </Box>
)

export const PriceSurfaceScatter = () => {
    const { graphData } = useAppContext()
    const theme = useTheme()
    const breakpointsSmall = useMediaQuery((theme: Theme) =>
        theme.breakpoints.up('sm')
    )
    return (
        <ResponsiveContainer width="100%" minHeight={0} height={485}>
            <ScatterChart
                margin={{
                    top: 0,
                    right: 40,
                    left: breakpointsSmall ? 0 : 40,
                    bottom: 0
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                    type="number"
                    dataKey="valeur_fonciere"
                    name="Prix"
                    tickFormatter={(value) => {
                        if (!breakpointsSmall && value === 0) return ''
                        else return value.toLocaleString() + ' €'
                    }}
                />
                <YAxis
                    type="number"
                    dataKey="total_surface_reelle_bati"
                    name="Surface"
                    domain={[
                        () => 0,
                        (maxData: number) =>
                            Math.max(
                                maxData,
                                graphData?.priceSurfaceScatter?.endPoint
                                    .y as number
                            )
                    ]}
                    mirror={!breakpointsSmall}
                    tickFormatter={(value) => {
                        if (!breakpointsSmall && value === 0) return ''
                        else return value.toLocaleString() + ' m²'
                    }}
                    width={80}
                />
                <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    content={<CustomScatterTooltip />}
                    trigger="click"
                />
                <Scatter
                    data={graphData?.priceSurfaceScatter?.data}
                    fill={theme.palette.primary.main}
                    name="Transactions"
                />
                <ReferenceLine
                    segment={[
                        { x: 0, y: 0 },
                        graphData?.priceSurfaceScatter?.endPoint as {
                            x: number
                            y: number
                        }
                    ]}
                    strokeWidth={2}
                    stroke="red"
                    isFront
                    name="Moyenne prix / m²"
                />
                <Legend
                    content={
                        <CustomLegend
                            averagePricePerMeter={
                                graphData?.priceSurfaceScatter
                                    ?.averagePricePerMeterSquare as number
                            }
                        />
                    }
                    type="plainline"
                />
            </ScatterChart>
        </ResponsiveContainer>
    )
}
