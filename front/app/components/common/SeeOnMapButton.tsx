import { useAppContext } from '@/app/context/Context'
import { LatLng } from '@/app/types'
import { Button, Theme } from '@mui/material'
import MapIcon from '@mui/icons-material/Map'
import styled from '@emotion/styled'

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
    //const theme = useTheme()
    return (
        <StyledButton
            variant="contained"
            size="small"
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
