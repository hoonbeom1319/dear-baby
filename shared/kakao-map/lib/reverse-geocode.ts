import { loadKakaoSdk } from './helper';

export type PlaceCandidateKind = 'poi' | 'building' | 'address';

/** 좌표 하나에 대한 장소명 후보 — 사용자가 이 중에서 고른다(자동 top1 확정 금지) */
export type PlaceCandidate = {
    name: string;
    lat: number;
    lng: number;
    /** poi=카카오 장소 / building=도로명주소 건물명 / address=도로명주소 폴백 */
    kind: PlaceCandidateKind;
    /** 카카오 POI id (poi일 때만) — 그대로 Place.kakao_place_id 로 쓸 수 있다 */
    kakaoPlaceId: string | null;
    category: string | null;
    /** 기준 좌표로부터의 거리(m) — poi만 */
    distanceM: number | null;
};

export type SuggestOptions = {
    /** 반환할 POI 후보 최대 개수 (building/address 폴백은 별도) */
    topN?: number;
    /** 주변 POI 검색 반경(m) */
    radiusM?: number;
};

// 가족 나들이 맥락에서 의미 있는 카테고리 그룹.
// 카카오 카테고리검색은 code가 필수라 대표군을 순회한다(공원은 약하지만 building/주소 폴백이 받친다).
// AT4 관광명소 · CT1 문화시설 · FD6 음식점 · CE7 카페 · MT1 대형마트
// CS2 편의점 · PK6 주차장 · PO3 공공기관 · SC4 학교 · AD5 숙박
const CATEGORY_CODES = ['AT4', 'CT1', 'FD6', 'CE7', 'MT1', 'CS2', 'PK6', 'PO3', 'SC4', 'AD5'] as const;

const normalize = (s: string): string => s.replace(/\s+/g, '');

/**
 * 좌표 → 카카오 장소명 후보 리스트. (역지오코딩 검증 결론을 그대로 구현, [[verify-kakao-reverse-geocoding]])
 *
 * 카카오엔 "좌표→POI명" 단일 API가 없어 두 경로를 조합한다:
 *   - coord2Address : 도로명주소 + building_name (대형건물·실내에서 POI가 놓치는 대표명)
 *   - categorySearch(좌표·거리순) : 주변 POI 거리순 — 후보의 본체
 *
 * 3중 폴백: ② building_name을 상단에 → ① 주변 POI top-N → ③ 도로명주소(항상 존재하는 기본값).
 */
export async function suggestPlaceCandidates(
    coord: { lat: number; lng: number },
    options: SuggestOptions = {},
): Promise<PlaceCandidate[]> {
    await loadKakaoSdk();

    const topN = options.topN ?? 5;
    const radius = options.radiusM ?? 100;
    const geocoder = new kakao.maps.services.Geocoder();
    const places = new kakao.maps.services.Places();

    const [addr, categoryResults] = await Promise.all([
        coord2Address(geocoder, coord.lng, coord.lat),
        Promise.all(CATEGORY_CODES.map((code) => categorySearch(places, code, coord.lng, coord.lat, radius))),
    ]);

    // ① 주변 POI — id 기준 중복 제거 후 거리순
    const seen = new Set<string>();
    const pois: PlaceCandidate[] = [];
    for (const result of categoryResults) {
        for (const doc of result) {
            if (seen.has(doc.id)) continue;
            seen.add(doc.id);
            const lat = Number(doc.y);
            const lng = Number(doc.x);
            if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
            pois.push({
                name: doc.place_name,
                lat,
                lng,
                kind: 'poi',
                kakaoPlaceId: doc.id,
                category: doc.category_group_name || doc.category_name || null,
                distanceM: doc.distance ? Number(doc.distance) : null,
            });
        }
    }
    pois.sort((a, b) => (a.distanceM ?? Infinity) - (b.distanceM ?? Infinity));

    const candidates: PlaceCandidate[] = [];

    // ② building_name 을 후보 상단에 — 실내·대형건물에서 POI top1이 놓치는 대표 장소
    if (addr?.buildingName) {
        const matchingPoi = pois.find((p) => normalize(p.name) === normalize(addr.buildingName!));
        candidates.push(
            matchingPoi ?? {
                name: addr.buildingName,
                lat: coord.lat,
                lng: coord.lng,
                kind: 'building',
                kakaoPlaceId: null,
                category: null,
                distanceM: null,
            },
        );
    }

    // ① 주변 POI top-N (이미 들어간 후보와 중복 제외)
    for (const poi of pois) {
        if (candidates.some((c) => (c.kakaoPlaceId && c.kakaoPlaceId === poi.kakaoPlaceId) || normalize(c.name) === normalize(poi.name))) {
            continue;
        }
        candidates.push(poi);
        if (candidates.length >= topN) break;
    }

    // ③ 도로명주소 폴백 — 후보가 비거나, 마지막 기본값으로 항상 하나 보장 ("이름 없음" 방지)
    const addressName = addr?.roadAddress || addr?.address;
    if (addressName && !candidates.some((c) => normalize(c.name) === normalize(addressName))) {
        candidates.push({
            name: addressName,
            lat: coord.lat,
            lng: coord.lng,
            kind: 'address',
            kakaoPlaceId: null,
            category: null,
            distanceM: null,
        });
    }

    return candidates;
}

type AddressResult = { buildingName: string | null; roadAddress: string | null; address: string | null };

function coord2Address(geocoder: kakao.maps.services.Geocoder, x: number, y: number): Promise<AddressResult | null> {
    return new Promise((resolve) => {
        geocoder.coord2Address(x, y, (result, status) => {
            if (status !== kakao.maps.services.Status.OK || !result[0]) {
                resolve(null);
                return;
            }
            const doc = result[0];
            resolve({
                buildingName: doc.road_address?.building_name || null,
                roadAddress: doc.road_address?.address_name || null,
                address: doc.address?.address_name || null,
            });
        });
    });
}

function categorySearch(
    places: kakao.maps.services.Places,
    code: string,
    x: number,
    y: number,
    radius: number,
): Promise<kakao.maps.services.PlacesSearchDocument[]> {
    return new Promise((resolve) => {
        places.categorySearch(
            code,
            (result, status) => {
                resolve(status === kakao.maps.services.Status.OK ? result : []);
            },
            { x: String(x), y: String(y), radius, sort: kakao.maps.services.SortBy.DISTANCE, size: 5 },
        );
    });
}
