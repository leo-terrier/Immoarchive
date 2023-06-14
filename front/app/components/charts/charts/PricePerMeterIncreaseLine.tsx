import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts'
import { Theme, useMediaQuery, useTheme } from '@mui/material'
import CustomTooltip from '../tooltip/CustomTooltip'
import { useAppContext } from '@/app/context/Context'

export const PricePerMeterIncreaseLine = () => {
    const { graphData } = useAppContext()
    const theme = useTheme()
    const unit = ' €'
    const breakpointsSmall = useMediaQuery((theme: Theme) =>
        theme.breakpoints.up('sm')
    )

    return (
        <ResponsiveContainer width='100%' minHeight={0} height={485}>
            <LineChart
                data={graphData?.pricePerMeterIncreaseLine}
                margin={{
                    top: 0,
                    right: 40,
                    left: breakpointsSmall ? 0 : 40,
                    bottom: 0
                }}
            >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis
                    type='number'
                    tickFormatter={(value) => value.toLocaleString()}
                    domain={[
                        (dataMin: number) =>
                            Math.floor(Math.abs(dataMin - 1000) / 1000) * 1000,
                        (dataMax: number) =>
                            Math.ceil((dataMax + 1000) / 1000) * 1000
                    ]}
                    unit={unit}
                    mirror={!breakpointsSmall}
                    width={80}
                    padding={{ bottom: !breakpointsSmall ? 20 : 0 }}
                />
                <Tooltip content={<CustomTooltip unit={''} />} />
                <Legend align='right' />
                <Line
                    type='monotone'
                    dataKey='Prix / m²'
                    strokeWidth={'3px'}
                    stroke={theme.palette.primary.main}
                    activeDot={{ r: 8 }}
                />
            </LineChart>
        </ResponsiveContainer>
    )
}
