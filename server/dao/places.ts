import type { SupabaseClient } from '@supabase/supabase-js';

import { createSupabaseAdmin } from '../db/supabase';
import { removePhotoObjects } from '../lib/storage';

// ─── 도메인 타입 ──────────────────────────────────────────────────────────────

/** 지도 핀 한 개 + 누적 방문 요약 (지도 홈 F-6) */
export type PlaceSummary = {
    id: string;
    name: string;
    lat: number;
    lng: number;
    source: 'kakao' | 'manual';
    kakaoPlaceId: string | null;
    visitCount: number;
    lastVisitedOn: string | null;
};

/** 장소 상세의 사진 — storagePath 보관 (서명 URL 변환은 controller 몫) */
export type PhotoRow = {
    id: string;
    storagePath: string;
    takenAt: string | null;
    sortOrder: number;
};

/** 장소 상세의 방문 한 건 (시간순 F-7) */
export type VisitDetail = {
    id: string;
    visitedOn: string;
    note: string | null;
    createdAt: string;
    photos: PhotoRow[];
};

/** 장소 상세 — 모든 방문을 시간순으로 (F-7) */
export type PlaceDetail = {
    id: string;
    name: string;
    lat: number;
    lng: number;
    source: 'kakao' | 'manual';
    kakaoPlaceId: string | null;
    createdAt: string;
    visits: VisitDetail[];
};

// ─── Queries ─────────────────────────────────────────────────────────────────

/** 지도 홈 — 사용자의 모든 핀 + 방문 수/최근 방문일 */
export async function findPlacesByUser(userId: string): Promise<PlaceSummary[]> {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
        .from('places')
        .select('id, name, lat, lng, source, kakao_place_id, visits(visited_on)')
        .eq('user_id', userId);
    if (error) throw new Error(error.message);

    return (data ?? []).map((row) => {
        const visited = (row.visits ?? []).map((v: { visited_on: string }) => v.visited_on);
        const lastVisitedOn = visited.length > 0 ? visited.reduce((a, b) => (a > b ? a : b)) : null;
        return {
            id: row.id,
            name: row.name,
            lat: row.lat,
            lng: row.lng,
            source: row.source,
            kakaoPlaceId: row.kakao_place_id,
            visitCount: visited.length,
            lastVisitedOn
        };
    });
}

/** 장소 상세 — 방문 시간순(내림차순), 각 방문의 사진은 sort_order 순 */
export async function findPlaceDetail(userId: string, placeId: string): Promise<PlaceDetail | null> {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
        .from('places')
        .select('id, name, lat, lng, source, kakao_place_id, created_at, visits(id, visited_on, note, created_at, photos(id, storage_path, taken_at, sort_order))')
        .eq('id', placeId)
        .eq('user_id', userId)
        .order('visited_on', { referencedTable: 'visits', ascending: false })
        .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return null;

    return {
        id: data.id,
        name: data.name,
        lat: data.lat,
        lng: data.lng,
        source: data.source,
        kakaoPlaceId: data.kakao_place_id,
        createdAt: data.created_at,
        visits: (data.visits ?? []).map((v: RawVisit) => ({
            id: v.id,
            visitedOn: v.visited_on,
            note: v.note,
            createdAt: v.created_at,
            photos: (v.photos ?? [])
                .map((p: RawPhoto) => ({ id: p.id, storagePath: p.storage_path, takenAt: p.taken_at, sortOrder: p.sort_order }))
                .sort((a, b) => a.sortOrder - b.sortOrder)
        }))
    };
}

type RawPhoto = { id: string; storage_path: string; taken_at: string | null; sort_order: number };
type RawVisit = { id: string; visited_on: string; note: string | null; created_at: string; photos: RawPhoto[] | null };

// ─── Mutations (저장 후 편집) ─────────────────────────────────────────────────

/** 핀을 옮기면 카카오 장소와의 연결이 끊기므로 source='manual'로 내려가는 게 자연스럽다(편집기 규칙과 동일). */
export type PlacePatch = { name?: string; lat?: number; lng?: number; source?: 'manual'; kakaoPlaceId?: string | null };

export async function updatePlace(userId: string, placeId: string, patch: PlacePatch): Promise<void> {
    const row: Record<string, unknown> = {};
    if (patch.name !== undefined) row.name = patch.name;
    if (patch.lat !== undefined) row.lat = patch.lat;
    if (patch.lng !== undefined) row.lng = patch.lng;
    if (patch.source !== undefined) row.source = patch.source;
    if (patch.kakaoPlaceId !== undefined) row.kakao_place_id = patch.kakaoPlaceId;
    if (Object.keys(row).length === 0) return;

    const supabase = createSupabaseAdmin();
    const { error } = await supabase.from('places').update(row).eq('id', placeId).eq('user_id', userId);
    if (error) throw new Error(error.message);
}

export async function deletePlace(userId: string, placeId: string): Promise<void> {
    const supabase = createSupabaseAdmin();
    const paths = await findPlacePhotoPaths(supabase, userId, placeId);
    const { error } = await supabase.from('places').delete().eq('id', placeId).eq('user_id', userId);
    if (error) throw new Error(error.message);
    await removePhotoObjects(supabase, paths); // row는 CASCADE로 사라지지만 Storage 파일은 직접 정리
}

/** place 하위 모든 사진의 storage_path (삭제 전 정리용) */
async function findPlacePhotoPaths(supabase: SupabaseClient, userId: string, placeId: string): Promise<string[]> {
    const { data: visits, error: ve } = await supabase.from('visits').select('id').eq('user_id', userId).eq('place_id', placeId);
    if (ve) throw new Error(ve.message);
    const visitIds = (visits ?? []).map((v) => v.id);
    if (visitIds.length === 0) return [];

    const { data: photos, error: pe } = await supabase.from('photos').select('storage_path').in('visit_id', visitIds);
    if (pe) throw new Error(pe.message);
    return (photos ?? []).map((p) => p.storage_path);
}
