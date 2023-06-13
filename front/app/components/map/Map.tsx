//https://react-google-maps-api-docs.netlify.app/#googlemap
import {
    Card,
    useMediaQuery,
    Theme,
    CircularProgress,
    Box
} from '@mui/material'
import {
    GoogleMap,
    /*  HeatmapLayer, */ InfoWindow
} from '@react-google-maps/api'
import React, { useCallback, useRef } from 'react'
import { useAppContext } from '@/app/context/Context'
import { AgglomeratedDealsObjType, LatLng } from '@/app/types'
import { AddressForm } from './addressForm/AddressForm'
import { SearchFilterContainer } from './searchFilters/SearchFilterContainer'
import { CustomMarker } from './customMarker/CustomMarker'
import { MapTooltip } from './customMarker/MapTooltip'
import { ClusteredMarker } from './ClusteredMarker'
import { roundNumber } from '@/utils/utilityFunctions'
import { SearchFilterButtonLg } from './searchFilters/SearchFilterButtonLg'

const Map: React.FC = () => {
    const {
        handleMapChange,
        agglomeratedDeals,
        openDeals,
        isLoading,
        clusters,
        mapParams,
        isClustered,
        isFiltersOpen,
        length,
        queryParams: { isMobile: isMobileStr }
    } = useAppContext()

    const isMobile = isMobileStr === 'true' ? true : false
    const breakpointsMedium = useMediaQuery((theme: Theme) =>
        theme.breakpoints.up('md')
    )
    const mapRef = useRef<google.maps.Map | null>(null)
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

    const changeZoom = (zoomType: 'increment' | 'initial' = 'increment') => {
        if (zoomType === 'increment') {
            const currentZoom = mapRef.current!.getZoom() as number
            mapRef.current!.setZoom(currentZoom + 1)
        } else {
            mapRef.current!.setZoom(18)
        }
    }

    const setMapCenter = (lnglat: LatLng) => {
        mapRef.current!.setCenter(lnglat)
    }

    const onLoad = useCallback(function callback(map: google.maps.Map) {
        mapRef.current = map as google.maps.Map
        handleBoundsChange()
    }, [])

    const handleBoundsChange = React.useCallback(() => {
        if (mapRef.current !== null) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
            timeoutRef.current = setTimeout(() => {
                const { east, south, north, west } = JSON.parse(
                    JSON.stringify(mapRef.current!.getBounds())
                )
                const { lat, lng } = JSON.parse(
                    JSON.stringify(mapRef.current!.getCenter())
                )
                const zoom = JSON.parse(
                    JSON.stringify(mapRef.current!.getZoom())
                )

                handleMapChange({
                    lnge: roundNumber(east, 5),
                    lngw: roundNumber(west, 5),
                    latn: roundNumber(north, 5),
                    lats: roundNumber(south, 5),
                    lat: roundNumber(lat, 5),
                    lng: roundNumber(lng, 5),
                    zoom
                })
            }, 500)
        }
    }, [])

    const mapOptions: google.maps.MapOptions = {
        disableDefaultUI: true, // Disabled most controls as it was causing chrome to raise accessibility "issues" (missing label for formfield)
        //mapTypeControl: breakpointsMedium ? true : false,
        //scaleControl: true,
        //rotateControl: true,
        //fullscreenControl: false,

        zoomControl: true,
        streetViewControl: isMobile ? false : true,
        clickableIcons: false,
        gestureHandling: 'cooperative',
        minZoom: 13,
        maxZoom: 19,
        restriction: {
            latLngBounds: {
                north: 51.56,
                south: 41.07,
                west: -5.2,
                east: 9.9
            }
        }
    }

    return (
        <Box position='relative'>
            <AddressForm changeZoom={changeZoom} setMapCenter={setMapCenter} />
            <Card
                data-cy='mapCard'
                sx={{
                    width: '100%',
                    height: 'min(90vh, 700px)',
                    boxShadow: '0'
                }}
            >
                <GoogleMap
                    mapContainerStyle={{
                        width: '100%',
                        height: '100%'
                    }}
                    center={mapParams.center}
                    zoom={mapParams.zoom}
                    onLoad={onLoad}
                    onZoomChanged={isMobile ? () => {} : handleBoundsChange}
                    onDrag={isMobile ? () => {} : handleBoundsChange}
                    onBoundsChanged={isMobile ? handleBoundsChange : () => {}}
                    streetView={undefined}
                    options={mapOptions}
                >
                    {isClustered &&
                        length > 0 &&
                        clusters?.map((cluster) => (
                            <ClusteredMarker
                                key={Object.values(cluster).join('-')}
                                location={cluster}
                                changeZoom={changeZoom}
                                setMapCenter={setMapCenter}
                            />
                        ))}

                    {!isClustered &&
                        length > 0 &&
                        agglomeratedDeals?.map(
                            (locationDeals: AgglomeratedDealsObjType) => {
                                return (
                                    <CustomMarker
                                        key={Object.values(
                                            locationDeals.lnglat
                                        ).join('-')}
                                        isSelected={
                                            JSON.stringify(
                                                openDeals?.lnglat
                                            ) ===
                                            JSON.stringify(locationDeals.lnglat)
                                        }
                                        agglomeratedDeals={locationDeals}
                                    />
                                )
                            }
                        )}

                    {isLoading && (
                        <Box
                            sx={{
                                height: '100%',
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 3
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    )}

                    {openDeals !== null && (
                        <InfoWindow
                            position={openDeals.lnglat}
                            options={{
                                maxWidth: 350,
                                minWidth: 320
                                /* pixelOffset: infoWindowPixelOffset */
                            }}
                            onPositionChanged={() => {
                                if (!breakpointsMedium) {
                                    mapRef.current!.panTo(openDeals.lnglat)
                                }
                            }}
                            zIndex={3}
                        >
                            <MapTooltip />
                        </InfoWindow>
                    )}
                </GoogleMap>
            </Card>
            {isFiltersOpen ? (
                <SearchFilterContainer />
            ) : (
                <SearchFilterButtonLg />
            )}
        </Box>
    )
}

export default React.memo(Map)
