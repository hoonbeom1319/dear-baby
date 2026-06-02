'use client';

import type { ReactNode } from 'react';

import { Link } from '@/shared/ui';
import { usePathname } from 'next/navigation';

import { Icon, type IconName } from '@/shared/ui';

import { cn } from '@/hbds/lib/utils';

const NAV: { href: string; label: string; icon: IconName; key: string }[] = [
    { href: '/admin', label: '대시보드', icon: 'home', key: 'dashboard' },
    { href: '/admin/places', label: '장소 관리', icon: 'pin', key: 'places' },
    { href: '/admin/courses', label: '코스 관리', icon: 'route', key: 'courses' },
    { href: '/admin/reports', label: '정보 제보', icon: 'inbox', key: 'reports' }
];

/**
 * 관리자 데스크톱 셸 — 좌측 사이드바 + 본문. (PRD 8.2)
 * 시안의 브라우저 창 크롬(점·URL바)은 디자인 캔버스용이라 제외한다.
 */
export const AdminShell = ({ children, pendingReports = 0 }: { children: ReactNode; pendingReports?: number }) => {
    const pathname = usePathname();
    const isActive = (href: string) => (href === '/admin' ? pathname === '/admin' : pathname.startsWith(href));

    return (
        <div className="flex min-h-dvh bg-neutral-50 text-neutral-700">
            <aside className="flex w-[232px] shrink-0 flex-col border-r border-border bg-surface px-3 py-[18px]">
                <div className="flex items-center gap-2.5 px-2.5 pt-1 pb-[18px]">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-xs font-bold tracking-[-0.02em] text-white">
                        db
                    </span>
                    <div className="flex flex-col leading-tight">
                        <span className="text-[15px] font-bold tracking-[-0.02em] text-surface-foreground">Dear Baby</span>
                        <span className="mt-0.5 text-[11px] font-medium tracking-[0.02em] text-muted">Admin</span>
                    </div>
                </div>

                <div className="px-2.5 pt-3.5 pb-1.5 text-[11px] font-semibold tracking-[0.06em] text-muted uppercase">메뉴</div>
                <nav className="flex flex-col gap-1">
                    {NAV.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.key}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] font-medium transition-colors',
                                    active ? 'bg-primary-50 text-primary-700' : 'text-neutral-700 hover:bg-neutral-100 hover:text-surface-foreground'
                                )}
                            >
                                <span className={active ? 'text-primary-600' : 'text-muted'}>
                                    <Icon name={item.icon} size={16} />
                                </span>
                                <span>{item.label}</span>
                                {item.key === 'reports' && pendingReports > 0 && (
                                    <span className="ml-auto rounded-full bg-primary-600 px-[7px] py-0.5 text-[11px] leading-tight font-semibold text-white tabular-nums">
                                        {pendingReports}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto flex items-center gap-2.5 border-t border-border px-2.5 pt-3 pb-1">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 text-xs font-semibold text-neutral-700">
                        서
                    </span>
                    <div className="flex flex-col leading-tight">
                        <span className="text-[13px] font-medium text-surface-foreground">서지원</span>
                        <span className="text-[11px] text-muted">운영자</span>
                    </div>
                </div>
            </aside>

            <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
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
