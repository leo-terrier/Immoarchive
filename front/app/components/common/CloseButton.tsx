import { IconButton } from '@mui/material'
import React from 'react'
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded'

type propsType = {
    handleClose: () => void
    top?: number
    right?: number
}
export const CloseButton = ({ handleClose, top = 0, right = 0 }: propsType) => {
    return (
        <IconButton
            disableRipple
            sx={{
                position: 'absolute',
                right,
                top
            }}
            onClick={handleClose}
        >
            <DisabledByDefaultRoundedIcon
                sx={{ color: (theme) => theme.palette.secondary.main }}
            />
        </IconButton>
    )
}
