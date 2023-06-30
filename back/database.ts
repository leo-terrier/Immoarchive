import mysql from 'mysql2/promise'
import { format } from 'mysql2'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({
    path:
        __dirname === 'dist'
            ? path.resolve(__dirname, '../.env')
            : path.resolve(__dirname, '.env')
})

const pool = mysql.createPool({
    host: process.env.DB_HOST as string,
    port: parseInt(process.env.DB_PORT as string, 10),
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_NAME as string,
    decimalNumbers: true
})

pool.getConnection()
    .then(() => {
        // eslint-disable-next-line no-console
        console.log('Can reach database')
    })
    .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(err)
    })

export async function queryDataBase(
    query: string,
    values: (number | string)[] = []
) {
    try {
        const parametrizedQuery = format(query, values)
        //console.log(parametrizedQuery)
        const [data] = await pool.query(parametrizedQuery)
        return data
    } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
    }
}
