import { mutationOptions, queryOptions, type QueryClient } from '@tanstack/react-query';

import {
    DeletePhoto,
    DeletePlace,
    DeleteVisit,
    GetPlaceDetail,
    GetPlaces,
    PatchPlace,
    PatchVisit,
    PostRecord,
    PostVisit,
    PostVisitPhotos
} from './api';
import type { PlacePatch, RecordPhotoInput, VisitInput, VisitPatch } from './model/types';

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
        }),

    // ── 저장 후 편집 ──────────────────────────────────────────────────────────
    // 모든 입력에 placeId를 함께 받는다(화면이 현재 보고 있는 장소를 앎) → 그 detail을 무효화.
    // 이름·핀·방문수·삭제처럼 지도 핀 요약에 영향 주는 변경은 listByUser도 무효화한다.

    modifyPlace: (userId: string | null, queryClient: QueryClient) =>
        mutationOptions({
            mutationFn: ({ placeId, patch }: { placeId: string; patch: PlacePatch }) => PatchPlace(placeId, patch),
            onSuccess: (_d, { placeId }) => {
                queryClient.invalidateQueries({ queryKey: placeQueries.detail(placeId).queryKey });
                queryClient.invalidateQueries({ queryKey: placeQueries.listByUser(userId).queryKey });
            }
        }),

    removePlace: (userId: string | null, queryClient: QueryClient) =>
        mutationOptions({
            mutationFn: ({ placeId }: { placeId: string }) => DeletePlace(placeId),
            onSuccess: (_d, { placeId }) => {
                queryClient.removeQueries({ queryKey: placeQueries.detail(placeId).queryKey }); // 화면을 떠나므로 캐시 제거
                queryClient.invalidateQueries({ queryKey: placeQueries.listByUser(userId).queryKey });
            }
        }),

    addVisit: (userId: string | null, queryClient: QueryClient) =>
        mutationOptions({
            mutationFn: ({ placeId, input }: { placeId: string; input: VisitInput }) => PostVisit(placeId, input),
            onSuccess: (_d, { placeId }) => {
                queryClient.invalidateQueries({ queryKey: placeQueries.detail(placeId).queryKey });
                queryClient.invalidateQueries({ queryKey: placeQueries.listByUser(userId).queryKey }); // 방문 수·최근 방문일
            }
        }),

    modifyVisit: (userId: string | null, queryClient: QueryClient) =>
        mutationOptions({
            mutationFn: ({ visitId, patch }: { placeId: string; visitId: string; patch: VisitPatch }) => PatchVisit(visitId, patch),
            onSuccess: (_d, { placeId }) => {
                queryClient.invalidateQueries({ queryKey: placeQueries.detail(placeId).queryKey });
                queryClient.invalidateQueries({ queryKey: placeQueries.listByUser(userId).queryKey }); // 날짜 변경 → 최근 방문일
            }
        }),

    removeVisit: (userId: string | null, queryClient: QueryClient) =>
        mutationOptions({
            mutationFn: ({ visitId }: { placeId: string; visitId: string }) => DeleteVisit(visitId),
            onSuccess: (_d, { placeId }) => {
                queryClient.invalidateQueries({ queryKey: placeQueries.detail(placeId).queryKey });
                queryClient.invalidateQueries({ queryKey: placeQueries.listByUser(userId).queryKey }); // 방문 수 감소
            }
        }),

    // 사진 추가/삭제는 지도 핀 요약에 영향 없음 → detail만 무효화.
    addPhotos: (_userId: string | null, queryClient: QueryClient) =>
        mutationOptions({
            mutationFn: ({ visitId, photos }: { placeId: string; visitId: string; photos: RecordPhotoInput[] }) => PostVisitPhotos(visitId, photos),
            onSuccess: (_d, { placeId }) => {
                queryClient.invalidateQueries({ queryKey: placeQueries.detail(placeId).queryKey });
            }
        }),

    removePhoto: (_userId: string | null, queryClient: QueryClient) =>
        mutationOptions({
            mutationFn: ({ photoId }: { placeId: string; photoId: string }) => DeletePhoto(photoId),
            onSuccess: (_d, { placeId }) => {
                queryClient.invalidateQueries({ queryKey: placeQueries.detail(placeId).queryKey });
            }
        })
};
