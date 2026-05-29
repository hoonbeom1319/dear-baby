import type { ReactNode } from 'react';

import { fetchPendingReportsCount } from '@/server/controllers/reports';

import { AdminShell } from '@/widgets/admin-shell';

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const pendingReports = await fetchPendingReportsCount();
    return <AdminShell pendingReports={pendingReports}>{children}</AdminShell>;
}
