import type { SupabaseClient } from '@supabase/supabase-js';

const BUCKET = 'photos';

/**
 * Storage 객체 일괄 삭제. DB의 FK ON DELETE CASCADE는 row만 지우고 Storage 파일은
 * 그대로 남기므로, place/visit/photo 삭제 dao가 경로를 모아 이 헬퍼로 정리한다.
 * (controller의 signPaths와 대칭 — 한쪽은 서명, 한쪽은 삭제.)
 */
export async function removePhotoObjects(supabase: SupabaseClient, paths: string[]): Promise<void> {
    if (paths.length === 0) return;
    const { error } = await supabase.storage.from(BUCKET).remove(paths);
    if (error) throw new Error(error.message);
}
