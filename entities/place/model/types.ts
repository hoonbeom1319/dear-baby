// 클라이언트가 다루는 장소 도메인 타입 (BFF /api/places 응답 형태와 일치)

export type PlaceSource = 'kakao' | 'manual';

/** 지도 핀 + 누적 방문 요약 (지도 홈) */
export type PlaceSummary = {
    id: string;
    name: string;
    lat: number;
    lng: number;
    source: PlaceSource;
    kakaoPlaceId: string | null;
    visitCount: number;
    lastVisitedOn: string | null;
};

export type Photo = {
    id: string;
    url: string | null; // 서명 URL (만료 있음)
    takenAt: string | null;
    sortOrder: number;
};

export type Visit = {
    id: string;
    visitedOn: string;
    note: string | null;
    createdAt: string;
    photos: Photo[];
};

/** 장소 상세 — 방문 시간순 */
export type PlaceDetail = {
    id: string;
    name: string;
    lat: number;
    lng: number;
    source: PlaceSource;
    kakaoPlaceId: string | null;
    createdAt: string;
    visits: Visit[];
};

// ─── 기록 세션 입력 (편집기 → BFF /api/records) ──────────────────────────────
// 사진 바이너리는 브라우저가 Storage에 먼저 올리고, 여기엔 그 경로만 담는다.

export type RecordPhotoInput = {
    storagePath: string;
    takenAt: string | null;
    sortOrder: number;
};

// ─── 저장 후 편집 입력 (장소 상세 → BFF) ─────────────────────────────────────

/** 핀을 옮기면 카카오 연결이 끊겨 source='manual'로 내려간다. */
export type PlacePatch = { name?: string; lat?: number; lng?: number; source?: 'manual'; kakaoPlaceId?: string | null };
export type VisitPatch = { visitedOn?: string; note?: string | null };
/** 기존 장소에 새 방문 추가 */
export type VisitInput = { visitedOn: string; note: string | null };

/** 한 장소 그룹 = Place 1개 + Visit 1개(+ 사진들) */
export type RecordGroupInput = {
    name: string;
    lat: number;
    lng: number;
    source: PlaceSource;
    kakaoPlaceId: string | null;
    visitedOn: string; // YYYY-MM-DD
    note: string | null;
    photos: RecordPhotoInput[];
};
