import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// 인증이 필요한 API 경로 목록 — 새 보호 라우트 추가 시 여기에만 추가
const PROTECTED_API_PREFIXES: string[] = ['/api/places', '/api/records', '/api/events'];

function isProtectedApi(pathname: string) {
    return PROTECTED_API_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

async function verifyAuth(request: NextRequest): Promise<string | null> {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) return null;

    // auth.getUser()는 단순 HTTP 검증이므로 anon 키로 충분 (Edge 호환)
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
        auth: { persistSession: false, autoRefreshToken: false }
    });
    const {
        data: { user }
    } = await supabase.auth.getUser(token);
    return user?.id ?? null;
}

// Kakao/Naver OAuth는 서버 사이드 redirect이므로 CSP 대상 아님
const CSP = [
    "default-src 'self'",
    // Next.js 하이드레이션 인라인 스크립트 허용
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' dapi.kakao.com *.daumcdn.net",
    // Tailwind/Next.js 인라인 스타일 허용
    "style-src 'self' 'unsafe-inline'",
    // Supabase Storage + 카카오맵 타일/마커
    "img-src 'self' data: blob: *.supabase.co *.daumcdn.net *.kakao.com",
    // 로컬 폰트(Pretendard woff2)
    "font-src 'self'",
    // Supabase + 카카오맵 API
    "connect-src 'self' *.supabase.co dapi.kakao.com *.kakao.com",
    // PWA 서비스 워커
    "worker-src 'self'",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
].join('; ');

function applySecurityHeaders(response: NextResponse): NextResponse {
    response.headers.set('Content-Security-Policy', CSP);
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    return response;
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (isProtectedApi(pathname)) {
        const userId = await verifyAuth(request);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-user-id', userId);
        const response = NextResponse.next({ request: { headers: requestHeaders } });
        return applySecurityHeaders(response);
    }

    return applySecurityHeaders(NextResponse.next());
}

export const config = {
    matcher: [
        // static 파일, 이미지 최적화, favicon 제외한 모든 경로
        '/((?!_next/static|_next/image|favicon\\.ico).*)'
    ]
};
