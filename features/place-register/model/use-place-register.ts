'use client';

import { useState } from 'react';

import type { AmenityId } from '@/shared/config';
import { toast } from '@/shared/lib';

import { formToPayload, prefillToForm } from '../lib/place-to-form';
import type { PlaceFormPrefill, PlaceRegisterFormState, PlaceRegisterPayload } from '../lib/type';

/**
 * 장소 등록 폼의 상태·검증·저장 흐름을 보유한다.
 * 실제 persist는 boundaries 규칙상 feature가 직접 못 하므로 onSubmit으로 주입받는다.
 * prefill이 초기 상태를 정하므로, 다른 장소를 등록하려면 소비처에서 key로 remount 한다.
 */
export function usePlaceRegister(prefill: PlaceFormPrefill, onSubmit: (payload: PlaceRegisterPayload) => Promise<void>) {
    const [form, setForm] = useState<PlaceRegisterFormState>(() => prefillToForm(prefill));
    const [saving, setSaving] = useState(false);

    const set = <K extends keyof PlaceRegisterFormState>(key: K, val: PlaceRegisterFormState[K]) =>
        setForm((prev) => ({ ...prev, [key]: val }));

    const toggleAmenity = (id: AmenityId) =>
        setForm((prev) => ({
            ...prev,
            amenities: prev.amenities.includes(id) ? prev.amenities.filter((a) => a !== id) : [...prev.amenities, id]
        }));

    const save = async () => {
        if (!form.name.trim()) {
            toast('이름을 입력해주세요');
            return;
        }
        if (!form.area) {
            toast('동네를 선택해주세요');
            return;
        }
        setSaving(true);
        try {
            await onSubmit(formToPayload(form));
            toast('장소를 저장했어요');
        } catch {
            toast('저장에 실패했어요');
        } finally {
            setSaving(false);
        }
    };

    return { form, set, toggleAmenity, saving, save };
}
