import { ContextValueType } from '../app/context/Context'
export const mockContext: ContextValueType = {
    mapParams: {
        center: { lat: 0, lng: 0 },
        zoom: 0
    },
    queryParams: {
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
        minYear: '',
        lats: '',
        latn: '',
        lngw: '',
        lnge: '',
        isMobile: 'false'
    },
    handleMapChange: () => {},
    handleChangeFilters: () => {},
    agglomeratedDeals: [],
    listedDeals: [],
    openDeals: null,
    isClustered: false,
    setOpenDeals: () => {},
    setIsFiltersOpen: () => {},
    isFiltersOpen: false,
    isLoading: false,
    length: 0,
    graphData: null,
    clusters: [],
    handlePopTooltip: () => {},
    deleteAllSearchFilters: () => {}
}
