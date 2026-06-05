declare const latBrand: unique symbol;
declare const lngBrand: unique symbol;

/** 검증된 WGS84 위도 (–90~90, 십진수도). toLatLng로만 생성된다. */
export type Latitude = number & { readonly [latBrand]: true };
/** 검증된 WGS84 경도 (–180~180, 십진수도). toLatLng로만 생성된다. */
export type Longitude = number & { readonly [lngBrand]: true };

/**
 * 지도/마커용 좌표. lat·lng는 브랜드 타입이라 임의 number로는 만들 수 없다.
 * 반드시 toLatLng를 거쳐야 하므로 ×10⁷ 원시값 같은 잘못된 스케일이 흘러드는 걸 막는다.
 */
export type LatLng = { lat: Latitude; lng: Longitude; label?: string };
