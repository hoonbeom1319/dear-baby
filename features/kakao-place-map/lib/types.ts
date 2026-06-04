/** mapx(경도)·mapy(위도) — WGS84×10⁷ 정수 문자열 */
export type MapPlace = {
    mapx: string;
    mapy: string;
};

/** 지도 검색 결과(카카오 Places → mapx/mapy 형식으로 정규화) */
export type KakaoSearchPlace = MapPlace & {
    title: string;
    link: string;
    category: string;
    description: string;
    telephone: string;
    address: string;
    roadAddress: string;
};

export type MapCenter = { lat: number; lng: number };

/** 지도 카메라가 이동할 좌표 */
export type MapFocusPlace = MapCenter;

export type KakaoPlaceMapSearchResult =
    | { ok: true; places: KakaoSearchPlace[] }
    | { ok: false; reason: 'fetch_failed' };
