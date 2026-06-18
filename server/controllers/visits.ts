import { deleteVisit, findVisitFeed, insertVisit, updateVisit, type VisitPatch } from '../dao/visits';
import { signPhotoPaths } from '../lib/sign-photos';

export type { VisitPatch } from '../dao/visits';

/** 클라이언트로 내보내는 타임라인 항목 — 썸네일은 storagePath 대신 서명 URL */
export type VisitFeedView = {
    id: string;
    visitedOn: string;
    note: string | null;
    placeId: string;
    placeName: string;
    photoCount: number;
    thumbnailUrl: string | null;
};

/**
 * 홈 날짜별 타임라인 — 방문 전체를 날짜순으로, 방문마다 대표 사진 1장만 서명한다.
 * (상세처럼 전 사진을 서명하지 않아 리스트가 가벼움.)
 */
export async function fetchVisitFeed(userId: string): Promise<VisitFeedView[]> {
    const items = await findVisitFeed(userId);
    const paths = items.map((i) => i.thumbnailPath).filter((p): p is string => p !== null);
    const urlByPath = await signPhotoPaths(paths);

    return items.map((i) => ({
        id: i.id,
        visitedOn: i.visitedOn,
        note: i.note,
        placeId: i.placeId,
        placeName: i.placeName,
        photoCount: i.photoCount,
        thumbnailUrl: i.thumbnailPath ? (urlByPath.get(i.thumbnailPath) ?? null) : null
    }));
}

export async function modifyVisit(userId: string, visitId: string, patch: VisitPatch): Promise<void> {
    return updateVisit(userId, visitId, patch);
}

export async function removeVisit(userId: string, visitId: string): Promise<void> {
    return deleteVisit(userId, visitId);
}

/** 기존 장소에 새 방문 추가 → 생성된 visit id */
export async function createVisit(userId: string, placeId: string, visitedOn: string, note: string | null): Promise<string> {
    return insertVisit(userId, placeId, visitedOn, note);
}
