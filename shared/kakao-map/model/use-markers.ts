'use client';

import { useEffect, useEffectEvent, useRef } from 'react';

import type { LatLng } from '../lib/type';

// 활성 마커 이미지 — primary-600 oklch(68% 0.2 48), % → %25 인코딩
let _activeMarkerImage: kakao.maps.MarkerImage | null = null;
function getActiveMarkerImage() {
    if (!_activeMarkerImage) {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="33" height="46" viewBox="0 0 33 46"><path d="M16.5 0C7.39 0 0 7.39 0 16.5C0 29.04 16.5 46 16.5 46S33 29.04 33 16.5C33 7.39 25.61 0 16.5 0z" fill="oklch(68%25 0.2 48)"/><circle cx="16.5" cy="16.5" r="7" fill="white"/></svg>`;
        _activeMarkerImage = new kakao.maps.MarkerImage(`data:image/svg+xml;charset=utf-8,${svg}`, new kakao.maps.Size(33, 46), {
            offset: new kakao.maps.Point(16, 46)
        });
    }
    return _activeMarkerImage;
}

const ACTIVE_MARKER_Z_INDEX = 10;

type UseMarkersOptions<T> = {
    onClick?: (item: T) => void;
    onHover?: (item: T | null) => void;
    activeItem?: T | null;
};

export function useMarkers<T extends LatLng>(map: kakao.maps.Map | null, items: T[], { onClick, onHover, activeItem }: UseMarkersOptions<T> = {}) {
    const markersRef = useRef<kakao.maps.Marker[]>([]);
    const overlayRef = useRef<kakao.maps.CustomOverlay | null>(null);

    const handleClick = useEffectEvent((item: T) => onClick?.(item));
    const handleHover = useEffectEvent((item: T | null) => onHover?.(item));

    useEffect(() => {
        if (!map) return;

        items.forEach((item) => {
            const isActive = activeItem != null && item === activeItem;
            const marker = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(item.lat, item.lng),
                map,
                image: isActive ? getActiveMarkerImage() : undefined,
                zIndex: isActive ? ACTIVE_MARKER_Z_INDEX : undefined
            });
            kakao.maps.event.addListener(marker, 'click', () => handleClick(item));
            kakao.maps.event.addListener(marker, 'mouseover', () => {
                handleHover(item);
                if (item.label) {
                    const label = item.label;
                    overlayRef.current?.setMap(null);
                    const content = `<div style="background:white;padding:5px 10px;border-radius:6px;font-size:12.5px;font-weight:600;box-shadow:0 2px 8px rgba(0,0,0,0.15);white-space:nowrap;pointer-events:none">${label}</div>`;
                    overlayRef.current = new kakao.maps.CustomOverlay({
                        content,
                        position: new kakao.maps.LatLng(item.lat, item.lng),
                        yAnchor: 2.3,
                        zIndex: 20
                    });
                    overlayRef.current.setMap(map);
                }
            });
            kakao.maps.event.addListener(marker, 'mouseout', () => {
                handleHover(null);
                overlayRef.current?.setMap(null);
                overlayRef.current = null;
            });
            markersRef.current.push(marker);
        });

        return () => {
            markersRef.current.forEach((m) => m.setMap(null));
            markersRef.current = [];
            overlayRef.current?.setMap(null);
            overlayRef.current = null;
        };
    }, [map, items, activeItem]);
}
