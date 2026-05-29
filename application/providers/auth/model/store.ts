import { create } from 'zustand';

import { getSupabaseBrowser } from '@/shared/lib';

type AuthStore = {
    loggedIn: boolean;
    userId: string | null;
    loginOpen: boolean;
    openLogin: () => void;
    closeLogin: () => void;
    logout: () => Promise<void>;
};

export const useAuth = create<AuthStore>((set) => ({
    loggedIn: false,
    userId: null,
    loginOpen: false,
    openLogin: () => set({ loginOpen: true }),
    closeLogin: () => set({ loginOpen: false }),
    logout: async () => {
        await getSupabaseBrowser().auth.signOut();
    }
}));
