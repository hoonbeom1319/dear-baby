import { NextResponse } from 'next/server';

export async function GET() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: process.env.NAVER_CLIENT_ID!,
        redirect_uri: `${siteUrl}/api/auth/naver/callback`,
        state: crypto.randomUUID()
    });
    return NextResponse.redirect(`https://nid.naver.com/oauth2.0/authorize?${params}`);
}
