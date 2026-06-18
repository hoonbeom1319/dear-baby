'use client';

import { useEffect, useEffectEvent, useState } from 'react';

import { toLatLng } from '../lib/helper';

import { KakaoMap } from './kakao-map';

const SEOUL = toLatLng(37.5665, 126.978)!;

type PinPickerProps = {
    center: { lat: number; lng: number };
    onChange: (lat: number, lng: number) => void;
    className?: string;
};

/** 지도를 눌러 핀을 옮기는 미니 맵 — 수동 장소 지정(F-4 "할머니 집" 등)·핀 위치 수정용. */
export function PinPicker({ center, onChange, className }: PinPickerProps) {
    const [map, setMap] = useState<kakao.maps.Map | null>(null);
    const handleChange = useEffectEvent(onChange);
    const initial = toLatLng(center.lat, center.lng) ?? SEOUL;

    useEffect(() => {
        if (!map) return;
        const marker = new kakao.maps.Marker({ position: new kakao.maps.LatLng(center.lat, center.lng), map });
        const onClick = (e: kakao.maps.MouseEvent) => {
            marker.setPosition(e.latLng);
            handleChange(e.latLng.getLat(), e.latLng.getLng());
        };
        kakao.maps.event.addListener(map, 'click', onClick);
        return () => {
            kakao.maps.event.removeListener(map, 'click', onClick);
            marker.setMap(null);
        };
    }, [map, center.lat, center.lng]);

    return <KakaoMap center={initial} level={4} onReady={setMap} className={className} />;
}
