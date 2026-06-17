import { useQuery } from '@tanstack/react-query';

import { placeQueries } from '../factory';

/** 지도 홈 — 사용자의 모든 핀 (raw data) */
export function usePlacesData(userId: string | null) {
    const query = useQuery(placeQueries.listByUser(userId));
    return {
        places: query.data?.places ?? [],
        isLoading: query.isLoading,
        isError: query.isError
    };
}
