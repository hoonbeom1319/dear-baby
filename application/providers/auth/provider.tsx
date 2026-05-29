'use client';

import { type ReactNode } from 'react';

import { LoginSheet } from '@/features/login';

import { useAuth } from './model/store';
import { useAuthSession } from './model/use-auth-session';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { recentProvider } = useAuthSession();
    const loginOpen = useAuth((s) => s.loginOpen);
    const closeLogin = useAuth((s) => s.closeLogin);

    return (
        <>
            {children}
            <LoginSheet open={loginOpen} onOpenChange={(open) => !open && closeLogin()} onComplete={() => {}} recent={recentProvider} />
        </>
    );
};
