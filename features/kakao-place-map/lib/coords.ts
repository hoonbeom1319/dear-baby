import type { MapCenter, MapPlace } from './types';

/** mapx(경도)·mapy(위도) ×10⁷ 문자열 → WGS84 [lat, lng] */
export function toLatLng(mapx: string, mapy: string): [number, number] | null {
    const lat = Number(mapy) / 1e7;
    const lng = Number(mapx) / 1e7;
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return null;
    }
    return [lat, lng];
}

export function toMapCenter(place: MapPlace): MapCenter | null {
    const coords = toLatLng(place.mapx, place.mapy);
    if (!coords) return null;
    return { lat: coords[0], lng: coords[1] };
}
