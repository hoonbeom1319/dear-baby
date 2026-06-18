// 클라이언트가 다루는 타임라인 도메인 타입 (BFF /api/timeline 응답 형태와 일치)

/** 홈 날짜별 리스트 한 항목 — 한 번의 방문 + 소속 장소명 + 대표 썸네일 */
export type TimelineVisit = {
    id: string;
    visitedOn: string; // YYYY-MM-DD
    note: string | null;
    placeId: string;
    placeName: string;
    photoCount: number;
    thumbnailUrl: string | null; // 서명 URL (만료 있음)
};
