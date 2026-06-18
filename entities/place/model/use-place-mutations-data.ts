import { useMutation, useQueryClient } from '@tanstack/react-query';

import { placeMutations } from '../factory';

/**
 * 저장 후 편집 mutation 묶음 (raw data). 장소 상세에서 이름·핀·방문·사진을 고친다.
 * 각 mutate 입력에 placeId를 함께 넘기면 factory가 해당 detail(+ 필요 시 지도 핀) 캐시를 무효화한다.
 */
export function usePlaceMutationsData(userId: string | null) {
    const queryClient = useQueryClient();
    return {
        modifyPlace: useMutation(placeMutations.modifyPlace(userId, queryClient)),
        removePlace: useMutation(placeMutations.removePlace(userId, queryClient)),
        addVisit: useMutation(placeMutations.addVisit(userId, queryClient)),
        modifyVisit: useMutation(placeMutations.modifyVisit(userId, queryClient)),
        removeVisit: useMutation(placeMutations.removeVisit(userId, queryClient)),
        addPhotos: useMutation(placeMutations.addPhotos(userId, queryClient)),
        removePhoto: useMutation(placeMutations.removePhoto(userId, queryClient))
    };
}
