import { loadKakaoSdk } from './helper';

/** 키워드 검색 결과 한 건 — 장소 추가 시트가 이걸로 그룹을 만든다(source 'kakao'). */
export type PlaceSearchResult = {
    name: string;
    address: string;
    lat: number;
    lng: number;
    kakaoPlaceId: string;
};

/** 검색·지도에서 고른 장소 — 새 장소 추가/장소 수정의 입력. (기록 편집기·장소 상세 공용) */
export type PickedPlace = {
    name: string;
    source: 'kakao' | 'manual';
    lat: number;
    lng: number;
    kakaoPlaceId: string | null;
};

/**
 * 키워드로 카카오 장소를 검색한다(지도 없이). 사용자가 직접 하는 장소 검색용.
 * 항상 정확도순 — 거리순으로 하면 좌표 근처(예: 몰 안)의 입점 매장이 대표 장소보다 위로 올라온다.
 * (좌표 기반 자동 제안은 역지오코딩 suggestPlaceCandidates가 따로 담당한다.)
 */
export async function searchPlacesByKeyword(keyword: string): Promise<PlaceSearchResult[]> {
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
            { sort: kakao.maps.services.SortBy.ACCURACY, size: 15 }
        );
    });
}
