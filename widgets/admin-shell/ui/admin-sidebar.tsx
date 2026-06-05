'use client';

import { useEffect } from 'react';

import { usePathname } from 'next/navigation';

import { Link } from '@/shared/ui';
import { Icon, type IconName } from '@/shared/ui';

import { cn } from '@/hbds/lib/utils';

import { ADMIN_SIDEBAR_WIDTH_COLLAPSED, ADMIN_SIDEBAR_WIDTH_EXPANDED } from '../config/sidebar';

const NAV: { href: string; label: string; icon: IconName; key: string }[] = [
    { href: '/admin', label: '대시보드', icon: 'home', key: 'dashboard' },
    { href: '/admin/places', label: '장소 관리', icon: 'pin', key: 'places' },
    { href: '/admin/place-finder', label: '장소 찾기', icon: 'search', key: 'place-finder' },
    { href: '/admin/courses', label: '코스 관리', icon: 'route', key: 'courses' },
    { href: '/admin/reports', label: '정보 제보', icon: 'inbox', key: 'reports' }
];

type AdminSidebarProps = {
    pendingReports: number;
    isDesktop: boolean;
    isCollapsed: boolean;
    isMobileOpen: boolean;
    onToggleCollapsed: () => void;
    onCloseMobile: () => void;
};

export const AdminSidebar = ({ pendingReports, isDesktop, isCollapsed, isMobileOpen, onToggleCollapsed, onCloseMobile }: AdminSidebarProps) => {
    const pathname = usePathname();
    const isActive = (href: string) => (href === '/admin' ? pathname === '/admin' : pathname.startsWith(href));
    const showLabels = !isCollapsed;

    useEffect(() => {
        onCloseMobile();
    }, [pathname, onCloseMobile]);

    return (
        <aside
            style={{ width: isCollapsed ? ADMIN_SIDEBAR_WIDTH_COLLAPSED : ADMIN_SIDEBAR_WIDTH_EXPANDED }}
            className={cn(
                'flex shrink-0 flex-col border-r border-border bg-surface transition-[width,transform] duration-200 ease-out',
                isCollapsed ? 'px-2 py-3' : 'px-3 py-[18px]',
                isDesktop
                    ? 'relative z-auto translate-x-0'
                    : cn('fixed inset-y-0 left-0 z-50 shadow-lg', isMobileOpen ? 'translate-x-0' : '-translate-x-full')
            )}
        >
            <div className={cn('flex items-center', isCollapsed ? 'justify-center px-0' : 'gap-2.5 px-2.5 pt-1 pb-[18px]')}>
                {isDesktop && isCollapsed ? (
                    <button
                        type="button"
                        onClick={onToggleCollapsed}
                        aria-label="사이드바 펼치기"
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-neutral-100 hover:text-surface-foreground"
                    >
                        <Icon name="right" size={16} />
                    </button>
                ) : (
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-900 text-xs font-bold tracking-[-0.02em] text-white">
                        db
                    </span>
                )}
                {showLabels && (
                    <div className="flex min-w-0 flex-1 flex-col leading-tight">
                        <span className="truncate text-[15px] font-bold tracking-[-0.02em] text-surface-foreground">Dear Baby</span>
                        <span className="mt-0.5 text-[11px] font-medium tracking-[0.02em] text-muted">Admin</span>
                    </div>
                )}
                {isDesktop && !isCollapsed && (
                    <button
                        type="button"
                        onClick={onToggleCollapsed}
                        aria-label="사이드바 접기"
                        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted transition-colors hover:bg-neutral-100 hover:text-surface-foreground"
                    >
                        <Icon name="back" size={16} />
                    </button>
                )}
            </div>

            {showLabels && <div className="px-2.5 pt-3.5 pb-1.5 text-[11px] font-semibold tracking-[0.06em] text-muted uppercase">메뉴</div>}
            <nav className="flex flex-col gap-1">
                {NAV.map((item) => {
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.key}
                            href={item.href}
                            title={isCollapsed ? item.label : undefined}
                            className={cn(
                                'relative flex items-center rounded-lg py-2 text-[13.5px] font-medium transition-colors',
                                isCollapsed ? 'justify-center px-0' : 'gap-2.5 px-2.5',
                                active ? 'bg-primary-50 text-primary-700' : 'text-neutral-700 hover:bg-neutral-100 hover:text-surface-foreground'
                            )}
                        >
                            <span className={active ? 'text-primary-600' : 'text-muted'}>
                                <Icon name={item.icon} size={16} />
                            </span>
                            {showLabels && <span>{item.label}</span>}
                            {item.key === 'reports' && pendingReports > 0 && (
                                <span
                                    className={cn(
                                        'rounded-full bg-primary-600 font-semibold text-white tabular-nums',
                                        isCollapsed
                                            ? 'absolute top-1.5 right-2 h-2 w-2'
                                            : 'ml-auto px-[7px] py-0.5 text-[11px] leading-tight'
                                    )}
                                >
                                    {!isCollapsed && pendingReports}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div
                className={cn(
                    'mt-auto flex items-center border-t border-border pt-3 pb-1',
                    isCollapsed ? 'justify-center px-0' : 'gap-2.5 px-2.5'
                )}
            >
                <span
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-xs font-semibold text-neutral-700"
                    title={isCollapsed ? '서지원 · 운영자' : undefined}
                >
                    서
                </span>
                {showLabels && (
                    <div className="flex min-w-0 flex-col leading-tight">
                        <span className="truncate text-[13px] font-medium text-surface-foreground">서지원</span>
                        <span className="text-[11px] text-muted">운영자</span>
                    </div>
                )}
            </div>
        </aside>
    );
};
