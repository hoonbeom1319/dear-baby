import { NextRequest, NextResponse } from 'next/server';

import { createSupabaseAdmin } from '@/server/db/supabase';

type KakaoTokenResponse = { access_token: string; error?: string };
type KakaoUserResponse = {
    id: number;
    properties?: { nickname?: string; profile_image?: string };
    kakao_account?: { email?: string };
};

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

    if (!code) return NextResponse.redirect(siteUrl);

    try {
        // 1. 인가코드 → 액세스 토큰 교환
        const tokenParams: Record<string, string> = {
            grant_type: 'authorization_code',
            client_id: process.env.KAKAO_REST_API_KEY!,
            redirect_uri: `${siteUrl}/api/auth/kakao/callback`,
            code
        };
        if (process.env.KAKAO_CLIENT_SECRET) {
            tokenParams.client_secret = process.env.KAKAO_CLIENT_SECRET;
        }
        const tokenRes = await fetch('https://kauth.kakao.com/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(tokenParams)
        });
        const tokenData = (await tokenRes.json()) as KakaoTokenResponse;
        if (tokenData.error) return NextResponse.redirect(`${siteUrl}/?error=kakao_token&msg=${encodeURIComponent(JSON.stringify(tokenData))}`);

        // 2. 카카오 사용자 정보 조회
        const userRes = await fetch('https://kapi.kakao.com/v2/user/me', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` }
        });
        const kakaoUser = (await userRes.json()) as KakaoUserResponse;

        // 이메일 없이 카카오 ID 기반 가상 이메일 사용
        const email = kakaoUser.kakao_account?.email ?? `kakao${kakaoUser.id}@oauth.dear`;
        const userMeta = {
            full_name: kakaoUser.properties?.nickname ?? '',
            avatar_url: kakaoUser.properties?.profile_image ?? '',
            provider: 'kakao',
            kakao_id: String(kakaoUser.id)
        };

        const supabase = createSupabaseAdmin();

        // 3. 신규 가입 시도
        const signupResult = await supabase.auth.admin.generateLink({
            type: 'signup',
            email,
            password: crypto.randomUUID(),
            options: { data: userMeta, redirectTo: `${siteUrl}/auth/callback` }
        });

        if (!signupResult.error) {
            return NextResponse.redirect(signupResult.data.properties.action_link);
        }

        // 4. 기존 유저 → 매직링크로 로그인
        const isExisting = signupResult.error.message.toLowerCase().includes('already');
        if (!isExisting) {
            return NextResponse.redirect(`${siteUrl}/?error=kakao_signup&msg=${encodeURIComponent(signupResult.error.message)}`);
        }

        const magicResult = await supabase.auth.admin.generateLink({
            type: 'magiclink',
            email,
            options: { redirectTo: `${siteUrl}/auth/callback` }
        });
        if (magicResult.error || !magicResult.data?.properties?.action_link) {
            return NextResponse.redirect(`${siteUrl}/?error=kakao_magic&msg=${encodeURIComponent(magicResult.error?.message ?? 'unknown')}`);
        }

        return NextResponse.redirect(magicResult.data.properties.action_link);
    } catch (e) {
        const msg = e instanceof Error ? e.message : 'unknown';
        return NextResponse.redirect(`${siteUrl}/?error=kakao_exception&msg=${encodeURIComponent(msg)}`);
    }
}
