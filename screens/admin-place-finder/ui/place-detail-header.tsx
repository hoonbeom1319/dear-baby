import type { KakaoSearchPlace } from '@/features/kakao-place-map';

import { stripHtml } from '@/shared/lib';

export function PlaceDetailHeader({ place, onBack }: { place: KakaoSearchPlace; onBack: () => void }) {
    return (
        <>
            <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-1.5 border-b border-border px-4 py-2.5 text-[13px] font-medium text-muted transition-colors hover:bg-neutral-50"
            >
                ← 결과 목록
            </button>

            <div className="border-b border-border px-4 py-4">
                <div className="mb-1 flex items-center gap-2">
                    <span className="text-[16px] font-bold text-surface-foreground">{stripHtml(place.title)}</span>
                    <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-muted">{place.category.split('>').pop()}</span>
                </div>
                <p className="text-[13px] text-muted">{place.roadAddress || place.address}</p>
                {place.telephone && <p className="mt-0.5 text-[12.5px] text-muted">{place.telephone}</p>}
                {place.link && (
                    <a
                        href={place.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-[12px] text-primary-600 hover:underline"
                    >
                        네이버 지도에서 보기 ↗
                    </a>
                )}
            </div>
        </>
    );
}
