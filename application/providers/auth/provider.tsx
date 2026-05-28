'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { LoginSheet } from '@/features/login';

import { getSupabaseBrowser } from '@/shared/lib';

type AuthContextValue = {
    loggedIn: boolean;
    userId: string | null;
    openLogin: () => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = (): AuthContextValue => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
    return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [loginOpen, setLoginOpen] = useState(false);

    useEffect(() => {
        const supabase = getSupabaseBrowser();

        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setUserId(session.user.id);
                setLoggedIn(true);
            }
        });

        const {
            data: { subscription }
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setUserId(session.user.id);
                setLoggedIn(true);
            } else {
                setUserId(null);
                setLoggedIn(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const openLogin = useCallback(() => setLoginOpen(true), []);
    const logout = useCallback(async () => {
        const supabase = getSupabaseBrowser();
        await supabase.auth.signOut();
    }, []);

    const value = useMemo<AuthContextValue>(() => ({ loggedIn, userId, openLogin, logout }), [loggedIn, userId, openLogin, logout]);

    return (
        <AuthContext.Provider value={value}>
            {children}
            <LoginSheet open={loginOpen} onOpenChange={(open) => !open && setLoginOpen(false)} onComplete={() => {}} />
        </AuthContext.Provider>
    );
};
