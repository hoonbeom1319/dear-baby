'use client';

import { useCatalog } from '@/application/providers';

import { AdField, AdInput, AdTextarea, AreaSelect } from '@/widgets/admin-shell';

import type { AreaId, CategoryId } from '@/shared/config';
import { Icon, type IconName } from '@/shared/ui';

import { Button } from '@/hbds/display/button';
import { cn } from '@/hbds/lib/utils';

import type { PlaceFormPrefill, PlaceRegisterPayload } from '../lib/type';
import { usePlaceRegister } from '../model/use-place-register';

export function PlaceRegisterForm({
    prefill,
    onSubmit
}: {
    prefill: PlaceFormPrefill;
    onSubmit: (payload: PlaceRegisterPayload) => Promise<void>;
}) {
    const areas = useCatalog((s) => s.areas);
    const regions = useCatalog((s) => s.regions);
    const categories = useCatalog((s) => s.categories);
    const amenities = useCatalog((s) => s.amenities);

    const { form, set, toggleAmenity, saving, save } = usePlaceRegister(prefill, onSubmit);

    return (
        <div className="flex flex-col gap-4 p-4">
            <p className="text-[11.5px] font-semibold tracking-widest text-muted uppercase">등록 정보</p>

            <AdField label="이름">
                <AdInput value={form.name} onChange={(e) => set('name', e.target.value)} />
            </AdField>

            <div className="grid grid-cols-2 gap-3">
                <AdField label="동네">
                    <AreaSelect
                        variant="field"
                        allowAll={false}
                        value={form.area}
                        onChange={(id) => set('area', id as AreaId)}
                        areas={areas}
                        regions={regions}
                    />
                </AdField>
                <AdField label="카테고리">
                    <select
                        value={form.category}
                        onChange={(e) => set('category', e.target.value as CategoryId)}
                        className="h-9 w-full rounded-lg border border-border bg-surface px-3 text-[13.5px] text-surface-foreground"
                    >
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </AdField>
            </div>

            <AdField label="주소">
                <AdInput value={form.address} onChange={(e) => set('address', e.target.value)} />
            </AdField>

            <div className="grid grid-cols-2 gap-3">
                <AdField label="전화번호">
                    <AdInput value={form.phone} onChange={(e) => set('phone', e.target.value)} />
                </AdField>
                <AdField label="표시 순서">
                    <AdInput value={form.sortOrder} onChange={(e) => set('sortOrder', e.target.value)} inputMode="numeric" />
                </AdField>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <AdField label="시작 월령">
                    <AdInput value={form.ageRangeStart} onChange={(e) => set('ageRangeStart', e.target.value)} placeholder="예: 6" inputMode="numeric" />
                </AdField>
                <AdField label="끝 월령">
                    <AdInput value={form.ageRangeEnd} onChange={(e) => set('ageRangeEnd', e.target.value)} placeholder="없으면 빈칸" inputMode="numeric" />
                </AdField>
            </div>

            <AdField label="한 줄 설명">
                <AdTextarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => set('description', e.target.value)}
                    placeholder="블로그 후기를 참고해서 한 줄로 정리해주세요"
                />
            </AdField>

            <AdField label="편의시설" hint="다중 선택">
                <div className="flex flex-wrap gap-2">
                    {amenities.map((amenity) => {
                        const on = form.amenities.includes(amenity.id);
                        return (
                            <label
                                key={amenity.id}
                                className={cn(
                                    'inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-[13px] transition-colors',
                                    on
                                        ? 'border-primary-500 bg-primary-50 font-medium text-primary-700'
                                        : 'border-border bg-surface text-neutral-700 hover:bg-neutral-50'
                                )}
                            >
                                <input type="checkbox" className="sr-only" checked={on} onChange={() => toggleAmenity(amenity.id)} />
                                <span
                                    className={cn(
                                        'inline-flex h-4 w-4 items-center justify-center rounded',
                                        on ? 'bg-primary-600 text-white' : 'border-[1.5px] border-neutral-300 text-transparent'
                                    )}
                                >
                                    <Icon name="check" size={11} stroke={3} />
                                </span>
                                <Icon name={amenity.icon as IconName} size={14} stroke={1.8} />
                                {amenity.short}
                            </label>
                        );
                    })}
                </div>
            </AdField>

            <Button onClick={save} disabled={saving} className="w-full">
                {saving ? '저장 중…' : '장소 등록하기'}
            </Button>
        </div>
    );
}
