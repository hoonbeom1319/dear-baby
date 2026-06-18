import type { RecordPhotoInput } from '@/entities/place';

import { getSupabaseBrowser } from '@/shared/lib';

const BUCKET = 'photos';

// 파일명에 한글·공백이 섞이면 Storage 키가 깨질 수 있어 보수적으로 치환(upload-photos.ts와 동일 규칙).
const safeName = (name: string): string => name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-60) || 'photo';

/**
 * 기존 방문에 추가할 사진을 Storage에 올리고 RecordPhotoInput[]으로 만든다.
 * 폴더 = visitId (visit이 이미 있으므로 의도된 경로 `{userId}/{visitId}/...`. RLS는 첫 폴더=uid).
 * sortOrder는 0-based로 두고, 절대 순서는 서버(addPhotos)가 기존 max 뒤로 재배치한다.
 */
export async function uploadVisitPhotos(userId: string, visitId: string, files: File[]): Promise<RecordPhotoInput[]> {
    const supabase = getSupabaseBrowser();
    return Promise.all(
        files.map(async (file, i): Promise<RecordPhotoInput> => {
            const path = `${userId}/${visitId}/${crypto.randomUUID()}-${safeName(file.name)}`;
            const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type, upsert: false });
            if (error) throw new Error(`사진 업로드 실패: ${error.message}`);
            return { storagePath: path, takenAt: null, sortOrder: i };
        })
    );
}
