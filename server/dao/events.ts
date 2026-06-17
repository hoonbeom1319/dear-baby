import { createSupabaseAdmin } from '../db/supabase';

export type EventType = 'pin_created' | 'recall_session';

/**
 * 행동 로그 기록 (PRD §4.4 F-9 / §2.6).
 * pin_created 는 create_record_session RPC가 직접 남기므로,
 * 클라이언트에서 명시적으로 부르는 것은 recall_session(순수 되새김 세션)이다.
 */
export async function insertEvent(userId: string, type: EventType, meta: Record<string, unknown> = {}): Promise<void> {
    const supabase = createSupabaseAdmin();
    const { error } = await supabase.from('events').insert({ user_id: userId, type, meta });
    if (error) throw new Error(error.message);
}
