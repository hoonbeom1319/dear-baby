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

/** 프리필 값으로 폼 초기 상태를 만든다. 프리필이 없는 필드는 빈 값으로 시작. */
export function prefillToForm(prefill: PlaceFormPrefill): PlaceRegisterFormState {
    return {
        name: prefill.name,
        area: (prefill.area || '') as AreaId,
        category: prefill.category,
        address: prefill.address,
        phone: prefill.phone,
        ageRangeStart: '',
        ageRangeEnd: '',
        sortOrder: '0',
        description: '',
        amenities: []
    };
}

/** 시작/끝 월령 입력을 표시용 한 문장으로 합친다. */
export function buildAgeRange(start: string, end: string): string {
    if (!start && !end) return '전 연령';
    if (start && !end) return `${start}개월~`;
    if (start && end) return `${start}~${end}개월`;
    return '';
}

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

/** 폼 상태를 trim·숫자 변환·월령 합성까지 끝낸 페이로드로 만든다. */
export function formToPayload(form: PlaceRegisterFormState): PlaceRegisterPayload {
    return {
        area: form.area,
        category: form.category,
        name: form.name.trim(),
        address: form.address.trim(),
        phone: form.phone.trim(),
        ageRange: buildAgeRange(form.ageRangeStart, form.ageRangeEnd),
        description: form.description.trim(),
        amenities: form.amenities,
        sortOrder: Number(form.sortOrder) || 0
    };
}
