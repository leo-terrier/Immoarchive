export type StrNumberObjType = { [key: string]: number | string }
export type StringObjType = { [key: string]: string }

// // Results types
export type OriginalDealType = {
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
    latitude: number
    longitude: number
}

export type AgglomeratedDealType = {
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

export type ListedDealType = {
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
    agglomerateIdx: number
    lnglat: LatLng
}
export type AgglomeratedDealsObjType = {
    lnglat: LatLng
    deals: AgglomeratedDealType[]
}
export type LatLng = {
    lat: number
    lng: number
}

export type BigQueryResultType = { id: number }[]

// // Graph types

// When isClustered, use default Original format, otherwise use ListedDealType to provide agglomeratedIdx
export type StatsDealType = ListedDealType | OriginalDealType

export type GenerateHistoType = {
    deals: StatsDealType[]
    prop:
        | 'valeur_fonciere'
        | 'prix_metre_carre'
        | 'total_surface_reelle_bati'
        | 'total_nombre_pieces_principales'
    range?: [number, number]
}

export type GenerateScatterType = {
    priceSorted: ListedDealType[]
    surfaceSorted: ListedDealType[]
    dealsBottomOutliersRemoved: ListedDealType[]
}

export type TooltipType = {
    tooltipItems: {
        name: string
        value: string
        unit?: string
        color?: string
    }[]
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
