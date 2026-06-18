'use client';

import { usePlaceMutationsData } from '@/entities/place';

import type { PickedPlace } from '@/shared/kakao-map';
import { toast } from '@/shared/lib';

import { uploadVisitPhotos } from '../lib/upload-visit-photos';

const FAIL = () => toast('변경에 실패했어요. 다시 시도해주세요', 'danger');

/**
 * 저장 후 편집 액션 묶음 — 장소 상세에서 이름·핀·방문·사진을 고친다.
 * entities/place mutation을 placeId에 묶어 의도 단위 액션으로 노출한다(시트·토글 UI는 화면이 가짐).
 */
export function useMemoryEditor(userId: string | null, placeId: string) {
    const m = usePlaceMutationsData(userId);

    const isMutating =
        m.modifyPlace.isPending ||
        m.removePlace.isPending ||
        m.addVisit.isPending ||
        m.modifyVisit.isPending ||
        m.removeVisit.isPending ||
        m.addPhotos.isPending ||
        m.removePhoto.isPending;

    return {
        isMutating,
        renamePlace: (name: string) => m.modifyPlace.mutate({ placeId, patch: { name } }, { onError: FAIL }),
        // 카카오 검색/지도에서 고른 장소로 통째 교체 — 이름·좌표·출처·kakaoId를 함께 갱신한다.
        changePlace: (picked: PickedPlace) =>
            m.modifyPlace.mutate(
                { placeId, patch: { name: picked.name, lat: picked.lat, lng: picked.lng, source: picked.source, kakaoPlaceId: picked.kakaoPlaceId } },
                { onError: FAIL }
            ),
        removePlace: (onSuccess: () => void) => m.removePlace.mutate({ placeId }, { onSuccess, onError: FAIL }),
        addVisit: (visitedOn: string) => m.addVisit.mutate({ placeId, input: { visitedOn, note: null } }, { onError: FAIL }),
        editVisitDate: (visitId: string, visitedOn: string) => m.modifyVisit.mutate({ placeId, visitId, patch: { visitedOn } }, { onError: FAIL }),
        editVisitNote: (visitId: string, note: string) => m.modifyVisit.mutate({ placeId, visitId, patch: { note: note.trim() || null } }, { onError: FAIL }),
        removeVisit: (visitId: string) => m.removeVisit.mutate({ placeId, visitId }, { onError: FAIL }),
        removePhoto: (photoId: string) => m.removePhoto.mutate({ placeId, photoId }, { onError: FAIL }),
        addPhotos: async (visitId: string, files: File[]): Promise<void> => {
            if (!userId || files.length === 0) return;
            try {
                const photos = await uploadVisitPhotos(userId, visitId, files);
                m.addPhotos.mutate({ placeId, visitId, photos }, { onError: FAIL });
            } catch {
                FAIL();
            }
        }
    };
}
