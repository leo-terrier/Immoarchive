export type BasicDealInfo = {
    id_mutation: string
    date_mutation: string
    adresse_numero: string
    adresse_suffixe: string
    adresse_nom_voie: string
    code_postal: string
    nom_commune: string
    code_type_local: string
    total_nombre_lots: number
    valeur_fonciere: number
    total_surface_reelle_bati: number
    total_nombre_pieces_principales: number
    total_surface_terrain: number
    total_nombre_locaux: number
    prix_metre_carre: number
}

export type ListedDealType = BasicDealInfo & {
    agglomerateIdx: number
    lnglat: LatLng
}

export type LatLng = {
    lat: number
    lng: number
}

export type AgglomeratedDealsObjType = {
    lnglat: LatLng
    deals: BasicDealInfo[]
}

export type OpenDealsType = AgglomeratedDealsObjType & {
    selectedDealIdx?: number
}

// initial map params
export type MapParamsType = {
    center: LatLng
    zoom: number
}

export type HandleChangeMapType = {
    lats: number
    latn: number
    lngw: number
    lnge: number
    lat: number
    lng: number
    zoom: number
}

// query and url types

export type handleChangeFilterType = {
    maxNbOfRooms: string
    maxPrice: string
    maxPricePerMeterSquare: string
    maxSurface: string
    maxSurfaceLand: string
    maxYear: string
    minNbOfRooms: string
    minPrice: string
    minPricePerMeterSquare: string
    minSurface: string
    minSurfaceLand: string
    minYear: string
}

type MapQueryType = {
    lats: string
    latn: string
    lngw: string
    lnge: string
    isMobile: 'false' | 'true'
}

export type QueryParamsType = handleChangeFilterType & MapQueryType

type MapUrlQueryParamsType = {
    lat: string
    lng: string
    zoom: string
}

export type UrlQueryParamsType = QueryParamsType & MapUrlQueryParamsType

// Graph type

export type TooltipItemType = {
    name: string
    value: string
    unit?: string
    color?: string
}
export type TooltipType = {
    tooltipItems: TooltipItemType[]
    label: string
}

export type Bar = {
    name: string
    value: number
    count: number
    tooltipProps: TooltipType
}
export type Line = {
    name: string
    'Prix / m²': number
    tooltipProps: TooltipType
}

export type GraphDataType = {
    priceHisto: Bar[]
    pricePerMeterHisto: Bar[]
    pricePerMeterIncreaseLine: Line[]
    priceSurfaceScatter: {
        data: ListedDealType[]
        averagePricePerMeterSquare: number
        endPoint: { x: number; y: number }
    } | null
    roomsHisto: Bar[]
    surfaceHisto: Bar[]
} | null
