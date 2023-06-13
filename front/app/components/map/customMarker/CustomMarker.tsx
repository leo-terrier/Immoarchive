import { Marker } from '@react-google-maps/api'
import { useTheme } from '@mui/material'
import { AgglomeratedDealsObjType } from '@/app/types'
import { useAppContext } from '@/app/context/Context'

export const CustomMarker = ({
    agglomeratedDeals: locationDeal,
    isSelected
}: {
    agglomeratedDeals: AgglomeratedDealsObjType
    isSelected: boolean
}) => {
    const { setOpenDeals } = useAppContext()
    const theme = useTheme()

    const dotIcon = (selected = false) => ({
        path: 'M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12s12-5.4 12-12S18.6 0 12 0z',
        fillColor: selected
            ? theme.palette.secondary.main
            : theme.palette.primary.main,
        fillOpacity: 1,
        strokeColor: 'transparent',
        scale: 0.5
    })

    return (
        <Marker
            data-cy='marker'
            position={locationDeal.lnglat}
            onClick={() => {
                setOpenDeals(locationDeal)
            }}
            icon={dotIcon(isSelected)}
            zIndex={isSelected ? 2 : 1}
        />
    )
}
