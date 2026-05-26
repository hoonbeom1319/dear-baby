'use client';

import { useState, type ReactNode } from 'react';

import { Dialog } from 'radix-ui';

import { useApp } from '@/application/providers';

import { AdChip, AdInput, AdminPage, AdminShell } from '@/widgets/admin-shell';

import { cn } from '@/shared/lib';
import { Button, Icon, Pill } from '@/shared/ui';

type Report = { time: string; date: string; place: string; kind: 'minus' | 'plus'; change: string; who: string };

const REPORTS: Report[] = [
    { time: '14시간 전', date: '05-21 14:32', place: '잠실 키즈빌리지', kind: 'minus', change: '주차가 어려워요', who: '비회원' },
    { time: '1일 전', date: '05-20 09:14', place: '롯데월드몰 패밀리존', kind: 'minus', change: '수유실 없어졌어요', who: '회원 · 서지원' },
    { time: '2일 전', date: '05-19 17:08', place: '올리브 베이커리 카페', kind: 'plus', change: '정보 그대로 맞아요', who: '비회원' },
    { time: '3일 전', date: '05-18 11:42', place: '동네 한정식 — 솔밭', kind: 'minus', change: '폐업했어요', who: '회원 · 김지호' },
    { time: '5일 전', date: '05-16 22:01', place: '운정 한식당', kind: 'minus', change: '아기의자가 없어졌어요', who: '비회원' }
];

const Th = ({ children, className }: { children?: ReactNode; className?: string }) => (
    <th className={cn('border-b border-border bg-slate-50 px-4 py-3 text-left text-xs font-semibold text-muted', className)}>{children}</th>
);

/** 정보 제보 관리 (PRD A-5). 자동 반영 금지 — 운영자가 확인 모달을 거쳐 반영. */
export const AdminReports = () => {
    const { toast } = useApp();
    const [confirmFor, setConfirmFor] = useState<number | null>(null);

    return (
        <AdminShell>
            <AdminPage title="정보 제보" subtitle="자동 반영 금지 · 운영자가 검토 후 [반영]을 클릭 · A-5 · 부록 15.1-7">
                <div className="mb-4 flex items-center gap-2">
                    <AdChip active>
                        대기 중 <span className="ml-0.5 font-semibold">4</span>
                    </AdChip>
                    <AdChip>반영됨</AdChip>
                    <AdChip>무시</AdChip>
                    <AdChip>전체</AdChip>
                    <div className="flex-1" />
                    <div className="relative min-w-[240px]">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                            <Icon name="search" size={14} />
                        </span>
                        <AdInput className="h-8 pl-9 text-[13px]" placeholder="장소명·내용으로 검색" />
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-border bg-surface">
                    <table className="w-full border-collapse text-[13.5px]">
                        <thead>
                            <tr>
                                <Th className="w-[140px]">제보 시각</Th>
                                <Th>장소</Th>
                                <Th className="w-[90px]">유형</Th>
                                <Th>변경 내용</Th>
                                <Th className="w-[140px]">제보자</Th>
                                <Th className="w-[180px]" />
                            </tr>
                        </thead>
                        <tbody>
                            {REPORTS.map((report, i) => (
                                <tr key={i} className="transition-colors hover:bg-slate-50">
                                    <td className="border-b border-border px-4 py-3.5 text-muted">
                                        <div className="font-medium text-surface-foreground">{report.time}</div>
                                        <div className="mt-0.5 text-[11.5px]">{report.date}</div>
                                    </td>
                                    <td className="border-b border-border px-4 py-3.5 font-medium text-surface-foreground">{report.place}</td>
                                    <td className="border-b border-border px-4 py-3.5">
                                        {report.kind === 'minus' ? <Pill tone="warning">변경 필요</Pill> : <Pill tone="success">확인됨</Pill>}
                                    </td>
                                    <td className="border-b border-border px-4 py-3.5 text-slate-700">{report.change}</td>
                                    <td className="border-b border-border px-4 py-3.5 text-muted">{report.who}</td>
                                    <td className="border-b border-border px-4 py-3.5">
                                        <div className="flex justify-end gap-1.5">
                                            <Button size="sm" variant="outline" onClick={() => toast('제보를 무시했어요')}>
                                                무시
                                            </Button>
                                            <Button size="sm" onClick={() => setConfirmFor(i)}>
                                                반영하기
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </AdminPage>

            {/* 반영 확인 모달 — 운영자 실수 방지 (PRD 10.3) */}
            <Dialog.Root open={confirmFor !== null} onOpenChange={(open) => !open && setConfirmFor(null)}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-[1040] animate-[fade-in_150ms_ease-out] bg-slate-900/45" />
                    <Dialog.Content className="fixed left-1/2 top-1/2 z-[1050] w-[440px] max-w-[calc(100vw-32px)] -translate-x-1/2 -translate-y-1/2 animate-[modal-in_200ms_var(--ease-spring)] rounded-xl bg-surface p-6 shadow-modal focus:outline-none">
                        <div className="flex items-start gap-3">
                            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] bg-amber-50 text-warning">
                                <Icon name="alert" size={18} />
                            </span>
                            <div className="flex-1">
                                <Dialog.Title className="text-[17px] font-semibold tracking-[-0.015em] text-surface-foreground">
                                    이 제보를 반영할까요?
                                </Dialog.Title>
                                <Dialog.Description className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
                                    {confirmFor !== null && (
                                        <>
                                            <strong className="text-surface-foreground">{REPORTS[confirmFor].place}</strong>의 데이터가 즉시 변경돼요.
                                            <br />
                                            운영자 실수 방지를 위한 한 번의 확인 단계예요. (10.3 데이터 무결성)
                                        </>
                                    )}
                                </Dialog.Description>
                            </div>
                        </div>
                        <div className="mt-5 flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => setConfirmFor(null)}>
                                취소
                            </Button>
                            <Button
                                size="sm"
                                onClick={() => {
                                    setConfirmFor(null);
                                    toast('제보를 반영했어요');
                                }}>
                                반영하기
                            </Button>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </AdminShell>
    );
};
