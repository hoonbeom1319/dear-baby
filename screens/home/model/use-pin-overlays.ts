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
    /** 전체 핀이 보이게 화면을 맞출지. 복원된 뷰포트가 있으면 false(사용자가 보던 확대 상태 유지). */
    fit: boolean;
};

/** 지도 중심 부근에서 위도 0.01도가 차지하는 화면 px → 미터당 px. 줌이 바뀔 때마다 달라진다. */
function pixelsPerMeter(map: kakao.maps.Map): number {
    const projection = map.getProjection();
    const center = map.getCenter();
    const north = new kakao.maps.LatLng(center.getLat() + 0.01, center.getLng());
    const pc = projection.containerPointFromCoords(center);
    const pn = projection.containerPointFromCoords(north);
    const px = Math.hypot(pn.x - pc.x, pn.y - pc.y);
    const meters = 0.01 * 111320; // 위도 1도 ≈ 111.32km
    return meters > 0 ? px / meters : 0;
}

/**
 * 지도 인스턴스 위에 장소 핀(CustomOverlay)을 얹고, 전체 핀이 보이도록 화면을 맞춘다. (PRD F-6)
 * 디자인(Family Memory Map): 방문 강도 도트 마커(위) + 히트 블롭(아래) 2레이어.
 * 히트 블롭은 지리적 크기라 줌이 바뀌면 px를 다시 계산해 지도와 함께 확대/축소된다.
 */
export function usePinOverlays(map: kakao.maps.Map | null, places: PlaceSummary[], { newPlaceIds, onPinClick, fit }: UsePinOverlaysOptions) {
    const handleClick = useEffectEvent((place: PlaceSummary) => onPinClick(place));
    // 펄스는 첫 배치 모양만 결정 — newPlaceIds 변동으로 오버레이를 재생성하지 않는다.
    const newIds = useEffectEvent(() => new Set(newPlaceIds ?? []));
    const shouldFit = useEffectEvent(() => fit);

    useEffect(() => {
        if (!map || places.length === 0) return;

        const isNew = newIds();
        // 방문수 정규화 — 분모 하한 2로 둬서 1회 방문이 100%로 타오르지 않게 한다.
        const maxVisits = Math.max(2, ...places.map((p) => p.visitCount));
        const intensity = (place: PlaceSummary) => Math.min(1, place.visitCount / maxVisits);

        // 히트 블롭(아래, zIndex 1). 각 블롭의 "지리적 반경(미터)"을 기억해 줌 변경 시 px를 다시 맞춘다.
        const heatBlobs: { el: HTMLElement; meters: number }[] = [];
        const basePpm = pixelsPerMeter(map);
        const heatOverlays = places.map((place) => {
            const t = intensity(place);
            const el = createHeatBlob(t);
            const baseSize = Math.round(92 + t * 138);
            heatBlobs.push({ el, meters: basePpm > 0 ? baseSize / basePpm : baseSize });
            const overlay = new kakao.maps.CustomOverlay({
                content: el,
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

        // 복원된 뷰포트가 있으면(fit=false) 사용자가 보던 화면을 건드리지 않는다.
        if (shouldFit()) {
            if (places.length === 1) {
                map.setCenter(new kakao.maps.LatLng(places[0].lat, places[0].lng));
                map.setLevel(SINGLE_PIN_LEVEL);
            } else {
                const bounds = new kakao.maps.LatLngBounds();
                places.forEach((p) => bounds.extend(new kakao.maps.LatLng(p.lat, p.lng)));
                map.setBounds(bounds, FIT_PADDING.top, FIT_PADDING.right, FIT_PADDING.bottom, FIT_PADDING.left);
            }
        }

        // 줌이 바뀌면 블롭을 지리적 크기로 다시 그린다(고정 px면 확대 시 글로우가 상대적으로 작아진다).
        const resizeHeat = () => {
            const ppm = pixelsPerMeter(map);
            if (ppm <= 0) return;
            for (const { el, meters } of heatBlobs) {
                const px = Math.round(meters * ppm);
                el.style.width = `${px}px`;
                el.style.height = `${px}px`;
            }
        };
        resizeHeat(); // fit/복원으로 바뀐 줌에 초기 1회 맞춤
        kakao.maps.event.addListener(map, 'zoom_changed', resizeHeat);

        return () => {
            kakao.maps.event.removeListener(map, 'zoom_changed', resizeHeat);
            overlays.forEach((o) => o.setMap(null));
        };
    }, [map, places]);
}
