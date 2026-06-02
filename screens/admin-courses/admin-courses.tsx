'use client';

import { useState, type ReactNode } from 'react';

import { useCatalog } from '@/application/providers';

import { createCourse, modifyCourse, modifyCourseStops, removeCourse } from '@/server/controllers/courses';

import { AdChip, AdField, AdIconButton, AdInput, AdSelect, AdTextarea, AdminPage } from '@/widgets/admin-shell';

import type { Course } from '@/entities/course';
import type { PlaceAdmin } from '@/entities/place';

import { useRouter } from '@/shared/hooks';
import { toast } from '@/shared/lib';
import { Icon } from '@/shared/ui';

import { Pill } from '@/hbds/display/badge';
import { Button } from '@/hbds/display/button';
import { cn } from '@/hbds/lib/utils';

const Th = ({ children, className }: { children?: ReactNode; className?: string }) => (
    <th className={cn('border-b border-border bg-neutral-50 px-4 py-3 text-left text-xs font-semibold text-muted', className)}>{children}</th>
);

type StopDraft = { placeId: string; comment: string };

type Props = {
    initialCourses: Course[];
    allPlaces: PlaceAdmin[];
};

/** 코스 관리 (PRD A-4). 좌측 목록 선택 → 우측 에디터 라이브 갱신. */
export const AdminCourses = ({ initialCourses, allPlaces }: Props) => {
    const router = useRouter();
    const areas = useCatalog((s) => s.areas);
    const getArea = useCatalog((s) => s.getArea);
    const getCategory = useCatalog((s) => s.getCategory);
    const [selected, setSelected] = useState(0);
    const [saving, setSaving] = useState(false);
    const [areaFilter, setAreaFilter] = useState<string>('all');

    const filteredCourses = areaFilter === 'all' ? initialCourses : initialCourses.filter((c) => c.area === areaFilter);

    const course = filteredCourses[selected] ?? initialCourses[selected];

    // 에디터 로컬 상태 (선택 변경 시 course로 초기화)
    const [draftTitle, setDraftTitle] = useState(course?.title ?? '');
    const [draftDuration, setDraftDuration] = useState(course?.duration ?? '');
    const [draftDesc, setDraftDesc] = useState(course?.description ?? '');
    const [draftStops, setDraftStops] = useState<StopDraft[]>(course?.stopIds.map((id, i) => ({ placeId: id, comment: course.comments[i] ?? '' })) ?? []);

    const syncEditor = (c: Course) => {
        setDraftTitle(c.title);
        setDraftDuration(c.duration);
        setDraftDesc(c.description);
        setDraftStops(c.stopIds.map((id, i) => ({ placeId: id, comment: c.comments[i] ?? '' })));
    };

    const handleSelect = (idx: number) => {
        setSelected(idx);
        const c = filteredCourses[idx];
        if (c) syncEditor(c);
    };

    const moveStop = (idx: number, dir: -1 | 1) => {
        const next = [...draftStops];
        const swap = idx + dir;
        if (swap < 0 || swap >= next.length) return;
        [next[idx], next[swap]] = [next[swap], next[idx]];
        setDraftStops(next);
    };

    const removeStop = (idx: number) => {
        setDraftStops((prev) => prev.filter((_, i) => i !== idx));
    };

    const addStop = (placeId: string) => {
        if (!placeId || draftStops.some((s) => s.placeId === placeId)) return;
        setDraftStops((prev) => [...prev, { placeId, comment: '' }]);
    };

    const handleSave = async () => {
        if (!course) return;
        setSaving(true);
        try {
            await modifyCourse(course.id, {
                title: draftTitle,
                duration: draftDuration,
                description: draftDesc
            });
            await modifyCourseStops(course.id, draftStops);
            toast('변경사항을 저장했어요');
            router.refresh();
        } catch {
            toast('저장에 실패했어요');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (c: Course) => {
        if (!confirm(`"${c.title}" 코스를 삭제할까요?`)) return;
        try {
            await removeCourse(c.id);
            toast('삭제했어요');
            setSelected(0);
            router.refresh();
        } catch {
            toast('삭제에 실패했어요');
        }
    };

    const handleNewCourse = async () => {
        try {
            await createCourse({
                area: areas[0]?.id ?? '',
                title: '새 코스',
                duration: '',
                season: '사계절',
                description: '',
                sortOrder: initialCourses.length,
                stops: []
            });
            toast('새 코스를 만들었어요. 우측 에디터에서 편집하세요.');
            router.refresh();
        } catch {
            toast('생성에 실패했어요');
        }
    };

    return (
        <AdminPage
            title="코스 관리"
            subtitle="큐레이션 영역 — 자동 생성 안 함 · A-4"
            actions={
                <Button size="sm" onClick={handleNewCourse}>
                    <Icon name="plus" size={14} /> 새 코스 추가
                </Button>
            }
        >
            <div className="grid grid-cols-[1.3fr_1fr] items-start gap-5">
                {/* 좌측: 목록 */}
                <div>
                    <div className="mb-3 flex gap-2">
                        <AdChip
                            active={areaFilter === 'all'}
                            onClick={() => {
                                setAreaFilter('all');
                                setSelected(0);
                            }}
                        >
                            전체 동네
                        </AdChip>
                        {areas.map((a) => (
                            <AdChip
                                key={a.id}
                                active={areaFilter === a.id}
                                onClick={() => {
                                    setAreaFilter(a.id);
                                    setSelected(0);
                                }}
                            >
                                {a.name}
                            </AdChip>
                        ))}
                    </div>
                    <div className="overflow-hidden rounded-xl border border-border bg-surface">
                        <table className="w-full border-collapse text-[13.5px]">
                            <thead>
                                <tr>
                                    <Th>이름</Th>
                                    <Th className="w-[90px]">동네</Th>
                                    <Th className="w-[90px]">정거장</Th>
                                    <Th className="w-[90px]">소요</Th>
                                    <Th className="w-[80px]" />
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCourses.map((item, i) => (
                                    <tr
                                        key={item.id}
                                        onClick={() => handleSelect(i)}
                                        className={cn('cursor-pointer transition-colors', selected === i ? 'bg-primary-50' : 'hover:bg-neutral-50')}
                                    >
                                        <td className="border-b border-border px-4 py-3.5 font-medium text-surface-foreground">{item.title}</td>
                                        <td className="border-b border-border px-4 py-3.5 text-muted">{getArea(item.area)?.name}</td>
                                        <td className="border-b border-border px-4 py-3.5 text-surface-foreground tabular-nums">{item.stopIds.length}곳</td>
                                        <td className="border-b border-border px-4 py-3.5 text-muted">{item.duration}</td>
                                        <td className="border-b border-border px-4 py-3.5">
                                            <div className="flex justify-end gap-1">
                                                <AdIconButton
                                                    name="trash"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(item);
                                                    }}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredCourses.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-[13px] text-muted">
                                            코스가 없어요
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 우측: 에디터 */}
                {course ? (
                    <div className="overflow-hidden rounded-xl border border-border bg-surface">
                        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
                            <div>
                                <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-surface-foreground">편집 중</h3>
                                <p className="mt-0.5 text-xs text-muted">{course.title}</p>
                            </div>
                            <Pill tone="primary">저장 전</Pill>
                        </div>
                        <div className="flex flex-col gap-3.5 p-5">
                            <AdField label="이름">
                                <AdInput value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)} />
                            </AdField>
                            <div className="grid grid-cols-2 gap-4">
                                <AdField label="동네">
                                    <AdSelect value={getArea(course.area)?.name} />
                                </AdField>
                                <AdField label="예상 소요">
                                    <AdInput value={draftDuration} onChange={(e) => setDraftDuration(e.target.value)} />
                                </AdField>
                            </div>
                            <AdField label="설명">
                                <AdTextarea rows={2} value={draftDesc} onChange={(e) => setDraftDesc(e.target.value)} />
                            </AdField>

                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between text-[12.5px] font-medium text-surface-foreground">
                                    <span>정거장 순서</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {draftStops.map((stop, n) => {
                                        const place = allPlaces.find((p) => p.id === stop.placeId);
                                        return (
                                            <div key={stop.placeId} className="flex flex-col gap-2 rounded-[10px] border border-border bg-surface p-2.5">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="inline-flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-primary-600 text-xs font-semibold text-white tabular-nums">
                                                        {n + 1}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="text-[13.5px] font-medium text-surface-foreground">{place?.name ?? stop.placeId}</div>
                                                        <div className="mt-0.5 text-[11.5px] text-muted">
                                                            {place ? `${getCategory(place.category)?.name} · ${getArea(place.area)?.name}` : ''}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <button
                                                            type="button"
                                                            onClick={() => moveStop(n, -1)}
                                                            className="flex h-[18px] w-6 items-center justify-center rounded text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-surface-foreground"
                                                        >
                                                            <Icon name="up-arrow" size={14} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => moveStop(n, 1)}
                                                            className="flex h-[18px] w-6 items-center justify-center rounded text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-surface-foreground"
                                                        >
                                                            <Icon name="down" size={14} />
                                                        </button>
                                                    </div>
                                                    <AdIconButton name="trash" onClick={() => removeStop(n)} />
                                                </div>
                                                <AdInput
                                                    placeholder="코멘트 (선택)"
                                                    value={stop.comment}
                                                    onChange={(e) =>
                                                        setDraftStops((prev) => prev.map((s, i) => (i === n ? { ...s, comment: e.target.value } : s)))
                                                    }
                                                />
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* 정거장 추가 드롭다운 */}
                                <div className="mt-1">
                                    <select
                                        defaultValue=""
                                        onChange={(e) => {
                                            addStop(e.target.value);
                                            e.target.value = '';
                                        }}
                                        className="h-8 w-full rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-3 text-[13px] text-muted"
                                    >
                                        <option value="" disabled>
                                            + 정거장 추가
                                        </option>
                                        {allPlaces
                                            .filter((p) => !draftStops.some((s) => s.placeId === p.id))
                                            .map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name} ({getArea(p.area)?.name})
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 border-t border-border bg-neutral-50 p-4">
                            <Button size="sm" variant="outline" onClick={() => syncEditor(course)}>
                                되돌리기
                            </Button>
                            <Button size="sm" onClick={handleSave} disabled={saving}>
                                {saving ? '저장 중…' : '변경사항 저장'}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center rounded-xl border border-dashed border-border p-10 text-[13px] text-muted">
                        좌측에서 코스를 선택하세요
                    </div>
                )}
            </div>
        </AdminPage>
    );
};
