import { IconButton } from '@mui/material'
import React from 'react'
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded'

type propsType = {
    handleClose: () => void
}
export const CloseButton = ({ handleClose }: propsType) => {
    return (
        <IconButton
            disableRipple
            sx={{
                position: 'absolute',
                right: 0,
                top: 0
            }}
            onClick={handleClose}
        >
            <DisabledByDefaultRoundedIcon
                sx={{ color: (theme) => theme.palette.redish.main }}
            />
        </IconButton>
    )
}
