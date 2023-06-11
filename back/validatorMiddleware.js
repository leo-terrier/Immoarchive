"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkValidators = exports.validators = void 0;
const express_validator_1 = require("express-validator");
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
];
const maxValues = {
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
};
const maxYDistance = 0.09; // approx. 9km
const maxXDistance = 0.26; // approx. 19km
exports.validators = [
    (0, express_validator_1.query)('lats').isNumeric(),
    (0, express_validator_1.query)('lats').isNumeric(),
    (0, express_validator_1.query)('lngw').isNumeric(),
    (0, express_validator_1.query)('lnge').isNumeric(),
    (0, express_validator_1.query)('minNbOfRooms')
        .optional()
        .isInt({ min: 0, max: maxValues.minNbOfRooms }),
    (0, express_validator_1.query)('maxNbOfRooms')
        .optional()
        .isInt({ min: 0, max: maxValues.maxNbOfRooms }),
    (0, express_validator_1.query)('minPrice').optional().isInt({ min: 0, max: maxValues.minPrice }),
    (0, express_validator_1.query)('maxPrice').optional().isInt({ min: 0, max: maxValues.maxPrice }),
    (0, express_validator_1.query)('minPricePerMeterSquare')
        .optional()
        .isInt({ min: 0, max: maxValues.minPricePerMeterSquare }),
    (0, express_validator_1.query)('maxPricePerMeterSquare')
        .optional()
        .isInt({ min: 0, max: maxValues.maxPricePerMeterSquare }),
    (0, express_validator_1.query)('minSurface').optional().isInt({ min: 0, max: maxValues.minSurface }),
    (0, express_validator_1.query)('maxSurface').optional().isInt({ min: 0, max: maxValues.maxSurface }),
    (0, express_validator_1.query)('minYear').optional().isInt({ min: 0, max: 2022 }),
    (0, express_validator_1.query)('maxYear').optional().isInt({ min: 0, max: 2022 }),
    (0, express_validator_1.query)('minSurfaceLand')
        .optional()
        .isInt({ min: 0, max: maxValues.minSurfaceLand }),
    (0, express_validator_1.query)('maxSurfaceLand')
        .optional()
        .isInt({ min: 0, max: maxValues.maxSurfaceLand })
];
const checkValidators = (req, res, next) => {
    const validationResults = (0, express_validator_1.validationResult)(req);
    for (const [key, value] of Object.entries(req.query)) {
        //Verify query param is accepted
        if (!queryParams.includes(key)) {
            return res.status(400).send('Unknown filter : ' + key);
        }
        //Verify that min < max
        if (key.includes('min')) {
            const maxQueryValue = req.query[key.replace('min', 'max')];
            if (maxQueryValue &&
                parseInt(maxQueryValue, 10) <
                    parseInt(value, 10)) {
                return res.status(400).send('Invalid value : ' + key);
            }
        }
    }
    // Verify validator compliance
    if (!validationResults.isEmpty()) {
        return res.status(400).send({ errors: validationResults.array() });
    }
    // Verify map area under max for min zoom (13)
    if (parseFloat(req.query.latn) -
        parseFloat(req.query.lats) >
        maxYDistance ||
        parseFloat(req.query.lnge) -
            parseFloat(req.query.lngw) >
            maxXDistance) {
        return res.status(400).send({ errors: 'Invalid coordinates' });
    }
    next();
};
exports.checkValidators = checkValidators;
