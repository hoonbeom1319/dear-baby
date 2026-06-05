import type { KakaoSearchPlace } from '@/features/kakao-place-map';

import { stripHtml } from '@/shared/lib';
import { Icon } from '@/shared/ui';

export function ResultsList({
    results,
    pendingQuery,
    onSelect
}: {
    results: KakaoSearchPlace[];
    pendingQuery: string | null;
    onSelect: (place: KakaoSearchPlace) => void;
}) {
    if (pendingQuery) return <div className="flex flex-1 items-center justify-center py-20 text-[13px] text-muted">검색 중…</div>;

    if (results.length === 0)
        return (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
                <Icon name="search" size={28} />
                <p className="mt-1 text-[13.5px] font-medium text-surface-foreground">검색으로 장소를 찾아보세요</p>
                <p className="text-[12.5px] text-muted">강남 카페, 잠실 뷔페, 영등포 식당 …</p>
            </div>
        );

    return (
        <div className="flex flex-col">
            <div className="border-b border-border px-4 py-2 text-[12px] text-muted">{results.length}개 결과</div>
            {results.map((place, i) => (
                <button
                    key={i}
                    type="button"
                    onClick={() => onSelect(place)}
                    className="flex flex-col gap-1 border-b border-border px-4 py-3 text-left transition-colors hover:bg-neutral-50"
                >
                    <div className="flex items-center gap-2">
                        <span className="text-[13.5px] font-semibold text-surface-foreground">{stripHtml(place.title)}</span>
                        <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-muted">{place.category.split('>').pop()}</span>
                    </div>
                    <span className="text-[12.5px] text-muted">{place.roadAddress || place.address}</span>
                    {place.telephone && <span className="text-[12px] text-muted">{place.telephone}</span>}
                </button>
            ))}
        </div>
    );
}
