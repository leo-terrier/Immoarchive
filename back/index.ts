import express, { Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { getDeals } from './getDeals'
import { checkValidators, validators } from './validatorMiddleware'

const app = express()

dotenv.config()

app.use(cors())

const port = process.env.PORT

app.get('/', (res: Response) => {
    res.send('Express server')
})

app.get('/deals', validators, checkValidators, getDeals)

app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
