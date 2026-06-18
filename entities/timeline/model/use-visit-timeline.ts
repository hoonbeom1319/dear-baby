import { useQuery } from '@tanstack/react-query';

import { timelineQueries } from '../factory';

/** 홈 날짜별 타임라인 — 사용자의 모든 방문 (raw data). enabled로 시트 열림에 맞춰 조회. */
export function useVisitTimeline(userId: string | null, enabled = true) {
    const query = useQuery(timelineQueries.feed(userId, enabled));
    return {
        visits: query.data?.visits ?? [],
        isLoading: query.isLoading,
        isError: query.isError
    };
}
