import { toLatLng, type LatLng } from '@/shared/kakao-map';

import type { MapPlace } from './types';

/** mapx(경도)·mapy(위도) ×10⁷ 문자열 → 검증된 LatLng */
export function toMapCenter(place: MapPlace): LatLng | null {
    const lat = Number(place.mapy) / 1e7;
    const lng = Number(place.mapx) / 1e7;
    return toLatLng(lat, lng);
}
