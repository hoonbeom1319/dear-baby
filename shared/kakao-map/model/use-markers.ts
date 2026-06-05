'use client';

import { useEffect, useEffectEvent, useRef } from 'react';

import type { LatLng } from '../lib/type';

type UseMarkersOptions<T> = {
    onClick?: (item: T) => void;
};

export function useMarkers<T extends LatLng>(map: kakao.maps.Map | null, items: T[], { onClick }: UseMarkersOptions<T> = {}) {
    const markersRef = useRef<kakao.maps.Marker[]>([]);

    const handleClick = useEffectEvent((item: T) => onClick?.(item));

    useEffect(() => {
        if (!map) return;

        items.forEach((item) => {
            const marker = new kakao.maps.Marker({ position: new kakao.maps.LatLng(item.lat, item.lng), map });
            kakao.maps.event.addListener(marker, 'click', () => handleClick(item));
            markersRef.current.push(marker);
        });

        return () => {
            markersRef.current.forEach((m) => m.setMap(null));
            markersRef.current = [];
        };
    }, [map, items]);
}
