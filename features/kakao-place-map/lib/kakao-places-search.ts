import type { KakaoSearchPlace } from './types';

/** WGS84 도(소수) → mapx/mapy용 ×10⁷ 정수 문자열 */
const toCoord = (value: string): string => {
    const n = Number(value);
    if (!Number.isFinite(n)) return '0';
    return String(Math.round(n * 1e7));
};

/** 정렬용 위경도 유클리드 거리² (소영역 내 대소 비교만 사용) */
const distanceSq = (lat1: number, lng1: number, lat2: number, lng2: number): number =>
    (lat1 - lat2) ** 2 + (lng1 - lng2) ** 2;

/** rect 한 구역 검색 — API 한도(45건)까지 페이지네이션 후 반환 */
const searchRect = (
    keyword: string,
    rect: string,
    cx: number,
    cy: number,
): Promise<(KakaoSearchPlace & { _id: string })[]> =>
    new Promise((resolve, reject) => {
        const service = new kakao.maps.services.Places();
        const collected: (KakaoSearchPlace & { _id: string })[] = [];

        const callback = (
            data: kakao.maps.services.PlacesSearchDocument[],
            status: kakao.maps.services.Status,
            pagination: kakao.maps.services.Pagination,
        ) => {
            if (status === kakao.maps.services.Status.OK) {
                collected.push(
                    ...data.map((doc) => ({
                        _id: doc.id,
                        title: doc.place_name,
                        link: doc.place_url ?? '',
                        category: doc.category_name,
                        description: '',
                        telephone: doc.phone ?? '',
                        address: doc.address_name,
                        roadAddress: doc.road_address_name || doc.address_name,
                        mapx: toCoord(doc.x),
                        mapy: toCoord(doc.y),
                    })),
                );
                if (pagination.hasNextPage) {
                    pagination.nextPage();
                    return;
                }
                resolve(collected);
                return;
            }
            if (status === kakao.maps.services.Status.ZERO_RESULT) {
                resolve([]);
                return;
            }
            reject(new Error(`kakao places search: ${status}`));
        };

        service.keywordSearch(keyword, callback, {
            rect,
            x: String(cx),
            y: String(cy),
            sort: kakao.maps.services.SortBy.DISTANCE,
            size: 15,
        });
    });

/**
 * 현재 지도 화면을 2×2로 분할해 병렬 검색 — 최대 ~180건
 * place.id 기준 중복 제거 후 지도 중심 거리순 정렬
 */
export const searchPlacesOnMap = async (map: kakao.maps.Map, keyword: string): Promise<KakaoSearchPlace[]> => {
    const q = keyword.trim();
    if (!q) return [];

    const bounds = map.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    const x1 = sw.getLng(), y1 = sw.getLat();
    const x2 = ne.getLng(), y2 = ne.getLat();
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;

    // [rect 문자열, 구역 중심 경도, 구역 중심 위도]
    const zones: [string, number, number][] = [
        [`${x1},${y1},${mx},${my}`, (x1 + mx) / 2, (y1 + my) / 2], // SW
        [`${mx},${y1},${x2},${my}`, (mx + x2) / 2, (y1 + my) / 2], // SE
        [`${x1},${my},${mx},${y2}`, (x1 + mx) / 2, (my + y2) / 2], // NW
        [`${mx},${my},${x2},${y2}`, (mx + x2) / 2, (my + y2) / 2], // NE
    ];

    const results = await Promise.allSettled(
        zones.map(([rect, cx, cy]) => searchRect(q, rect, cx, cy)),
    );

    const center = map.getCenter();
    const cLat = center.getLat();
    const cLng = center.getLng();

    const seen = new Set<string>();
    const merged: (KakaoSearchPlace & { _d: number })[] = [];

    for (const result of results) {
        if (result.status !== 'fulfilled') continue;
        for (const { _id, ...place } of result.value) {
            if (seen.has(_id)) continue;
            seen.add(_id);
            const lat = Number(place.mapy) / 1e7;
            const lng = Number(place.mapx) / 1e7;
            merged.push({ ...place, _d: distanceSq(cLat, cLng, lat, lng) });
        }
    }

    merged.sort((a, b) => a._d - b._d);

    return merged.map(({ _d: _, ...place }) => place);
};
