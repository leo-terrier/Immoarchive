import { Box } from '@mui/material'

type props = {
    children: React.ReactNode
    p?: { [key: string]: number } | number
}

export const TooltipContainer = ({ children, p = 2 }: props) => {
    return (
        <Box
            sx={{
                backgroundColor: (theme) => theme.palette.greish.light,
                backgroundOpacity: '.9',
                borderStyle: 'solid',
                borderWidth: '.5px !important',
                borderColor: (theme) => theme.palette.greish.main,
                pointerEvents: 'auto',
                p: p,
                position: 'relative'
            }}
        >
            {children}
        </Box>
    )
}
