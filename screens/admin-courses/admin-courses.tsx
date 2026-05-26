'use client';

import { useState, type ReactNode } from 'react';

import { AdChip, AdField, AdIconButton, AdInput, AdSelect, AdTextarea, AdminPage, AdminShell } from '@/widgets/admin-shell';

import { COURSES } from '@/entities/course';
import { getPlace } from '@/entities/place';

import { getArea, getCategory } from '@/shared/config';
import { cn } from '@/shared/lib';
import { Button, Icon, Pill } from '@/shared/ui';

const Th = ({ children, className }: { children?: ReactNode; className?: string }) => (
    <th className={cn('border-b border-border bg-slate-50 px-4 py-3 text-left text-xs font-semibold text-muted', className)}>{children}</th>
);

/** 코스 관리 (PRD A-4). 좌측 목록 선택 → 우측 에디터 라이브 갱신. 자동 생성 안 함. */
export const AdminCourses = () => {
    const [selected, setSelected] = useState(0);
    const course = COURSES[selected];

    return (
        <AdminShell>
            <AdminPage
                title="코스 관리"
                subtitle="큐레이션 영역 — 자동 생성 안 함 · A-4"
                actions={
                    <Button size="sm">
                        <Icon name="plus" size={14} /> 새 코스 추가
                    </Button>
                }>
                <div className="grid grid-cols-[1.3fr_1fr] items-start gap-5">
                    {/* 좌측: 목록 */}
                    <div>
                        <div className="mb-3 flex gap-2">
                            <AdChip active>전체 동네</AdChip>
                            <AdChip>송파</AdChip>
                            <AdChip>운정</AdChip>
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
                                    {COURSES.map((item, i) => (
                                        <tr
                                            key={item.id}
                                            onClick={() => setSelected(i)}
                                            className={cn('cursor-pointer transition-colors', selected === i ? 'bg-primary-50' : 'hover:bg-slate-50')}>
                                            <td className="border-b border-border px-4 py-3.5 font-medium text-surface-foreground">{item.title}</td>
                                            <td className="border-b border-border px-4 py-3.5 text-muted">{getArea(item.area)?.name}</td>
                                            <td className="border-b border-border px-4 py-3.5 tabular-nums text-surface-foreground">{item.stopIds.length}곳</td>
                                            <td className="border-b border-border px-4 py-3.5 text-muted">{item.duration}</td>
                                            <td className="border-b border-border px-4 py-3.5">
                                                <div className="flex justify-end gap-1">
                                                    <AdIconButton name="edit" />
                                                    <AdIconButton name="trash" />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 우측: 에디터 (선택 변경 시 remount) */}
                    <div key={course.id} className="overflow-hidden rounded-xl border border-border bg-surface">
                        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
                            <div>
                                <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-surface-foreground">편집 중</h3>
                                <p className="mt-0.5 text-xs text-muted">{course.title}</p>
                            </div>
                            <Pill tone="primary">초안</Pill>
                        </div>
                        <div className="flex flex-col gap-3.5 p-5">
                            <AdField label="이름">
                                <AdInput defaultValue={course.title} />
                            </AdField>
                            <div className="grid grid-cols-2 gap-4">
                                <AdField label="동네">
                                    <AdSelect value={getArea(course.area)?.name} />
                                </AdField>
                                <AdField label="예상 소요">
                                    <AdInput defaultValue={course.duration} />
                                </AdField>
                            </div>
                            <AdField label="설명">
                                <AdTextarea rows={2} defaultValue={course.description} />
                            </AdField>

                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between text-[12.5px] font-medium text-surface-foreground">
                                    <span>정거장 순서</span>
                                    <Button size="sm" variant="ghost">
                                        <Icon name="plus" size={13} /> 정거장 추가
                                    </Button>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {course.stopIds.map((id, n) => {
                                        const place = getPlace(id);
                                        return (
                                            <div key={id} className="flex items-center gap-2.5 rounded-[10px] border border-border bg-surface p-2.5">
                                                <div className="inline-flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-primary-600 text-xs font-semibold tabular-nums text-white">
                                                    {n + 1}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-[13.5px] font-medium text-surface-foreground">{place?.name}</div>
                                                    <div className="mt-0.5 text-[11.5px] text-muted">
                                                        {place ? `${getCategory(place.category)?.name} · ${getArea(place.area)?.name}` : ''}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <button
                                                        type="button"
                                                        className="flex h-[18px] w-6 items-center justify-center rounded text-slate-400 transition-colors hover:bg-slate-100 hover:text-surface-foreground">
                                                        <Icon name="up-arrow" size={14} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="flex h-[18px] w-6 items-center justify-center rounded text-slate-400 transition-colors hover:bg-slate-100 hover:text-surface-foreground">
                                                        <Icon name="down" size={14} />
                                                    </button>
                                                </div>
                                                <AdIconButton name="trash" />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 border-t border-border bg-slate-50 p-4">
                            <Button size="sm" variant="outline">
                                취소
                            </Button>
                            <Button size="sm">변경사항 저장</Button>
                        </div>
                    </div>
                </div>
            </AdminPage>
        </AdminShell>
    );
};
