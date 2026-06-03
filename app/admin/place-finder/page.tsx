'use client';

import dynamic from 'next/dynamic';

// Leaflet은 브라우저 전용이므로 SSR 비활성화
const AdminPlaceFinder = dynamic(
    () => import('@/screens/admin-place-finder').then((m) => ({ default: m.AdminPlaceFinder })),
    { ssr: false, loading: () => <div className="flex h-screen items-center justify-center text-[13px] text-muted">로딩 중…</div> }
);

export default function Page() {
    return <AdminPlaceFinder />;
}
