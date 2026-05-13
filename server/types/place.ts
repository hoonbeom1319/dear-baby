export type PlaceId = string;

export type PlaceMapLinks = { kakao?: string; naver?: string; tmap?: string } | null;

export type Place = {
    id: PlaceId;
    regionCode: string;
    subRegionCode: string;
    categoryCode: string;
    name: string;
    subtitle?: string | null;
    headline?: string | null;
    description?: string | null;
    honeyTip?: string | null;
    address?: string | null;
    lat?: number | null;
    lng?: number | null;
    mapLinks?: PlaceMapLinks;
    images?: string[] | null;
    amenityCodes: string[];
    createdAt?: string;
    updatedAt?: string;
};

export type PlaceListQuery = {
    regionCode?: string;
    subRegionCode?: string;
    limit?: number;
    cursor?: string;
};

export type CreatePlaceInput = {
    region_code: string;
    sub_region_code: string;
    category_code: string;
    name: string;
    subtitle: string | null;
    headline: string | null;
    description: string | null;
    honey_tip: string | null;
    address: string | null;
    lat: number | null;
    lng: number | null;
    map_links: PlaceMapLinks;
    images: string[] | null;
    amenity_codes: string[];
};
