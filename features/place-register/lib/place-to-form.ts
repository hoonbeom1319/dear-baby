import type { PlaceFormPrefill, PlaceRegisterFormState, PlaceRegisterPayload } from './type';

/** 프리필 값으로 폼 초기 상태를 만든다. 프리필이 없는 필드는 빈 값으로 시작. */
export function prefillToForm(prefill: PlaceFormPrefill): PlaceRegisterFormState {
    return {
        name: prefill.name,
        area: prefill.area as PlaceRegisterFormState['area'],
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
