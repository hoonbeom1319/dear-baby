import { getAuthHeaders } from '@/shared/api';

import { FETCH } from '@/hbw/api';

export type LogEventResponse = { ok: true };

/** 순수 되새김 세션 기록 (기록 없이 지도만 열어본 사건) */
export const LogRecallSession = async (): Promise<LogEventResponse> => {
    const headers = await getAuthHeaders();
    return FETCH<LogEventResponse>('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ type: 'recall_session' })
    });
};
