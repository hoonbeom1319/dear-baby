import { findPlaceDetail, findPlacesByUser, type PlaceSummary } from '../dao/places';
import { createSupabaseAdmin } from '../db/supabase';
import { NotFoundError } from '../lib/error';

export type { PlaceSummary } from '../dao/places';

// 클라이언트로 내보내는 상세 — 사진은 storagePath 대신 즉시 표시 가능한 서명 URL
export type PhotoView = {
    id: string;
    url: string | null;
    takenAt: string | null;
    sortOrder: number;
};
export type VisitView = {
    id: string;
    visitedOn: string;
    note: string | null;
    createdAt: string;
    photos: PhotoView[];
};
export type PlaceDetailView = {
    id: string;
    name: string;
    lat: number;
    lng: number;
    source: 'kakao' | 'manual';
    kakaoPlaceId: string | null;
    createdAt: string;
    visits: VisitView[];
};

const SIGNED_URL_TTL = 60 * 60; // 1시간

export async function fetchPlacesForMap(userId: string): Promise<PlaceSummary[]> {
    return findPlacesByUser(userId);
}

/**
 * 장소 상세 — 방문 시간순 + 사진 서명 URL.
 * private 버킷이라 storagePath를 그대로 줄 수 없어, 모든 사진 경로를 한 번에 서명한다.
 */
export async function fetchPlaceDetail(userId: string, placeId: string): Promise<PlaceDetailView> {
    const place = await findPlaceDetail(userId, placeId);
    if (!place) throw new NotFoundError();

    const paths = place.visits.flatMap((v) => v.photos.map((p) => p.storagePath));
    const urlByPath = await signPaths(paths);

    return {
        id: place.id,
        name: place.name,
        lat: place.lat,
        lng: place.lng,
        source: place.source,
        kakaoPlaceId: place.kakaoPlaceId,
        createdAt: place.createdAt,
        visits: place.visits.map((v) => ({
            id: v.id,
            visitedOn: v.visitedOn,
            note: v.note,
            createdAt: v.createdAt,
            photos: v.photos.map((p) => ({ id: p.id, url: urlByPath.get(p.storagePath) ?? null, takenAt: p.takenAt, sortOrder: p.sortOrder }))
        }))
    };
}

async function signPaths(paths: string[]): Promise<Map<string, string>> {
    const result = new Map<string, string>();
    if (paths.length === 0) return result;

    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase.storage.from('photos').createSignedUrls(paths, SIGNED_URL_TTL);
    if (error) throw new Error(error.message);

    for (const item of data ?? []) {
        if (item.path && item.signedUrl) result.set(item.path, item.signedUrl);
    }
    return result;
}
