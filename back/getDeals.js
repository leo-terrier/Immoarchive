"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeals = void 0;
const bigquery_1 = require("@google-cloud/bigquery");
const database_1 = require("./database");
const utils_1 = require("./utils");
const graphFunctions_1 = require("./graphFunctions");
function getDeals(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const queryParams = req.query;
        const isMobile = req.query.isMobile === 'true' ? true : false;
        let graphData = null;
        let isClustered = false;
        let isOverGraphLimit = false;
        let clusteredDeals = [];
        let agglomeratedDeals = [];
        let listedDeals = [];
        const mapLimit = isMobile ? 400 : 750;
        const graphLimit = 1500;
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
            )`;
        // reduce map area size for map button space
        const xDistance = parseFloat(queryParams.lnge) - parseFloat(queryParams.lngw);
        const yDistance = parseFloat(queryParams.latn) - parseFloat(queryParams.lats);
        const parametrizedFilters = {
            lats: parseFloat(queryParams.lats) + 0.04 * yDistance,
            latn: parseFloat(queryParams.latn) - 0.07 * yDistance,
            lngw: parseFloat(queryParams.lngw) + 0.04 * xDistance,
            lnge: parseFloat(queryParams.lnge) - 0.07 * xDistance
        };
        // Build big query query
        const mapParamsArr = ['lats', 'latn', 'lngw', 'lnge', 'zoom', 'isMobile'];
        const additionalParamKeyValues = Object.entries(queryParams).filter(([key]) => !mapParamsArr.includes(key));
        if (additionalParamKeyValues.length) {
            query += ' AND ';
            const additionalQueryArr = [];
            additionalParamKeyValues.forEach(([key, value]) => {
                additionalQueryArr.push((0, utils_1.getQueryForFilter)(key));
                parametrizedFilters[key] = key.includes('Year')
                    ? (0, utils_1.createFullDate)(key, value)
                    : parseInt(value, 10);
            });
            query += additionalQueryArr.join(' AND ');
        }
        query += ` LIMIT ${graphLimit}`;
        const bigquery = new bigquery_1.BigQuery();
        const [job, meta] = yield bigquery.createQueryJob({
            query: query,
            params: parametrizedFilters
            /*  useQueryCache: false */
        });
        if (job) {
            const [rows] = yield job.getQueryResults();
            const length = rows.length;
            isOverGraphLimit = length === graphLimit;
            isClustered = length > mapLimit;
            const mb = parseInt((_a = meta === null || meta === void 0 ? void 0 : meta.statistics) === null || _a === void 0 ? void 0 : _a.totalBytesProcessed, 10) /
                1048000;
            // eslint-disable-next-line no-console
            console.table({ queryParams });
            // // If graph limit passed, fetch 4 dispersed Ids for clusters, else fetch all transaction info from IDs retreived
            const idsToFetch = (isOverGraphLimit
                ? (0, utils_1.filterFourDispersedRows)(rows)
                : rows)
                .map((e) => e.id)
                .join(', ');
            if (length) {
                const sqlResult = (yield (0, database_1.queryDataBase)(`SELECT ${isOverGraphLimit
                    ? ''
                    : 'id_mutation, date_mutation, valeur_fonciere, adresse_numero, adresse_suffixe, adresse_nom_voie, code_postal, nom_commune, total_nombre_lots, code_type_local, total_surface_reelle_bati, total_nombre_pieces_principales, total_surface_terrain,total_nombre_locaux, prix_metre_carre,'} latitude, longitude FROM transac WHERE id IN (${idsToFetch})`));
                if (Array.isArray(sqlResult) && sqlResult.length) {
                    if (isOverGraphLimit) {
                        clusteredDeals = sqlResult.map(utils_1.formatForClusteredMarker);
                        graphData = null;
                    }
                    else if (isClustered) {
                        clusteredDeals = (0, utils_1.filterFourDispersedRows)(sqlResult).map(utils_1.formatForClusteredMarker);
                        graphData = (0, graphFunctions_1.generateGraphData)(sqlResult, isClustered);
                    }
                    else {
                        const { agglomeratedDealsResult, listedDealsResult } = (0, utils_1.formatDealList)(sqlResult);
                        agglomeratedDeals = agglomeratedDealsResult;
                        listedDeals = listedDealsResult;
                        // if both marker and graph are present, get formatted list for scatter chart <=> map interaction
                        graphData = (0, graphFunctions_1.generateGraphData)(listedDeals, isClustered);
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
                });
            return res.json({
                length,
                isClustered,
                clusteredDeals,
                agglomeratedDeals,
                listedDeals,
                MB: mb.toFixed(0),
                graphData
            });
        }
    });
}
exports.getDeals = getDeals;
