'use client';

import type { ReactNode } from 'react';

import { Icon } from '@/shared/ui';

import { cn } from '@/hbds/lib/utils';

import { useAdminSidebar } from './model/use-admin-sidebar';
import { AdminSidebar } from './ui/admin-sidebar';

/**
 * 관리자 데스크톱 셸 — 좌측 사이드바 + 본문. (PRD 8.2)
 * 시안의 브라우저 창 크롬(점·URL바)은 디자인 캔버스용이라 제외한다.
 */
export const AdminShell = ({ children, pendingReports = 0 }: { children: ReactNode; pendingReports?: number }) => {
    const sidebar = useAdminSidebar();

    return (
        <div className="flex min-h-dvh bg-neutral-50 text-neutral-700">
            {!sidebar.isDesktop && sidebar.isMobileOpen && (
                <button
                    type="button"
                    aria-label="메뉴 닫기"
                    className="fixed inset-0 z-40 bg-neutral-900/40 lg:hidden"
                    onClick={sidebar.closeMobile}
                />
            )}

            <AdminSidebar
                pendingReports={pendingReports}
                isDesktop={sidebar.isDesktop}
                isCollapsed={sidebar.isCollapsed}
                isMobileOpen={sidebar.isMobileOpen}
                onToggleCollapsed={sidebar.toggleCollapsed}
                onCloseMobile={sidebar.closeMobile}
            />

            <div className="flex min-w-0 flex-1 flex-col">
                {!sidebar.isDesktop && (
                    <header className="flex shrink-0 items-center gap-3 border-b border-border bg-surface px-4 py-3">
                        <button
                            type="button"
                            onClick={sidebar.toggleMobile}
                            aria-label={sidebar.isMobileOpen ? '메뉴 닫기' : '메뉴 열기'}
                            aria-expanded={sidebar.isMobileOpen}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-neutral-700 transition-colors hover:bg-neutral-100"
                        >
                            <Icon name={sidebar.isMobileOpen ? 'close' : 'menu'} size={18} />
                        </button>
                        <div className="flex min-w-0 flex-col leading-tight">
                            <span className="truncate text-[15px] font-bold tracking-[-0.02em] text-surface-foreground">Dear Baby</span>
                            <span className="text-[11px] font-medium text-muted">Admin</span>
                        </div>
                    </header>
                )}

                <main className={cn('min-w-0 flex-1 overflow-y-auto')}>{children}</main>
            </div>
        </div>
    );
};

type AdminPageProps = {
    title: ReactNode;
    subtitle?: ReactNode;
    actions?: ReactNode;
    children: ReactNode;
};

/** 본문 페이지 래퍼 — 제목/부제/액션 헤더 + 패딩. */
export const AdminPage = ({ title, subtitle, actions, children }: AdminPageProps) => (
    <div className="px-8 py-7">
        <div className="mb-6 flex items-start justify-between gap-4">
            <div>
                <h1 className="text-[26px] leading-tight font-bold tracking-[-0.025em] text-surface-foreground">{title}</h1>
                {subtitle && <p className="mt-1 text-[13px] text-muted">{subtitle}</p>}
            </div>
            {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
        </div>
        {children}
    </div>
);
