import { useEffect, useEffectEvent } from 'react';

import type { PlaceSummary } from '@/entities/place';

import { createDotElement, createHeatBlob } from '../lib/map-pin';

// 단일 핀일 때 setBounds는 과도하게 확대된다 → 적당한 줌으로 고정.
const SINGLE_PIN_LEVEL = 5;
// setBounds 여백(px) — 떠있는 카드(상단)·FAB/힌트(하단)에 핀이 가리지 않게.
const FIT_PADDING = { top: 132, right: 56, bottom: 150, left: 56 } as const;

type UsePinOverlaysOptions = {
    /** 방금 저장한 핀 id — 펄스 링을 단다(저장 직후 되새김 씨앗) */
    newPlaceIds?: string[];
    onPinClick: (place: PlaceSummary) => void;
};

/**
 * 지도 인스턴스 위에 장소 핀(CustomOverlay)을 얹고, 전체 핀이 보이도록 화면을 맞춘다. (PRD F-6)
 * shared의 useMarkers(기본 마커)와 달리 디자인 핀(방문 횟수·펄스)이 필요해 직접 오버레이를 관리한다.
 */
export function usePinOverlays(map: kakao.maps.Map | null, places: PlaceSummary[], { newPlaceIds, onPinClick }: UsePinOverlaysOptions) {
    const handleClick = useEffectEvent((place: PlaceSummary) => onPinClick(place));
    // 펄스는 첫 배치 모양만 결정 — newPlaceIds 변동으로 오버레이를 재생성하지 않는다.
    const newIds = useEffectEvent(() => new Set(newPlaceIds ?? []));

    useEffect(() => {
        if (!map || places.length === 0) return;

        const isNew = newIds();
        // 방문수 정규화 — 분모 하한 2로 둬서 1회 방문이 100%로 타오르지 않게 한다.
        const maxVisits = Math.max(2, ...places.map((p) => p.visitCount));
        const intensity = (place: PlaceSummary) => Math.min(1, place.visitCount / maxVisits);

        // 히트 블롭(아래, zIndex 1) — 겹치는 글로우가 짙어져 "자주 가는 동네"를 드러낸다.
        const heatOverlays = places.map((place) => {
            const overlay = new kakao.maps.CustomOverlay({
                content: createHeatBlob(intensity(place)),
                position: new kakao.maps.LatLng(place.lat, place.lng),
                xAnchor: 0.5,
                yAnchor: 0.5,
                zIndex: 1,
                clickable: false
            });
            overlay.setMap(map);
            return overlay;
        });

        // 도트 마커(위, zIndex 10) — 좌표 중앙 정렬, 탭하면 장소 상세로.
        const dotOverlays = places.map((place) => {
            const element = createDotElement(place, {
                t: intensity(place),
                isNew: isNew.has(place.id),
                onClick: () => handleClick(place)
            });
            const overlay = new kakao.maps.CustomOverlay({
                content: element,
                position: new kakao.maps.LatLng(place.lat, place.lng),
                xAnchor: 0.5,
                yAnchor: 0.5,
                zIndex: 10,
                clickable: true
            });
            overlay.setMap(map);
            return overlay;
        });

        const overlays = [...heatOverlays, ...dotOverlays];

        if (places.length === 1) {
            map.setCenter(new kakao.maps.LatLng(places[0].lat, places[0].lng));
            map.setLevel(SINGLE_PIN_LEVEL);
        } else {
            const bounds = new kakao.maps.LatLngBounds();
            places.forEach((p) => bounds.extend(new kakao.maps.LatLng(p.lat, p.lng)));
            map.setBounds(bounds, FIT_PADDING.top, FIT_PADDING.right, FIT_PADDING.bottom, FIT_PADDING.left);
        }

        return () => overlays.forEach((o) => o.setMap(null));
    }, [map, places]);
}
