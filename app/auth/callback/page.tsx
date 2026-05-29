'use client';

import { Suspense, useEffect } from 'react';

import type { EmailOtpType } from '@supabase/supabase-js';
import { useRouter, useSearchParams } from 'next/navigation';

import { getSupabaseBrowser } from '@/shared/lib';

function CallbackInner() {
    const router = useRouter();
    const params = useSearchParams();

    useEffect(() => {
        const supabase = getSupabaseBrowser();
        const code = params.get('code');
        const tokenHash = params.get('token_hash');
        const type = params.get('type');

        if (code) {
            // 카카오 OAuth PKCE 콜백
            supabase.auth.exchangeCodeForSession(code).finally(() => router.replace('/'));
        } else if (tokenHash && type) {
            // 네이버 커스텀 OAuth — signup 또는 magiclink(email) 타입
            supabase.auth.verifyOtp({ token_hash: tokenHash, type: type as EmailOtpType }).finally(() => router.replace('/'));
        } else {
            router.replace('/');
        }
    }, [params, router]);

    return <div className="flex min-h-dvh items-center justify-center text-[15px] text-muted">로그인 처리 중…</div>;
}

export default function AuthCallbackPage() {
    return (
        <Suspense>
            <CallbackInner />
        </Suspense>
    );
}
