'use client';

import { useState, type ReactNode } from 'react';

import { useRouter } from 'next/navigation';

import { useApp } from '@/application/providers';

import { listCoursesByArea } from '@/entities/course';
import { PLACES, PlaceCard } from '@/entities/place';

import { AREAS, CATEGORIES, getArea, type CategoryId } from '@/shared/config';
import { AppHeader, Brand, Card, Chip, ChipRow, Icon, IconButton, MobileShell } from '@/shared/ui';

const SectionLabel = ({ children }: { children: ReactNode }) => (
    <div className="px-4 pb-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">{children}</div>
);

/**
 * 첫 화면 (PRD F-1~F-5). 마지막으로 본 동네(전역 area)의 장소를 카드로 보여주고,
 * 동네/카테고리 칩과 (카테고리=전체일 때만) 코스 진입 카드를 노출한다.
 */
export const Home = () => {
    const router = useRouter();
    const { area, setArea, isFavorite, toggleFavorite } = useApp();
    const [category, setCategory] = useState<CategoryId>('all');

    const places = PLACES.filter((place) => place.area === area && (category === 'all' || place.category === category));
    const courseCount = listCoursesByArea(area).length;
    const areaName = getArea(area)?.name;

    return (
        <MobileShell>
            <AppHeader
                lead={<Brand />}
                right={<IconButton name="star" title="즐겨찾기" onClick={() => router.push('/favorites')} />}
            />

            <div className="flex-1 pb-8">
                {/* 인사 · 맥락 */}
                <div className="px-4 pb-1 pt-4">
                    <h1 className="text-[22px] font-bold leading-tight tracking-[-0.02em] text-surface-foreground">
                        오늘 어디 갈까요?
                    </h1>
                    <p className="mt-1 text-[13px] text-muted">{areaName}에 등록된 아기와 갈 만한 곳</p>
                </div>

                {/* 동네 칩 */}
                <section className="pb-1.5 pt-4">
                    <SectionLabel>동네</SectionLabel>
                    <ChipRow>
                        {AREAS.map((item) => (
                            <Chip key={item.id} active={area === item.id} onClick={() => setArea(item.id)}>
                                {item.name}
                            </Chip>
                        ))}
                    </ChipRow>
                </section>

                {/* 카테고리 칩 */}
                <section className="pb-3.5 pt-2">
                    <SectionLabel>카테고리</SectionLabel>
                    <ChipRow>
                        {CATEGORIES.map((item) => (
                            <Chip key={item.id} active={category === item.id} onClick={() => setCategory(item.id)}>
                                {item.name}
                            </Chip>
                        ))}
                    </ChipRow>
                </section>

                {/* 코스 진입 카드 — 카테고리 = 전체일 때만 (PRD F-4) */}
                {category === 'all' && courseCount > 0 && (
                    <div className="px-4 pb-3.5">
                        <Card
                            interactive
                            onClick={() => router.push('/course')}
                            className="flex items-center gap-3 p-3.5">
                            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-primary-50 text-primary-600">
                                <Icon name="map" size={20} stroke={2} />
                            </span>
                            <div className="min-w-0 flex-1">
                                <div className="text-sm font-semibold tracking-[-0.01em] text-surface-foreground">
                                    {areaName}의 추천 코스
                                </div>
                                <div className="mt-0.5 text-xs text-muted">큐레이터가 묶은 외출 시퀀스 {courseCount}개</div>
                            </div>
                            <Icon name="right" size={18} className="text-slate-400" />
                        </Card>
                    </div>
                )}

                {/* 장소 카드 리스트 */}
                <div className="flex flex-col gap-2.5 px-4 pb-8">
                    <div className="mb-0.5 flex items-center justify-between text-xs text-muted">
                        <span className="font-medium">장소 {places.length}곳</span>
                        <span className="text-[11px]">운영자 지정 순서</span>
                    </div>
                    {places.map((place) => (
                        <PlaceCard
                            key={place.id}
                            place={place}
                            isFavorite={isFavorite(place.id)}
                            onToggleFavorite={toggleFavorite}
                            onSelect={(id) => router.push(`/place/${id}`)}
                        />
                    ))}
                    {places.length === 0 && (
                        <div className="py-10 text-center text-[13px] text-muted">해당 조건에 등록된 장소가 없어요</div>
                    )}
                </div>
            </div>
        </MobileShell>
    );
};
