import { BigQuery } from "@google-cloud/bigquery";
import fs from "fs";
import { Request, Response } from "express";
import { queryDataBase } from "./database";
import {
  FormattedQueryParamsType,
  LocationDealsObjType,
  QueryParamsType,
  agglomerateDeals,
  createFullDate,
  getQueryForFilter,
} from "./utils";

export async function getDeals(req: Request, res: Response) {
  const bigquery = new BigQuery();

  const isMobile = false;
  const queryParams = req.query as QueryParamsType;
  let isClustered = false;
  let result: LocationDealsObjType[] = [];
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

  const xDistance = Math.abs(
    parseFloat(queryParams.lngw) - parseFloat(queryParams.lnge)
  );

  const yDistance = Math.abs(
    parseFloat(queryParams.latn) - parseFloat(queryParams.lats)
  );

  const parametrizedFilters: FormattedQueryParamsType = {
    lats: parseFloat(queryParams.lats) + 0.04 * yDistance,
    latn: parseFloat(queryParams.latn) - 0.07 * yDistance,
    lngw: parseFloat(queryParams.lngw) + 0.04 * xDistance,
    lnge: parseFloat(queryParams.lnge) - 0.07 * xDistance,
  };

  const mapParamsArr = ["lats", "latn", "lngw", "lnge", "zoom", "isMobile"];

  const additionalParamKeyValues = Object.entries(queryParams).filter(
    (pair) => !mapParamsArr.includes(pair[0])
  );

  if (additionalParamKeyValues.length) {
    query += " AND ";
    const additionalQueryArr: string[] = [];
    additionalParamKeyValues.forEach(([key, value]) => {
      additionalQueryArr.push(getQueryForFilter(key));
      parametrizedFilters[key] = !key.includes("Year")
        ? parseInt(value, 10)
        : createFullDate(key, value);
    });
    query += additionalQueryArr.join(" AND ");
  }

  query += ` LIMIT ${limit}`;

  const [job, meta] = await bigquery.createQueryJob({
    query: query,
    params: parametrizedFilters,
    /*  useQueryCache: false */
  });
  //https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query

  if (job) {
    const [rows] = await job.getQueryResults();
    const length = rows.length;
    const mb =
      parseInt(meta?.statistics?.totalBytesProcessed as string, 10) / 1048000;
    // eslint-disable-next-line no-console
    console.table({ queryParams });
    // eslint-disable-next-line no-console
    console.table({ length, MB: mb.toFixed(0) });

    if (length) {
      isClustered = length === limit;
      const idArr = isClustered
        ? rows.filter((_, i) =>
            [
              0,
              Math.floor(limit * (1 / 3)),
              Math.floor(limit * (2 / 3)),
              limit,
            ].includes(i)
          )
        : rows;
      const sqlResult = await queryDataBase(
        `SELECT id_mutation, date_mutation, valeur_fonciere, adresse_numero, adresse_suffixe, adresse_nom_voie, code_postal, nom_commune, total_nombre_lots, code_type_local, total_surface_reelle_bati, total_nombre_pieces_principales, total_surface_terrain, latitude, longitude, total_nombre_locaux, prix_metre_carre FROM transac WHERE id IN (${idArr
          .map((e) => e.id)
          .join(", ")})`
      );
      if (Array.isArray(sqlResult)) {
        result = agglomerateDeals(sqlResult);
      }
    }

    let bytsAbove = false;
    if (mb > 53) {
      bytsAbove = true;
      fs.appendFile(
        "./bigQueryLogManyBytes.txt",
        `\n${mb.toFixed(0)} MB request at ${req.url}`,
        (err) => {
          if (err) {
            // eslint-disable-next-line no-console
            return console.log(err);
          }
          // eslint-disable-next-line no-console
          console.log("Big query was saved!");
        }
      );
    }

    return res.json({
      isClustered,
      length: rows.length,
      result,
      bits: mb.toFixed(0),
      bytsAbove,
    });
  }
}
