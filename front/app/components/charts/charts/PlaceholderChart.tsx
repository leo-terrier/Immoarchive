import { Theme, useMediaQuery, useTheme } from '@mui/material'
import {
    XAxis,
    YAxis,
    ResponsiveContainer,
    ScatterChart,
    Scatter,
    ReferenceLine
} from 'recharts'

const data = [
    {
        valeur_fonciere: 221100,
        total_surface_reelle_bati: 92
    },
    {
        valeur_fonciere: 220000,
        total_surface_reelle_bati: 92
    },
    {
        valeur_fonciere: 214000,
        total_surface_reelle_bati: 90
    },
    {
        valeur_fonciere: 204500,
        total_surface_reelle_bati: 57
    },
    {
        valeur_fonciere: 190000,
        total_surface_reelle_bati: 101
    },
    {
        valeur_fonciere: 185000,
        total_surface_reelle_bati: 92
    },
    {
        valeur_fonciere: 183430,
        total_surface_reelle_bati: 69
    },
    {
        valeur_fonciere: 180000,
        total_surface_reelle_bati: 84
    },
    {
        valeur_fonciere: 177400,
        total_surface_reelle_bati: 74
    },
    {
        valeur_fonciere: 175000,
        total_surface_reelle_bati: 92
    },
    {
        valeur_fonciere: 175000,
        total_surface_reelle_bati: 45
    },
    {
        valeur_fonciere: 175000,
        total_surface_reelle_bati: 20
    },
    {
        valeur_fonciere: 172000,
        total_surface_reelle_bati: 69
    },
    {
        valeur_fonciere: 169000,
        total_surface_reelle_bati: 79
    },
    {
        valeur_fonciere: 163000,
        total_surface_reelle_bati: 77
    },
    {
        valeur_fonciere: 159500,
        total_surface_reelle_bati: 45
    },
    {
        valeur_fonciere: 145500,
        total_surface_reelle_bati: 51
    },
    {
        valeur_fonciere: 142000,
        total_surface_reelle_bati: 45
    },
    {
        valeur_fonciere: 140000,
        total_surface_reelle_bati: 26
    },
    {
        valeur_fonciere: 140000,
        total_surface_reelle_bati: 45
    },
    {
        valeur_fonciere: 138000,
        total_surface_reelle_bati: 45
    },
    {
        valeur_fonciere: 130000,
        total_surface_reelle_bati: 32
    },
    {
        valeur_fonciere: 120000,
        total_surface_reelle_bati: 70
    },
    {
        valeur_fonciere: 116000,
        total_surface_reelle_bati: 71
    },
    {
        valeur_fonciere: 109000,
        total_surface_reelle_bati: 70
    },
    {
        valeur_fonciere: 78000,
        total_surface_reelle_bati: 25
    },
    {
        valeur_fonciere: 74500,
        total_surface_reelle_bati: 28
    }
]

export function PlaceholderChart() {
    const theme = useTheme()
    const breakpointsSmall = useMediaQuery((theme: Theme) =>
        theme.breakpoints.up('sm')
    )
    const unit = ' m²'
    return (
        <ResponsiveContainer width='100%' minHeight={0} height={485}>
            <ScatterChart
                margin={{
                    top: 0,
                    right: 40,
                    left: breakpointsSmall ? 0 : 40,
                    bottom: 0
                }}
            >
                <XAxis
                    type='number'
                    dataKey='valeur_fonciere'
                    name='Prix'
                    tickFormatter={(value) => {
                        if (!breakpointsSmall && value === 0) return ''
                        else return value.toLocaleString('fr-FR') + unit
                    }}
                />
                <YAxis
                    type='number'
                    dataKey='total_surface_reelle_bati'
                    name='Surface'
                    mirror={!breakpointsSmall}
                    tickFormatter={(value) => {
                        if (!breakpointsSmall && value === 0) return ''
                        else return value.toLocaleString('fr-FR') + unit
                    }}
                />
                <Scatter
                    data={data}
                    fill={theme.palette.primary.main}
                    name='Transactions'
                />
                <ReferenceLine
                    segment={[
                        { x: 0, y: 0 },
                        { x: 200000, y: 80 }
                    ]}
                    strokeWidth={2}
                    stroke='red'
                    isFront
                    name='Moyenne prix / m²'
                />
            </ScatterChart>
        </ResponsiveContainer>
    )
}
