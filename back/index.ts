import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { getDeals } from './getDeals'
import { checkValidators, validators } from './validatorMiddleware'

export const app = express()

dotenv.config()

app.use(
    process.env.NODE_ENV === 'production'
        ? cors({ origin: 'https://immoarchive.netlify.app' })
        : cors()
)

const port = process.env.PORT

app.get('/deals', validators, checkValidators, getDeals)

if (!process.env.CLOUD_FUNCTION) {
    app.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(
            `⚡️[server]: Server is running at http://localhost:${port}`
        )
    })
}
