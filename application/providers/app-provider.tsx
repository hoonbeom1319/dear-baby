'use client';

import { useState, type ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { InstallPrompt } from '@/features/install-prompt';

import { NavigationProgress, ToastProvider } from '@/shared/ui';

import { AuthProvider } from './auth/provider';

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>{children}</AuthProvider>
            <ToastProvider />
            <NavigationProgress />
            <InstallPrompt />
        </QueryClientProvider>
    );
};
