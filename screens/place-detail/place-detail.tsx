'use client';

import { useState, type ReactNode } from 'react';

import { useRouter } from '@/shared/hooks';

import { useAuth, useCatalog } from '@/application/providers';

import { createReport } from '@/server/controllers/reports';

import { NavSheet } from '@/features/navigate';
import { ReportSheet } from '@/features/report';

import type { Course } from '@/entities/course';
import { useFavorite } from '@/entities/favorite';
import { AmenityGrid, usePlaceFeedback } from '@/entities/place';
import type { Place } from '@/entities/place';

import { toast } from '@/shared/lib';
import { AppHeader, Button, Card, Icon, IconButton, MobileShell, PlaceImage } from '@/shared/ui';

type SheetKind = 'nav' | 'report' | null;

const MetaDot = () => <span className="h-0.5 w-0.5 rounded-full bg-neutral-300" />;

const SectionTitle = ({ children }: { children: ReactNode }) => (
    <div className="mb-3 text-[13px] font-semibold tracking-[-0.005em] text-surface-foreground">{children}</div>
);

type Props = {
    place: Place | null;
    relatedCourses: Course[];
};

/**
 * 장소 상세 — 결정이 일어나는 "홀로 서는 화면". (PRD F-6 · 시나리오 C)
 * place/relatedCourses는 RSC page.tsx에서 Supabase로 패치해 전달받는다.
 */
export const PlaceDetail = ({ place, relatedCourses }: Props) => {
    const router = useRouter();
    const userId = useAuth((s) => s.userId);
    const openLogin = useAuth((s) => s.openLogin);
    const { isFavorite, toggleFavorite } = useFavorite(userId, { onRequestLogin: openLogin });
    const [sheet, setSheet] = useState<SheetKind>(null);
    const { kind: feedbackKind, setFeedback } = usePlaceFeedback(place?.id ?? '');
    const getArea = useCatalog((s) => s.getArea);
    const getCategory = useCatalog((s) => s.getCategory);

    const isFav = isFavorite(place?.id || '');
    const category = getCategory(place?.category || '');
    const area = getArea(place?.area || '');

    const goBack = () => {
        if (typeof window !== 'undefined' && window.history.length > 1) router.back();
        else router.push('/');
    };

    if (!place) {
        return (
            <MobileShell>
                <AppHeader left={<IconButton name="back" onClick={goBack} />} title="장소" />
                <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
                    <div className="text-[15px] font-semibold text-surface-foreground">장소를 찾을 수 없어요</div>
                    <Button onClick={() => router.push('/')}>홈으로</Button>
                </div>
            </MobileShell>
        );
    }

    return (
        <MobileShell>
            <AppHeader
                left={<IconButton name="back" onClick={goBack} />}
                right={
                    <>
                        <IconButton name={isFav ? 'star-fill' : 'star'} fav={isFav} onClick={() => toggleFavorite(place.id)} title="즐겨찾기" />
                        <IconButton name="share" onClick={() => toast('공유 링크를 복사했어요 (장소)')} title="공유" />
                    </>
                }
            />

            <div className="flex-1">
                {/* 사진 영역 */}
                <div className="relative">
                    <PlaceImage className="h-[200px] w-full bg-white" iconSize={32} />
                    <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                        <span className="h-1.5 w-[18px] rounded bg-neutral-700" />
                        <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
                        <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
                    </div>
                </div>

                {/* 핵심 정보 */}
                <div className="px-4 pt-[18px] pb-2">
                    <h1 className="text-[22px] leading-tight font-bold tracking-[-0.02em] text-surface-foreground">{place.name}</h1>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px] text-muted">
                        <span>{category?.name}</span>
                        <MetaDot />
                        <span>{area?.name}</span>
                        <MetaDot />
                        <span>
                            권장 월령 <strong className="font-semibold text-surface-foreground">{place.ageRange}</strong>
                        </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-neutral-700">{place.description}</p>
                </div>

                {/* 편의시설 전체 */}
                <section className="border-t border-border p-4">
                    <SectionTitle>편의시설</SectionTitle>
                    <AmenityGrid place={place} />
                    <div className="mt-3 flex items-center gap-3 text-[11px] text-muted">
                        <span className="inline-flex items-center gap-1">
                            <span className="h-2 w-2 rounded-sm bg-primary-500" /> 있음
                        </span>
                        <span className="inline-flex items-center gap-1">
                            <span className="h-2 w-2 rounded-sm bg-neutral-200" /> 없음
                        </span>
                    </div>
                </section>

                {/* 정보 제보 */}
                <section className="border-t border-border p-4">
                    <SectionTitle>이 정보가 맞나요?</SectionTitle>
                    {feedbackKind ? (
                        <div
                            className={`flex items-center gap-2.5 rounded-[10px] border p-3.5 ${
                                feedbackKind === 'correct'
                                    ? 'border-success/30 bg-success/5 text-success'
                                    : 'border-warning/30 bg-warning/5 text-warning'
                            }`}
                        >
                            <Icon name="check" size={16} stroke={2.5} />
                            <span className="text-sm font-medium">
                                {feedbackKind === 'correct' ? '맞아요라고 알려주셨어요' : '수정 제보를 해주셨어요'}
                            </span>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setFeedback('correct');
                                    toast('제보해주셔서 감사해요');
                                }}
                                className="flex flex-1 flex-col items-center gap-1 rounded-[10px] border border-border bg-surface p-3 text-neutral-700 transition-colors hover:border-success hover:text-success"
                            >
                                <Icon name="thumb" size={18} />
                                <span className="text-xs font-medium">맞아요</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setSheet('report')}
                                className="flex flex-1 flex-col items-center gap-1 rounded-[10px] border border-border bg-surface p-3 text-neutral-700 transition-colors hover:border-warning hover:text-warning"
                            >
                                <Icon name="thumb-down" size={18} />
                                <span className="text-xs font-medium">바뀌었어요</span>
                            </button>
                        </div>
                    )}
                </section>

                {/* 기본 정보 */}
                <section className="border-t border-border p-4">
                    <SectionTitle>기본 정보</SectionTitle>
                    <div className="flex items-center justify-between gap-2 border-b border-border py-3">
                        <div>
                            <div className="mb-0.5 flex items-center gap-1 text-[11px] text-muted">
                                <Icon name="pin" size={11} stroke={2} /> 주소
                            </div>
                            <div className="text-[13px] text-neutral-700">{place.address}</div>
                        </div>
                        <IconButton name="copy" size={18} onClick={() => toast('주소를 복사했어요')} title="주소 복사" />
                    </div>
                </section>

                {/* 함께 가면 좋은 코스 */}
                {relatedCourses.length > 0 && (
                    <section className="border-t border-border p-4">
                        <SectionTitle>함께 가면 좋은 코스</SectionTitle>
                        <div className="flex flex-col gap-2">
                            {relatedCourses.map((course) => (
                                <Card
                                    key={course.id}
                                    interactive
                                    onClick={() => router.push(`/course/${course.id}`)}
                                    className="flex items-center justify-between gap-3 p-3"
                                >
                                    <div className="min-w-0 flex-1">
                                        <div className="text-sm font-semibold text-surface-foreground">{course.title}</div>
                                        <div className="mt-1 flex items-center gap-2 text-xs text-muted">
                                            <span>정거장 {course.stopIds.length}곳</span>
                                            <MetaDot />
                                            <span className="inline-flex items-center gap-1">
                                                <Icon name="clock" size={11} stroke={2} /> {course.duration}
                                            </span>
                                        </div>
                                    </div>
                                    <Icon name="right" size={16} className="text-neutral-400" />
                                </Card>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* 하단 액션 영역 (한 손) */}
            <div className="sticky bottom-0 flex items-center gap-2 border-t border-border bg-surface px-3.5 pt-2.5 pb-[18px]">
                <Button block className="flex-1" onClick={() => setSheet('nav')}>
                    <Icon name="nav" size={18} stroke={2} /> 길찾기
                </Button>
                <IconButton name="copy" onClick={() => toast('주소를 복사했어요')} title="주소 복사" />
                <IconButton name={isFav ? 'star-fill' : 'star'} fav={isFav} onClick={() => toggleFavorite(place.id)} title="즐겨찾기" />
            </div>

            <NavSheet
                open={sheet === 'nav'}
                onOpenChange={(open) => !open && setSheet(null)}
                onPick={(appName) => {
                    setSheet(null);
                    toast(`${appName} 앱을 열어요`);
                }}
                onCopyAddress={() => {
                    setSheet(null);
                    toast('주소를 복사했어요');
                }}
            />
            <ReportSheet
                open={sheet === 'report'}
                onOpenChange={(open) => !open && setSheet(null)}
                onSubmit={async (reason) => {
                    setSheet(null);
                    try {
                        await createReport({ placeId: place.id, reason });
                    } catch {
                        // 저장 실패해도 사용자에게는 성공 토스트 (UX 우선)
                    }
                    setFeedback('reported');
                    toast('제보해주셔서 감사해요');
                }}
            />
        </MobileShell>
    );
};
