import type { AmenityId, AreaId, CategoryId } from '@/shared/config';

export type PlaceStatus = 'public' | 'review';

/** 장소 표시용 view model. (PRD 6.1 Place) */
export type Place = {
    id: string;
    area: AreaId;
    category: CategoryId;
    name: string;
    address: string;
    phone: string;
    /** 권장 월령 범위 라벨, 예: "6개월~", "12~48개월", "전 연령". */
    ageRange: string;
    /** 한 줄 설명 · 큐레이터 코멘트. */
    description: string;
    /** 보유한 편의시설만 (없는 것은 담지 않는다). */
    amenities: AmenityId[];
};

/** 어드민용 — Place + 관리 메타. */
export type PlaceAdmin = Place & {
    sortOrder: number;
    status: PlaceStatus;
};
