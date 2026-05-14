'use client';

import { useEffect, useMemo, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { useRegionList } from '@/entities/regions/model/use-region-list';

type Catalog = {
    categories: { code: string; displayName: string }[];
    amenities: { code: string; displayName: string; icon: string }[];
};

type FormState = {
    region_code: string;
    sub_region_code: string;
    category_code: string;
    name: string;
    subtitle: string;
    headline: string;
    description: string;
    honey_tip: string;
    address: string;
    lat: string;
    lng: string;
    map_kakao: string;
    map_naver: string;
    map_tmap: string;
    images_text: string;
};

const emptyForm: FormState = {
    region_code: '',
    sub_region_code: '',
    category_code: '',
    name: '',
    subtitle: '',
    headline: '',
    description: '',
    honey_tip: '',
    address: '',
    lat: '',
    lng: '',
    map_kakao: '',
    map_naver: '',
    map_tmap: '',
    images_text: ''
};

function parseNullableNumber(v: string): number | null {
    const trimmed = v.trim();
    if (!trimmed) return null;
    const n = Number(trimmed);
    return Number.isFinite(n) ? n : null;
}

async function fetchPlaceCatalog(): Promise<Catalog> {
    const res = await fetch('/api/place-form-options');
    const json = (await res.json().catch(() => null)) as
        | { ok: true; categories: Catalog['categories']; amenities: Catalog['amenities'] }
        | { ok: false; error?: { message?: string } }
        | null;
    if (!res.ok || !json || !('ok' in json) || !json.ok) {
        const msg = json && 'error' in json ? json.error?.message : undefined;
        throw new Error(msg ?? '카테고리·시설 정보를 불러오지 못했어요.');
    }
    return { categories: json.categories, amenities: json.amenities };
}

export default function NewPlaceForm() {
    const router = useRouter();
    const { list: regions, isPending: regionsPending } = useRegionList();

    const { data: catalog, isPending: catalogPending, isError: catalogError, error: catalogErr } = useQuery({
        queryKey: ['place-form-options'],
        queryFn: fetchPlaceCatalog
    });

    const [form, setForm] = useState<FormState>(emptyForm);
    const [amenityCodes, setAmenityCodes] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const selectedRegion = useMemo(() => regions.find((r) => r.code === form.region_code) ?? null, [form.region_code, regions]);

    useEffect(() => {
        if (!catalog?.categories.length) return;
        setForm((p) => (p.category_code ? p : { ...p, category_code: catalog.categories[0]!.code }));
    }, [catalog?.categories]);

    useEffect(() => {
        if (!regions.length || form.region_code) return;
        setForm((p) => ({ ...p, region_code: regions[0]!.code }));
    }, [regions, form.region_code]);

    const canSubmit = useMemo(() => {
        return (
            form.region_code.trim().length > 0 &&
            form.sub_region_code.trim().length > 0 &&
            form.category_code.trim().length > 0 &&
            form.name.trim().length > 0
        );
    }, [form]);

    function toggleAmenity(code: string) {
        setAmenityCodes((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!canSubmit) {
            setError('필수 항목(시·도, 시·군·구, 카테고리, 이름)을 입력해 주세요.');
            return;
        }

        const lat = parseNullableNumber(form.lat);
        const lng = parseNullableNumber(form.lng);
        if ((form.lat.trim() && lat === null) || (form.lng.trim() && lng === null)) {
            setError('위도/경도는 숫자만 입력해 주세요.');
            return;
        }

        const map_links: { kakao?: string; naver?: string; tmap?: string } = {};
        const k = form.map_kakao.trim();
        const n = form.map_naver.trim();
        const t = form.map_tmap.trim();
        if (k) map_links.kakao = k;
        if (n) map_links.naver = n;
        if (t) map_links.tmap = t;

        const images = form.images_text
            .split(/\r?\n|,/)
            .map((s) => s.trim())
            .filter(Boolean);

        setSubmitting(true);
        try {
            const res = await fetch('/api/admin/places', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    region_code: form.region_code.trim(),
                    sub_region_code: form.sub_region_code.trim(),
                    category_code: form.category_code.trim(),
                    name: form.name.trim(),
                    subtitle: form.subtitle.trim() ? form.subtitle.trim() : null,
                    headline: form.headline.trim() ? form.headline.trim() : null,
                    description: form.description.trim() ? form.description.trim() : null,
                    honey_tip: form.honey_tip.trim() ? form.honey_tip.trim() : null,
                    address: form.address.trim() ? form.address.trim() : null,
                    lat,
                    lng,
                    map_links: Object.keys(map_links).length ? map_links : null,
                    images: images.length ? images : null,
                    amenity_codes: amenityCodes
                })
            });

            const json = (await res.json().catch(() => null)) as { ok: true; id: string } | { ok: false; error?: { message?: string } } | null;
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

    const catalogLoadError = catalogError ? (catalogErr instanceof Error ? catalogErr.message : '카테고리·시설 로드 실패') : null;

    return (
        <form className="space-y-6" onSubmit={onSubmit}>
            {catalogLoadError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{catalogLoadError}</div>
            ) : null}

            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="mb-2 block text-xs font-bold text-neutral-600">장소 이름 *</label>
                    <input
                        className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                        value={form.name}
                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                        placeholder="예: 키즈프렌들리 카페"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-xs font-bold text-neutral-600">카테고리 *</label>
                    <select
                        className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                        value={form.category_code}
                        onChange={(e) => setForm((p) => ({ ...p, category_code: e.target.value }))}
                        disabled={catalogPending || !catalog?.categories.length}
                    >
                        {(catalog?.categories ?? []).map((c) => (
                            <option key={c.code} value={c.code}>
                                {c.displayName}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-xs font-bold text-neutral-600">시·도 *</label>
                    <select
                        className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                        value={form.region_code}
                        onChange={(e) => setForm((p) => ({ ...p, region_code: e.target.value, sub_region_code: '' }))}
                        disabled={regionsPending || !regions.length}
                    >
                        {regions.map((r) => (
                            <option key={r.code} value={r.code}>
                                {r.displayName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-span-2">
                    <label className="mb-2 block text-xs font-bold text-neutral-600">시·군·구 *</label>
                    <select
                        className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                        value={form.sub_region_code}
                        onChange={(e) => setForm((p) => ({ ...p, sub_region_code: e.target.value }))}
                        disabled={!selectedRegion?.sub.length}
                    >
                        <option value="">선택</option>
                        {(selectedRegion?.sub ?? []).map((s) => (
                            <option key={s.code} value={s.code}>
                                {s.displayName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-span-2">
                    <label className="mb-2 block text-xs font-bold text-neutral-600">부제 (subtitle)</label>
                    <input
                        className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                        value={form.subtitle}
                        onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))}
                        placeholder="예: Modern Italian Dining"
                    />
                </div>

                <div className="col-span-2">
                    <label className="mb-2 block text-xs font-bold text-neutral-600">히어로 문구 (headline)</label>
                    <input
                        className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                        value={form.headline}
                        onChange={(e) => setForm((p) => ({ ...p, headline: e.target.value }))}
                        placeholder="예: 아이와 함께하는 편안한 다이닝"
                    />
                </div>

                <div className="col-span-2">
                    <label className="mb-2 block text-xs font-bold text-neutral-600">본문 설명 (description)</label>
                    <textarea
                        className="min-h-24 w-full resize-y rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                        value={form.description}
                        onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                        placeholder="장소에 대한 자세한 설명"
                    />
                </div>

                <div className="col-span-2">
                    <label className="mb-2 block text-xs font-bold text-neutral-600">주소</label>
                    <input
                        className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                        value={form.address}
                        onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                        placeholder="예: 서울특별시 ..."
                    />
                </div>

                <div>
                    <label className="mb-2 block text-xs font-bold text-neutral-600">위도</label>
                    <input
                        className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                        value={form.lat}
                        onChange={(e) => setForm((p) => ({ ...p, lat: e.target.value }))}
                        placeholder="37.5665"
                        inputMode="decimal"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-xs font-bold text-neutral-600">경도</label>
                    <input
                        className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                        value={form.lng}
                        onChange={(e) => setForm((p) => ({ ...p, lng: e.target.value }))}
                        placeholder="126.9780"
                        inputMode="decimal"
                    />
                </div>

                <div className="col-span-2 rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3 text-xs leading-relaxed text-neutral-600">
                    <span className="font-bold text-neutral-700">위도·경도는 어디서 구하나요?</span>
                    <ul className="mt-2 list-inside list-disc space-y-1">
                        <li>
                            <span className="font-semibold text-neutral-700">지도 앱/웹</span>: 카카오맵·네이버지도·구글맵에서 해당 장소를 연 뒤, 공유 링크나 URL에 포함된{' '}
                            <code className="rounded bg-white px-1 py-0.5 text-[11px]">lat</code>, <code className="rounded bg-white px-1 py-0.5 text-[11px]">lng</code>/
                            <code className="rounded bg-white px-1 py-0.5 text-[11px]">x</code>, <code className="rounded bg-white px-1 py-0.5 text-[11px]">y</code> 같은 쿼리값을
                            복사하거나, 구글맵은 핀을 찍으면 좌표가 표시됩니다.
                        </li>
                        <li>
                            <span className="font-semibold text-neutral-700">지오코딩 API</span>: 주소만 있다면 카카오 로컬·네이버 클라우드 지도·구글 Geocoding 등으로 주소 → 좌표 변환을 할 수 있습니다(별도 키·연동 필요).
                        </li>
                        <li>한국에서 쓰는 값은 보통 WGS84(GPS와 동일)입니다. 비워 두어도 등록은 됩니다.</li>
                    </ul>
                </div>

                <div className="col-span-2">
                    <label className="mb-2 block text-xs font-bold text-neutral-600">지도 링크</label>
                    <div className="grid gap-3 sm:grid-cols-3">
                        <input
                            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                            value={form.map_kakao}
                            onChange={(e) => setForm((p) => ({ ...p, map_kakao: e.target.value }))}
                            placeholder="카카오맵 URL"
                        />
                        <input
                            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                            value={form.map_naver}
                            onChange={(e) => setForm((p) => ({ ...p, map_naver: e.target.value }))}
                            placeholder="네이버맵 URL"
                        />
                        <input
                            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                            value={form.map_tmap}
                            onChange={(e) => setForm((p) => ({ ...p, map_tmap: e.target.value }))}
                            placeholder="T맵 URL"
                        />
                    </div>
                </div>

                <div className="col-span-2">
                    <label className="mb-2 block text-xs font-bold text-neutral-600">이미지 URL (줄바꿈 또는 쉼표로 구분, 첫 줄이 대표 이미지)</label>
                    <textarea
                        className="min-h-20 w-full resize-y rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                        value={form.images_text}
                        onChange={(e) => setForm((p) => ({ ...p, images_text: e.target.value }))}
                        placeholder="https://..."
                    />
                </div>

                <div className="col-span-2">
                    <label className="mb-2 block text-xs font-bold text-neutral-600">실전 외출 꿀팁</label>
                    <textarea
                        className="min-h-28 w-full resize-y rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                        value={form.honey_tip}
                        onChange={(e) => setForm((p) => ({ ...p, honey_tip: e.target.value }))}
                        placeholder="예: 점심 피크(12~1시)만 피하면 유아 의자 수급이 수월해요."
                    />
                </div>

                <div className="col-span-2">
                    <span className="mb-2 block text-xs font-bold text-neutral-600">시설·서비스 (해당 항목만 선택)</span>
                    <div className="flex flex-wrap gap-2">
                        {(catalog?.amenities ?? []).map((a) => {
                            const on = amenityCodes.includes(a.code);
                            return (
                                <button
                                    key={a.code}
                                    type="button"
                                    onClick={() => toggleAmenity(a.code)}
                                    className={`rounded-full border px-4 py-2 text-xs font-bold transition-colors ${
                                        on ? 'border-orange-500 bg-orange-50 text-orange-900' : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                                    }`}
                                >
                                    {a.displayName}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div> : null}

            <div className="flex items-center justify-end gap-3">
                <button
                    type="button"
                    className="rounded-full border border-neutral-300 px-6 py-3 text-sm font-bold hover:bg-neutral-100"
                    onClick={() => {
                        const next = { ...emptyForm };
                        if (regions[0]) next.region_code = regions[0].code;
                        if (catalog?.categories[0]) next.category_code = catalog.categories[0].code;
                        setForm(next);
                        setAmenityCodes([]);
                    }}
                    disabled={submitting}
                >
                    초기화
                </button>
                <button
                    type="submit"
                    className="rounded-full bg-orange-600 px-8 py-3 text-sm font-bold text-white shadow hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={!canSubmit || submitting || catalogPending || regionsPending}
                >
                    {submitting ? '등록 중…' : '등록 완료'}
                </button>
            </div>
        </form>
    );
}
