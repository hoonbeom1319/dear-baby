import type { ReactNode } from 'react';

import { AdminShell } from '@/widgets/admin-shell';

import { fetchPendingReportsCount } from '@/server/actions/reports';

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const pendingReports = await fetchPendingReportsCount();
    return <AdminShell pendingReports={pendingReports}>{children}</AdminShell>;
}
