'use client';

import { useState, type ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { InstallPrompt } from '@/features/install-prompt';

import { NavigationProgress, ToastProvider } from '@/shared/ui';

import { AuthProvider } from './auth/provider';

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    // staleTime: 지도↔상세 왕복(router.back)·창 포커스 복귀마다 /api/places를 다시 받지 않도록.
                    // 핀/방문 변경은 mutation의 invalidate가 즉시 무효화하므로 신선도는 그쪽이 보장한다.
                    queries: { staleTime: 60_000, gcTime: 5 * 60_000, refetchOnWindowFocus: false }
                }
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>{children}</AuthProvider>
            <ToastProvider />
            <NavigationProgress />
            <InstallPrompt />
        </QueryClientProvider>
    );
};
