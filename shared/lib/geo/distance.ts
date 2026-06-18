export type GeoPoint = { lat: number; lng: number };

const EARTH_RADIUS_M = 6371000;
const toRad = (deg: number): number => (deg * Math.PI) / 180;

/** 두 좌표 사이의 대권 거리(m) — haversine */
export function haversineMeters(a: GeoPoint, b: GeoPoint): number {
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const h =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
    return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** 좌표 무게중심(산술 평균). 소영역에선 평면 근사로 충분하다. */
export function centroid(points: GeoPoint[]): GeoPoint {
    if (points.length === 0) return { lat: 0, lng: 0 };
    let lat = 0;
    let lng = 0;
    for (const p of points) {
        lat += p.lat;
        lng += p.lng;
    }
    return { lat: lat / points.length, lng: lng / points.length };
}
