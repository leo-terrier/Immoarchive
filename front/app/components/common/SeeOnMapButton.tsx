import { Button, Theme } from '@mui/material'
import MapIcon from '@mui/icons-material/Map'
import styled from '@emotion/styled'
import { LatLng } from '@/app/types'
import { useAppContext } from '@/app/context/Context'

type StyledButtonType = {
    isDarkMode: boolean
}

const StyledButton = styled(Button)<StyledButtonType>`
    &:hover {
        background-color: ${(props) =>
            props.isDarkMode
                ? props.theme.palette.grey[600]
                : props.theme.palette.primary.main};
    }
`
type ButtonType = {
    lnglat: LatLng
    idx: number
    isDarkMode?: boolean
}

export const SeeOnMapButton = ({
    lnglat,
    idx,
    isDarkMode = false
}: ButtonType) => {
    const { handlePopTooltip } = useAppContext()
    return (
        <StyledButton
            data-cy='seeOnMapButton'
            variant='contained'
            size='small'
            startIcon={<MapIcon />}
            onClick={() => {
                handlePopTooltip({
                    lnglat,
                    idx
                })
            }}
            sx={{
                backgroundColor: (theme: Theme) =>
                    isDarkMode ? theme.palette.grey[600] : 'primary'
            }}
            isDarkMode={isDarkMode}
        >
            <span
                style={{
                    marginBottom: '-2px'
                }}
            >
                voir
            </span>
        </StyledButton>
    )
}
