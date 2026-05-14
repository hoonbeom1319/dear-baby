import type { Place } from '@/server/types/place';

import { FETCH } from '@/hbw/api/fetch';

export type GetPlacesParams = {
    regionCode?: string;
    subRegionCode?: string;
    limit?: number;
    cursor?: string;
};

export type GetPlacesResponse = {
    ok: true;
    items: Place[];
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