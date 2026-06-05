'use client';

import { useCallback, useMemo, useState } from 'react';

import { useCatalog } from '@/application/providers';

import { createPlace } from '@/server/controllers/places';

import { AdInput } from '@/widgets/admin-shell';

import { KakaoPlaceMap, toMapCenter, type KakaoPlaceMapSearchResult, type KakaoSearchPlace } from '@/features/kakao-place-map';
import { PlaceRegisterForm, type PlaceFormPrefill } from '@/features/place-register';

import { useNaverBlog } from '@/entities/naver-blog';

import type { Area, AreaId, CategoryId } from '@/shared/config';
import { useRouter } from '@/shared/hooks';
import { stripHtml, toast } from '@/shared/lib';
import { Icon } from '@/shared/ui';

import { Button } from '@/hbds/display/button';
import { ResizablePanel } from '@/hbds/layout';

import { NaverBlogReviews } from './ui/naver-blog-reviews';
import { PlaceDetailHeader } from './ui/place-detail-header';
import { ResultsList } from './ui/results-list';

/** 검색 결과 장소를 등록 폼 프리필로 변환한다. 동네를 못 잡으면 첫 동네로 폴백. */
function placeToPrefill(place: KakaoSearchPlace, areas: Area[]): PlaceFormPrefill {
    const area = areas.find(({ name }) => place.roadAddress.includes(name))?.id ?? '';
    return {
        name: stripHtml(place.title),
        area,
        category: '' as CategoryId,
        address: place.roadAddress || place.address,
        phone: place.telephone
    };
}

// ── AdminPlaceFinder ──────────────────────────────────────────────────────────

export const AdminPlaceFinder = () => {
    const [query, setQuery] = useState('');
    const [mapSearchQuery, setMapSearchQuery] = useState<string | null>(null);
    const [searchResults, setSearchResults] = useState<KakaoSearchPlace[]>([]);
    const [selected, setSelected] = useState<KakaoSearchPlace | null>(null);
    const [hoveredPlace, setHoveredPlace] = useState<KakaoSearchPlace | null>(null);
    const [isPendingSearch, setIsPendingSearch] = useState(false);

    const router = useRouter();
    const areas = useCatalog((s) => s.areas);

    const selectedPlaceName = selected ? stripHtml(selected.title) : null;
    const { posts: blogPosts, isLoading: blogLoading } = useNaverBlog(selectedPlaceName);

    const focusPlace = useMemo(() => (selected ? toMapCenter(selected) : null), [selected]);

    const prefill = useMemo(() => {
        if (!selected) return { name: '', area: '', category: '', address: '', phone: '' };
        const area = areas.find(({ name }) => selected.roadAddress.includes(name))?.id ?? '';
        return {
            name: stripHtml(selected.title),
            area,
            category: '' as CategoryId,
            address: selected.roadAddress || selected.address,
            phone: selected.telephone
        };
    }, [selected, areas]);

    const handleSelect = useCallback((place: KakaoSearchPlace) => setSelected(place), []);

    const handleSearch = () => {
        const q = query.trim();
        if (!q) return;

        setSelected(null);
        setSearchResults([]);
        setIsPendingSearch(true);
        setMapSearchQuery(null);
        queueMicrotask(() => setMapSearchQuery(q));
    };

    const handleSearchComplete = useCallback((result: KakaoPlaceMapSearchResult) => {
        setMapSearchQuery(null);
        setIsPendingSearch(false);
        if (!result.ok) {
            toast('검색에 실패했어요');
            return;
        }
        setSearchResults(result.places);
        if (result.places.length === 0) {
            toast('이 지도 영역에서 결과를 찾지 못했어요. 지도를 이동하거나 검색어를 바꿔보세요');
        }
    }, []);

    const handleResearchStart = useCallback(() => {
        setSelected(null);
        setSearchResults([]);
        setIsPendingSearch(true);
    }, []);

    return (
        <div className="h-screen overflow-hidden">
            <div className="flex h-14 items-center gap-3 border-b border-border bg-surface px-6 py-3">
                <span className="text-[15px] font-bold tracking-tight text-surface-foreground">장소 찾기</span>
                <div className="flex flex-1 items-center gap-3">
                    <Icon name="search" size={20} />
                    <AdInput
                        className="h-9 pl-9 text-[13.5px]"
                        placeholder="장소 유형으로 검색 (현재 지도 위치 기준)  예: 카페, 뷔페"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && handleSearch()}
                    />
                </div>
                <Button size="sm" onClick={handleSearch} disabled={!query.trim()}>
                    검색
                </Button>
            </div>

            <div className="relative flex h-[calc(100vh-4rem)]">
                <KakaoPlaceMap
                    searchQuery={mapSearchQuery}
                    focusPlace={focusPlace}
                    activePlace={selected}
                    onSearchComplete={handleSearchComplete}
                    onResearchStart={handleResearchStart}
                    onMarkerClick={handleSelect}
                    onMarkerHover={setHoveredPlace}
                />
                <ResizablePanel defaultWidth={350} minWidth={240} maxWidth={700}>
                    <div
                        key={`${selected?.roadAddress || selected?.address}|${selectedPlaceName}`}
                        className="h-full overflow-y-auto border-l border-border bg-surface"
                    >
                        {selected ? (
                            <>
                                <PlaceDetailHeader place={selected} onBack={() => setSelected(null)} />
                                <NaverBlogReviews posts={blogPosts} loading={blogLoading} />
                                <PlaceRegisterForm
                                    prefill={prefill}
                                    onSubmit={async (payload) => {
                                        await createPlace(payload);
                                        setSelected(null);
                                        router.refresh();
                                    }}
                                />
                            </>
                        ) : (
                            <ResultsList results={searchResults} pending={isPendingSearch} onSelect={handleSelect} hoveredPlace={hoveredPlace} />
                        )}
                    </div>
                </ResizablePanel>
            </div>
        </div>
    );
};
