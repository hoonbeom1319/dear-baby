import { insertRecordSession, type RecordGroupInput } from '../dao/records';

export type { RecordGroupInput, RecordPhotoInput } from '../dao/records';

/**
 * 기록 세션 생성 — Place/Visit/Photo + pin_created 이벤트를 원자적으로 만든다.
 * 반환: 생성된 place id 배열 (지도에서 방금 박힌 핀 강조용)
 */
export async function createRecord(userId: string, groups: RecordGroupInput[]): Promise<string[]> {
    return insertRecordSession(userId, groups);
}
