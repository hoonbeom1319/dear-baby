'use client';

import type { ReactNode } from 'react';

import { ToastProvider } from '@/shared/ui';

import { AuthProvider } from './auth/provider';
import { FavoriteProvider } from './favorite-provider';

export const AppProvider = ({ children }: { children: ReactNode }) => (
    <>
        <AuthProvider>
            <FavoriteProvider>
                {children}
            </FavoriteProvider>
        </AuthProvider>
        <ToastProvider />
    </>
);
