import { loadKakaoSdk } from './helper';

/** 키워드 검색 결과 한 건 — 장소 추가 시트가 이걸로 그룹을 만든다(source 'kakao'). */
export type PlaceSearchResult = {
    name: string;
    address: string;
    lat: number;
    lng: number;
    kakaoPlaceId: string;
};

/**
 * 키워드로 카카오 장소를 검색한다(지도 없이). 장소 추가 시트의 검색 모드용.
 * `near`가 있으면 그 좌표 거리순으로(그날 동선 근처 우선), 없으면 정확도순.
 */
export async function searchPlacesByKeyword(keyword: string, near?: { lat: number; lng: number }): Promise<PlaceSearchResult[]> {
    const q = keyword.trim();
    if (!q) return [];

    await loadKakaoSdk();
    const places = new kakao.maps.services.Places();

    return new Promise((resolve, reject) => {
        places.keywordSearch(
            q,
            (result, status) => {
                if (status === kakao.maps.services.Status.ZERO_RESULT) {
                    resolve([]);
                    return;
                }
                if (status !== kakao.maps.services.Status.OK) {
                    reject(new Error(`kakao keyword search: ${status}`));
                    return;
                }
                resolve(
                    result.map((doc) => ({
                        name: doc.place_name,
                        address: doc.road_address_name || doc.address_name,
                        lat: Number(doc.y),
                        lng: Number(doc.x),
                        kakaoPlaceId: doc.id
                    }))
                );
            },
            near ? { x: String(near.lng), y: String(near.lat), sort: kakao.maps.services.SortBy.DISTANCE, size: 15 } : { sort: kakao.maps.services.SortBy.ACCURACY, size: 15 }
        );
    });
}
