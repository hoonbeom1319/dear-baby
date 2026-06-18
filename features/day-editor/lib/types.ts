import type { PlaceCandidate } from '@/shared/kakao-map';

/** EXIF 분석을 마친 사진 한 장 */
export type AnalyzedPhoto = {
    file: File;
    /** WGS84 좌표 — 없으면 null (미분류로 빠짐) */
    gps: { lat: number; lng: number } | null;
    takenAt: Date | null;
};

/** 위치 근접으로 묶인 한 장소 그룹 = 편집기 초기 카드 1개 (Place 1 + Visit 1 후보) */
export type DayPlaceGroup = {
    /** 클라이언트 임시 id (저장 전) */
    id: string;
    photos: AnalyzedPhoto[];
    /** 그룹 대표 좌표(무게중심) — 역지오코딩 기준점 */
    center: { lat: number; lng: number };
    /** 대표 촬영시각에서 뽑은 방문일 제안 (YYYY-MM-DD, 로컬). 촬영시각이 전혀 없으면 null */
    visitedOn: string | null;
    /** 좌표→장소명 후보 — 사용자가 고른다(자동 top1 확정 금지). 분석 직후엔 빈 배열 */
    candidates: PlaceCandidate[];
};

/** A-3 편집기를 "이미 채워진 상태"로 시작시키는 분석 결과 (PRD F-2/F-3/F-4) */
export type DayAnalysis = {
    /** 동선 순서(가장 이른 촬영시각 기준)로 정렬된 장소 그룹들. 같은 장소라도 날짜가 다르면 별도 그룹(방문). */
    groups: DayPlaceGroup[];
    /** GPS 없는 사진 — 미분류 영역. 메인 흐름과 동등한 무게(PRD F-3) */
    unsorted: AnalyzedPhoto[];
};
