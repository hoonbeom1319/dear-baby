import { getAuthHeaders } from '@/shared/api';

import { FETCH } from '@/hbw/api';

import type { TimelineVisit } from './model/types';

export type GetVisitTimelineResponse = { ok: true; visits: TimelineVisit[] };

export const GetVisitTimeline = async (): Promise<GetVisitTimelineResponse> => {
    const headers = await getAuthHeaders();
    return FETCH<GetVisitTimelineResponse>('/api/timeline', { headers });
};
