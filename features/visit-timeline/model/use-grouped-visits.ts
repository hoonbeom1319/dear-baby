import { useMemo } from 'react';

import type { TimelineVisit } from '@/entities/timeline';

import { formatVisitDateLong } from '@/shared/lib';

export type VisitDateGroup = { date: string; label: string; visits: TimelineVisit[] };

/**
 * 서버가 이미 visited_on 내림차순으로 주므로, 순서를 유지하며 연속한 같은 날짜끼리 묶는다.
 * (정렬을 다시 하지 않아 O(n).)
 */
export function useGroupedVisits(visits: TimelineVisit[]): VisitDateGroup[] {
    return useMemo(() => {
        const groups: VisitDateGroup[] = [];
        for (const visit of visits) {
            const last = groups[groups.length - 1];
            if (last && last.date === visit.visitedOn) last.visits.push(visit);
            else groups.push({ date: visit.visitedOn, label: formatVisitDateLong(visit.visitedOn), visits: [visit] });
        }
        return groups;
    }, [visits]);
}
