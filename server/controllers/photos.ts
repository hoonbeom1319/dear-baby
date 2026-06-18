import { deletePhoto, findMaxSortOrder, insertPhotos, type RecordPhotoInput } from '../dao/photos';

export type { RecordPhotoInput };

/**
 * 기존 visit에 사진 추가. sort_order는 현재 최대값 다음부터 채번해 기존 사진 뒤에 붙인다
 * (클라이언트가 보낸 sortOrder는 추가분 내 상대 순서로만 쓰고, 절대값은 서버가 정한다).
 */
export async function addPhotos(userId: string, visitId: string, photos: RecordPhotoInput[]): Promise<void> {
    if (photos.length === 0) return;
    const base = await findMaxSortOrder(userId, visitId);
    const ordered = photos
        .slice()
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((p, i) => ({ ...p, sortOrder: base + 1 + i }));
    return insertPhotos(userId, visitId, ordered);
}

export async function removePhoto(userId: string, photoId: string): Promise<void> {
    return deletePhoto(userId, photoId);
}
