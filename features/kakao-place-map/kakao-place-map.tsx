'use client';

import { useMemo, useState } from 'react';

import { UpdateIcon } from '@radix-ui/react-icons';

import { KakaoMap } from '@/shared/kakao-map';

import { Button } from '@/hbds/display/button';

import { DEFAULT_MAP_CENTER, DEFAULT_MAP_LEVEL } from './config/defaults';
import type { KakaoPlaceMapSearchResult, KakaoSearchPlace, MapFocusPlace } from './lib/types';
import { useKakaoPlaceSearch } from './model/use-kakao-place-search';


export type KakaoPlaceMapProps = {
    searchQuery?: string | null;
    focusPlace?: MapFocusPlace | null;
    activePlace?: KakaoSearchPlace | null;
    onMarkerClick?: (place: KakaoSearchPlace) => void;
    onMarkerHover?: (place: KakaoSearchPlace | null) => void;
    onSearchComplete?: (result: KakaoPlaceMapSearchResult) => void;
    onResearchStart?: () => void;
    className?: string;
};

export function KakaoPlaceMap({
    searchQuery = null,
    focusPlace = null,
    activePlace = null,
    onMarkerClick,
    onMarkerHover,
    onSearchComplete,
    onResearchStart,
    className
}: KakaoPlaceMapProps) {
    const [map, setMap] = useState<kakao.maps.Map | null>(null);
    const { markers, showResearch, researchHere } = useKakaoPlaceSearch(map, { searchQuery, focusPlace, onSearchComplete });

    const activeMarker = useMemo(() => markers.find((m) => m.place === activePlace) ?? null, [markers, activePlace]);

    return (
        <KakaoMap
            onReady={setMap}
            center={DEFAULT_MAP_CENTER}
            level={DEFAULT_MAP_LEVEL}
            markers={markers}
            onMarkerClick={onMarkerClick ? ({ place }) => onMarkerClick(place) : undefined}
            onMarkerHover={onMarkerHover ? (m) => onMarkerHover(m ? m.place : null) : undefined}
            activeMarker={activeMarker}
            className={className}
        >
            {showResearch && (
                <div className="absolute top-3 left-1/2 z-10 -translate-x-1/2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                            onResearchStart?.();
                            researchHere();
                        }}
                        className="rounded-full shadow-md"
                    >
                        <UpdateIcon className="h-3.5 w-3.5" />이 지역에서 재검색
                    </Button>
                </div>
            )}
        </KakaoMap>
    );
}
