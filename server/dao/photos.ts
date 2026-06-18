import { createSupabaseAdmin } from '../db/supabase';
import { NotFoundError } from '../lib/error';
import { removePhotoObjects } from '../lib/storage';

import type { RecordPhotoInput } from './records';

export type { RecordPhotoInput };

/** visit의 현재 최대 sort_order. 사진 추가 시 그 다음 값부터 채번한다. 없으면 -1(→ 첫 사진 0). */
export async function findMaxSortOrder(userId: string, visitId: string): Promise<number> {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
        .from('photos')
        .select('sort_order')
        .eq('user_id', userId)
        .eq('visit_id', visitId)
        .order('sort_order', { ascending: false })
        .limit(1)
        .maybeSingle();
    if (error) throw new Error(error.message);
    return data?.sort_order ?? -1;
}

/** 기존 visit에 사진 추가. 브라우저가 Storage 업로드를 마친 경로만 받는다. sort_order는 호출부가 채워 넘김. */
export async function insertPhotos(userId: string, visitId: string, photos: RecordPhotoInput[]): Promise<void> {
    if (photos.length === 0) return;
    const supabase = createSupabaseAdmin();

    const { data: visit, error: ve } = await supabase.from('visits').select('id').eq('id', visitId).eq('user_id', userId).maybeSingle();
    if (ve) throw new Error(ve.message);
    if (!visit) throw new NotFoundError();

    const rows = photos.map((p) => ({
        user_id: userId,
        visit_id: visitId,
        storage_path: p.storagePath,
        taken_at: p.takenAt,
        sort_order: p.sortOrder
    }));
    const { error } = await supabase.from('photos').insert(rows);
    if (error) throw new Error(error.message);
}

export async function deletePhoto(userId: string, photoId: string): Promise<void> {
    const supabase = createSupabaseAdmin();
    const { data, error: se } = await supabase.from('photos').select('storage_path').eq('id', photoId).eq('user_id', userId).maybeSingle();
    if (se) throw new Error(se.message);

    const { error } = await supabase.from('photos').delete().eq('id', photoId).eq('user_id', userId);
    if (error) throw new Error(error.message);
    if (data?.storage_path) await removePhotoObjects(supabase, [data.storage_path]);
}
