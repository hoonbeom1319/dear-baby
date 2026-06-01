'use client';

import { useMemo, useState, type ReactNode } from 'react';

import { useRouter } from 'next/navigation';

import { useAuth, useCatalog, usePlaces } from '@/application/providers';

import type { Course } from '@/entities/course';
import { useFavorite } from '@/entities/favorite';
import { PlaceCard } from '@/entities/place';

import { Slide } from '@/hbds/overlay/slide';
import { cn } from '@/hbds/lib/utils';

import type { AreaId, CategoryId } from '@/shared/config';
import { toast } from '@/shared/lib';
import { AppHeader, Brand, Card, Chip, ChipRow, Icon, IconButton, MobileShell } from '@/shared/ui';

const SectionLabel = ({ children }: { children: ReactNode }) => (
    <div className="px-4 pb-2 text-[11px] font-semibold tracking-[0.06em] text-muted uppercase">{children}</div>
);

/**
 * 첫 화면 (PRD F-1~F-5). 헤더 지역 버튼 → 바텀시트로 동네 선택.
 * 장소는 AppProvider 컨텍스트(layout에서 서버 패치)에서, 코스는 page.tsx RSC에서 전달받는다.
 */
export const Home = ({ allCourses }: { allCourses: Course[] }) => {
    const [category, setCategory] = useState<CategoryId>('all');
    const [sheetOpen, setSheetOpen] = useState(false);
    const [search, setSearch] = useState('');

    const area = usePlaces((s) => s.area);
    const setArea = usePlaces((s) => s.setArea);
    const allPlaces = usePlaces((s) => s.allPlaces);

    const loggedIn = useAuth((s) => s.loggedIn);
    const userId = useAuth((s) => s.userId);
    const openLogin = useAuth((s) => s.openLogin);
    const logout = useAuth((s) => s.logout);

    const { isFavorite, toggleFavorite } = useFavorite(userId, { onRequestLogin: openLogin });

    const regions = useCatalog((s) => s.regions);
    const areas = useCatalog((s) => s.areas);
    const categories = useCatalog((s) => s.categories);
    const getArea = useCatalog((s) => s.getArea);

    const currentAreaData = areas.find((a) => a.id === area);
    const currentRegionId = currentAreaData?.regionId ?? regions[0]?.id ?? '';

    const placeCountByArea = useMemo(() => {
        const counts: Record<string, number> = {};
        allPlaces.forEach((p) => {
            counts[p.area] = (counts[p.area] ?? 0) + 1;
        });
        return counts;
    }, [allPlaces]);

    const filteredAreas = search.trim()
        ? areas.filter((a) => a.name.includes(search.trim()))
        : areas;

    const handleAreaChange = (areaId: AreaId) => {
        setArea(areaId);
        setSheetOpen(false);
        setSearch('');
    };

    const router = useRouter();

    const places = allPlaces.filter(
        (place) => place.area === area && (category === 'all' || place.category === category)
    );
    const courseCount = allCourses.filter((c) => c.area === area).length;

    const regionName = regions.find((r) => r.id === currentRegionId)?.name ?? '';
    const areaName = getArea(area)?.name ?? '';
    const displaySubtitle = [regionName, areaName].filter(Boolean).join(' ');

    return (
        <MobileShell>
            <AppHeader
                lead={
                    <button
                        type="button"
                        onClick={() => setSheetOpen(true)}
                        className="flex items-center gap-1.5"
                    >
                        <Icon name="pin" size={15} className="shrink-0 text-primary-600" />
                        <span className="text-[15px] font-semibold text-surface-foreground">{areaName}</span>
                        <Icon name="down" size={14} className="text-muted" />
                    </button>
                }
                right={
                    <>
                        <IconButton name="star" title="즐겨찾기" onClick={() => router.push('/favorites')} />
                        <IconButton
                            name="user"
                            title={loggedIn ? '로그아웃' : '로그인'}
                            onClick={() => {
                                if (loggedIn) {
                                    logout();
                                    toast('로그아웃 했어요');
                                } else {
                                    openLogin();
                                }
                            }}
                        />
                    </>
                }
            />

            <div className="flex-1 pb-8">
                {/* 인사 · 맥락 */}
                <div className="px-4 pt-4 pb-1">
                    <h1 className="text-[22px] leading-tight font-bold tracking-[-0.02em] text-surface-foreground">오늘 어디 갈까요?</h1>
                    <p className="mt-1 text-[13px] text-muted">{displaySubtitle}에 등록된 아기와 갈 만한 곳</p>
                </div>

                {/* 카테고리 칩 */}
                <section className="pt-4 pb-3.5">
                    <SectionLabel>카테고리</SectionLabel>
                    <ChipRow>
                        {[{ id: 'all', name: '전체' }, ...categories].map((item) => (
                            <Chip key={item.id} active={category === item.id} onClick={() => setCategory(item.id)}>
                                {item.name}
                            </Chip>
                        ))}
                    </ChipRow>
                </section>

                {/* 코스 진입 카드 — 카테고리 = 전체일 때만 (PRD F-4) */}
                {category === 'all' && courseCount > 0 && (
                    <div className="px-4 pb-3.5">
                        <Card interactive onClick={() => router.push('/course')} className="flex items-center gap-3 p-3.5">
                            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-primary-50 text-primary-600">
                                <Icon name="map" size={20} stroke={2} />
                            </span>
                            <div className="min-w-0 flex-1">
                                <div className="text-sm font-semibold tracking-[-0.01em] text-surface-foreground">{areaName}의 추천 코스</div>
                                <div className="mt-0.5 text-xs text-muted">큐레이터가 묶은 외출 시퀀스 {courseCount}개</div>
                            </div>
                            <Icon name="right" size={18} className="text-neutral-400" />
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

            {/* 바텀시트 — 지역 선택 */}
            {sheetOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/40"
                    onClick={() => {
                        setSheetOpen(false);
                        setSearch('');
                    }}
                />
            )}
            <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center">
                <Slide
                    direction="down"
                    open={sheetOpen}
                    className="pointer-events-auto w-full max-w-[480px] rounded-t-2xl bg-surface shadow-xl"
                >
                    {/* 핸들 */}
                    <div className="flex justify-center pt-3 pb-1">
                        <div className="h-1 w-10 rounded-full bg-neutral-200" />
                    </div>

                    {/* 타이틀 */}
                    <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-[16px] font-bold text-surface-foreground">동네 선택</span>
                        <button
                            type="button"
                            onClick={() => {
                                setSheetOpen(false);
                                setSearch('');
                            }}
                        >
                            <Icon name="x" size={20} className="text-muted" />
                        </button>
                    </div>

                    {/* 검색 */}
                    <div className="px-4 pb-3">
                        <div className="flex items-center gap-2 rounded-xl bg-neutral-100 px-3 py-2.5">
                            <Icon name="search" size={15} className="shrink-0 text-muted" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="동네 이름으로 검색"
                                className="flex-1 bg-transparent text-[13.5px] text-surface-foreground outline-none placeholder:text-neutral-400"
                            />
                        </div>
                    </div>

                    {/* 현재 위치로 찾기 */}
                    <button
                        type="button"
                        onClick={() => toast('현재 위치 기반 찾기는 준비 중이에요')}
                        className="flex w-full items-center gap-2 px-4 py-3 text-[13.5px] font-semibold text-primary-600"
                    >
                        <Icon name="pin" size={15} />
                        현재 위치로 찾기
                    </button>

                    <div className="border-t border-border" />

                    {/* 지역별 리스트 */}
                    <div className="max-h-[55vh] overflow-y-auto">
                        {regions.map((r) => {
                            const list = filteredAreas.filter((a) => a.regionId === r.id);
                            if (list.length === 0) return null;
                            return (
                                <div key={r.id}>
                                    <div className="px-4 pt-4 pb-1.5 text-[11px] font-semibold tracking-[0.06em] text-muted uppercase">
                                        {r.name}
                                    </div>
                                    {list.map((item) => {
                                        const count = placeCountByArea[item.id] ?? 0;
                                        const isSelected = item.id === area;
                                        return (
                                            <button
                                                key={item.id}
                                                type="button"
                                                onClick={() => handleAreaChange(item.id)}
                                                className={cn(
                                                    'flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-neutral-50',
                                                    isSelected ? 'text-primary-600' : 'text-surface-foreground'
                                                )}
                                            >
                                                <span className="text-[14px] font-semibold">{item.name}</span>
                                                <span className="text-[12.5px]">
                                                    {isSelected ? (
                                                        <span className="flex items-center gap-1 text-primary-600">
                                                            {count}곳{' '}
                                                            <Icon name="check" size={13} />
                                                        </span>
                                                    ) : count > 0 ? (
                                                        <span className="text-muted">{count}곳</span>
                                                    ) : (
                                                        <span className="text-neutral-400">준비 중</span>
                                                    )}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>

                    <div className="h-6" />
                </Slide>
            </div>
        </MobileShell>
    );
};
