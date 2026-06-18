import { deleteVisit, insertVisit, updateVisit, type VisitPatch } from '../dao/visits';

export type { VisitPatch } from '../dao/visits';

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
