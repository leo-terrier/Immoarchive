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
import { LocationDealsObjType, LatLng } from '@/app/types'
import { AddressForm } from './addressForm/AddressForm'
import { SearchFilterContainer } from './searchFilters/SearchFilterContainer'
import { CustomMarker } from './customMarker/CustomMarker'
import { TooltipContent } from './customMarker/TooltipContent'
import {
    getUrlQueryParams,
    useSetUrlQueryParams
} from '@/utils/utilityFunctions'

const Map: React.FC = () => {
    const {
        handleChangeMapParams,
        locationDeals,
        openDeals,
        isLoading,
        setCenter,
        center
    } = useAppContext()

    const breakpointsMedium = useMediaQuery((theme: Theme) =>
        theme.breakpoints.up('md')
    )
    const setUrlQueryParams = useSetUrlQueryParams()
    const { zoom } = getUrlQueryParams()
    const mapRef = useRef<google.maps.Map>({} as google.maps.Map)
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>()
    const isFirstFetchRef = useRef<boolean>(true)

    const changeZoom = (type = 'increment') => {
        if (type === 'increment') {
            const currentZoom = mapRef.current?.getZoom() as number
            mapRef.current?.setZoom(currentZoom + 1)
        } else if (type === 'initial') {
            mapRef.current?.setZoom(15)
        }
    }

    const setMapCenter = (lnglat: LatLng) => {
        mapRef.current?.setCenter(lnglat)
    }

    const onLoad = useCallback(function callback(map: google.maps.Map) {
        mapRef.current = map as google.maps.Map
    }, [])

    const handleBoundsChange = React.useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(() => {
            if (mapRef.current) {
                const { east, south, north, west } = JSON.parse(
                    JSON.stringify(mapRef.current.getBounds())
                )
                const bounds = {
                    lats: south.toFixed(5),
                    latn: north.toFixed(5),
                    lngw: west.toFixed(5),
                    lnge: east.toFixed(5)
                }
                const { lat, lng } = JSON.parse(
                    JSON.stringify(mapRef.current.getCenter())
                )
                const center = {
                    lat,
                    lng
                }
                const centerStr = {
                    lat: lat.toFixed(5),
                    lng: lng.toFixed(5)
                }
                const currentZoom = (
                    mapRef.current?.getZoom() as number
                ).toString()

                setCenter(center)
                handleChangeMapParams(bounds)
                if (isFirstFetchRef.current) {
                    isFirstFetchRef.current = false
                } else {
                    setUrlQueryParams({
                        ...bounds,
                        ...centerStr,
                        zoom: currentZoom
                    })
                }
            }
        }, 500)
    }, [])

    const mapOptions: google.maps.MapOptions = {
        disableDefaultUI: false, // Disable all default UI controls
        zoomControl: true, // Disable the zoom control
        mapTypeControl: breakpointsMedium ? true : false, // Disable the map type control
        scaleControl: true, // Disable the scale control
        streetViewControl: true, // Disable the street view control
        rotateControl: true, // Disable the rotate control
        fullscreenControl: false,
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
        },
        styles: [
            {
                elementType: '',
                stylers: []
            }
        ]
    }

    const defaultZoom = zoom ? parseInt(zoom, 10) : 15

    return (
        <Box position="relative">
            <AddressForm changeZoom={changeZoom} setMapCenter={setMapCenter} />
            <Card
                sx={{
                    width: '100%',
                    height: {
                        xs: '80vh',
                        sm: '70vh'
                    },
                    boxShadow: '0'
                }}
                //id="map-container"
            >
                <GoogleMap
                    mapContainerStyle={{
                        width: '100%',
                        height: '100%'
                    }}
                    center={center}
                    zoom={defaultZoom}
                    onLoad={onLoad}
                    onZoomChanged={handleBoundsChange}
                    onDrag={handleBoundsChange}
                    streetView={undefined}
                    options={mapOptions}
                >
                    {locationDeals?.map(
                        (locationDeal: LocationDealsObjType) => {
                            return (
                                <CustomMarker
                                    setMapCenter={setMapCenter}
                                    locationDeal={locationDeal}
                                    key={Object.values(
                                        locationDeal.lnglat
                                    ).join('-')}
                                    isSelected={
                                        JSON.stringify(openDeals?.lnglat) ===
                                        JSON.stringify(locationDeal.lnglat)
                                    }
                                    changeZoom={changeZoom}
                                />
                            )
                        }
                    )}

                    {isLoading ? (
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
                    ) : (
                        <></>
                    )}

                    {openDeals && (
                        <InfoWindow
                            position={openDeals.lnglat}
                            options={{
                                maxWidth: 350
                                /* pixelOffset: infoWindowPixelOffset */
                            }}
                            onPositionChanged={() => {
                                if (!breakpointsMedium) {
                                    mapRef.current.panTo(openDeals.lnglat)
                                }
                            }}
                            zIndex={3}
                        >
                            <TooltipContent />
                        </InfoWindow>
                    )}
                </GoogleMap>
            </Card>
            <SearchFilterContainer />
        </Box>
    )
}

export default React.memo(Map)

/* {false ? (
    <HeatmapLayer
        data={locationDeals.map((location) => ({
            location: new google.maps.LatLng(
                location.lnglat.lat,
                location.lnglat.lng
            ),
            weight: location.deals[0].prix_metre_carre
        }))}
    />
) : (
    <></>
)} */
