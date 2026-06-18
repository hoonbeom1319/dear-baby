import { queryOptions } from '@tanstack/react-query';

import { GetVisitTimeline } from './api';

export const timelineQueries = {
    all: () => ['timeline'] as const,

    /**
     * 사용자의 모든 방문(날짜순). 시트가 열릴 때만 조회(enabled)하고, staleTime 0으로
     * 열 때마다 최신 방문을 반영한다 — place 쪽 mutation을 cross-import해 무효화하지 않아도 된다.
     */
    feed: (userId: string | null, enabled = true) =>
        queryOptions({
            queryKey: [...timelineQueries.all(), userId],
            queryFn: GetVisitTimeline,
            enabled: !!userId && enabled,
            staleTime: 0
        })
};
