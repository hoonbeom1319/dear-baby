import { queryOptions } from '@tanstack/react-query';

import { GetPlaces, type GetPlacesParams } from './api';

export const placeQueries = {
    all: () => ['place'] as const,
    list: (params: GetPlacesParams = {}) =>
        queryOptions({
            queryKey: [...placeQueries.all(), 'list', params.regionCode ?? '', params.subRegionCode ?? '', params.limit ?? null, params.cursor ?? ''],
            queryFn: () => GetPlaces(params)
        })
};
