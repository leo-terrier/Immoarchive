'use client'
// slow next https://stackoverflow.com/questions/75563499/next-js-app-loading-very-slow-in-development-enviorment
// PB WITH SWC => https://www.reddit.com/r/nextjs/comments/swciuj/next_dev_is_slow/
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import axios, { CancelTokenSource } from 'axios'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { useJsApiLoader } from '@react-google-maps/api'
import {
    buildQueryString,
    getUrlQueryParams,
    setUrlQueryParams
} from '@/utils/utilityFunctions'
import theme from './theme/Theme'
import {
    handleChangeFilterType,
    QueryParamsType,
    OpenDealsType,
    AgglomeratedDealsObjType,
    ListedDealType,
    LatLng,
    MapParamsType,
    HandleChangeMapType,
    GraphDataType
} from '../types'

const googleLibraries: (
    | 'places'
    | 'visualization'
    | 'drawing'
    | 'geometry'
    | 'localContext'
)[] = ['places', 'visualization']

type ContextValueType = {
    mapParams: MapParamsType
    queryParams: QueryParamsType
    handleMapChange: (params: HandleChangeMapType) => void
    handleChangeFilters: (params: handleChangeFilterType) => void
    agglomeratedDeals: AgglomeratedDealsObjType[]
    listedDeals: ListedDealType[]
    openDeals: OpenDealsType | null
    isClustered: boolean
    setOpenDeals: React.Dispatch<OpenDealsType | null>
    setIsFiltersOpen: React.Dispatch<boolean>
    isFiltersOpen: boolean
    isLoading: boolean
    length: number
    /* mode: string
    setMode: React.Dispatch<SetStateAction<string>> */
    graphData: GraphDataType
    clusters: LatLng[]
    handlePopTooltip: (obj: { lnglat: LatLng; idx: number }) => void
    deleteAllSearchFilters: () => void
}
const AppContext = createContext<ContextValueType>({} as ContextValueType)

export const AppContextProvider = ({
    children
}: {
    children: React.ReactNode
}) => {
    const isFirstRenderRef = useRef<boolean>(true)

    // // Search states

    const urlQueryParams = getUrlQueryParams()

    // Map Params for 1) initial map params 2) reverse geolocation in infoBanner 3) add mapParams to url for future render
    // Get from url or set it to default coordinates
    const [mapParams, setMapParams] = useState<MapParamsType>({
        center: {
            lat: urlQueryParams.lat ? parseFloat(urlQueryParams.lat) : 48.88645,
            lng: urlQueryParams.lng ? parseFloat(urlQueryParams.lng) : 2.33761
        },
        zoom: urlQueryParams.zoom ? parseInt(urlQueryParams.zoom, 10) : 18
    })

    // get initial query params from url or set to default (empty for filters and default coordinates boundaries coordinates params)
    const [queryParams, setQueryParams] = useState<QueryParamsType>({
        maxNbOfRooms: urlQueryParams.maxNbOfRooms || '',
        maxPrice: urlQueryParams.maxPrice || '',
        maxPricePerMeterSquare: urlQueryParams.maxPricePerMeterSquare || '',
        maxSurface: urlQueryParams.maxSurface || '',
        maxSurfaceLand: urlQueryParams.maxSurfaceLand || '',
        maxYear: urlQueryParams.maxYear || '',
        minNbOfRooms: urlQueryParams.minNbOfRooms || '',
        minPrice: urlQueryParams.minPrice || '',
        minPricePerMeterSquare: urlQueryParams.minPricePerMeterSquare || '',
        minSurface: urlQueryParams.minSurface || '',
        minSurfaceLand: urlQueryParams.minSurfaceLand || '',
        minYear: urlQueryParams.minYear || '',
        lats: urlQueryParams.lats || '48.88528',
        latn: urlQueryParams.latn || '48.88762',
        lngw: urlQueryParams.lngw || '2.33385',
        lnge: urlQueryParams.lnge || '2.34137',
        isMobile: 'false'
    })

    // // Results states

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isClustered, setIsClustered] = useState<boolean>(false)
    const [length, setLength] = useState<number>(0)
    const [graphData, setGraphData] = useState<GraphDataType>(null)
    const [agglomeratedDeals, setAgglomeratedDeals] = useState<
        AgglomeratedDealsObjType[]
    >([])
    const [listedDeals, setListedDeals] = useState<ListedDealType[]>([])
    const [clusters, setClusters] = useState<LatLng[]>([])
    const [isFiltersOpen, setIsFiltersOpen] = useState(false)
    const [openDeals, setOpenDeals] = useState<OpenDealsType | null>(null)
    //const [mode, setMode] = useState<string>('transactions')

    // // Functions

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_API_GMAP as string,
        libraries: googleLibraries,
        mapIds: ['eb42d3e82f21e8de']
    })

    const handleMapChange = (mapParams: HandleChangeMapType) => {
        setQueryParams((prev) => ({
            ...prev,
            lats: mapParams.lats.toString(),
            latn: mapParams.latn.toString(),
            lngw: mapParams.lngw.toString(),
            lnge: mapParams.lnge.toString()
        }))
        setMapParams({
            center: {
                lng: mapParams.lng,
                lat: mapParams.lat
            },
            zoom: mapParams.zoom
        })
    }

    const handleChangeFilters = (filters: handleChangeFilterType) => {
        setQueryParams((prev) => ({ ...prev, ...filters }))
    }

    const deleteAllSearchFilters = () => {
        setQueryParams((prev) => ({
            ...prev,
            maxNbOfRooms: '',
            maxPrice: '',
            maxPricePerMeterSquare: '',
            maxSurface: '',
            maxSurfaceLand: '',
            maxYear: '',
            minNbOfRooms: '',
            minPrice: '',
            minPricePerMeterSquare: '',
            minSurface: '',
            minSurfaceLand: '',
            minYear: ''
        }))
        setIsFiltersOpen(false)
    }

    const handlePopTooltip = ({
        lnglat,
        idx
    }: {
        lnglat: LatLng
        idx: number
    }) => {
        const selectedDeals = agglomeratedDeals.find(
            (e) => e.lnglat.lat === lnglat.lat && e.lnglat.lng === lnglat.lng
        )
        if (selectedDeals) {
            setOpenDeals({
                ...selectedDeals,
                selectedDealIdx: idx
            })
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    const queryJSONObj = JSON.stringify(queryParams)

    useEffect(() => {
        const fetchDeals = async (source: CancelTokenSource) => {
            setIsLoading(true)
            const url =
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/deals` +
                '?' +
                buildQueryString(queryParams)
            // eslint-disable-next-line no-console
            console.table(queryParams)
            try {
                const res = await axios.get(url, {
                    cancelToken: source.token
                })
                setIsClustered(res.data.isClustered)
                setClusters(res.data.clusteredDeals)
                setAgglomeratedDeals(res.data.agglomeratedDeals)
                setListedDeals(res.data.listedDeals)
                setLength(res.data.length)
                setGraphData(res.data.graphData)
                if (openDeals) {
                    if (res.data.length === 0 || res.data.isClustered) {
                        setOpenDeals(null)
                    } else {
                        const isOpenDealsNotFetchedAgain =
                            openDeals &&
                            res.data.agglomeratedDeals.findIndex(
                                (location: AgglomeratedDealsObjType) =>
                                    JSON.stringify(location.lnglat) ===
                                    JSON.stringify(openDeals.lnglat)
                            ) === -1
                        if (isOpenDealsNotFetchedAgain) {
                            setOpenDeals(null)
                        }
                    }
                }
                // eslint-disable-next-line no-console
                console.log({ MB: res.data.MB, length: res.data.length })
                if (res.data.bytsAbove) {
                    alert(
                        `${res.data.bits} MB request made => ${buildQueryString(
                            queryParams
                        )}`
                    )
                }
                if (isFirstRenderRef.current) {
                    isFirstRenderRef.current = false
                } else {
                    setUrlQueryParams({
                        ...queryParams,
                        lat: mapParams.center.lat.toString(),
                        lng: mapParams.center.lng.toString(),
                        zoom: mapParams.zoom.toString()
                    })
                }
                setIsLoading(false)
            } catch (error) {
                // eslint-disable-next-line no-empty
                if (axios.isCancel(error)) {
                } else {
                    // eslint-disable-next-line no-console
                    console.log('Error', error)
                    alert('Error : ' + error)
                    setIsLoading(false)
                }
            }
        }
        const source = axios.CancelToken.source()
        fetchDeals(source)
        return () => source.cancel()
    }, [queryJSONObj])

    useEffect(() => {
        if (typeof navigator !== 'undefined') {
            setQueryParams((prev) => ({
                ...prev,
                isMobile: /iPhone|iPad|iPod|Android/i
                    .test(navigator.userAgent)
                    .toString() as 'true' | 'false'
            }))
        }
    }, [])
    return isLoaded ? (
        <AppContext.Provider
            value={{
                mapParams,
                queryParams: queryParams,
                handleMapChange,
                handleChangeFilters,
                agglomeratedDeals,
                openDeals,
                isClustered,
                setOpenDeals,
                setIsFiltersOpen,
                isFiltersOpen,
                isLoading,
                length,
                /* mode,
                setMode, */
                graphData,
                clusters,
                handlePopTooltip,
                listedDeals,
                deleteAllSearchFilters
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
