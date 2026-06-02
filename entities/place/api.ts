import { FETCH } from '@/hbw/api';

type PlaceMapLinks = { kakao?: string; naver?: string; tmap?: string } | null;

export type PlaceDto = {
    id: string;
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

export type GetPlacesParams = {
    regionCode?: string;
    subRegionCode?: string;
    limit?: number;
    cursor?: string;
};

export type GetPlacesResponse = {
    ok: true;
    items: PlaceDto[];
    nextCursor: string | null;
};

export const GetPlaces = (params: GetPlacesParams = {}) => {
    const search = new URLSearchParams();

    if (params.regionCode) search.set('regionCode', params.regionCode);
    if (params.subRegionCode) search.set('subRegionCode', params.subRegionCode);
    if (typeof params.limit === 'number') search.set('limit', String(params.limit));
    if (params.cursor) search.set('cursor', params.cursor);

    const query = search.toString();
    const path = query ? `/api/places?${query}` : '/api/places';

    return FETCH<GetPlacesResponse>(path);
};
