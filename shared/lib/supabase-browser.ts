import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let instance: SupabaseClient | null = null;

/**
 * 브라우저 전용 Supabase 클라이언트 (싱글턴).
 * - localStorage에 세션 유지 (기본값)
 * - Auth onAuthStateChange에 구독 가능
 * - 서버 컴포넌트/서버 액션에서는 server/db/supabase.ts를 사용한다.
 */
export function getSupabaseBrowser(): SupabaseClient {
    if (!instance) {
        instance = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
    }
    return instance;
}
