'use client';

import { useState, type ReactNode } from 'react';

import { useRouter } from 'next/navigation';

import { useApp } from '@/application/providers';

import { AdChip, AdField, AdIconButton, AdInput, AdTextarea, AdminPage } from '@/widgets/admin-shell';

import type { PlaceAdmin } from '@/entities/place';

import type { AmenityId, AreaId, CategoryId } from '@/shared/config';
import { cn, useCatalog } from '@/shared/lib';
import { Button, Icon, type IconName, Pill } from '@/shared/ui';

import { createPlace, deletePlace, updatePlace, updatePlaceStatus } from '@/server/actions/places';

const Th = ({ children, className }: { children?: ReactNode; className?: string }) => (
    <th className={cn('border-b border-border bg-slate-50 px-4 py-3 text-left text-xs font-semibold text-muted', className)}>{children}</th>
);

type FormState = {
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


function buildAgeRange(start: string, end: string): string {
    if (!start && !end) return '전 연령';
    if (start && !end) return `${start}개월~`;
    if (start && end) return `${start}~${end}개월`;
    return '';
}

function parseAgeRange(ageRange: string): { start: string; end: string } {
    if (!ageRange || ageRange === '전 연령') return { start: '', end: '' };
    const ranged = ageRange.match(/^(\d+)~(\d+)개월$/);
    if (ranged) return { start: ranged[1], end: ranged[2] };
    const open = ageRange.match(/^(\d+)개월~$/);
    if (open) return { start: open[1], end: '' };
    return { start: '', end: '' };
}

function placeToForm(place: PlaceAdmin): FormState {
    const { start, end } = parseAgeRange(place.ageRange);
    return {
        name: place.name,
        area: place.area,
        category: place.category,
        address: place.address,
        phone: place.phone,
        ageRangeStart: start,
        ageRangeEnd: end,
        sortOrder: String(place.sortOrder),
        description: place.description,
        amenities: [...place.amenities],
    };
}

type Mode = 'list' | 'create' | 'edit';
type Props = { initialPlaces: PlaceAdmin[] };

/** 장소 관리 (PRD A-3). 목록 테이블 + 새 장소 추가/수정 폼. */
export const AdminPlaces = ({ initialPlaces }: Props) => {
    const router = useRouter();
    const { toast } = useApp();
    const { areas, categories, amenities } = useCatalog();

    const makeDefaultForm = (): FormState => ({
        name: '', area: areas[0]?.id ?? '', category: categories[0]?.id ?? '',
        address: '', phone: '', ageRangeStart: '', ageRangeEnd: '',
        sortOrder: '0', description: '', amenities: [],
    });

    const [mode, setMode] = useState<Mode>('list');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState<FormState>(makeDefaultForm);
    const [areaFilter, setAreaFilter] = useState<AreaId | 'all'>('all');
    const [search, setSearch] = useState('');

    const filtered = initialPlaces.filter((p) => {
        if (areaFilter !== 'all' && p.area !== areaFilter) return false;
        if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const openCreate = () => { setForm(makeDefaultForm()); setEditingId(null); setMode('create'); };
    const openEdit = (place: PlaceAdmin) => { setForm(placeToForm(place)); setEditingId(place.id); setMode('edit'); };
    const closeForm = () => { setMode('list'); setEditingId(null); };

    const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
        setForm((prev) => ({ ...prev, [key]: val }));

    const toggleAmenity = (id: AmenityId) => {
        setForm((prev) => ({
            ...prev,
            amenities: prev.amenities.includes(id)
                ? prev.amenities.filter((a) => a !== id)
                : [...prev.amenities, id],
        }));
    };

    const handleSave = async () => {
        if (!form.name.trim()) { toast('이름을 입력해주세요'); return; }
        setSaving(true);
        const input = {
            area: form.area, category: form.category,
            name: form.name.trim(), address: form.address.trim(),
            phone: form.phone.trim(),
            ageRange: buildAgeRange(form.ageRangeStart, form.ageRangeEnd),
            description: form.description.trim(),
            amenities: form.amenities,
            sortOrder: Number(form.sortOrder) || 0,
        };
        try {
            if (mode === 'edit' && editingId) {
                await updatePlace(editingId, input);
                toast('장소를 수정했어요');
            } else {
                await createPlace(input);
                toast('장소를 저장했어요');
            }
            closeForm();
            router.refresh();
        } catch {
            toast('저장에 실패했어요');
        } finally {
            setSaving(false);
        }
    };

    const handleToggleStatus = async (place: PlaceAdmin) => {
        try {
            await updatePlaceStatus(place.id, place.status === 'public' ? 'review' : 'public');
            toast(place.status === 'public' ? '검토중으로 변경했어요' : '공개로 변경했어요');
            router.refresh();
        } catch { toast('상태 변경에 실패했어요'); }
    };

    const handleDelete = async (place: PlaceAdmin) => {
        if (!confirm(`"${place.name}" 장소를 삭제할까요? 연결된 코스 정거장도 함께 삭제됩니다.`)) return;
        try {
            await deletePlace(place.id);
            toast('삭제했어요');
            router.refresh();
        } catch { toast('삭제에 실패했어요'); }
    };

    // ── 폼 (create / edit 공용) ────────────────────────────────────────────
    if (mode !== 'list') {
        return (
            <AdminPage
                    title={mode === 'edit' ? '장소 수정' : '새 장소 추가'}
                    subtitle="운영자가 직접 채우는 데이터의 본진 · A-3">
                    <button
                        type="button"
                        onClick={closeForm}
                        className="mb-4 inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[13.5px] font-medium text-slate-700 transition-colors hover:bg-slate-100">
                        ← 목록으로
                    </button>

                    <div className="max-w-[820px] overflow-hidden rounded-xl border border-border bg-surface">
                        <div className="flex flex-col gap-[18px] p-6">
                            <AdField label="이름">
                                <AdInput value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="예: 잠실 키즈빌리지" />
                            </AdField>

                            <div className="grid grid-cols-2 gap-4">
                                <AdField label="동네">
                                    <select value={form.area} onChange={(e) => set('area', e.target.value as AreaId)}
                                        className="h-9 w-full rounded-lg border border-border bg-surface px-3 text-[13.5px] text-surface-foreground">
                                        {areas.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                                    </select>
                                </AdField>
                                <AdField label="카테고리">
                                    <select value={form.category} onChange={(e) => set('category', e.target.value as CategoryId)}
                                        className="h-9 w-full rounded-lg border border-border bg-surface px-3 text-[13.5px] text-surface-foreground">
                                        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </AdField>
                            </div>

                            <AdField label="주소">
                                <AdInput value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="도로명 주소를 입력하세요" />
                            </AdField>

                            <div className="grid grid-cols-4 gap-4">
                                <AdField label="전화번호">
                                    <AdInput value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="02-0000-0000" />
                                </AdField>
                                <AdField label="권장 시작 월령">
                                    <AdInput value={form.ageRangeStart} onChange={(e) => set('ageRangeStart', e.target.value)} placeholder="6" inputMode="numeric" />
                                </AdField>
                                <AdField label="권장 끝 월령">
                                    <AdInput value={form.ageRangeEnd} onChange={(e) => set('ageRangeEnd', e.target.value)} placeholder="48 (없으면 빈칸)" inputMode="numeric" />
                                </AdField>
                                <AdField label="표시 순서">
                                    <AdInput value={form.sortOrder} onChange={(e) => set('sortOrder', e.target.value)} placeholder="1" inputMode="numeric" />
                                </AdField>
                            </div>

                            <AdField label="한 줄 설명 · 큐레이터 코멘트">
                                <AdTextarea rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="첫 화면 카드와 상세화면에 같이 보여요" />
                            </AdField>

                            <AdField label="편의시설" hint="다중 선택">
                                <div className="flex flex-wrap gap-2">
                                    {amenities.map((amenity) => {
                                        const on = form.amenities.includes(amenity.id);
                                        return (
                                            <label key={amenity.id} className={cn(
                                                'inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-[13px] transition-colors',
                                                on ? 'border-primary-500 bg-primary-50 font-medium text-primary-700' : 'border-border bg-surface text-slate-700 hover:bg-slate-50'
                                            )}>
                                                <input type="checkbox" className="sr-only" checked={on} onChange={() => toggleAmenity(amenity.id)} />
                                                <span className={cn('inline-flex h-4 w-4 items-center justify-center rounded',
                                                    on ? 'bg-primary-600 text-white' : 'border-[1.5px] border-slate-300 text-transparent')}>
                                                    <Icon name="check" size={11} stroke={3} />
                                                </span>
                                                <Icon name={amenity.icon as IconName} size={14} stroke={1.8} />
                                                {amenity.short}
                                            </label>
                                        );
                                    })}
                                </div>
                            </AdField>
                        </div>
                        <div className="flex justify-end gap-2 border-t border-border bg-slate-50 p-4">
                            <Button size="sm" variant="outline" onClick={closeForm}>취소</Button>
                            <Button size="sm" onClick={handleSave} disabled={saving}>
                                {saving ? '저장 중…' : mode === 'edit' ? '수정 저장' : '저장하기'}
                            </Button>
                        </div>
                    </div>
                </AdminPage>
        );
    }

    // ── 목록 ──────────────────────────────────────────────────────────────
    return (
        <AdminPage
                title="장소 관리"
                subtitle={`전체 ${initialPlaces.length}곳`}
                actions={
                    <Button size="sm" onClick={openCreate}>
                        <Icon name="plus" size={14} /> 새 장소 추가
                    </Button>
                }>
                <div className="mb-4 flex flex-wrap items-center gap-2">
                    <AdChip active={areaFilter === 'all'} onClick={() => setAreaFilter('all')}>전체 동네</AdChip>
                    {areas.map((a) => (
                        <AdChip key={a.id} active={areaFilter === a.id} onClick={() => setAreaFilter(a.id)}>{a.name}</AdChip>
                    ))}
                    <div className="flex-1" />
                    <div className="relative min-w-[240px]">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                            <Icon name="search" size={14} />
                        </span>
                        <AdInput className="h-8 pl-9 text-[13px]" placeholder="이름으로 검색" value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-border bg-surface">
                    <table className="w-full border-collapse text-[13.5px]">
                        <thead>
                            <tr>
                                <Th className="w-[60px]">순서</Th>
                                <Th>이름</Th>
                                <Th className="w-[100px]">동네</Th>
                                <Th className="w-[100px]">카테고리</Th>
                                <Th className="w-[130px]">권장 월령</Th>
                                <Th className="w-[200px]">편의시설</Th>
                                <Th className="w-[110px]">상태</Th>
                                <Th className="w-[96px]" />
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((place) => (
                                <tr key={place.id} className="transition-colors hover:bg-slate-50">
                                    <td className="border-b border-border px-4 py-3.5 tabular-nums text-surface-foreground">{place.sortOrder}</td>
                                    <td className="border-b border-border px-4 py-3.5 font-medium text-surface-foreground">{place.name}</td>
                                    <td className="border-b border-border px-4 py-3.5 text-muted">{areas.find((a) => a.id === place.area)?.name}</td>
                                    <td className="border-b border-border px-4 py-3.5 text-muted">{categories.find((c) => c.id === place.category)?.name}</td>
                                    <td className="border-b border-border px-4 py-3.5 text-muted">{place.ageRange}</td>
                                    <td className="border-b border-border px-4 py-3.5">
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: 5 }).map((_, j) => (
                                                <span key={j} className={cn('h-2 w-2 rounded-sm', j < place.amenities.length ? 'bg-primary-500' : 'bg-slate-200')} />
                                            ))}
                                            <span className="ml-1.5 text-[12.5px] text-muted">{place.amenities.length}/5</span>
                                        </div>
                                    </td>
                                    <td className="border-b border-border px-4 py-3.5">
                                        <button type="button" onClick={() => handleToggleStatus(place)}>
                                            <Pill tone={place.status === 'public' ? 'success' : 'warning'}>
                                                {place.status === 'public' ? '공개' : '검토중'}
                                            </Pill>
                                        </button>
                                    </td>
                                    <td className="border-b border-border px-4 py-3.5">
                                        <div className="flex justify-end gap-1">
                                            <AdIconButton name="edit" onClick={() => openEdit(place)} />
                                            <AdIconButton name="trash" onClick={() => handleDelete(place)} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div className="py-10 text-center text-[13px] text-muted">해당 조건에 장소가 없어요</div>
                    )}
                </div>
                <div className="mt-3.5">
                    <span className="text-[12.5px] text-muted">총 {initialPlaces.length}곳 · {filtered.length}개 표시 중</span>
                </div>
            </AdminPage>
    );
};
