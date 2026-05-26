'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { LoginSheet } from '@/features/login';

import type { AreaId } from '@/shared/config';
import { Toast } from '@/shared/ui';

type AppContextValue = {
    loggedIn: boolean;
    /** 마지막으로 본 동네 — 홈/코스 목록이 공유한다. (PRD F-1) */
    area: AreaId;
    setArea: (area: AreaId) => void;
    /** 최근 추가순 (newest first). (PRD F-8) */
    favoriteIds: string[];
    isFavorite: (placeId: string) => boolean;
    /** 비회원이면 로그인 시트를 띄우고, 로그인 후 자동 등록한다. (PRD F-7 · 7.5) */
    toggleFavorite: (placeId: string) => void;
    toast: (message: string) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export const useApp = () => {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used within <AppProvider>');
    return ctx;
};

/**
 * 앱 전역 세션 · 즐겨찾기 · 토스트 store + 로그인 게이트.
 * 즐겨찾기/세션이 화면을 가로질러 일관되게 유지되도록 app 루트에서 한 번 마운트한다.
 *
 * NOTE: 지금은 메모리 상태다. Supabase Auth + favorites 영속은 후속 작업에서 이 store 뒤에 연결한다.
 */
export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [area, setArea] = useState<AreaId>('songpa');
    const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
    const [loginOpen, setLoginOpen] = useState(false);
    const [pendingFav, setPendingFav] = useState<string | null>(null);
    const [toastMsg, setToastMsg] = useState<string | null>(null);

    useEffect(() => {
        if (!toastMsg) return;
        const timer = setTimeout(() => setToastMsg(null), 2400);
        return () => clearTimeout(timer);
    }, [toastMsg]);

    const toast = useCallback((message: string) => setToastMsg(message), []);

    const isFavorite = useCallback((placeId: string) => favoriteIds.includes(placeId), [favoriteIds]);

    const toggleFavorite = useCallback(
        (placeId: string) => {
            if (!loggedIn) {
                setPendingFav(placeId);
                setLoginOpen(true);
                return;
            }
            const adding = !favoriteIds.includes(placeId);
            setFavoriteIds((prev) => (adding ? [placeId, ...prev] : prev.filter((id) => id !== placeId)));
            setToastMsg(adding ? '즐겨찾기에 추가했어요' : '즐겨찾기에서 뺐어요');
        },
        [loggedIn, favoriteIds]
    );

    const completeLogin = useCallback(() => {
        setLoggedIn(true);
        setLoginOpen(false);
        if (pendingFav) {
            const id = pendingFav;
            setFavoriteIds((prev) => (prev.includes(id) ? prev : [id, ...prev]));
            setPendingFav(null);
            setToastMsg('로그인 완료 · 즐겨찾기에 추가했어요');
        } else {
            setToastMsg('로그인 완료');
        }
    }, [pendingFav]);

    const value = useMemo<AppContextValue>(
        () => ({ loggedIn, area, setArea, favoriteIds, isFavorite, toggleFavorite, toast }),
        [loggedIn, area, favoriteIds, isFavorite, toggleFavorite, toast]
    );

    return (
        <AppContext.Provider value={value}>
            {children}
            <LoginSheet open={loginOpen} onOpenChange={(open) => !open && setLoginOpen(false)} onComplete={completeLogin} />
            {toastMsg && <Toast message={toastMsg} />}
        </AppContext.Provider>
    );
};
