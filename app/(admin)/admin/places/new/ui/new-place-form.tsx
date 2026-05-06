'use client';

import { useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

type FormState = {
    region_code: string;
    sub_region: string;
    kind: string;
    name: string;
    short_description: string;
    honey_tip: string;
    address: string;
    lat: string;
    lng: string;
};

const initialState: FormState = {
    region_code: '',
    sub_region: '',
    kind: '식당',
    name: '',
    short_description: '',
    honey_tip: '',
    address: '',
    lat: '',
    lng: ''
};

function parseNullableNumber(v: string): number | null {
    const trimmed = v.trim();
    if (!trimmed) return null;
    const n = Number(trimmed);
    return Number.isFinite(n) ? n : null;
}

export default function NewPlaceForm() {
    const router = useRouter();
    const [form, setForm] = useState<FormState>(initialState);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const canSubmit = useMemo(() => {
        return (
            form.region_code.trim().length > 0 &&
            form.sub_region.trim().length > 0 &&
            form.kind.trim().length > 0 &&
            form.name.trim().length > 0 &&
            form.short_description.trim().length > 0
        );
    }, [form]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!canSubmit) {
            setError('필수 항목(지역코드/세부지역/카테고리/이름/한줄설명)을 입력해 주세요.');
            return;
        }

        const lat = parseNullableNumber(form.lat);
        const lng = parseNullableNumber(form.lng);
        if ((form.lat.trim() && lat === null) || (form.lng.trim() && lng === null)) {
            setError('위도/경도는 숫자만 입력해 주세요.');
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch('/api/admin/places', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    region_code: form.region_code.trim(),
                    sub_region: form.sub_region.trim(),
                    kind: form.kind.trim(),
                    name: form.name.trim(),
                    short_description: form.short_description.trim(),
                    honey_tip: form.honey_tip.trim() ? form.honey_tip.trim() : null,
                    address: form.address.trim() ? form.address.trim() : null,
                    lat,
                    lng,
                    map_links: null,
                    images: null
                })
            });

            const json = (await res.json().catch(() => null)) as
                | { ok: true; id: string }
                | { ok: false; error?: { message?: string } }
                | null;
            if (!res.ok || !json?.ok) {
                const message = json && 'error' in json ? json.error?.message : undefined;
                throw new Error(message ?? '등록에 실패했어요.');
            }

            router.push('/admin/places');
            router.refresh();
        } catch (e) {
            setError(e instanceof Error ? e.message : '알 수 없는 오류가 발생했어요.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form className="space-y-6" onSubmit={onSubmit}>
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="mb-2 block text-xs font-bold text-neutral-600">장소 이름 *</label>
                    <input
                        className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-medium outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                        value={form.name}
                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                        placeholder="예: 키즈프렌들리 카페"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-xs font-bold text-neutral-600">카테고리 *</label>
                    <select
                        className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-medium outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                        value={form.kind}
                        onChange={(e) => setForm((p) => ({ ...p, kind: e.target.value }))}
                    >
                        <option value="식당">식당</option>
                        <option value="카페">카페</option>
                        <option value="놀거리">놀거리</option>
                        <option value="복합몰">복합몰</option>
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-xs font-bold text-neutral-600">지역코드(REGIONS) *</label>
                    <input
                        className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-medium outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                        value={form.region_code}
                        onChange={(e) => setForm((p) => ({ ...p, region_code: e.target.value }))}
                        placeholder="예: SEOUL"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-xs font-bold text-neutral-600">세부지역 *</label>
                    <input
                        className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-medium outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                        value={form.sub_region}
                        onChange={(e) => setForm((p) => ({ ...p, sub_region: e.target.value }))}
                        placeholder="예: 강남구"
                    />
                </div>

                <div className="col-span-2">
                    <label className="mb-2 block text-xs font-bold text-neutral-600">한줄 설명 *</label>
                    <input
                        className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-medium outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                        value={form.short_description}
                        onChange={(e) => setForm((p) => ({ ...p, short_description: e.target.value }))}
                        placeholder="예: 유모차 진입이 편하고 아기의자가 준비된 곳"
                    />
                </div>

                <div className="col-span-2">
                    <label className="mb-2 block text-xs font-bold text-neutral-600">주소</label>
                    <input
                        className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-medium outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                        value={form.address}
                        onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                        placeholder="예: 서울특별시 ..."
                    />
                </div>

                <div>
                    <label className="mb-2 block text-xs font-bold text-neutral-600">위도</label>
                    <input
                        className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-medium outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                        value={form.lat}
                        onChange={(e) => setForm((p) => ({ ...p, lat: e.target.value }))}
                        placeholder="37.5665"
                        inputMode="decimal"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-xs font-bold text-neutral-600">경도</label>
                    <input
                        className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-medium outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                        value={form.lng}
                        onChange={(e) => setForm((p) => ({ ...p, lng: e.target.value }))}
                        placeholder="126.9780"
                        inputMode="decimal"
                    />
                </div>

                <div className="col-span-2">
                    <label className="mb-2 block text-xs font-bold text-neutral-600">실전 외출 꿀팁</label>
                    <textarea
                        className="min-h-28 w-full resize-y rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-medium outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                        value={form.honey_tip}
                        onChange={(e) => setForm((p) => ({ ...p, honey_tip: e.target.value }))}
                        placeholder="예: 점심 피크(12~1시)만 피하면 유아 의자 수급이 수월해요."
                    />
                </div>
            </div>

            {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div> : null}

            <div className="flex items-center justify-end gap-3">
                <button
                    type="button"
                    className="rounded-full border border-neutral-300 px-6 py-3 text-sm font-bold hover:bg-neutral-100"
                    onClick={() => setForm(initialState)}
                    disabled={submitting}
                >
                    초기화
                </button>
                <button
                    type="submit"
                    className="rounded-full bg-orange-600 px-8 py-3 text-sm font-bold text-white shadow hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={!canSubmit || submitting}
                >
                    {submitting ? '등록 중…' : '등록 완료'}
                </button>
            </div>
        </form>
    );
}

