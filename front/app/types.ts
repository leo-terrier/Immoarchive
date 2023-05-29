export type DealType = {
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

export type LatLng = {
    lat: number
    lng: number
}

export type LocationDealsObjType = {
    lnglat: LatLng
    deals: DealType[]
}

export type OpenDealsType = LocationDealsObjType & {
    selectedDealIdx?: number
}

export type FilterParamsType = {
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

export type MapParamsType = {
    lats: string
    latn: string
    lngw: string
    lnge: string
}

export type QueryParamsType = FilterParamsType & MapParamsType

export type UrlQueryParamsType = QueryParamsType & {
    lat: string
    lng: string
    zoom: string
}
