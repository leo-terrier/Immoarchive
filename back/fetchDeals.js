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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeals = void 0;
const bigquery_1 = require("@google-cloud/bigquery");
const fs_1 = __importDefault(require("fs"));
const database_1 = require("./database");
const utils_1 = require("./utils");
function getDeals(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const bigquery = new bigquery_1.BigQuery();
        const isMobile = false;
        const queryParams = req.query;
        let isClustered = false;
        let result = [];
        const limit = isMobile ? 100 : 500;
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
        const xDistance = Math.abs(parseFloat(queryParams.lngw) - parseFloat(queryParams.lnge));
        const yDistance = Math.abs(parseFloat(queryParams.latn) - parseFloat(queryParams.lats));
        const parametrizedFilters = {
            lats: parseFloat(queryParams.lats) + 0.04 * yDistance,
            latn: parseFloat(queryParams.latn) - 0.07 * yDistance,
            lngw: parseFloat(queryParams.lngw) + 0.04 * xDistance,
            lnge: parseFloat(queryParams.lnge) - 0.07 * xDistance
        };
        const mapParamsArr = ['lats', 'latn', 'lngw', 'lnge', 'zoom', 'isMobile'];
        const additionalParamKeyValues = Object.entries(queryParams).filter((pair) => !mapParamsArr.includes(pair[0]));
        if (additionalParamKeyValues.length) {
            query += ' AND ';
            const additionalQueryArr = [];
            additionalParamKeyValues.forEach(([key, value]) => {
                additionalQueryArr.push((0, utils_1.getQueryForFilter)(key));
                parametrizedFilters[key] = !key.includes('Year')
                    ? parseInt(value, 10)
                    : (0, utils_1.createFullDate)(key, value);
            });
            query += additionalQueryArr.join(' AND ');
        }
        query += ` LIMIT ${limit}`;
        const [job, meta] = yield bigquery.createQueryJob({
            query: query,
            params: parametrizedFilters
            /*  useQueryCache: false */
        });
        //https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query
        if (job) {
            const [rows] = yield job.getQueryResults();
            const length = rows.length;
            const mb = parseInt((_a = meta === null || meta === void 0 ? void 0 : meta.statistics) === null || _a === void 0 ? void 0 : _a.totalBytesProcessed, 10) /
                1048000;
            // eslint-disable-next-line no-console
            console.table({ queryParams });
            console.table({ length, MB: mb.toFixed(0) });
            if (length) {
                isClustered = length === limit;
                const idArr = isClustered
                    ? rows.filter((_, i) => [
                        0,
                        Math.floor(limit * (1 / 3)),
                        Math.floor(limit * (2 / 3)),
                        limit
                    ].includes(i))
                    : rows;
                const sqlResult = yield (0, database_1.queryDataBase)(`SELECT id_mutation, date_mutation, valeur_fonciere, adresse_numero, adresse_suffixe, adresse_nom_voie, code_postal, nom_commune, total_nombre_lots, code_type_local, total_surface_reelle_bati, total_nombre_pieces_principales, total_surface_terrain, latitude, longitude, total_nombre_locaux, prix_metre_carre FROM transac WHERE id IN (${idArr
                    .map((e) => e.id)
                    .join(', ')})`);
                if (Array.isArray(sqlResult)) {
                    result = (0, utils_1.agglomerateDeals)(sqlResult);
                }
            }
            let bytsAbove = false;
            if (mb > 53) {
                bytsAbove = true;
                fs_1.default.appendFile('./bigQueryLogManyBytes.txt', `\n${mb.toFixed(0)} MB request at ${req.url}`, (err) => {
                    if (err) {
                        // eslint-disable-next-line no-console
                        return console.log(err);
                    }
                    // eslint-disable-next-line no-console
                    console.log('Big query was saved!');
                });
            }
            return res.json({
                isClustered,
                length: rows.length,
                result,
                bits: mb.toFixed(0),
                bytsAbove
            });
        }
    });
}
exports.getDeals = getDeals;
