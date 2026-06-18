'use client';

import type { VisitDateGroup } from '../model/use-grouped-visits';

import { TimelineRow } from './timeline-row';

type TimelineGroupProps = {
    group: VisitDateGroup;
    onSelect: (placeId: string) => void;
};

/** 날짜 헤더 + 그 날의 방문들. */
export function TimelineGroup({ group, onSelect }: TimelineGroupProps) {
    return (
        <section>
            <h3 className="sticky top-0 bg-surface px-2 pt-3 pb-1 text-[13px] font-bold text-muted tabular-nums">{group.label}</h3>
            <div className="flex flex-col">
                {group.visits.map((visit) => (
                    <TimelineRow key={visit.id} visit={visit} onSelect={onSelect} />
                ))}
            </div>
        </section>
    );
}
