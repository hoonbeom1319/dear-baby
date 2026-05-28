'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { getSupabaseBrowser, toast } from '@/shared/lib';

import { useAuth } from './auth/provider';

type FavoriteContextValue = {
    favoriteIds: string[];
    isFavorite: (placeId: string) => boolean;
    toggleFavorite: (placeId: string) => void;
};

const FavoriteContext = createContext<FavoriteContextValue | null>(null);

export const useFavorite = (): FavoriteContextValue => {
    const ctx = useContext(FavoriteContext);
    if (!ctx) throw new Error('useFavorite must be used within <FavoriteProvider>');
    return ctx;
};

export const FavoriteProvider = ({ children }: { children: ReactNode }) => {
    const { userId, openLogin } = useAuth();
    const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
    const isInitialLoad = useRef(true);

    useEffect(() => {
        if (!userId) {
            setFavoriteIds([]);
            isInitialLoad.current = true;
            return;
        }

        const supabase = getSupabaseBrowser();

        const loadFavorites = async () => {
            const { data } = await supabase.from('favorites').select('place_id').eq('user_id', userId).order('created_at', { ascending: false });
            if (data) setFavoriteIds(data.map((r) => r.place_id as string));
        };

        const pending = typeof window !== 'undefined' ? sessionStorage.getItem('pending_fav') : null;

        if (pending) {
            sessionStorage.removeItem('pending_fav');
            supabase
                .from('favorites')
                .insert({ user_id: userId, place_id: pending })
                .then(() => loadFavorites())
                .then(() => toast('로그인 완료 · 즐겨찾기에 추가했어요'));
        } else {
            loadFavorites();
            if (!isInitialLoad.current) {
                toast('로그인 완료');
            }
        }

        isInitialLoad.current = false;
    }, [userId]);

    const isFavorite = useCallback((placeId: string) => favoriteIds.includes(placeId), [favoriteIds]);

    const toggleFavorite = useCallback(
        async (placeId: string) => {
            if (!userId) {
                if (typeof window !== 'undefined') sessionStorage.setItem('pending_fav', placeId);
                openLogin();
                return;
            }

            const supabase = getSupabaseBrowser();
            const adding = !favoriteIds.includes(placeId);

            // 낙관적 업데이트
            setFavoriteIds((prev) => (adding ? [placeId, ...prev] : prev.filter((id) => id !== placeId)));
            toast(adding ? '즐겨찾기에 추가했어요' : '즐겨찾기에서 뺐어요');

            if (adding) {
                await supabase.from('favorites').insert({ user_id: userId, place_id: placeId });
            } else {
                await supabase.from('favorites').delete().eq('user_id', userId).eq('place_id', placeId);
            }
        },
        [userId, favoriteIds, openLogin, toast]
    );

    const value = useMemo<FavoriteContextValue>(
        () => ({ favoriteIds, isFavorite, toggleFavorite }),
        [favoriteIds, isFavorite, toggleFavorite]
    );

    return <FavoriteContext.Provider value={value}>{children}</FavoriteContext.Provider>;
};
