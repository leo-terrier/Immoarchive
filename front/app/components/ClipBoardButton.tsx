import { useEffect, useState } from 'react'
import {
    Box,
    Divider,
    IconButton,
    Paper,
    TextField,
    Theme,
    Tooltip,
    Typography,
    useMediaQuery
} from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

import { Rancho } from 'next/font/google'
import { useAppContext } from '../context/Context'

const rancho = Rancho({
    weight: ['400'],
    display: 'swap',
    style: ['normal'],
    subsets: ['latin']
})

export const ClipboardButton = () => {
    const breakpointsSm = useMediaQuery((theme: Theme) =>
        theme.breakpoints.up('sm')
    )
    const { isLoading } = useAppContext()
    const [href, setHref] = useState('')

    const originalMessage = 'Copier le lien de recherche'
    const [tooltipMessage, setTooltipMessage] = useState(originalMessage)
    const [isTooltipShown, setIsTooltipShown] = useState(false)

    const handleClick = () => {
        navigator.clipboard.writeText(href).then(() => {
            setTooltipMessage('Lien copié !')
            setIsTooltipShown(true)
            setTimeout(() => {
                setIsTooltipShown(false)
                setTooltipMessage(originalMessage)
            }, 3000)
        })
    }

    useEffect(() => {
        if (typeof window !== 'undefined' && !isLoading) {
            setHref(window.location.href)
        }
    }, [isLoading])

    return (
        <Box
            display='flex'
            gap='30px'
            justifyContent='center'
            alignItems='center'
            width='100%'
        >
            {breakpointsSm && (
                <Typography
                    component={'label'}
                    htmlFor='clipboard'
                    fontSize='45px'
                    fontWeight='bold'
                    whiteSpace={'nowrap'}
                    style={rancho.style}
                >
                    Lien de recherche:
                </Typography>
            )}
            <Paper
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '50px',
                    width: { xs: '100%', sm: `${href.length + 2}ch` },
                    minWidth: '300px',
                    backgroundColor: (theme) => theme.palette.grey[900],
                    color: (theme) => theme.palette.grey[200],
                    border: '.2px solid'
                }}
            >
                <Tooltip
                    open={isTooltipShown}
                    title={
                        <Typography fontWeight='bolder'>
                            {tooltipMessage}
                        </Typography>
                    }
                    placement={'top'}
                    slots={{
                        tooltip: Paper
                    }}
                    slotProps={{
                        tooltip: {
                            sx: {
                                p: '8px 15px',
                                mb: 2,
                                backgroundColor: 'rgba(255,255,255,.8)',
                                borderRadius: '30px'
                            }
                        }
                    }}
                >
                    <IconButton
                        onMouseEnter={() => setIsTooltipShown(true)}
                        onMouseLeave={() => setIsTooltipShown(false)}
                        onClick={handleClick}
                        color='inherit'
                    >
                        <ContentCopyIcon />
                    </IconButton>
                </Tooltip>
                <Divider
                    orientation='vertical'
                    sx={{
                        backgroundColor: (theme) => theme.palette.grey[400],
                        height: '80%',
                        alignSelf: 'center',
                        width: '.2px',
                        borderRadius: '10px'
                    }}
                />
                <TextField
                    sx={{
                        whiteSpace: 'nowrap',
                        width: '100%',
                        padding: '0 14px'
                    }}
                    variant='standard'
                    margin='normal'
                    aria-label='Lien de recherche'
                    required
                    value={href}
                    type='text'
                    InputProps={{
                        disableUnderline: true,
                        id: 'clipboardInput',
                        sx: {
                            borderRadius: 0,
                            height: '100%',
                            minWidth: '100%',
                            fontSize: '17px',
                            marginTop: '-4px',
                            color: 'inherit'
                        }
                    }}
                />
            </Paper>
        </Box>
    )
}
