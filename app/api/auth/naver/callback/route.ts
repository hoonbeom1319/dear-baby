import { NextRequest, NextResponse } from 'next/server';

import { createSupabaseAdmin } from '@/server/db/supabase';

type NaverTokenResponse = { access_token: string; error?: string };
type NaverUserResponse = {
    resultcode: string;
    response: { id: string; email?: string; name?: string; profile_image?: string };
};

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

    if (!code) return NextResponse.redirect(siteUrl);

    try {
        // 1. Naver 인가코드 → 액세스 토큰 교환
        const tokenRes = await fetch('https://nid.naver.com/oauth2.0/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: process.env.NAVER_CLIENT_ID!,
                client_secret: process.env.NAVER_CLIENT_SECRET!,
                code,
                state: searchParams.get('state') ?? ''
            })
        });
        const tokenData = (await tokenRes.json()) as NaverTokenResponse;
        if (tokenData.error) return NextResponse.redirect(`${siteUrl}/?error=naver_token`);

        // 2. Naver 사용자 정보 조회
        const userRes = await fetch('https://openapi.naver.com/v1/nid/me', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` }
        });
        const userData = (await userRes.json()) as NaverUserResponse;
        const naverUser = userData.response;

        if (!naverUser?.email) return NextResponse.redirect(`${siteUrl}/?error=naver_no_email`);

        const supabase = createSupabaseAdmin();
        const userMeta = {
            full_name: naverUser.name ?? '',
            avatar_url: naverUser.profile_image ?? '',
            provider: 'naver',
            naver_id: naverUser.id
        };

        // 3. 신규 가입 시도 (generateLink signup = 유저 생성 + 링크 동시 처리)
        // password는 필수 필드지만 네이버 로그인에선 사용되지 않으므로 랜덤값
        const signupResult = await supabase.auth.admin.generateLink({
            type: 'signup',
            email: naverUser.email,
            password: crypto.randomUUID(),
            options: { data: userMeta, redirectTo: `${siteUrl}/auth/callback` }
        });

        if (!signupResult.error) {
            return NextResponse.redirect(signupResult.data.properties.action_link);
        }

        // 4. 이미 가입된 유저 → 매직링크로 로그인
        const isExisting = signupResult.error.message.toLowerCase().includes('already');
        if (!isExisting) {
            return NextResponse.redirect(`${siteUrl}/?error=signup_failed&msg=${encodeURIComponent(signupResult.error.message)}`);
        }

        const magicResult = await supabase.auth.admin.generateLink({
            type: 'magiclink',
            email: naverUser.email,
            options: { redirectTo: `${siteUrl}/auth/callback` }
        });
        if (magicResult.error || !magicResult.data?.properties?.action_link) {
            return NextResponse.redirect(`${siteUrl}/?error=magic_link&msg=${encodeURIComponent(magicResult.error?.message ?? 'unknown')}`);
        }

        return NextResponse.redirect(magicResult.data.properties.action_link);
    } catch (e) {
        const msg = e instanceof Error ? e.message : 'unknown';
        return NextResponse.redirect(`${siteUrl}/?error=exception&msg=${encodeURIComponent(msg)}`);
    }
}
