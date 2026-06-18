import { create } from 'zustand';

import { getSupabaseBrowser } from '@/shared/lib';

type AuthStore = {
    loggedIn: boolean;
    userId: string | null;
    /** OAuth user_metadata에서 온 표시용 프로필 (계정 시트). profiles 테이블과 같은 출처. */
    displayName: string | null;
    avatarUrl: string | null;
    loginOpen: boolean;
    openLogin: () => void;
    closeLogin: () => void;
    logout: () => Promise<void>;
};

export const useAuth = create<AuthStore>((set) => ({
    loggedIn: false,
    userId: null,
    displayName: null,
    avatarUrl: null,
    loginOpen: false,
    openLogin: () => set({ loginOpen: true }),
    closeLogin: () => set({ loginOpen: false }),
    logout: async () => {
        await getSupabaseBrowser().auth.signOut();
    }
}));
