'use client'

import { buildQueryString, getUrlQueryParams } from '@/utils/utilityFunctions'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { useJsApiLoader } from '@react-google-maps/api'
import axios, { CancelTokenSource } from 'axios'
import {
    SetStateAction,
    createContext,
    useContext,
    useEffect,
    useState
} from 'react'
import theme from './theme/Theme'
import { LatLng } from 'use-places-autocomplete'
import {
    LocationDealsObjType,
    FilterParamsType,
    MapParamsType,
    QueryParamsType,
    OpenDealsType
} from '../types'

const googleLibraries: (
    | 'places'
    | 'visualization'
    | 'drawing'
    | 'geometry'
    | 'localContext'
)[] = ['places', 'visualization']

type ContextValueType = {
    setCenter: React.Dispatch<SetStateAction<LatLng>>
    center: LatLng
    queryParams: QueryParamsType
    handleChangeMapParams: (params: MapParamsType) => void
    handleChangeFilters: (params: FilterParamsType) => void
    locationDeals: LocationDealsObjType[]
    setLocationDeals: React.Dispatch<SetStateAction<LocationDealsObjType[]>>
    openDeals: OpenDealsType | null
    setOpenDeals: React.Dispatch<OpenDealsType | null>
    setOpenFilters: React.Dispatch<boolean>
    openFilters: boolean
    /* setZoom: React.Dispatch<SetStateAction<number>>
    zoom: number */
    isLoading: boolean
    isClustered: boolean
    length: string
    mode: string
    setMode: React.Dispatch<SetStateAction<string>>
}

const AppContext = createContext<ContextValueType>({} as ContextValueType)

export const AppContextProvider = ({
    children
}: {
    children: React.ReactNode
}) => {
    const {
        maxNbOfRooms,
        maxPrice,
        maxPricePerMeterSquare,
        maxSurface,
        maxSurfaceLand,
        maxYear,
        minNbOfRooms,
        minPrice,
        minPricePerMeterSquare,
        minSurface,
        minSurfaceLand,
        minYear,
        lats,
        latn,
        lngw,
        lnge,
        lat,
        lng
    } = getUrlQueryParams()

    const [center, setCenter] = useState({
        lat: lat ? parseFloat(lat) : 48.8392,
        lng: lng ? parseFloat(lng) : 2.38849
    })

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isClustered, setIsClustered] = useState<boolean>(false)
    const [length, setLength] = useState<string>('')
    const [mode, setMode] = useState<string>('transactions')

    const [queryParams, setQueryParams] = useState<QueryParamsType>({
        maxNbOfRooms: maxNbOfRooms || '',
        maxPrice: maxPrice || '',
        maxPricePerMeterSquare: maxPricePerMeterSquare || '',
        maxSurface: maxSurface || '',
        maxSurfaceLand: maxSurfaceLand || '',
        maxYear: maxYear || '',
        minNbOfRooms: minNbOfRooms || '',
        minPrice: minPrice || '',
        minPricePerMeterSquare: minPricePerMeterSquare || '',
        minSurface: minSurface || '',
        minSurfaceLand: minSurfaceLand || '',
        minYear: minYear || '',
        lats: lats || '',
        latn: latn || '',
        lngw: lngw || '',
        lnge: lnge || ''
        /* zoom: zoomParam || '' */
    })

    const [locationDeals, setLocationDeals] = useState<LocationDealsObjType[]>(
        []
    )
    const [openFilters, setOpenFilters] = useState(false)

    const [openDeals, setOpenDeals] = useState<OpenDealsType | null>(null)

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_API_GMAP as string,
        libraries: googleLibraries,
        mapIds: ['eb42d3e82f21e8de']
    })
    const handleChangeMapParams = (coordinates: MapParamsType) => {
        setQueryParams((prev) => ({ ...prev, ...coordinates }))
    }

    const handleChangeFilters = (filters: FilterParamsType) => {
        setQueryParams((prev) => ({ ...prev, ...filters }))
    }

    const queryJSONObj = JSON.stringify(queryParams)

    useEffect(() => {
        const fetchDeals = async (
            params: QueryParamsType,
            source: CancelTokenSource
        ) => {
            if (params.latn) {
                setIsLoading(true)
                const url =
                    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/deals` +
                    '?' +
                    buildQueryString(params)
                // eslint-disable-next-line no-console
                console.log('*** PARAMS ****')
                Object.entries(params).forEach((pair) => {
                    // eslint-disable-next-line no-console
                    console.log(pair[0], Number(pair[1]))
                })
                try {
                    const res = await axios.get(url, {
                        cancelToken: source.token
                    })
                    setIsClustered(res.data.isClustered)

                    const isOpenDealsNotFetchedAgain =
                        openDeals &&
                        res.data.result.findIndex(
                            (locationDeal: LocationDealsObjType) =>
                                JSON.stringify(locationDeal.lnglat) ===
                                JSON.stringify(openDeals.lnglat)
                        ) === -1

                    if (isOpenDealsNotFetchedAgain) {
                        setOpenDeals(null)
                    }
                    setLocationDeals(res.data.result)
                    setLength(res.data.length.toString())
                    setIsLoading(false)
                    // eslint-disable-next-line no-console
                    console.log({ MB: res.data.bits, length: res.data.length })
                    if (res.data.bytsAbove) {
                        alert(
                            `${
                                res.data.bits
                            } MB request made => ${buildQueryString(params)}`
                        )
                    }
                } catch (error) {
                    // eslint-disable-next-line no-empty
                    if (axios.isCancel(error)) {
                    } else {
                        // eslint-disable-next-line no-console
                        console.log('Error', error)
                    }
                    setIsLoading(false)
                }
            }
        }
        const source = axios.CancelToken.source()
        fetchDeals(queryParams, source)
        return () => source.cancel()
    }, [queryJSONObj])

    return isLoaded ? (
        <AppContext.Provider
            value={{
                center,
                setCenter,
                queryParams: queryParams,
                handleChangeMapParams,
                handleChangeFilters,
                locationDeals,
                setLocationDeals,
                openDeals,
                setOpenDeals,
                setOpenFilters,
                openFilters,
                /*  zoom,
                setZoom, */
                isLoading,
                isClustered,
                length,
                mode,
                setMode
            }}
        >
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </AppContext.Provider>
    ) : (
        <></>
    )
}
export const useAppContext = () => useContext(AppContext)
