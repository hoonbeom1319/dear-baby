import { useCallback, useEffect } from 'react';

import { toast } from '@/shared/lib';

import { useFavoriteData } from './use-favorite-data';

type Options = {
    onRequestLogin: () => void;
};

export function useFavorite(userId: string | null, { onRequestLogin }: Options) {
    const { favoriteIds, add, remove } = useFavoriteData(userId);

    // 로그인 전 즐겨찾기 시도 → 로그인 후 자동 복원
    useEffect(() => {
        if (!userId) return;
        const pending = sessionStorage.getItem('pending_fav');
        if (!pending) return;
        sessionStorage.removeItem('pending_fav');
        add.mutate(pending, { onSuccess: () => toast('로그인 완료 · 즐겨찾기에 추가했어요') });
        // add.mutate는 React Query 내부에서 useCallback으로 안정화되어 있음
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    const isFavorite = useCallback((placeId: string) => favoriteIds.includes(placeId), [favoriteIds]);

    const toggleFavorite = useCallback(
        (placeId: string) => {
            if (!userId) {
                sessionStorage.setItem('pending_fav', placeId);
                onRequestLogin();
                return;
            }
            if (favoriteIds.includes(placeId)) {
                remove.mutate(placeId, { onSuccess: () => toast('즐겨찾기에서 뺐어요') });
            } else {
                add.mutate(placeId, { onSuccess: () => toast('즐겨찾기에 추가했어요') });
            }
        },
        [userId, favoriteIds, add, remove, onRequestLogin]
    );

    return { favoriteIds, isFavorite, toggleFavorite };
}
