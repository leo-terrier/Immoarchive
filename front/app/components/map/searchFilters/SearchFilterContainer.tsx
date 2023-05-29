import { useAppContext } from '@/app/context/Context'
import { Box, Button, Paper } from '@mui/material'
import React from 'react'
import { CloseButton } from '../../common/CloseButton'
import { SearchFilterForm } from './SearchFilterForm'
import { useMediaQuery, Theme } from '@mui/material'

export const SearchFilterContainer = () => {
    const { openFilters, setOpenFilters } = useAppContext()
    const breakpointSmall = useMediaQuery((theme: Theme) =>
        theme.breakpoints.up('sm')
    )

    return breakpointSmall ? (
        <Box
            sx={{
                position: 'absolute',
                left: 0,
                bottom: '50px',
                right: 0,
                marginX: 'auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                maxWidth: openFilters ? '80%' : '300px'
            }}
        >
            <Paper
                sx={{
                    backgroundColor: (theme) =>
                        openFilters ? theme.palette.greish.main : 'transparent',
                    position: 'relative',
                    boxShadow:
                        'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;',
                    paddingX: openFilters ? 4 : 0,
                    paddingY: openFilters ? 3 : 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                {openFilters ? (
                    <>
                        <CloseButton
                            handleClose={() => setOpenFilters(false)}
                        />
                        <SearchFilterForm />
                    </>
                ) : (
                    <Button
                        sx={{
                            color: 'rgb(86, 86, 86)' /* (theme) => theme.palette.text.primary */,
                            letterSpacing: 1,
                            fontWeight: 'bold',
                            fontFamily: 'Roboto',
                            paddingX: 2,
                            backgroundColor: 'white',
                            '&:hover': {
                                backgroundColor: 'rgb(235, 235, 235)' // Disable background color change on hover
                                //color: (theme) => theme.palette.secondary.main // Change font color on hover
                            }
                        }}
                        onClick={() => setOpenFilters(true)}
                    >
                        Recherche Avancée
                    </Button>
                )}
            </Paper>
        </Box>
    ) : openFilters ? (
        <Box
            sx={{
                position: 'absolute',
                top: 0,

                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                width: '100%',
                backgroundColor: 'rgba(255,255,255, .7)',
                zIndex: 2
            }}
        >
            <Paper
                sx={{
                    width: '90%',
                    height: '90%',
                    overflow: 'auto',
                    backgroundColor: (theme) => theme.palette.greish.main,
                    borderRadius: '10px',
                    position: 'relative',
                    padding: 3,
                    paddingTop: 4,
                    boxShadow:
                        'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;',
                    maxHeight: '580px'
                }}
            >
                <CloseButton handleClose={() => setOpenFilters(false)} />
                <SearchFilterForm />
            </Paper>
        </Box>
    ) : null
}
