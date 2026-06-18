'use client';

import { Skeleton } from '@/hbds/feedback/skeleton';
import { Spinner } from '@/hbds/feedback/spinner';

/**
 * 분석중 상태 — EXIF 파싱 + 역지오코딩이 걸리는 동안. 지친 부모를 빈 화면에 두지 않는다.
 * 실제 소요시간만큼 보이며, 끝나면 편집기 본문이 "이미 채워진 상태"로 바뀐다.
 */
export function AnalyzingState() {
    return (
        <div className="px-4 pt-7">
            <div className="mb-6 flex items-center justify-center gap-2">
                <Spinner size="sm" />
                <span className="text-[15px] font-medium text-[#475569]">사진 속 위치·시간을 분석하고 있어요…</span>
            </div>
            <div className="flex flex-col gap-3">
                <Skeleton className="h-[118px] rounded-2xl" />
                <Skeleton className="h-[118px] rounded-2xl" />
                <Skeleton className="h-[118px] rounded-2xl" />
            </div>
        </div>
    );
}
