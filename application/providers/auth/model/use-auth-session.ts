import { useEffect } from 'react';

import { useStorageState } from '@/shared/hooks';
import { getSupabaseBrowser } from '@/shared/lib';

import { useAuth } from './store';

export function useAuthSession() {
    const [recentProvider, setRecentProvider] = useStorageState<'kakao' | 'naver'>('recent_login_provider', 'kakao');

    useEffect(() => {
        const supabase = getSupabaseBrowser();

        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                useAuth.setState({ loggedIn: true, userId: session.user.id });
            }
        });

        const {
            data: { subscription }
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                useAuth.setState({ loggedIn: true, userId: session.user.id });
                const p = session.user.user_metadata?.provider;
                setRecentProvider(p === 'naver' ? 'naver' : 'kakao');
            } else {
                useAuth.setState({ loggedIn: false, userId: null });
            }
        });

        return () => subscription.unsubscribe();
    }, [setRecentProvider]);

    return { recentProvider };
}
