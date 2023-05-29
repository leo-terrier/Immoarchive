// https://mui.com/material-ui/customization/default-theme/?expand-path=$.typography

import {
    ThemeOptions,
    createTheme,
    responsiveFontSizes
} from '@mui/material/styles'

import { TypographyOptions } from '@mui/material/styles/createTypography'

declare module '@mui/material/styles' {
    interface Theme {
        status: {
            danger: React.CSSProperties['color']
        }
    }
    interface Palette {
        greish: Palette['primary']
        redish: Palette['primary']
    }

    interface PaletteOptions {
        greish: PaletteOptions['primary']
        redish: PaletteOptions['primary']
    }

    interface PaletteColor {
        darker?: string
    }

    interface SimplePaletteColorOptions {
        darker?: string
    }

    interface ThemeOptions {
        status: {
            danger: React.CSSProperties['color']
        }
    }
}

declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        tooltipTypo: true
        mapLgTypo: true
    }
}

interface ExtendedTypographyOptions extends TypographyOptions {
    tooltipTypo: React.CSSProperties
    mapLgTypo: React.CSSProperties
}

// eslint-disable-next-line no-unused-vars
let theme = createTheme({
    status: {
        danger: '#e53e3e'
    },
    palette: {
        /* primary: {
            main: '#3f51b5',
            darker: '#002984'
        }, */
        secondary: {
            main: '#f44336'
        },
        greish: {
            main: '#f5f5f5',
            dark: 'rgb(86, 86, 86)',
            contrastText: '#fff'
        },
        redish: {
            main: '#f44336',
            dark: '#ba000d'
        }
    },
    typography: {
        fontFamily: 'Roboto',
        fontSize: 14,
        color: 'rgb(86, 86, 86)',
        tooltipTypo: {
            fontWeight: 'bold',
            fontSize: 14
        },
        mapLgTypo: {
            fontWeight: 'bold',
            fontSize: '1.25rem'
        }
    } as ExtendedTypographyOptions
} as ThemeOptions)

theme = responsiveFontSizes(theme)

export default theme
