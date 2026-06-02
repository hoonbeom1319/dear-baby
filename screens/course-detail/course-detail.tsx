'use client';


import { useAuth, useCatalog, usePlaces } from '@/application/providers';

import type { Course } from '@/entities/course';
import { useFavorite } from '@/entities/favorite';
import { PlaceCard } from '@/entities/place';

import { useRouter } from '@/shared/hooks';
import { toast } from '@/shared/lib';
import { AppHeader, Icon, IconButton, MobileShell } from '@/shared/ui';

import { Button } from '@/hbds/display/button';

const MetaDot = () => <span className="h-0.5 w-0.5 rounded-full bg-neutral-300" />;

type Props = { course: Course | null };

/**
 * 코스 상세 (PRD F-10). 정거장을 순서대로 나열하고 사이를 화살표로 잇는다.
 * course는 RSC page.tsx에서 Supabase로 패치해 전달받는다.
 * 장소 조회는 AppProvider 컨텍스트(getPlaceById)를 사용한다.
 */
export const CourseDetail = ({ course }: Props) => {
    const router = useRouter();
    const getPlaceById = usePlaces((s) => s.getPlaceById);
    const userId = useAuth((s) => s.userId);
    const openLogin = useAuth((s) => s.openLogin);
    const { isFavorite, toggleFavorite } = useFavorite(userId, { onRequestLogin: openLogin });
    const getArea = useCatalog((s) => s.getArea);

    const goBack = () => {
        if (typeof window !== 'undefined' && window.history.length > 1) router.back();
        else router.push('/');
    };

    if (!course) {
        return (
            <MobileShell>
                <AppHeader left={<IconButton name="back" onClick={goBack} />} title="코스" />
                <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
                    <div className="text-[15px] font-semibold text-surface-foreground">코스를 찾을 수 없어요</div>
                    <Button onClick={() => router.push('/')}>홈으로</Button>
                </div>
            </MobileShell>
        );
    }

    const area = getArea(course.area);
    const stops = course.stopIds.map(getPlaceById);

    return (
        <MobileShell>
            <AppHeader
                left={<IconButton name="back" onClick={goBack} />}
                right={<IconButton name="share" onClick={() => toast('공유 링크를 복사했어요 (코스)')} title="공유" />}
            />

            <div className="flex-1 px-4 pb-10">
                {/* 핵심 정보 */}
                <div className="border-b border-border pt-3 pb-4">
                    <h1 className="text-[22px] leading-snug font-bold tracking-[-0.02em] text-surface-foreground">{course.title}</h1>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px] text-muted">
                        <span>{area?.name}</span>
                        <MetaDot />
                        <span className="inline-flex items-center gap-1">
                            <Icon name="clock" size={11} stroke={2} /> {course.duration}
                        </span>
                        <MetaDot />
                        <span>정거장 {stops.length}곳</span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-neutral-700">{course.description}</p>
                </div>

                {/* 정거장 흐름 */}
                <div className="pt-4">
                    <div className="mb-3 text-[13px] font-semibold text-surface-foreground">정거장 흐름</div>
                    {stops.map(
                        (place, i) =>
                            place && (
                                <div key={place.id}>
                                    <PlaceCard
                                        place={place}
                                        stopNumber={i + 1}
                                        isFavorite={isFavorite(place.id)}
                                        onToggleFavorite={toggleFavorite}
                                        onSelect={(id) => router.push(`/place/${id}`)}
                                    />
                                    <div className="mt-2 ml-9 flex items-start gap-2 py-2.5 pr-3 text-[12.5px] leading-relaxed text-muted">
                                        <Icon name="info" size={13} stroke={2} className="mt-0.5 shrink-0 text-neutral-400" />
                                        <span>{course.comments[i]}</span>
                                    </div>
                                    {i < stops.length - 1 && (
                                        <div className="py-2.5 text-center text-neutral-300">
                                            <Icon name="down-arrow" size={20} stroke={1.8} />
                                        </div>
                                    )}
                                </div>
                            )
                    )}

                    <div className="mt-4 rounded-[10px] border border-dashed border-border bg-neutral-50 p-3 text-center text-xs text-muted">─ 코스 완료 ─</div>
                </div>
            </div>
        </MobileShell>
    );
};
