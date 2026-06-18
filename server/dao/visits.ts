import type { SupabaseClient } from '@supabase/supabase-js';

import { createSupabaseAdmin } from '../db/supabase';
import { NotFoundError } from '../lib/error';
import { removePhotoObjects } from '../lib/storage';

export type VisitPatch = { visitedOn?: string; note?: string | null };

/** 홈 날짜별 리스트 한 항목 — 방문 + 소속 장소명 + 대표 사진(storagePath). 서명은 controller 몫. */
export type VisitFeedItem = {
    id: string;
    visitedOn: string;
    note: string | null;
    placeId: string;
    placeName: string;
    photoCount: number;
    thumbnailPath: string | null;
};

type RawFeedVisit = {
    id: string;
    visited_on: string;
    note: string | null;
    // FK(visits.place_id → places)는 to-one이라 객체로 오지만, PostgREST가 배열로 줄 때를 방어.
    place: { id: string; name: string } | { id: string; name: string }[] | null;
    photos: { storage_path: string; sort_order: number }[] | null;
};

/**
 * 사용자의 모든 방문을 날짜 내림차순으로 — 홈 날짜별 타임라인용. (visits_user_visited_idx 활용)
 * 같은 날은 created_at 내림차순(최근 기록 먼저). 대표 썸네일은 sort_order 최소 사진.
 */
export async function findVisitFeed(userId: string): Promise<VisitFeedItem[]> {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
        .from('visits')
        .select('id, visited_on, note, place:places(id, name), photos(storage_path, sort_order)')
        .eq('user_id', userId)
        .order('visited_on', { ascending: false })
        .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);

    return (data ?? []).map((row: RawFeedVisit) => {
        const place = Array.isArray(row.place) ? row.place[0] : row.place;
        const photos = [...(row.photos ?? [])].sort((a, b) => a.sort_order - b.sort_order);
        return {
            id: row.id,
            visitedOn: row.visited_on,
            note: row.note,
            placeId: place?.id ?? '',
            placeName: place?.name ?? '',
            photoCount: photos.length,
            thumbnailPath: photos[0]?.storage_path ?? null
        };
    });
}

export async function updateVisit(userId: string, visitId: string, patch: VisitPatch): Promise<void> {
    const row: Record<string, unknown> = {};
    if (patch.visitedOn !== undefined) row.visited_on = patch.visitedOn;
    if (patch.note !== undefined) row.note = patch.note;
    if (Object.keys(row).length === 0) return;

    const supabase = createSupabaseAdmin();
    const { error } = await supabase.from('visits').update(row).eq('id', visitId).eq('user_id', userId);
    if (error) throw new Error(error.message);
}

/** 기존 장소에 빈 방문 추가(다른 날 방문 — 사진은 이후 addPhotos로). 생성된 visit id 반환. */
export async function insertVisit(userId: string, placeId: string, visitedOn: string, note: string | null): Promise<string> {
    const supabase = createSupabaseAdmin();
    // 남의 장소에 내 방문이 붙는 무결성 깨짐을 막는다(admin client라 RLS 우회 → 직접 검증).
    const { data: place, error: pe } = await supabase.from('places').select('id').eq('id', placeId).eq('user_id', userId).maybeSingle();
    if (pe) throw new Error(pe.message);
    if (!place) throw new NotFoundError();

    const { data, error } = await supabase
        .from('visits')
        .insert({ user_id: userId, place_id: placeId, visited_on: visitedOn, note })
        .select('id')
        .single();
    if (error) throw new Error(error.message);
    return data.id as string;
}

export async function deleteVisit(userId: string, visitId: string): Promise<void> {
    const supabase = createSupabaseAdmin();
    const paths = await findVisitPhotoPaths(supabase, userId, visitId);
    const { error } = await supabase.from('visits').delete().eq('id', visitId).eq('user_id', userId);
    if (error) throw new Error(error.message);
    await removePhotoObjects(supabase, paths);
}

/** visit 하위 모든 사진의 storage_path (삭제 전 정리용) */
async function findVisitPhotoPaths(supabase: SupabaseClient, userId: string, visitId: string): Promise<string[]> {
    const { data, error } = await supabase.from('photos').select('storage_path').eq('user_id', userId).eq('visit_id', visitId);
    if (error) throw new Error(error.message);
    return (data ?? []).map((p) => p.storage_path);
}
