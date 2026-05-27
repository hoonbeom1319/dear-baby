'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { LoginSheet } from '@/features/login';

import type { Place } from '@/entities/place';

import type { AreaId } from '@/shared/config';
import { getSupabaseBrowser } from '@/shared/lib';
import { Toast } from '@/shared/ui';

type AppContextValue = {
    loggedIn: boolean;
    area: AreaId;
    setArea: (area: AreaId) => void;
    allPlaces: Place[];
    getPlaceById: (id: string) => Place | undefined;
    favoriteIds: string[];
    isFavorite: (placeId: string) => boolean;
    toggleFavorite: (placeId: string) => void;
    openLogin: () => void;
    logout: () => void;
    toast: (message: string) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export const useApp = () => {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used within <AppProvider>');
    return ctx;
};

type AppProviderProps = {
    children: ReactNode;
    initialPlaces: Place[];
};

export const AppProvider = ({ children, initialPlaces }: AppProviderProps) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [area, setArea] = useState<AreaId>('songpa');
    const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
    const [loginOpen, setLoginOpen] = useState(false);
    const [toastMsg, setToastMsg] = useState<string | null>(null);

    // Supabase Auth 구독
    useEffect(() => {
        const supabase = getSupabaseBrowser();

        const loadFavorites = async (uid: string) => {
            const { data } = await supabase
                .from('favorites')
                .select('place_id')
                .eq('user_id', uid)
                .order('created_at', { ascending: false });
            if (data) setFavoriteIds(data.map((r) => r.place_id as string));
        };

        // 기존 세션 확인
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setUserId(session.user.id);
                setLoggedIn(true);
                loadFavorites(session.user.id);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session) {
                const uid = session.user.id;
                setUserId(uid);
                setLoggedIn(true);

                // OAuth 리다이렉트 복귀 후 대기 중 즐겨찾기 처리
                const pending = typeof window !== 'undefined'
                    ? sessionStorage.getItem('pending_fav')
                    : null;

                if (pending) {
                    sessionStorage.removeItem('pending_fav');
                    await supabase.from('favorites').insert({ user_id: uid, place_id: pending });
                    const { data } = await supabase
                        .from('favorites')
                        .select('place_id')
                        .eq('user_id', uid)
                        .order('created_at', { ascending: false });
                    if (data) setFavoriteIds(data.map((r) => r.place_id as string));
                    setToastMsg('로그인 완료 · 즐겨찾기에 추가했어요');
                } else if (event === 'SIGNED_IN') {
                    loadFavorites(uid);
                    setToastMsg('로그인 완료');
                }
            } else {
                setUserId(null);
                setLoggedIn(false);
                setFavoriteIds([]);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (!toastMsg) return;
        const timer = setTimeout(() => setToastMsg(null), 2400);
        return () => clearTimeout(timer);
    }, [toastMsg]);

    const toast = useCallback((message: string) => setToastMsg(message), []);

    const openLogin = useCallback(() => setLoginOpen(true), []);

    const logout = useCallback(async () => {
        const supabase = getSupabaseBrowser();
        await supabase.auth.signOut();
        // onAuthStateChange가 null 세션을 감지해 상태 초기화
    }, []);

    const getPlaceById = useCallback((id: string) => initialPlaces.find((p) => p.id === id), [initialPlaces]);

    const isFavorite = useCallback((placeId: string) => favoriteIds.includes(placeId), [favoriteIds]);

    const toggleFavorite = useCallback(
        async (placeId: string) => {
            if (!userId) {
                if (typeof window !== 'undefined') {
                    sessionStorage.setItem('pending_fav', placeId);
                }
                setLoginOpen(true);
                return;
            }
            const supabase = getSupabaseBrowser();
            const adding = !favoriteIds.includes(placeId);

            // 낙관적 업데이트
            setFavoriteIds((prev) => (adding ? [placeId, ...prev] : prev.filter((id) => id !== placeId)));
            setToastMsg(adding ? '즐겨찾기에 추가했어요' : '즐겨찾기에서 뺐어요');

            if (adding) {
                await supabase.from('favorites').insert({ user_id: userId, place_id: placeId });
            } else {
                await supabase.from('favorites').delete().eq('user_id', userId).eq('place_id', placeId);
            }
        },
        [userId, favoriteIds]
    );

    const value = useMemo<AppContextValue>(
        () => ({ loggedIn, area, setArea, allPlaces: initialPlaces, getPlaceById, favoriteIds, isFavorite, toggleFavorite, openLogin, logout, toast }),
        [loggedIn, area, initialPlaces, getPlaceById, favoriteIds, isFavorite, toggleFavorite, openLogin, logout, toast]
    );

    return (
        <AppContext.Provider value={value}>
            {children}
            <LoginSheet open={loginOpen} onOpenChange={(open) => !open && setLoginOpen(false)} onComplete={() => {}} />
            {toastMsg && <Toast message={toastMsg} />}
        </AppContext.Provider>
    );
};
