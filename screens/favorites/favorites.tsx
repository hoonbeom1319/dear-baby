'use client';

import { useRouter } from 'next/navigation';

import { useApp } from '@/application/providers';

import { PlaceCard, getPlace } from '@/entities/place';

import { AppHeader, Button, Icon, IconButton, MobileShell } from '@/shared/ui';

/**
 * 즐겨찾기 목록 (PRD F-8). 첫 화면과 같은 카드 디자인 재사용, 최근 추가순 자동 정렬.
 * 진입은 첫 화면 우상단 ★ 한 곳에서만. 필터/칩 없음.
 */
export const Favorites = () => {
    const router = useRouter();
    const { favoriteIds, isFavorite, toggleFavorite } = useApp();

    // favoriteIds는 newest-first로 유지된다 (AppProvider).
    const places = favoriteIds.flatMap((id) => {
        const place = getPlace(id);
        return place ? [place] : [];
    });

    return (
        <MobileShell>
            <AppHeader
                left={<IconButton name="back" onClick={() => router.push('/')} />}
                title="즐겨찾기"
                subtitle={places.length > 0 ? `${places.length}곳 · 최근 추가순` : undefined}
            />

            <div className="flex-1 px-4 pb-8 pt-3">
                {places.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 px-8 pt-16 text-center">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary-500">
                            <Icon name="star" size={28} stroke={2} />
                        </div>
                        <div className="text-[15px] font-semibold text-surface-foreground">아직 즐겨찾기가 없어요</div>
                        <div className="text-[13px] leading-relaxed text-muted">
                            마음에 드는 장소에서 ★를 누르면
                            <br />
                            여기 모아둘 수 있어요
                        </div>
                        <Button className="mt-3" onClick={() => router.push('/')}>
                            장소 둘러보기
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2.5">
                        {places.map((place) => (
                            <PlaceCard
                                key={place.id}
                                place={place}
                                isFavorite={isFavorite(place.id)}
                                onToggleFavorite={toggleFavorite}
                                onSelect={(id) => router.push(`/place/${id}`)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </MobileShell>
    );
};
