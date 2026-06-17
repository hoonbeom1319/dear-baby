import { useQuery } from '@tanstack/react-query';

import { placeQueries } from '../factory';

/** 장소 상세 — 방문 시간순 (raw data) */
export function usePlaceDetailData(placeId: string | null) {
    const query = useQuery(placeQueries.detail(placeId));
    return {
        place: query.data?.place ?? null,
        isLoading: query.isLoading,
        isError: query.isError
    };
}
