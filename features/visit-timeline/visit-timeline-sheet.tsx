'use client';

import { useVisitTimeline } from '@/entities/timeline';

import { Sheet } from '@/hbds/overlay/sheet';

import { useGroupedVisits } from './model/use-grouped-visits';
import { TimelineGroup } from './ui/timeline-group';

type VisitTimelineSheetProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userId: string | null;
    onSelectPlace: (placeId: string) => void;
};

/**
 * 홈 날짜별 기록 바텀시트 — 핀 중첩으로 지도에서 고르기 어려운 방문을 날짜순 리스트로 본다.
 * 시트가 열릴 때만 조회하고(useVisitTimeline enabled), 행을 누르면 시트를 닫고 장소 상세로 보낸다.
 */
export function VisitTimelineSheet({ open, onOpenChange, userId, onSelectPlace }: VisitTimelineSheetProps) {
    const { visits, isLoading } = useVisitTimeline(userId, open);
    const groups = useGroupedVisits(visits);

    const select = (placeId: string) => {
        onOpenChange(false);
        onSelectPlace(placeId);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange} title="날짜별 기록">
            <div className="-mx-1 max-h-[68vh] overflow-y-auto overscroll-contain pb-2">
                {isLoading ? (
                    <p className="py-12 text-center text-[14px] text-muted">불러오는 중…</p>
                ) : groups.length === 0 ? (
                    <p className="py-12 text-center text-[14px] text-muted">아직 기록이 없어요</p>
                ) : (
                    groups.map((group) => <TimelineGroup key={group.date} group={group} onSelect={select} />)
                )}
            </div>
        </Sheet>
    );
}
