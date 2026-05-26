import type { AreaId } from '@/shared/config';

/**
 * 코스 = 큐레이터가 순서대로 묶은 장소 시퀀스. (PRD 6.1 Course)
 * stopIds는 Place id 목록, comments는 각 정거장의 큐레이터 코멘트(순서 일치).
 */
export type Course = {
    id: string;
    area: AreaId;
    title: string;
    /** 예상 소요 시간 라벨, 예: "약 4시간". */
    duration: string;
    season: string;
    description: string;
    stopIds: string[];
    comments: string[];
};
