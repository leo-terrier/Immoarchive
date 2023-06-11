import { NextFunction, Request, Response } from 'express'
import { query, validationResult } from 'express-validator'

type MaxValues = {
    [key: string]: number
}

const queryParams = [
    'maxNbOfRooms',
    'maxPrice',
    'maxPricePerMeterSquare',
    'maxSurface',
    'maxSurfaceLand',
    'maxYear',
    'minNbOfRooms',
    'minPrice',
    'minPricePerMeterSquare',
    'minSurface',
    'minSurfaceLand',
    'minYear',
    'lats',
    'latn',
    'lngw',
    'lnge',
    'isMobile'
]
const maxValues: MaxValues = {
    minPricePerMeterSquare: 20000,
    maxPricePerMeterSquare: 20000,
    minPrice: 40000000,
    maxPrice: 40000000,
    minSurface: 2000,
    maxSurface: 2000,
    minSurfaceLand: 20000,
    maxSurfaceLand: 20000,
    minNbOfRooms: 20,
    maxNbOfRooms: 20
}

const maxYDistance = 0.09 // approx. 9km
const maxXDistance = 0.26 // approx. 19km

export const validators = [
    query('lats').isNumeric(),
    query('lats').isNumeric(),
    query('lngw').isNumeric(),
    query('lnge').isNumeric(),
    query('minNbOfRooms')
        .optional()
        .isInt({ min: 0, max: maxValues.minNbOfRooms }),
    query('maxNbOfRooms')
        .optional()
        .isInt({ min: 0, max: maxValues.maxNbOfRooms }),
    query('minPrice').optional().isInt({ min: 0, max: maxValues.minPrice }),
    query('maxPrice').optional().isInt({ min: 0, max: maxValues.maxPrice }),
    query('minPricePerMeterSquare')
        .optional()
        .isInt({ min: 0, max: maxValues.minPricePerMeterSquare }),
    query('maxPricePerMeterSquare')
        .optional()
        .isInt({ min: 0, max: maxValues.maxPricePerMeterSquare }),
    query('minSurface').optional().isInt({ min: 0, max: maxValues.minSurface }),
    query('maxSurface').optional().isInt({ min: 0, max: maxValues.maxSurface }),
    query('minYear').optional().isInt({ min: 0, max: 2022 }),
    query('maxYear').optional().isInt({ min: 0, max: 2022 }),
    query('minSurfaceLand')
        .optional()
        .isInt({ min: 0, max: maxValues.minSurfaceLand }),
    query('maxSurfaceLand')
        .optional()
        .isInt({ min: 0, max: maxValues.maxSurfaceLand })
]

export const checkValidators = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const validationResults = validationResult(req)
    for (const [key, value] of Object.entries(req.query)) {
        //Verify query param is accepted
        if (!queryParams.includes(key)) {
            return res.status(400).send('Unknown filter : ' + key)
        }
        //Verify that min < max
        if (key.includes('min')) {
            const maxQueryValue = req.query[key.replace('min', 'max')]
            if (
                maxQueryValue &&
                parseInt(maxQueryValue as string, 10) <
                    parseInt(value as string, 10)
            ) {
                return res.status(400).send('Invalid value : ' + key)
            }
        }
    }
    // Verify validator compliance
    if (!validationResults.isEmpty()) {
        return res.status(400).send({ errors: validationResults.array() })
    }
    // Verify map area under max for min zoom (13)
    if (
        parseFloat(req.query.latn as string) -
            parseFloat(req.query.lats as string) >
            maxYDistance ||
        parseFloat(req.query.lnge as string) -
            parseFloat(req.query.lngw as string) >
            maxXDistance
    ) {
        return res.status(400).send({ errors: 'Invalid coordinates' })
    }

    next()
}
