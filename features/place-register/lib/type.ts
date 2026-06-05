import type { AmenityId, AreaId, CategoryId } from '@/shared/config';

/**
 * 외부(검색 결과 등)에서 폼을 미리 채우기 위한 중립 입력.
 * KakaoSearchPlace 같은 특정 슬라이스 타입에 의존하지 않도록 단순 값만 받는다.
 */
export type PlaceFormPrefill = {
    name: string;
    area: AreaId | '';
    category: CategoryId;
    address: string;
    phone: string;
};

/** 폼 내부 상태 — 사용자가 편집하는 모든 필드. */
export type PlaceRegisterFormState = {
    name: string;
    area: AreaId;
    category: CategoryId;
    address: string;
    phone: string;
    ageRangeStart: string;
    ageRangeEnd: string;
    sortOrder: string;
    description: string;
    amenities: AmenityId[];
};

/**
 * 서버에 넘길 등록 페이로드.
 * 실제 저장(server/controllers)은 feature가 직접 호출할 수 없어(boundaries 규칙),
 * 소비처가 이 모양을 받아 persist 한다.
 */
export type PlaceRegisterPayload = {
    area: AreaId;
    category: CategoryId;
    name: string;
    address: string;
    phone: string;
    ageRange: string;
    description: string;
    amenities: AmenityId[];
    sortOrder: number;
};
