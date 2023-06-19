import { BigQuery } from '@google-cloud/bigquery'
import { Request, Response } from 'express'
import { queryDataBase } from './database'
import {
    StrNumberObjType,
    LatLng,
    StringObjType,
    OriginalDealType,
    AgglomeratedDealsObjType,
    ListedDealType,
    BigQueryResultType,
    GraphDataType
} from './types'
import {
    formatDealList,
    createFullDate,
    filterFourDispersedRows,
    getQueryForFilter,
    formatForClusteredMarker
} from './utils'
import { generateGraphData } from './graphFunctions'

export async function getDeals(req: Request, res: Response) {
    const queryParams = req.query as StringObjType
    const isMobile = req.query.isMobile === 'true' ? true : false

    let graphData: GraphDataType = null
    let isClustered = false
    let isOverGraphLimit = false
    let clusteredDeals: LatLng[] = []
    let agglomeratedDeals: AgglomeratedDealsObjType[] = []
    let listedDeals: ListedDealType[] = []

    const mapLimit = isMobile ? 400 : 750
    const graphLimit = 1500

    // // Get Ids from Big Query
    let query = `SELECT
    id  FROM dealfinder-358812.immoarchive.prix
    WHERE ST_Contains(
        ST_MAKEPOLYGON(
            ST_MAKELINE([
                ST_GEOGPOINT(@lngw, @lats),
                ST_GEOGPOINT(@lngw, @latn),
                ST_GEOGPOINT(@lnge, @latn),
                ST_GEOGPOINT(@lnge, @lats)
            ])
            ),
            lnglat
            )`

    // reduce map area size for map button space
    const xDistance =
        parseFloat(queryParams.lnge) - parseFloat(queryParams.lngw)

    const yDistance =
        parseFloat(queryParams.latn) - parseFloat(queryParams.lats)

    const parametrizedFilters: StrNumberObjType = {
        lats: parseFloat(queryParams.lats) + 0.04 * yDistance,
        latn: parseFloat(queryParams.latn) - 0.07 * yDistance,
        lngw: parseFloat(queryParams.lngw) + 0.04 * xDistance,
        lnge: parseFloat(queryParams.lnge) - 0.07 * xDistance
    }

    // Build big query query
    const mapParamsArr = ['lats', 'latn', 'lngw', 'lnge', 'zoom', 'isMobile']

    const additionalParamKeyValues = Object.entries(queryParams).filter(
        ([key]) => !mapParamsArr.includes(key)
    )

    if (additionalParamKeyValues.length) {
        query += ' AND '
        const additionalQueryArr: string[] = []
        additionalParamKeyValues.forEach(([key, value]) => {
            additionalQueryArr.push(getQueryForFilter(key))
            parametrizedFilters[key] = key.includes('Year')
                ? createFullDate(key, value)
                : parseInt(value, 10)
        })
        query += additionalQueryArr.join(' AND ')
    }

    query += ` LIMIT ${graphLimit}`

    const bigquery = new BigQuery()

    const [job, meta] = await bigquery.createQueryJob({
        query: query,
        params: parametrizedFilters
        /*  useQueryCache: false */
    })

    if (job) {
        const [rows] = await job.getQueryResults()
        const length = rows.length
        isOverGraphLimit = length === graphLimit
        isClustered = length > mapLimit
        const mb =
            parseInt(meta?.statistics?.totalBytesProcessed as string, 10) /
            1048000
        // eslint-disable-next-line no-console
        console.table({ queryParams })

        // // If graph limit passed, fetch 4 dispersed Ids for clusters, else fetch all transaction info from IDs retreived

        const idsToFetch = (
            isOverGraphLimit
                ? filterFourDispersedRows<BigQueryResultType>(rows)
                : rows
        )
            .map((e) => e.id)
            .join(', ')

        if (length) {
            const sqlResult = (await queryDataBase(
                `SELECT ${
                    isOverGraphLimit
                        ? ''
                        : 'id_mutation, date_mutation, valeur_fonciere, adresse_numero, adresse_suffixe, adresse_nom_voie, code_postal, nom_commune, total_nombre_lots, code_type_local, total_surface_reelle_bati, total_nombre_pieces_principales, total_surface_terrain,total_nombre_locaux, prix_metre_carre,'
                } latitude, longitude FROM transac WHERE id IN (${idsToFetch})`
            )) as OriginalDealType[]
            if (Array.isArray(sqlResult) && sqlResult.length) {
                if (isOverGraphLimit) {
                    clusteredDeals = sqlResult.map(formatForClusteredMarker)
                    graphData = null
                } else if (isClustered) {
                    clusteredDeals = filterFourDispersedRows<OriginalDealType>(
                        sqlResult
                    ).map(formatForClusteredMarker)
                    graphData = generateGraphData(sqlResult, isClustered)
                } else {
                    const { agglomeratedDealsResult, listedDealsResult } =
                        formatDealList(sqlResult)
                    agglomeratedDeals = agglomeratedDealsResult
                    listedDeals = listedDealsResult

                    // if both marker and graph are present, get formatted list for scatter chart <=> map interaction
                    graphData = generateGraphData(listedDeals, isClustered)
                }
            }
        }
        if (mb > 60)
            // eslint-disable-next-line no-console
            console.table({
                msg: 'Alert: MB Exceeded',
                MB: mb.toFixed(0),
                queryParams,
                length
            })

        return res.json({
            length,
            isClustered,
            clusteredDeals,
            agglomeratedDeals,
            listedDeals,
            MB: mb.toFixed(0),
            graphData
        })
    }
}

const test = null
