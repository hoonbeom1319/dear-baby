import { getAuthHeaders } from '@/shared/api';

import { FETCH } from '@/hbw/api';

import type { PlaceDetail, PlacePatch, PlaceSummary, RecordGroupInput, RecordPhotoInput, VisitInput, VisitPatch } from './model/types';

export type GetPlacesResponse = { ok: true; places: PlaceSummary[] };
export type GetPlaceDetailResponse = { ok: true; place: PlaceDetail };
export type PostRecordResponse = { ok: true; placeIds: string[] };
type OkResponse = { ok: true };
type PostVisitResponse = { ok: true; visitId: string };

const jsonHeaders = async () => ({ 'Content-Type': 'application/json', ...(await getAuthHeaders()) });

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
    return FETCH<PostRecordResponse>('/api/records', {
        method: 'POST',
        headers: await jsonHeaders(),
        body: JSON.stringify({ groups })
    });
};

// ─── 저장 후 편집 ─────────────────────────────────────────────────────────────

export const PatchPlace = async (placeId: string, patch: PlacePatch): Promise<OkResponse> =>
    FETCH<OkResponse>(`/api/places/${placeId}`, { method: 'PATCH', headers: await jsonHeaders(), body: JSON.stringify(patch) });

export const DeletePlace = async (placeId: string): Promise<OkResponse> =>
    FETCH<OkResponse>(`/api/places/${placeId}`, { method: 'DELETE', headers: await getAuthHeaders() });

export const PostVisit = async (placeId: string, input: VisitInput): Promise<PostVisitResponse> =>
    FETCH<PostVisitResponse>(`/api/places/${placeId}/visits`, { method: 'POST', headers: await jsonHeaders(), body: JSON.stringify(input) });

export const PatchVisit = async (visitId: string, patch: VisitPatch): Promise<OkResponse> =>
    FETCH<OkResponse>(`/api/visits/${visitId}`, { method: 'PATCH', headers: await jsonHeaders(), body: JSON.stringify(patch) });

export const DeleteVisit = async (visitId: string): Promise<OkResponse> =>
    FETCH<OkResponse>(`/api/visits/${visitId}`, { method: 'DELETE', headers: await getAuthHeaders() });

export const PostVisitPhotos = async (visitId: string, photos: RecordPhotoInput[]): Promise<OkResponse> =>
    FETCH<OkResponse>(`/api/visits/${visitId}/photos`, { method: 'POST', headers: await jsonHeaders(), body: JSON.stringify({ photos }) });

export const DeletePhoto = async (photoId: string): Promise<OkResponse> =>
    FETCH<OkResponse>(`/api/photos/${photoId}`, { method: 'DELETE', headers: await getAuthHeaders() });
