'use client';

import type { ReactNode } from 'react';

import { useRouter } from 'next/navigation';

import type { DashboardData } from '@/server/controllers/dashboard';

import { AdminPage } from '@/widgets/admin-shell';

import { Button, Icon, type IconName } from '@/shared/ui';

import { cn } from '@/hbds/lib/utils';

type StatProps = { label: string; value: string; suffix: ReactNode; percent: number; barClass?: string };

const Stat = ({ label, value, suffix, percent, barClass = 'bg-primary-500' }: StatProps) => (
    <div className="rounded-xl border border-border bg-surface p-5">
        <div className="text-xs font-semibold tracking-[0.05em] text-muted uppercase">{label}</div>
        <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-[30px] leading-none font-bold tracking-[-0.025em] text-surface-foreground tabular-nums">{value}</span>
            <span className="text-xs text-muted">{suffix}</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-neutral-100">
            <span className={cn('block h-full rounded-full', barClass)} style={{ width: `${Math.min(percent, 100)}%` }} />
        </div>
    </div>
);

const CHECKLIST: { label: string; meta: string; done?: boolean }[] = [
    { label: '송파권 · 운정권 각 25~30곳 장소 등록', meta: '진행 중' },
    { label: '동네별 추천 코스 최소 2개씩', meta: '진행 중' },
    { label: '서비스 이용약관 · 개인정보 처리방침 게시', meta: '완료', done: true },
    { label: '베타 사용자 2명 피드백 반영', meta: '진행 중' }
];

const AREA_GOAL = 30;

/** 관리자 대시보드 (PRD A-2). 처리할 일을 한눈에. */
export const AdminDashboard = ({ data }: { data: DashboardData }) => {
    const router = useRouter();

    const { pendingReports, oldestPendingHours, placeCountByArea, totalPlaces, recentActivity } = data;

    const today = new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short'
    });

    const oldestText =
        oldestPendingHours === null
            ? null
            : oldestPendingHours < 24
              ? `가장 오래된 제보는 ${oldestPendingHours}시간 전`
              : `가장 오래된 제보는 ${Math.floor(oldestPendingHours / 24)}일 전`;

    const songpa = placeCountByArea['songpa'] ?? 0;
    const paju = placeCountByArea['paju'] ?? 0;

    return (
        <AdminPage
            title="대시보드"
            subtitle={`처리할 일을 한눈에 · ${today}`}
            actions={
                <>
                    <Button size="sm" variant="outline" onClick={() => router.push('/admin/courses')}>
                        <Icon name="plus" size={14} /> 새 코스
                    </Button>
                    <Button size="sm" onClick={() => router.push('/admin/places')}>
                        <Icon name="plus" size={14} /> 새 장소 추가
                    </Button>
                </>
            }
        >
            {/* 새 제보 배너 */}
            {pendingReports > 0 && (
                <button
                    type="button"
                    onClick={() => router.push('/admin/reports')}
                    className="mb-6 flex w-full items-center justify-between gap-4 rounded-xl border border-primary-200 bg-primary-50 px-5 py-4 text-left transition-colors hover:bg-primary-100"
                >
                    <div className="flex items-center gap-3.5">
                        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white">
                            <Icon name="bell" size={20} />
                        </span>
                        <div>
                            <div className="text-[15px] font-semibold tracking-[-0.01em] text-primary-900">새 제보 {pendingReports}건이 대기 중이에요</div>
                            <div className="mt-0.5 text-[12.5px] text-primary-700">48시간 내 대응 목표{oldestText ? ` · ${oldestText}` : ''}</div>
                        </div>
                    </div>
                    <Icon name="right" size={20} className="text-primary-700" />
                </button>
            )}

            {/* 통계 */}
            <div className="mb-6 grid grid-cols-3 gap-4">
                <Stat label="송파권 등록 장소" value={String(songpa)} suffix={`/ ${AREA_GOAL} 목표`} percent={(songpa / AREA_GOAL) * 100} />
                <Stat
                    label="파주권 등록 장소"
                    value={String(paju)}
                    suffix={`/ ${AREA_GOAL} 목표`}
                    percent={(paju / AREA_GOAL) * 100}
                    barClass="bg-warning"
                />
                <Stat
                    label="전체 등록 장소"
                    value={String(totalPlaces)}
                    suffix={`/ ${AREA_GOAL * 2} 목표`}
                    percent={(totalPlaces / (AREA_GOAL * 2)) * 100}
                    barClass="bg-success"
                />
            </div>

            {/* 최근 활동 + 체크리스트 */}
            <div className="grid grid-cols-[1.4fr_1fr] items-start gap-5">
                <div className="overflow-hidden rounded-xl border border-border bg-surface">
                    <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
                        <div>
                            <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-surface-foreground">최근 활동</h3>
                            <p className="mt-0.5 text-xs text-muted">제보 · 등록 · 최근 항목</p>
                        </div>
                    </div>
                    <div>
                        {recentActivity.length === 0 ? (
                            <div className="px-5 py-6 text-center text-[13px] text-muted">최근 활동이 없어요</div>
                        ) : (
                            recentActivity.map((row, i) => (
                                <div key={i} className={cn('flex items-center gap-3 px-5 py-3', i > 0 && 'border-t border-border')}>
                                    <span className={cn('inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', row.tone)}>
                                        <Icon name={row.icon as IconName} size={15} />
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <div className="truncate text-[13.5px] font-medium text-surface-foreground">{row.title}</div>
                                        <div className="mt-0.5 text-[11.5px] text-muted">{row.meta}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="rounded-xl border border-dashed border-neutral-300 bg-surface px-5 py-[18px]">
                    <div className="mb-2.5 text-xs font-semibold tracking-[0.06em] text-muted uppercase">출시 기준 체크리스트</div>
                    {CHECKLIST.map((item, i) => (
                        <div
                            key={i}
                            className={cn(
                                'flex items-center gap-2.5 py-2 text-[13px]',
                                i < CHECKLIST.length - 1 && 'border-b border-dashed border-border',
                                item.done ? 'text-muted line-through' : 'text-neutral-700'
                            )}
                        >
                            <span
                                className={cn(
                                    'inline-flex h-4 w-4 shrink-0 items-center justify-center rounded',
                                    item.done ? 'bg-success text-white' : 'border-[1.5px] border-neutral-300 text-transparent'
                                )}
                            >
                                <Icon name="check" size={11} stroke={3} />
                            </span>
                            <span className="flex-1">{item.label}</span>
                            <span className="text-[11px] text-muted">{item.meta}</span>
                        </div>
                    ))}
                </div>
            </div>
        </AdminPage>
    );
};
