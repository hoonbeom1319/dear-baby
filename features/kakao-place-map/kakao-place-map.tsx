'use client';

import { useRef } from 'react';

import { UpdateIcon } from '@radix-ui/react-icons';
import Script from 'next/script';

import { Button } from '@/hbds/display/button';
import { cn } from '@/hbds/lib/utils';

import type { KakaoPlaceMapSearchResult, KakaoSearchPlace, MapFocusPlace } from './lib/types';
import { useKakaoPlaceMap } from './model/use-kakao-place-map';

export type KakaoPlaceMapProps = {
    searchQuery?: string | null;
    focusPlace?: MapFocusPlace | null;
    onMarkerClick?: (place: KakaoSearchPlace) => void;
    onSearchComplete?: (result: KakaoPlaceMapSearchResult) => void;
    className?: string;
};

export function KakaoPlaceMap({ searchQuery = null, focusPlace = null, onMarkerClick, onSearchComplete, className }: KakaoPlaceMapProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const { mapReady, onSdkLoad, showResearch, researchHere } = useKakaoPlaceMap({
        mapContainerRef: containerRef,
        searchQuery,
        focusPlace,
        onMarkerClick,
        onSearchComplete
    });

    return (
        <>
            <Script
                src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_KEY}&autoload=false&libraries=services`}
                strategy="afterInteractive"
                onLoad={onSdkLoad}
            />
            <div ref={containerRef} className={cn('relative h-full w-full', className)}>
                {!mapReady && <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 text-[13px] text-muted">지도 로딩 중…</div>}
                {showResearch && (
                    <div className="absolute top-3 left-1/2 z-10 -translate-x-1/2">
                        <Button size="sm" variant="outline" onClick={researchHere} className="rounded-full shadow-md">
                            <UpdateIcon className="h-3.5 w-3.5" />이 지역에서 재검색
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}
