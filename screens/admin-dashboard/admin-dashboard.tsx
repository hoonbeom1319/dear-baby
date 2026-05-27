'use client';

import type { ReactNode } from 'react';

import { useRouter } from 'next/navigation';

import { AdminPage, AdminShell } from '@/widgets/admin-shell';

import { cn } from '@/shared/lib';
import { Button, Icon, type IconName } from '@/shared/ui';

type StatProps = { label: string; value: string; suffix: ReactNode; percent: number; barClass?: string };

const Stat = ({ label, value, suffix, percent, barClass = 'bg-primary-500' }: StatProps) => (
    <div className="rounded-xl border border-border bg-surface p-5">
        <div className="text-xs font-semibold uppercase tracking-[0.05em] text-muted">{label}</div>
        <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-[30px] font-bold leading-none tracking-[-0.025em] tabular-nums text-surface-foreground">{value}</span>
            <span className="text-xs text-muted">{suffix}</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <span className={cn('block h-full rounded-full', barClass)} style={{ width: `${percent}%` }} />
        </div>
    </div>
);

const ACTIVITY: { icon: IconName; tone: string; title: string; meta: string }[] = [
    { icon: 'inbox', tone: 'bg-primary-50 text-primary-600', title: "잠실 키즈빌리지 — '주차가 어려워요'", meta: '14시간 전 · 비회원' },
    { icon: 'plus', tone: 'bg-emerald-50 text-success', title: '새 장소 등록: 운정 카페 라떼라떼', meta: '어제 · 서지원' },
    { icon: 'edit', tone: 'bg-slate-100 text-slate-500', title: '올리브 베이커리 — 영업시간 수정', meta: '어제 · 서지원' },
    { icon: 'inbox', tone: 'bg-primary-50 text-primary-600', title: "롯데월드몰 — '수유실 없어졌어요'", meta: '2일 전 · 회원' },
    { icon: 'route', tone: 'bg-violet-50 text-violet-600', title: '코스 등록: 운정 야외 코스', meta: '3일 전 · 서지원' }
];

const CHECKLIST: { label: string; meta: string; done?: boolean }[] = [
    { label: '송파권 · 운정권 각 25~30곳 장소 등록', meta: '29 / 50' },
    { label: '동네별 추천 코스 최소 2개씩', meta: '3 / 4' },
    { label: '서비스 이용약관 · 개인정보 처리방침 게시', meta: '완료', done: true },
    { label: '베타 사용자 2명 피드백 반영', meta: '진행 중' }
];

/** 관리자 대시보드 (PRD A-2). 처리할 일을 한눈에. */
export const AdminDashboard = () => {
    const router = useRouter();

    return (
        <AdminShell>
            <AdminPage
                title="대시보드"
                subtitle="처리할 일을 한눈에 · 2026년 5월 21일 (목)"
                actions={
                    <>
                        <Button size="sm" variant="outline" onClick={() => router.push('/admin/courses')}>
                            <Icon name="plus" size={14} /> 새 코스
                        </Button>
                        <Button size="sm" onClick={() => router.push('/admin/places')}>
                            <Icon name="plus" size={14} /> 새 장소 추가
                        </Button>
                    </>
                }>
                {/* 새 제보 배너 */}
                <button
                    type="button"
                    onClick={() => router.push('/admin/reports')}
                    className="mb-6 flex w-full items-center justify-between gap-4 rounded-xl border border-primary-200 bg-primary-50 px-5 py-4 text-left transition-colors hover:bg-primary-100">
                    <div className="flex items-center gap-3.5">
                        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white">
                            <Icon name="bell" size={20} />
                        </span>
                        <div>
                            <div className="text-[15px] font-semibold tracking-[-0.01em] text-primary-900">새 제보 4건이 대기 중이에요</div>
                            <div className="mt-0.5 text-[12.5px] text-primary-700">48시간 내 대응 목표 · 가장 오래된 제보는 14시간 전</div>
                        </div>
                    </div>
                    <Icon name="right" size={20} className="text-primary-700" />
                </button>

                {/* 통계 */}
                <div className="mb-6 grid grid-cols-3 gap-4">
                    <Stat label="송파권 등록 장소" value="18" suffix="/ 25~30 목표" percent={65} />
                    <Stat label="운정권 등록 장소" value="11" suffix="/ 25~30 목표" percent={40} barClass="bg-warning" />
                    <Stat
                        label="이번 주 행동 전환율"
                        value="38%"
                        suffix={<span className="text-success">+4%p</span>}
                        percent={38}
                        barClass="bg-success"
                    />
                </div>

                {/* 최근 활동 + 체크리스트 */}
                <div className="grid grid-cols-[1.4fr_1fr] items-start gap-5">
                    <div className="overflow-hidden rounded-xl border border-border bg-surface">
                        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
                            <div>
                                <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-surface-foreground">최근 활동</h3>
                                <p className="mt-0.5 text-xs text-muted">제보 · 등록 · 수정 7일</p>
                            </div>
                        </div>
                        <div>
                            {ACTIVITY.map((row, i) => (
                                <div
                                    key={i}
                                    className={cn('flex items-center gap-3 px-5 py-3', i > 0 && 'border-t border-border')}>
                                    <span className={cn('inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', row.tone)}>
                                        <Icon name={row.icon} size={15} />
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <div className="truncate text-[13.5px] font-medium text-surface-foreground">{row.title}</div>
                                        <div className="mt-0.5 text-[11.5px] text-muted">{row.meta}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-xl border border-dashed border-slate-300 bg-surface px-5 py-[18px]">
                        <div className="mb-2.5 text-xs font-semibold uppercase tracking-[0.06em] text-muted">출시 기준 체크리스트</div>
                        {CHECKLIST.map((item, i) => (
                            <div
                                key={i}
                                className={cn(
                                    'flex items-center gap-2.5 py-2 text-[13px]',
                                    i < CHECKLIST.length - 1 && 'border-b border-dashed border-slate-200',
                                    item.done ? 'text-muted line-through' : 'text-slate-700'
                                )}>
                                <span
                                    className={cn(
                                        'inline-flex h-4 w-4 shrink-0 items-center justify-center rounded',
                                        item.done ? 'bg-success text-white' : 'border-[1.5px] border-slate-300 text-transparent'
                                    )}>
                                    <Icon name="check" size={11} stroke={3} />
                                </span>
                                <span className="flex-1">{item.label}</span>
                                <span className="text-[11px] text-muted">{item.meta}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </AdminPage>
        </AdminShell>
    );
};
