import { createSupabaseAdmin } from '../db/supabase';

const SIGNED_URL_TTL = 60 * 60; // 1시간

/**
 * private 'photos' 버킷의 storagePath들을 한 번에 서명 URL로 변환한다.
 * path→signedUrl Map 반환(서명 실패한 항목은 빠짐). 호출부에서 get으로 매핑한다.
 * 장소 상세·타임라인 등 사진을 보여주는 모든 조회가 공유한다.
 */
export async function signPhotoPaths(paths: string[]): Promise<Map<string, string>> {
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
