'use client';

import { useState, type ReactNode } from 'react';

import { useApp } from '@/application/providers';

import { AdChip, AdField, AdIconButton, AdInput, AdSelect, AdTextarea, AdminPage, AdminShell } from '@/widgets/admin-shell';

import { AMENITIES } from '@/shared/config';
import { cn } from '@/shared/lib';
import { Button, Icon, Pill } from '@/shared/ui';

type Row = { order: number; name: string; area: string; cat: string; age: string; has: number; status: '공개' | '검토중' };

const ROWS: Row[] = [
    { order: 1, name: '잠실 키즈빌리지', area: '송파', cat: '키즈카페', age: '12~48개월', has: 5, status: '공개' },
    { order: 2, name: '올리브 베이커리 카페', area: '송파', cat: '카페', age: '6개월~', has: 4, status: '공개' },
    { order: 3, name: '롯데월드몰 패밀리존', area: '송파', cat: '복합몰', age: '전 연령', has: 4, status: '공개' },
    { order: 4, name: '동네 한정식 — 솔밭', area: '송파', cat: '식당', age: '12개월~', has: 2, status: '공개' },
    { order: 5, name: '운정 가든 카페', area: '운정', cat: '카페', age: '전 연령', has: 2, status: '공개' },
    { order: 6, name: '운정 한식당', area: '운정', cat: '식당', age: '12개월~', has: 2, status: '공개' },
    { order: 7, name: '운정 카페 라떼라떼', area: '운정', cat: '카페', age: '6개월~', has: 3, status: '검토중' }
];

const Th = ({ children, className }: { children?: ReactNode; className?: string }) => (
    <th className={cn('border-b border-border bg-slate-50 px-4 py-3 text-left text-xs font-semibold text-muted', className)}>{children}</th>
);

/** 장소 관리 (PRD A-3). 목록 테이블 + 새 장소 추가 폼. */
export const AdminPlaces = () => {
    const { toast } = useApp();
    const [showForm, setShowForm] = useState(false);

    if (showForm) {
        return (
            <AdminShell>
                <AdminPage title="새 장소 추가" subtitle="운영자가 직접 채우는 데이터의 본진 · A-3">
                    <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="mb-4 inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[13.5px] font-medium text-slate-700 transition-colors hover:bg-slate-100">
                        ← 목록으로
                    </button>

                    <div className="max-w-[820px] overflow-hidden rounded-xl border border-border bg-surface">
                        <div className="flex flex-col gap-[18px] p-6">
                            <AdField label="이름">
                                <AdInput placeholder="예: 잠실 키즈빌리지" />
                            </AdField>

                            <div className="grid grid-cols-2 gap-4">
                                <AdField label="동네" hint="+ 새 동네 추가">
                                    <AdSelect value="송파" />
                                </AdField>
                                <AdField label="카테고리" hint="+ 새 카테고리 추가">
                                    <AdSelect value="키즈카페" />
                                </AdField>
                            </div>

                            <AdField label="주소" hint="입력 시 네이버 지도 API로 좌표 자동 채움">
                                <AdInput placeholder="도로명 주소를 입력하세요" />
                            </AdField>

                            <div className="grid grid-cols-4 gap-4">
                                <AdField label="전화번호">
                                    <AdInput placeholder="02-0000-0000" />
                                </AdField>
                                <AdField label="권장 시작 월령">
                                    <AdInput placeholder="6" inputMode="numeric" />
                                </AdField>
                                <AdField label="권장 끝 월령">
                                    <AdInput placeholder="48" inputMode="numeric" />
                                </AdField>
                                <AdField label="표시 순서">
                                    <AdInput placeholder="1" inputMode="numeric" />
                                </AdField>
                            </div>

                            <AdField label="한 줄 설명 · 큐레이터 코멘트">
                                <AdTextarea rows={3} placeholder="첫 화면 카드와 상세화면에 같이 보여요" />
                            </AdField>

                            <AdField label="편의시설" hint="다중 선택">
                                <div className="flex flex-wrap gap-2">
                                    {AMENITIES.map((amenity, i) => {
                                        const on = i < 3;
                                        return (
                                            <label
                                                key={amenity.id}
                                                className={cn(
                                                    'inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-[13px] transition-colors',
                                                    on
                                                        ? 'border-primary-500 bg-primary-50 font-medium text-primary-700'
                                                        : 'border-border bg-surface text-slate-700 hover:bg-slate-50'
                                                )}>
                                                <span
                                                    className={cn(
                                                        'inline-flex h-4 w-4 items-center justify-center rounded',
                                                        on ? 'bg-primary-600 text-white' : 'border-[1.5px] border-slate-300 text-transparent'
                                                    )}>
                                                    <Icon name="check" size={11} stroke={3} />
                                                </span>
                                                <Icon name={amenity.icon} size={14} stroke={1.8} />
                                                {amenity.short}
                                            </label>
                                        );
                                    })}
                                </div>
                            </AdField>

                            <AdField label="사진" hint="최대 3장 · 선택사항">
                                <div className="flex gap-2.5">
                                    {[0, 1, 2].map((i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            className="flex h-24 w-24 items-center justify-center rounded-[10px] border-[1.5px] border-dashed border-slate-300 bg-slate-50 text-slate-400 transition-colors hover:border-primary-400 hover:text-primary-600">
                                            <Icon name="plus" size={20} />
                                        </button>
                                    ))}
                                </div>
                            </AdField>
                        </div>
                        <div className="flex justify-end gap-2 border-t border-border bg-slate-50 p-4">
                            <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>
                                취소
                            </Button>
                            <Button
                                size="sm"
                                onClick={() => {
                                    setShowForm(false);
                                    toast('장소를 저장했어요');
                                }}>
                                저장하기
                            </Button>
                        </div>
                    </div>
                </AdminPage>
            </AdminShell>
        );
    }

    return (
        <AdminShell>
            <AdminPage
                title="장소 관리"
                subtitle="전체 29곳 · 동네/카테고리/편의시설로 필터링"
                actions={
                    <Button size="sm" onClick={() => setShowForm(true)}>
                        <Icon name="plus" size={14} /> 새 장소 추가
                    </Button>
                }>
                {/* 필터 */}
                <div className="mb-4 flex flex-wrap items-center gap-2">
                    <AdChip active>전체 동네</AdChip>
                    <AdChip>송파</AdChip>
                    <AdChip>운정</AdChip>
                    <span className="mx-1 h-5 w-px bg-border" />
                    <AdChip active>전체 카테고리</AdChip>
                    <AdChip>카페</AdChip>
                    <AdChip>식당</AdChip>
                    <AdChip>키즈카페</AdChip>
                    <AdChip>복합몰</AdChip>
                    <div className="flex-1" />
                    <div className="relative min-w-[240px]">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                            <Icon name="search" size={14} />
                        </span>
                        <AdInput className="h-8 pl-9 text-[13px]" placeholder="이름으로 검색" />
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
                            {ROWS.map((row) => (
                                <tr key={row.order} className="transition-colors hover:bg-slate-50">
                                    <td className="border-b border-border px-4 py-3.5 tabular-nums text-surface-foreground">{row.order}</td>
                                    <td className="border-b border-border px-4 py-3.5 font-medium text-surface-foreground">{row.name}</td>
                                    <td className="border-b border-border px-4 py-3.5 text-muted">{row.area}</td>
                                    <td className="border-b border-border px-4 py-3.5 text-muted">{row.cat}</td>
                                    <td className="border-b border-border px-4 py-3.5 text-muted">{row.age}</td>
                                    <td className="border-b border-border px-4 py-3.5">
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: 5 }).map((_, j) => (
                                                <span
                                                    key={j}
                                                    className={cn('h-2 w-2 rounded-sm', j < row.has ? 'bg-primary-500' : 'bg-slate-200')}
                                                />
                                            ))}
                                            <span className="ml-1.5 text-[12.5px] text-muted">{row.has}/5</span>
                                        </div>
                                    </td>
                                    <td className="border-b border-border px-4 py-3.5">
                                        <Pill tone={row.status === '공개' ? 'success' : 'warning'}>{row.status}</Pill>
                                    </td>
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

                <div className="mt-3.5 flex items-center justify-between">
                    <span className="text-[12.5px] text-muted">총 29곳 · 1–7 표시 중</span>
                    <div className="flex items-center gap-1 text-[12.5px]">
                        <button className="h-8 rounded-md border border-border bg-surface px-2 text-slate-400" disabled>
                            ← 이전
                        </button>
                        <button className="h-8 min-w-8 rounded-md border border-slate-900 bg-slate-900 px-2 text-white">1</button>
                        <button className="h-8 min-w-8 rounded-md border border-border bg-surface px-2 text-slate-700 hover:bg-slate-50">2</button>
                        <button className="h-8 min-w-8 rounded-md border border-border bg-surface px-2 text-slate-700 hover:bg-slate-50">3</button>
                        <button className="h-8 rounded-md border border-border bg-surface px-2 text-slate-700 hover:bg-slate-50">다음 →</button>
                    </div>
                </div>
            </AdminPage>
        </AdminShell>
    );
};
