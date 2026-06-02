import { Skeleton } from '@/hbds/feedback/skeleton';
import { AppHeader, MobileShell } from '@/shared/ui';

export default function Loading() {
    return (
        <MobileShell>
            {/* 헤더 */}
            <AppHeader
                left={<Skeleton className="h-9 w-9 rounded-lg" />}
                right={
                    <div className="flex gap-1">
                        <Skeleton className="h-9 w-9 rounded-lg" />
                        <Skeleton className="h-9 w-9 rounded-lg" />
                    </div>
                }
            />

            {/* 이미지 */}
            <Skeleton className="h-[200px] w-full rounded-none" />

            {/* 핵심 정보 */}
            <div className="px-4 pt-[18px] pb-2">
                <Skeleton className="h-7 w-1/2" />
                <div className="mt-2 flex gap-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-10" />
                    <Skeleton className="h-4 w-20" />
                </div>
                <div className="mt-3 flex flex-col gap-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            </div>

            {/* 편의시설 — grid-cols-5, h-11 w-11 */}
            <div className="border-t border-border p-4">
                <Skeleton className="mb-3 h-[18px] w-14" />
                <div className="grid grid-cols-5 gap-3">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="flex flex-col items-center gap-1.5">
                            <Skeleton className="h-11 w-11 rounded-xl" />
                            <Skeleton className="h-3 w-8" />
                        </div>
                    ))}
                </div>
            </div>

            {/* 이 정보가 맞나요? */}
            <div className="border-t border-border p-4">
                <Skeleton className="mb-3 h-[18px] w-24" />
                <div className="flex gap-2">
                    <Skeleton className="h-[66px] flex-1 rounded-[10px]" />
                    <Skeleton className="h-[66px] flex-1 rounded-[10px]" />
                </div>
            </div>

            {/* 기본 정보 */}
            <div className="border-t border-border p-4">
                <Skeleton className="mb-3 h-[18px] w-14" />
                <Skeleton className="h-12 w-full rounded-lg" />
            </div>

            {/* 하단 액션바 */}
            <div className="sticky bottom-0 flex items-center gap-2 border-t border-border bg-surface px-3.5 pt-2.5 pb-[18px]">
                <Skeleton className="h-10 flex-1 rounded-lg" />
                <Skeleton className="h-9 w-9 rounded-lg" />
                <Skeleton className="h-9 w-9 rounded-lg" />
            </div>
        </MobileShell>
    );
}
