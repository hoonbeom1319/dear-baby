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

import { NaverBlogReviews } from './ui/naver-blog-reviews';
import { PlaceDetailHeader } from './ui/place-detail-header';
import { ResultsList } from './ui/results-list';

// ── Constants ─────────────────────────────────────────────────────────────────

const AREA_ID_MAP: Record<string, string> = {
    강남구: 'gangnam',
    강북구: 'gangbuk',
    강동구: 'gangdong',
    강서구: 'gangseo',
    관악구: 'gwanak',
    광진구: 'gwangjin',
    구로구: 'guro',
    금천구: 'geumcheon',
    노원구: 'nowon',
    도봉구: 'dobong',
    동대문구: 'dongdaemun',
    동작구: 'dongjak',
    마포구: 'mapo',
    서대문구: 'seodaemun',
    서초구: 'seocho',
    성동구: 'seongdong',
    성북구: 'seongbuk',
    송파구: 'songpa',
    양천구: 'yangcheon',
    영등포구: 'yeongdeungpo',
    용산구: 'yongsan',
    은평구: 'eunpyeong',
    종로구: 'jongno',
    중구: 'jung',
    중랑구: 'jungnang'
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function detectArea(roadAddress: string): AreaId | '' {
    for (const [name, id] of Object.entries(AREA_ID_MAP)) {
        if (roadAddress.includes(name)) return id as AreaId;
    }
    return '';
}

function detectCategory(naverCategory: string): CategoryId {
    return naverCategory.includes('카페') || naverCategory.includes('디저트') ? 'cafe' : 'rest';
}

/** 검색 결과 장소를 등록 폼 프리필로 변환한다. 동네를 못 잡으면 첫 동네로 폴백. */
function placeToPrefill(place: KakaoSearchPlace, areas: Area[]): PlaceFormPrefill {
    return {
        name: stripHtml(place.title),
        area: (detectArea(place.roadAddress) || areas[0]?.id || '') as AreaId,
        category: detectCategory(place.category),
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

    const router = useRouter();
    const areas = useCatalog((s) => s.areas);

    const selectedPlaceName = selected ? stripHtml(selected.title) : null;
    const { posts: blogPosts, isLoading: blogLoading } = useNaverBlog(selectedPlaceName);

    const focusPlace = useMemo(() => (selected ? toMapCenter(selected) : null), [selected]);

    const handleSelect = useCallback((place: KakaoSearchPlace) => setSelected(place), []);

    const handleSearch = () => {
        const q = query.trim();
        if (!q) return;

        setSelected(null);
        setSearchResults([]);
        setMapSearchQuery(null);
        queueMicrotask(() => setMapSearchQuery(q));
    };

    const handleSearchComplete = useCallback((result: KakaoPlaceMapSearchResult) => {
        setMapSearchQuery(null);
        if (!result.ok) {
            toast('검색에 실패했어요');
            return;
        }
        setSearchResults(result.places);
        if (result.places.length === 0) {
            toast('이 지도 영역에서 결과를 찾지 못했어요. 지도를 이동하거나 검색어를 바꿔보세요');
        }
    }, []);

    return (
        <div className="flex h-screen flex-col">
            <div className="flex shrink-0 items-center gap-3 border-b border-border bg-surface px-6 py-3">
                <span className="shrink-0 text-[15px] font-bold tracking-tight text-surface-foreground">장소 찾기</span>
                <div className="relative max-w-[480px] flex-1">
                    <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted">
                        <Icon name="search" size={14} />
                    </span>
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

            <div className="flex flex-1">
                <KakaoPlaceMap searchQuery={mapSearchQuery} focusPlace={focusPlace} onSearchComplete={handleSearchComplete} onMarkerClick={handleSelect} />
                <div className="h-full max-h-full max-w-[440px] overflow-y-auto border-l border-border bg-surface">
                    {selected ? (
                        <>
                            <PlaceDetailHeader place={selected} onBack={() => setSelected(null)} />
                            <NaverBlogReviews posts={blogPosts} loading={blogLoading} />
                            <PlaceRegisterForm
                                key={`${selected.roadAddress || selected.address}|${selectedPlaceName}`}
                                prefill={placeToPrefill(selected, areas)}
                                onSubmit={async (payload) => {
                                    await createPlace(payload);
                                    setSelected(null);
                                    router.refresh();
                                }}
                            />
                        </>
                    ) : (
                        <ResultsList results={searchResults} pendingQuery={mapSearchQuery} onSelect={handleSelect} />
                    )}
                </div>
            </div>
        </div>
    );
};
