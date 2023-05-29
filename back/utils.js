"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFullDate = exports.getQueryForFilter = exports.agglomerateDeals = void 0;
// Put same location deals on same marker
const agglomerateDeals = (deals) => {
    const response = [];
    deals.forEach((deal) => {
        const newDeal = Object.assign({}, deal);
        delete newDeal.longitude;
        delete newDeal.latitude;
        const neightborDealIndex = response.findIndex((resDeal) => resDeal.lnglat.lat === deal.latitude &&
            resDeal.lnglat.lng === deal.longitude);
        if (neightborDealIndex === -1) {
            response.push({
                lnglat: {
                    lng: deal.longitude,
                    lat: deal.latitude,
                },
                deals: [newDeal],
            });
        }
        else {
            response[neightborDealIndex].deals.push(newDeal);
        }
    });
    return response;
};
exports.agglomerateDeals = agglomerateDeals;
const getQueryForFilter = (key) => {
    switch (key) {
        case "minPrice":
            return ` valeur_fonciere > @minPrice `;
        case "maxPrice":
            return ` valeur_fonciere < @maxPrice `;
        case "minSurface":
            return ` total_surface_reelle_bati > @minSurface `;
        case "maxSurface":
            return ` total_surface_reelle_bati < @maxSurface `;
        case "minNbOfRooms":
            return ` total_nombre_pieces_principales > @minNbOfRooms `;
        case "maxNbOfRooms":
            return ` total_nombre_pieces_principales < @maxNbOfRooms `;
        case "minPricePerMeterSquare":
            return ` prix_metre_carre > @minPricePerMeterSquare `;
        case "maxPricePerMeterSquare":
            return ` prix_metre_carre < @maxPricePerMeterSquare `;
        case "minSurfaceLand":
            return ` total_surface_terrain > @minSurfaceLand `;
        case "maxSurfaceLand":
            return ` total_surface_terrain < @maxSurfaceLand `;
        case "minYear":
            return ` date_mutation > @minYear `;
        case "maxYear":
            return ` date_mutation < @maxYear `;
        default:
            throw new Error("Invalid Filter param in switch case");
    }
};
exports.getQueryForFilter = getQueryForFilter;
const createFullDate = (name, yearValue) => {
    return name.includes("min") ? `${yearValue}-01-01` : `${yearValue}-12-31`;
};
exports.createFullDate = createFullDate;
