import { NextResponse } from 'next/server';

export async function GET() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: process.env.KAKAO_REST_API_KEY!,
        redirect_uri: `${siteUrl}/api/auth/kakao/callback`,
        // account_email 제외 — 비즈니스 앱 심사 없이도 동작하는 스코프만 요청
        scope: 'profile_nickname profile_image',
    });
    return NextResponse.redirect(`https://kauth.kakao.com/oauth/authorize?${params}`);
}
