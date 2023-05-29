import { useAppContext } from '@/app/context/Context'
import { LatLng, LocationDealsObjType } from '@/app/types'
import { Marker } from '@react-google-maps/api'
import { useTheme } from '@mui/material'

export const CustomMarker = ({
    locationDeal,
    isSelected,
    changeZoom,
    setMapCenter
}: {
    locationDeal: LocationDealsObjType
    isSelected: boolean
    changeZoom: (type?: string) => void
    setMapCenter: (lnglat: LatLng) => void
}) => {
    const { setOpenDeals, isClustered } = useAppContext()
    const theme = useTheme()

    const dotIcon = (selected = false) => ({
        path: 'M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12s12-5.4 12-12S18.6 0 12 0z',
        fillColor: selected
            ? theme.palette.redish.main
            : theme.palette.primary.main,
        fillOpacity: 1,
        strokeColor: selected
            ? theme.palette.redish.dark
            : theme.palette.primary.dark,
        strokeWeight: 1,
        scale: 0.5
    })

    const houseIcon = {
        path: 'M395.141,193.75V90.781h-47.703v55.266l-53.375-53.391L256,54.625l-38.063,38.031L0,310.609l38.063,38.063l41.813-41.828v150.531h352.25V306.844l41.813,41.828L512,310.609L395.141,193.75z M245.578,396.719h-54.484v-54.5h54.484V396.719z M245.578,321.063h-54.484v-54.5h54.484V321.063z M320.906,396.719h-54.484v-54.5h54.484V396.719z M320.906,321.063h-54.484v-54.5h54.484V321.063z',
        fillColor: theme.palette.grey['900'],
        fillOpacity: 1,
        strokeColor: theme.palette.grey['900'],
        scale: 0.1
    }
    return (
        <Marker
            position={locationDeal.lnglat}
            onClick={() => {
                if (isClustered) {
                    setMapCenter(locationDeal.lnglat)
                    changeZoom('increment')
                } else {
                    setOpenDeals(locationDeal)
                }
            }}
            icon={isClustered ? houseIcon : dotIcon(isSelected)}
            zIndex={isSelected ? 2 : 1}
        />
    )
}
