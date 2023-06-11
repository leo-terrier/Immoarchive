import { Box, Paper } from '@mui/material'
import React from 'react'
import { SearchFilterForm } from './SearchFilterForm'
import { useMediaQuery, Theme } from '@mui/material'

export const SearchFilterContainer = () => {
    const breakpointSmall = useMediaQuery((theme: Theme) =>
        theme.breakpoints.up('sm')
    )

    return breakpointSmall ? (
        <Paper
            sx={{
                backgroundColor: (theme) => theme.palette.greish.light,
                position: 'absolute',
                bottom: '50px',
                left: 0,
                right: 0,
                marginX: 'auto',
                boxShadow:
                    'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;',
                paddingX: 4,
                paddingY: 3,
                width: '80%',
                maxWidth: '960px'
            }}
        >
            <SearchFilterForm />
        </Paper>
    ) : (
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                height: '100%',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(255,255,255, .7)',
                zIndex: 3
            }}
        >
            <Paper
                sx={{
                    width: '90%',
                    height: '90%',
                    overflow: 'auto',
                    backgroundColor: (theme) => theme.palette.greish.light,
                    position: 'relative',
                    padding: 3,
                    boxShadow:
                        'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;',
                    maxHeight: '580px'
                }}
            >
                <SearchFilterForm />
            </Paper>
        </Box>
    )
}
