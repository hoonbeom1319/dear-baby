'use server';

import type { IconName } from '@/shared/ui';

import { countPendingReports, findAllPlaceAreas, findOldestPendingReport, findRecentCourses, findRecentPlaces, findRecentReports } from '../dao/dashboard';

export type DashboardActivity = {
    icon: IconName;
    tone: string;
    title: string;
    meta: string;
};

export type DashboardData = {
    pendingReports: number;
    oldestPendingHours: number | null;
    placeCountByArea: Record<string, number>;
    totalPlaces: number;
    recentActivity: DashboardActivity[];
};

function relativeTime(iso: string): string {
    const hours = Math.floor((Date.now() - new Date(iso).getTime()) / 3_600_000);
    if (hours < 1) return '방금 전';
    if (hours < 24) return `${hours}시간 전`;
    const days = Math.floor(hours / 24);
    return days === 1 ? '어제' : `${days}일 전`;
}

export async function fetchDashboardData(): Promise<DashboardData> {
    const [recentReports, recentPlaces, allPlaceAreas, recentCourses, pendingCount, oldestPending] = await Promise.all([
        findRecentReports(),
        findRecentPlaces(),
        findAllPlaceAreas(),
        findRecentCourses(),
        countPendingReports(),
        findOldestPendingReport()
    ]);

    const placeCountByArea: Record<string, number> = {};
    for (const p of allPlaceAreas) {
        placeCountByArea[p.area] = (placeCountByArea[p.area] ?? 0) + 1;
    }

    const oldestPendingHours = oldestPending?.created_at
        ? Math.floor((Date.now() - new Date(oldestPending.created_at).getTime()) / 3_600_000)
        : null;

    type Raw = { createdAt: string; item: DashboardActivity };
    const raw: Raw[] = [
        ...recentReports.map((r) => ({
            createdAt: r.created_at,
            item: {
                icon: 'inbox' as IconName,
                tone: 'bg-primary-50 text-primary-600',
                title: `${(r.places as unknown as { name: string } | null)?.name ?? '알 수 없는 장소'} — '${r.reason}'`,
                meta: `${relativeTime(r.created_at)} · ${r.user_id ? '회원' : '비회원'}`
            }
        })),
        ...recentPlaces.map((p) => ({
            createdAt: p.created_at,
            item: {
                icon: 'plus' as IconName,
                tone: 'bg-emerald-50 text-success',
                title: `새 장소 등록: ${p.name}`,
                meta: `${relativeTime(p.created_at)} · 운영자`
            }
        })),
        ...recentCourses.map((c) => ({
            createdAt: c.created_at,
            item: {
                icon: 'route' as IconName,
                tone: 'bg-secondary-50 text-secondary-600',
                title: `코스 등록: ${c.title}`,
                meta: `${relativeTime(c.created_at)} · 운영자`
            }
        }))
    ];

    const recentActivity = raw
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
        .map((r) => r.item);

    return {
        pendingReports: pendingCount,
        oldestPendingHours,
        placeCountByArea,
        totalPlaces: allPlaceAreas.length,
        recentActivity
    };
}
