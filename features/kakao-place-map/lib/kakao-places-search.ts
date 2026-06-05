import type { KakaoSearchPlace } from './types';

/** WGS84 도(소수) → mapx/mapy용 ×10⁷ 정수 문자열 */
const toCoord = (value: string): string => {
    const n = Number(value);
    if (!Number.isFinite(n)) return '0';
    return String(Math.round(n * 1e7));
};

/** 현재 지도 화면(bounds) 기준 키워드 검색 — 거리순, API 한도(45건)까지 페이지네이션 */
export const searchPlacesOnMap = (map: kakao.maps.Map, keyword: string): Promise<KakaoSearchPlace[]> => {
    const q = keyword.trim();
    if (!q) return Promise.resolve([]);

    return new Promise((resolve, reject) => {
        const service = new kakao.maps.services.Places(map);
        const collected: KakaoSearchPlace[] = [];

        const callback = (data: kakao.maps.services.PlacesSearchDocument[], status: kakao.maps.services.Status, pagination: kakao.maps.services.Pagination) => {
            if (status === kakao.maps.services.Status.OK) {
                collected.push(
                    ...data.map((doc) => ({
                        title: doc.place_name,
                        link: doc.place_url ?? '',
                        category: doc.category_name,
                        description: '',
                        telephone: doc.phone ?? '',
                        address: doc.address_name,
                        roadAddress: doc.road_address_name || doc.address_name,
                        mapx: toCoord(doc.x),
                        mapy: toCoord(doc.y)
                    }))
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

        service.keywordSearch(q, callback, {
            useMapBounds: true,
            location: map.getCenter(),
            sort: kakao.maps.services.SortBy.DISTANCE,
            size: 15 // API 페이지당 최대
        });
    });
};
