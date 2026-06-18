'use client';

import type { TimelineVisit } from '@/entities/timeline';

import { Icon } from '@/shared/ui';

type TimelineRowProps = {
    visit: TimelineVisit;
    onSelect: (placeId: string) => void;
};

/** 타임라인 한 줄 — 대표 썸네일 + 장소명 + 메모/사진수. 탭하면 그 장소 상세로. */
export function TimelineRow({ visit, onSelect }: TimelineRowProps) {
    const subtitle = visit.note?.trim() || (visit.photoCount > 0 ? `사진 ${visit.photoCount}장` : '기록');

    return (
        <button
            type="button"
            onClick={() => onSelect(visit.placeId)}
            className="flex w-full items-center gap-3 rounded-2xl px-2 py-2 text-left transition-colors hover:bg-neutral-50"
        >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-neutral-100 text-neutral-400">
                {visit.thumbnailUrl ? (
                    <img src={visit.thumbnailUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
                ) : (
                    <Icon name="image" size={22} stroke={1.8} />
                )}
            </span>

            <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1 text-[15px] font-bold text-surface-foreground">
                    <Icon name="pin" size={14} stroke={2} className="shrink-0 text-primary-600" />
                    <span className="truncate">{visit.placeName}</span>
                </span>
                <span className="mt-0.5 block truncate text-[13px] text-muted">{subtitle}</span>
            </span>

            <Icon name="right" size={18} className="shrink-0 text-neutral-300" />
        </button>
    );
}
