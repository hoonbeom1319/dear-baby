import { useEffect } from 'react';

import type { Session } from '@supabase/supabase-js';

import { useStorageState } from '@/shared/hooks';
import { getSupabaseBrowser } from '@/shared/lib';

import { useAuth } from './store';

export function useAuthSession() {
    const [recentProvider, setRecentProvider] = useStorageState<'kakao' | 'naver'>('recent_login_provider', 'kakao');

    useEffect(() => {
        const supabase = getSupabaseBrowser();

        // OAuth 콜백이 user_metadata.full_name/avatar_url을 심는다(profiles 트리거와 같은 키).
        const applySession = (session: Session) => {
            const meta = session.user.user_metadata ?? {};
            useAuth.setState({
                loggedIn: true,
                userId: session.user.id,
                displayName: typeof meta.full_name === 'string' && meta.full_name ? meta.full_name : null,
                avatarUrl: typeof meta.avatar_url === 'string' && meta.avatar_url ? meta.avatar_url : null
            });
        };

        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) applySession(session);
        });

        const {
            data: { subscription }
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                applySession(session);
                const p = session.user.user_metadata?.provider;
                setRecentProvider(p === 'naver' ? 'naver' : 'kakao');
            } else {
                useAuth.setState({ loggedIn: false, userId: null, displayName: null, avatarUrl: null });
            }
        });

        return () => subscription.unsubscribe();
    }, [setRecentProvider]);

    return { recentProvider };
}
