import { getSupabaseBrowser } from '@/shared/lib';

/**
 * BFF(/api/*) 호출 시 Supabase 세션 토큰을 Authorization 헤더로 변환한다.
 * 세션이 없으면 빈 객체를 반환하고, 서버에서 401로 거부된다.
 */
export async function getAuthHeaders(): Promise<HeadersInit> {
    const { data: { session } } = await getSupabaseBrowser().auth.getSession();
    if (!session?.access_token) return {};
    return { Authorization: `Bearer ${session.access_token}` };
}
