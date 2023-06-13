import { useAppContext } from '@/app/context/Context'
import { useTheme, useMediaQuery, Theme } from '@mui/material'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts'
import CustomTooltip from '../tooltip/CustomTooltip'

export function PriceHisto() {
    const { graphData } = useAppContext()
    const theme = useTheme()
    const unit = ' €'
    const breakpointsSmall = useMediaQuery((theme: Theme) =>
        theme.breakpoints.up('sm')
    )
    return (
        <ResponsiveContainer width='100%' minHeight={0} height={485}>
            <BarChart
                data={graphData?.priceHisto}
                margin={{
                    top: 0,
                    right: 40,
                    left: breakpointsSmall ? 0 : 40,
                    bottom: 0
                }}
            >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis
                    dataKey='name'
                    tickFormatter={(value) => {
                        if (!breakpointsSmall && value === 0) return ''
                        else return value.toLocaleString() + unit
                    }}
                />
                <YAxis
                    mirror={!breakpointsSmall}
                    tickFormatter={(value) => {
                        if (!breakpointsSmall && value === 0) return ''
                        else return value.toLocaleString()
                    }}
                    allowDecimals={false}
                />

                <Tooltip content={<CustomTooltip unit={unit} />} />
                <Legend align='right' />
                <Bar
                    dataKey='count'
                    name='Nombre de transactions'
                    fill={theme.palette.secondary.main}
                />
            </BarChart>
        </ResponsiveContainer>
    )
}
