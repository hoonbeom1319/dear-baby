import type { RecordGroupInput, RecordPhotoInput } from '@/entities/place';

import { getSupabaseBrowser } from '@/shared/lib';

import type { EditorGroup } from '../model/use-editor-draft';

const BUCKET = 'photos';

// 파일명에 한글·공백이 섞이면 Storage 키가 깨질 수 있어 보수적으로 치환.
const safeName = (name: string): string => name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-60) || 'photo';

/**
 * 한 그룹의 사진을 Storage('photos' 버킷)에 올리고 RecordPhotoInput으로 만든다.
 * 경로 = `{userId}/{folder}/...` — Storage RLS가 첫 폴더 = 본인 uid를 요구한다(visit_id는 아직 없음).
 */
async function uploadGroupPhotos(userId: string, group: EditorGroup): Promise<RecordPhotoInput[]> {
    const supabase = getSupabaseBrowser();
    const folder = crypto.randomUUID();

    return Promise.all(
        group.photos.map(async (photo, i): Promise<RecordPhotoInput> => {
            const path = `${userId}/${folder}/${i}-${safeName(photo.file.name)}`;
            const { error } = await supabase.storage.from(BUCKET).upload(path, photo.file, { contentType: photo.file.type, upsert: false });
            if (error) throw new Error(`사진 업로드 실패: ${error.message}`);
            return { storagePath: path, takenAt: photo.takenAt ? photo.takenAt.toISOString() : null, sortOrder: i };
        })
    );
}

/**
 * 저장 가능한 그룹들의 사진을 모두 업로드한 뒤 기록 생성 입력(RecordGroupInput[])으로 변환한다.
 * 호출부에서 이 결과를 useCreateRecordData에 넘겨 Place/Visit/Photo를 한 번에 만든다.
 */
export async function buildRecordInput(userId: string, groups: EditorGroup[], visitedOn: string): Promise<RecordGroupInput[]> {
    return Promise.all(
        groups.map(async (group): Promise<RecordGroupInput> => ({
            name: group.name.trim(),
            lat: group.lat,
            lng: group.lng,
            source: group.source,
            kakaoPlaceId: group.kakaoPlaceId,
            visitedOn,
            note: group.note.trim() || null,
            photos: await uploadGroupPhotos(userId, group)
        }))
    );
}
