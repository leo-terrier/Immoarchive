import functions from '@google-cloud/functions-framework'
import { BigQuery } from '@google-cloud/bigquery'

// Register an HTTP function with the Functions Framework
functions.http('getDeals', async (req, res) => {
    const bigquery = new BigQuery()
    let query = `SELECT
    id FROM dealfinder-358812.immoarchive.prix
    LIMIT 5`
    const [job, meta] = await bigquery.createQueryJob({
        query: query
        /*  useQueryCache: false */
    })
    res.set('Access-Control-Allow-Origin', '*')
    const [rows] = await job.getQueryResults()
    res.send(rows)
})
