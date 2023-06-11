import { LatLng } from '@/app/types'
import { Marker } from '@react-google-maps/api'
import { useTheme } from '@mui/material'

export const ClusteredMarker = ({
    location,
    changeZoom,
    setMapCenter
}: {
    location: LatLng
    changeZoom: (zoomType?: 'increment' | 'initial') => void
    setMapCenter: (lnglat: LatLng) => void
}) => {
    const theme = useTheme()

    const houseIcon = {
        path: 'M395.141,193.75V90.781h-47.703v55.266l-53.375-53.391L256,54.625l-38.063,38.031L0,310.609l38.063,38.063l41.813-41.828v150.531h352.25V306.844l41.813,41.828L512,310.609L395.141,193.75z M245.578,396.719h-54.484v-54.5h54.484V396.719z M245.578,321.063h-54.484v-54.5h54.484V321.063z M320.906,396.719h-54.484v-54.5h54.484V396.719z M320.906,321.063h-54.484v-54.5h54.484V321.063z',
        fillColor: theme.palette.grey['900'],
        fillOpacity: 1,
        scale: 0.1
    }
    return (
        <Marker
            position={location}
            onClick={() => {
                setMapCenter(location)
                changeZoom('increment')
            }}
            icon={houseIcon}
        />
    )
}
