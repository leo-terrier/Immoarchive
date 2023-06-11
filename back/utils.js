"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatForClusteredMarker = exports.roundToLeadingDigit = exports.filterFourDispersedRows = exports.createFullDate = exports.getQueryForFilter = exports.formatDealList = void 0;
// Put same location deals on same marker
const formatDealList = (deals) => {
    const agglomeratedDealsResult = [];
    const listedDealsResult = [];
    deals.forEach((deal) => {
        const newDeal = Object.assign({}, deal);
        delete newDeal.longitude;
        delete newDeal.latitude;
        const lnglat = {
            lng: deal.longitude,
            lat: deal.latitude
        };
        const neighborDealIndex = agglomeratedDealsResult.findIndex((location) => location.lnglat.lat === deal.latitude &&
            location.lnglat.lng === deal.longitude);
        if (neighborDealIndex === -1) {
            agglomeratedDealsResult.push({
                lnglat: lnglat,
                deals: [newDeal]
            });
            listedDealsResult.push(Object.assign(Object.assign({}, newDeal), { lnglat, agglomerateIdx: 0 }));
        }
        else {
            agglomeratedDealsResult[neighborDealIndex].deals.push(newDeal);
            listedDealsResult.push(Object.assign(Object.assign({}, newDeal), { lnglat, agglomerateIdx: agglomeratedDealsResult[neighborDealIndex].deals.length - 1 }));
        }
    });
    return { agglomeratedDealsResult, listedDealsResult };
};
exports.formatDealList = formatDealList;
const getQueryForFilter = (key) => {
    switch (key) {
        case 'minPrice':
            return ` valeur_fonciere >= @minPrice `;
        case 'maxPrice':
            return ` valeur_fonciere <= @maxPrice `;
        case 'minSurface':
            return ` total_surface_reelle_bati >= @minSurface `;
        case 'maxSurface':
            return ` total_surface_reelle_bati <= @maxSurface `;
        case 'minNbOfRooms':
            return ` total_nombre_pieces_principales >= @minNbOfRooms `;
        case 'maxNbOfRooms':
            return ` total_nombre_pieces_principales <= @maxNbOfRooms `;
        case 'minPricePerMeterSquare':
            return ` prix_metre_carre >= @minPricePerMeterSquare `;
        case 'maxPricePerMeterSquare':
            return ` prix_metre_carre <= @maxPricePerMeterSquare `;
        case 'minSurfaceLand':
            return ` total_surface_terrain >= @minSurfaceLand `;
        case 'maxSurfaceLand':
            return ` total_surface_terrain <= @maxSurfaceLand `;
        case 'minYear':
            return ` date_mutation >= @minYear `;
        case 'maxYear':
            return ` date_mutation <= @maxYear `;
        default:
            throw new Error('Invalid Filter param in switch case');
    }
};
exports.getQueryForFilter = getQueryForFilter;
const createFullDate = (name, yearValue) => {
    return name.includes('min') ? `${yearValue}-01-01` : `${yearValue}-12-31`;
};
exports.createFullDate = createFullDate;
const filterFourDispersedRows = (rows) => {
    return rows.filter((_, i) => [
        0,
        Math.floor(rows.length * (1 / 3)),
        Math.floor(rows.length * (2 / 3)),
        rows.length - 1
    ].includes(i));
};
exports.filterFourDispersedRows = filterFourDispersedRows;
function roundToLeadingDigit(number) {
    const multiplier = Math.pow(10, Math.floor(Math.log10(number)));
    const roundedNumber = Math.round(number / multiplier) * multiplier;
    return roundedNumber;
}
exports.roundToLeadingDigit = roundToLeadingDigit;
const formatForClusteredMarker = (deal) => ({
    lat: deal.latitude,
    lng: deal.longitude
});
exports.formatForClusteredMarker = formatForClusteredMarker;
