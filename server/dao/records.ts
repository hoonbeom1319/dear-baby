import { createSupabaseAdmin } from '../db/supabase';

// 기록 세션 입력 — 클라이언트(편집기)가 보내는 한 장소 그룹
export type RecordPhotoInput = {
    storagePath: string; // 브라우저가 Storage에 먼저 업로드한 경로
    takenAt: string | null; // EXIF 촬영시각 (ISO) — 없으면 null
    sortOrder: number;
};

export type RecordGroupInput = {
    name: string;
    lat: number;
    lng: number;
    source: 'kakao' | 'manual';
    kakaoPlaceId: string | null;
    visitedOn: string; // YYYY-MM-DD
    note: string | null;
    photos: RecordPhotoInput[];
};

/**
 * create_record_session RPC 호출 — Place/Visit/Photo + pin_created 이벤트를
 * 한 트랜잭션으로 생성한다. 반환값은 생성된 place id 배열.
 */
export async function insertRecordSession(userId: string, groups: RecordGroupInput[]): Promise<string[]> {
    const supabase = createSupabaseAdmin();
    const payload = groups.map((g) => ({
        name: g.name,
        lat: g.lat,
        lng: g.lng,
        source: g.source,
        kakao_place_id: g.kakaoPlaceId,
        visited_on: g.visitedOn,
        note: g.note,
        photos: g.photos.map((p) => ({ storage_path: p.storagePath, taken_at: p.takenAt, sort_order: p.sortOrder }))
    }));

    const { data, error } = await supabase.rpc('create_record_session', { p_user_id: userId, p_groups: payload });
    if (error) throw new Error(error.message);
    return (data ?? []) as string[];
}
