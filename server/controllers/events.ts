import { insertEvent } from '../dao/events';

/**
 * 순수 되새김 세션 기록 (PRD §2.6 / F-9) — 기록 없이 지도를 열어 둘러본 사건.
 * NSM의 절반(가치 전달)을 측정하는 핵심 신호.
 */
export async function recordRecallSession(userId: string): Promise<void> {
    await insertEvent(userId, 'recall_session');
}
