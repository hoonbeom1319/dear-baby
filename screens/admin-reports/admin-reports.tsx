'use client';

import { useState, type ReactNode } from 'react';

import { useRouter } from 'next/navigation';

import { Dialog } from 'radix-ui';

import { useApp } from '@/application/providers';

import { AdChip, AdInput, AdminPage, AdminShell } from '@/widgets/admin-shell';

import type { ReportRow } from '@/server/actions/reports';
import { updateReportStatus } from '@/server/actions/reports';

import { cn } from '@/shared/lib';
import { Button, Icon, Pill } from '@/shared/ui';

const Th = ({ children, className }: { children?: ReactNode; className?: string }) => (
    <th className={cn('border-b border-border bg-slate-50 px-4 py-3 text-left text-xs font-semibold text-muted', className)}>{children}</th>
);

function formatRelativeTime(isoString: string): { relative: string; date: string } {
    const now = Date.now();
    const then = new Date(isoString).getTime();
    const diffMs = now - then;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    let relative: string;
    if (diffMin < 60) relative = `${diffMin}분 전`;
    else if (diffHour < 24) relative = `${diffHour}시간 전`;
    else relative = `${diffDay}일 전`;

    const d = new Date(isoString);
    const date = `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

    return { relative, date };
}

type StatusFilter = 'pending' | 'applied' | 'ignored' | 'all';

type Props = { initialReports: ReportRow[] };

/** 정보 제보 관리 (PRD A-5). 자동 반영 금지 — 운영자가 확인 모달을 거쳐 반영. */
export const AdminReports = ({ initialReports }: Props) => {
    const router = useRouter();
    const { toast } = useApp();
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending');
    const [search, setSearch] = useState('');
    const [confirmId, setConfirmId] = useState<string | null>(null);
    const [acting, setActing] = useState(false);

    const pendingCount = initialReports.filter((r) => r.status === 'pending').length;

    const filtered = initialReports.filter((r) => {
        if (statusFilter !== 'all' && r.status !== statusFilter) return false;
        if (search) {
            const q = search.toLowerCase();
            const placeName = r.places?.name ?? '';
            if (!placeName.toLowerCase().includes(q) && !r.reason.toLowerCase().includes(q)) return false;
        }
        return true;
    });

    const confirmingReport = confirmId ? initialReports.find((r) => r.id === confirmId) : null;

    const handleIgnore = async (id: string) => {
        try {
            await updateReportStatus(id, 'ignored');
            toast('제보를 무시했어요');
            router.refresh();
        } catch {
            toast('처리에 실패했어요');
        }
    };

    const handleApply = async () => {
        if (!confirmId) return;
        setActing(true);
        try {
            await updateReportStatus(confirmId, 'applied');
            setConfirmId(null);
            toast('제보를 반영했어요');
            router.refresh();
        } catch {
            toast('처리에 실패했어요');
        } finally {
            setActing(false);
        }
    };

    const statusTone = (status: ReportRow['status']) => {
        if (status === 'applied') return 'success' as const;
        if (status === 'ignored') return 'neutral' as const;
        return 'warning' as const;
    };

    const statusLabel = (status: ReportRow['status']) => {
        if (status === 'applied') return '반영됨';
        if (status === 'ignored') return '무시';
        return '대기 중';
    };

    return (
        <AdminShell>
            <AdminPage title="정보 제보" subtitle="자동 반영 금지 · 운영자가 검토 후 [반영]을 클릭 · A-5 · 부록 15.1-7">
                <div className="mb-4 flex items-center gap-2">
                    <AdChip active={statusFilter === 'pending'} onClick={() => setStatusFilter('pending')}>
                        대기 중 <span className="ml-0.5 font-semibold">{pendingCount}</span>
                    </AdChip>
                    <AdChip active={statusFilter === 'applied'} onClick={() => setStatusFilter('applied')}>반영됨</AdChip>
                    <AdChip active={statusFilter === 'ignored'} onClick={() => setStatusFilter('ignored')}>무시</AdChip>
                    <AdChip active={statusFilter === 'all'} onClick={() => setStatusFilter('all')}>전체</AdChip>
                    <div className="flex-1" />
                    <div className="relative min-w-[240px]">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                            <Icon name="search" size={14} />
                        </span>
                        <AdInput
                            className="h-8 pl-9 text-[13px]"
                            placeholder="장소명·내용으로 검색"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-border bg-surface">
                    <table className="w-full border-collapse text-[13.5px]">
                        <thead>
                            <tr>
                                <Th className="w-[140px]">제보 시각</Th>
                                <Th>장소</Th>
                                <Th className="w-[90px]">상태</Th>
                                <Th>내용</Th>
                                <Th className="w-[140px]">제보자</Th>
                                <Th className="w-[180px]" />
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((report) => {
                                const { relative, date } = formatRelativeTime(report.created_at);
                                return (
                                    <tr key={report.id} className="transition-colors hover:bg-slate-50">
                                        <td className="border-b border-border px-4 py-3.5 text-muted">
                                            <div className="font-medium text-surface-foreground">{relative}</div>
                                            <div className="mt-0.5 text-[11.5px]">{date}</div>
                                        </td>
                                        <td className="border-b border-border px-4 py-3.5 font-medium text-surface-foreground">
                                            {report.places?.name ?? '(삭제된 장소)'}
                                        </td>
                                        <td className="border-b border-border px-4 py-3.5">
                                            <Pill tone={statusTone(report.status)}>{statusLabel(report.status)}</Pill>
                                        </td>
                                        <td className="border-b border-border px-4 py-3.5 text-slate-700">{report.reason}</td>
                                        <td className="border-b border-border px-4 py-3.5 text-muted">
                                            {report.user_id ? '회원' : '비회원'}
                                        </td>
                                        <td className="border-b border-border px-4 py-3.5">
                                            {report.status === 'pending' && (
                                                <div className="flex justify-end gap-1.5">
                                                    <Button size="sm" variant="outline" onClick={() => handleIgnore(report.id)}>
                                                        무시
                                                    </Button>
                                                    <Button size="sm" onClick={() => setConfirmId(report.id)}>
                                                        반영하기
                                                    </Button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div className="py-10 text-center text-[13px] text-muted">해당 조건에 제보가 없어요</div>
                    )}
                </div>
                <div className="mt-3.5">
                    <span className="text-[12.5px] text-muted">총 {initialReports.length}건 · {filtered.length}개 표시 중</span>
                </div>
            </AdminPage>

            {/* 반영 확인 모달 — 운영자 실수 방지 (PRD 10.3) */}
            <Dialog.Root open={confirmId !== null} onOpenChange={(open) => !open && setConfirmId(null)}>
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
                                    {confirmingReport && (
                                        <>
                                            <strong className="text-surface-foreground">{confirmingReport.places?.name ?? '(삭제된 장소)'}</strong>의 제보를 반영 처리해요.
                                            <br />
                                            운영자 실수 방지를 위한 한 번의 확인 단계예요. (10.3 데이터 무결성)
                                        </>
                                    )}
                                </Dialog.Description>
                            </div>
                        </div>
                        <div className="mt-5 flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => setConfirmId(null)} disabled={acting}>
                                취소
                            </Button>
                            <Button size="sm" onClick={handleApply} disabled={acting}>
                                {acting ? '처리 중…' : '반영하기'}
                            </Button>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </AdminShell>
    );
};
