export type geoTypes = {
  lats: number;
  latn: number;
  lngw: number;
  lnge: number;
};

export type DealType = {
  id_mutation: string;
  date_mutation: string;
  adresse_numero: string;
  adresse_suffixe: string;
  adresse_nom_voie: string;
  code_postal: string;
  nom_commune: string;
  code_type_local: string;
  total_nombre_lots: number;
  valeur_fonciere: number;
  total_surface_reelle_bati: number;
  total_nombre_pieces_principales: number;
  total_surface_terrain: number;
  total_nombre_locaux: number;
  prix_metre_carre: number;
  longitude: number;
  latitude: number;
};

export type OldDealType = DealType & {
  longitude?: number;
  latitude?: number;
};

export type LocationDealsObjType = {
  lnglat: {
    lng: number | undefined;
    lat: number | undefined;
  };
  deals: DealType[];
};

export type QueryParamsType = {
  [key: string]: string;
};
export type FormattedQueryParamsType = {
  [key: string]: string | number;
};

// Put same location deals on same marker
export const agglomerateDeals = (deals: any[]): LocationDealsObjType[] => {
  const response: LocationDealsObjType[] = [];

  deals.forEach((deal) => {
    const newDeal = { ...deal };
    delete newDeal.longitude;
    delete newDeal.latitude;
    const neightborDealIndex = response.findIndex(
      (resDeal) =>
        resDeal.lnglat.lat === deal.latitude &&
        resDeal.lnglat.lng === deal.longitude
    );
    if (neightborDealIndex === -1) {
      response.push({
        lnglat: {
          lng: deal.longitude,
          lat: deal.latitude,
        },
        deals: [newDeal],
      });
    } else {
      response[neightborDealIndex].deals.push(newDeal);
    }
  });
  return response;
};

export const getQueryForFilter = (key: string) => {
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

export const createFullDate = (name: string, yearValue: string) => {
  return name.includes("min") ? `${yearValue}-01-01` : `${yearValue}-12-31`;
};
