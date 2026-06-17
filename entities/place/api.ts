import { getAuthHeaders } from '@/shared/api';

import { FETCH } from '@/hbw/api';

import type { PlaceDetail, PlaceSummary, RecordGroupInput } from './model/types';

export type GetPlacesResponse = { ok: true; places: PlaceSummary[] };
export type GetPlaceDetailResponse = { ok: true; place: PlaceDetail };
export type PostRecordResponse = { ok: true; placeIds: string[] };

export const GetPlaces = async (): Promise<GetPlacesResponse> => {
    const headers = await getAuthHeaders();
    return FETCH<GetPlacesResponse>('/api/places', { headers });
};

export const GetPlaceDetail = async (placeId: string): Promise<GetPlaceDetailResponse> => {
    const headers = await getAuthHeaders();
    return FETCH<GetPlaceDetailResponse>(`/api/places/${placeId}`, { headers });
};

/** 기록 세션 생성 — Place/Visit/Photo 를 한 번에 만든다 */
export const PostRecord = async (groups: RecordGroupInput[]): Promise<PostRecordResponse> => {
    const headers = await getAuthHeaders();
    return FETCH<PostRecordResponse>('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ groups })
    });
};
