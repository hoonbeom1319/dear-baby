'use client';

import { useEffect, useRef, type ReactNode } from 'react';

import { cn } from '@/hbds/lib/utils';

import type { LatLng } from '../lib/type';
import { useKakaoMap } from '../model/use-kakao-map';
import { useKakaoSdk } from '../model/use-kakao-sdk';
import { useMarkers } from '../model/use-markers';

export type KakaoMapProps<T extends LatLng = LatLng> = {
    /** 최초 생성 시 중심 좌표 */
    center: LatLng;
    /** 최초 생성 시 줌 레벨 */
    level?: number;
    /** 지도에 표시할 마커 */
    markers?: T[];
    /** 마커 클릭 시 호출 */
    onMarkerClick?: (item: T) => void;
    /** 활성 마커 — 기본 마커와 다르게 표시된다 */
    activeMarker?: T | null;
    /** 활성 마커 z-index */
    activeMarkerZIndex?: number;
    /** 맵 인스턴스가 생성되면 호출된다 */
    onReady?: (map: kakao.maps.Map) => void;
    /** 맵 위에 띄울 오버레이 */
    children?: ReactNode;
    className?: string;
};

/** SDK 로딩 + 컨테이너 div + 맵 인스턴스·마커를 캡슐화한 범용 지도. */
export function KakaoMap<T extends LatLng = LatLng>({ center, level, markers = [], onMarkerClick, activeMarker, activeMarkerZIndex, onReady, children, className }: KakaoMapProps<T>) {
    const containerRef = useRef<HTMLDivElement>(null);
    const ready = useKakaoSdk();
    const map = useKakaoMap({ containerRef, ready, center, level });

    useMarkers(map, markers, { onClick: onMarkerClick, activeItem: activeMarker, activeZIndex: activeMarkerZIndex });

    useEffect(() => {
        if (map) onReady?.(map);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map]);

    return (
        <div ref={containerRef} className={cn('relative h-full w-full', className)}>
            {!map && <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 text-[13px] text-muted">지도 로딩 중…</div>}
            {map && children}
        </div>
    );
}
