'use client';

import { useState } from 'react';

import { UpdateIcon } from '@radix-ui/react-icons';

import { KakaoMap } from '@/shared/kakao-map';

import { Button } from '@/hbds/display/button';

import { DEFAULT_MAP_CENTER, DEFAULT_MAP_LEVEL } from './config/defaults';
import type { KakaoPlaceMapSearchResult, KakaoSearchPlace, MapFocusPlace } from './lib/types';
import { useKakaoPlaceSearch } from './model/use-kakao-place-search';

export type KakaoPlaceMapProps = {
    searchQuery?: string | null;
    focusPlace?: MapFocusPlace | null;
    onMarkerClick?: (place: KakaoSearchPlace) => void;
    onSearchComplete?: (result: KakaoPlaceMapSearchResult) => void;
    className?: string;
};

export function KakaoPlaceMap({ searchQuery = null, focusPlace = null, onMarkerClick, onSearchComplete, className }: KakaoPlaceMapProps) {
    const [map, setMap] = useState<kakao.maps.Map | null>(null);
    const { markers, showResearch, researchHere } = useKakaoPlaceSearch(map, { searchQuery, focusPlace, onSearchComplete });

    return (
        <KakaoMap
            onReady={setMap}
            center={DEFAULT_MAP_CENTER}
            level={DEFAULT_MAP_LEVEL}
            markers={markers}
            onMarkerClick={onMarkerClick ? ({ place }) => onMarkerClick(place) : undefined}
            className={className}
        >
            {showResearch && (
                <div className="absolute top-3 left-1/2 z-10 -translate-x-1/2">
                    <Button size="sm" variant="outline" onClick={researchHere} className="rounded-full shadow-md">
                        <UpdateIcon className="h-3.5 w-3.5" />이 지역에서 재검색
                    </Button>
                </div>
            )}
        </KakaoMap>
    );
}
