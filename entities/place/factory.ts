import { mutationOptions, queryOptions, type QueryClient } from '@tanstack/react-query';

import { GetPlaceDetail, GetPlaces, PostRecord } from './api';

export const placeQueries = {
    all: () => ['place'] as const,

    /** 지도 홈 — 사용자의 모든 핀 */
    listByUser: (userId: string | null) =>
        queryOptions({
            queryKey: [...placeQueries.all(), 'list', userId],
            queryFn: GetPlaces,
            enabled: !!userId
        }),

    /** 장소 상세 — 방문 시간순 */
    detail: (placeId: string | null) =>
        queryOptions({
            queryKey: [...placeQueries.all(), 'detail', placeId],
            queryFn: () => GetPlaceDetail(placeId as string),
            enabled: !!placeId
        })
};

export const placeMutations = {
    /** 기록 세션 생성 → 지도(핀 목록) 무효화. 새 핀이 그래프 단위로 생기므로 낙관적 갱신 대신 재요청. */
    createRecord: (userId: string | null, queryClient: QueryClient) =>
        mutationOptions({
            mutationFn: PostRecord,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: placeQueries.listByUser(userId).queryKey });
            }
        })
};
