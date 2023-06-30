import { ThemeOptions, createTheme } from '@mui/material/styles'

import { TypographyOptions } from '@mui/material/styles/createTypography'

declare module '@mui/material/styles' {
    interface Palette {
        greish: Palette['primary']
        green: Palette['primary']
        ash: Palette['primary']
    }
    interface PaletteOptions {
        greish: PaletteOptions['primary']
        green: PaletteOptions['primary']
        ash: PaletteOptions['primary']
    }
}
declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        tooltipTypo: true
        mapLgTypo1: true
        mapLgTypo2: true
    }
}
interface ExtendedTypographyOptions extends TypographyOptions {
    tooltipTypo: React.CSSProperties
    mapLgTypo1: React.CSSProperties
    mapLgTypo2: React.CSSProperties
}

const theme = createTheme({
    palette: {
        primary: {
            main: '#5773EF'
        },
        secondary: {
            main: '#E76F51'
        },
        error: {
            main: '#E76F51'
        },
        info: {
            main: '#3a0ca3'
        },
        greish: {
            main: '#cccccc',
            light: 'rgba(255, 255, 255, .9)'
        },
        green: {
            main: '#61988E'
        },
        ash: {
            main: '#A0B2A6'
        }
    },
    typography: {
        tooltipTypo: {
            fontWeight: 'bold',
            fontSize: 16
        },
        mapLgTypo: {
            fontWeight: 'bold',
            fontSize: '1.35rem'
        },
        mapLgTypo1: {
            fontWeight: 'bold',
            fontSize: '1.25rem'
        },
        mapLgTypo2: {
            fontWeight: 'bold',
            fontSize: '1.1rem'
        }
    } as ExtendedTypographyOptions,
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    cursor: 'pointer'
                }
            }
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    cursor: 'pointer'
                }
            }
        },
        MuiButtonBase: {
            styleOverrides: {
                root: {
                    cursor: 'pointer'
                }
            }
        }
    }
} as ThemeOptions)

export default theme
