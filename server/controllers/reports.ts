'use server';

import { revalidatePath } from 'next/cache';

import { findPendingReportsCount, findReportsAdmin, insertReport, updateReportStatus as dao_updateReportStatus } from '../dao/reports';

export type { ReportRow } from '../dao/reports';

// ─── Queries ─────────────────────────────────────────────────────────────────

export async function fetchPendingReportsCount() {
    return findPendingReportsCount();
}

export async function fetchReportsAdmin() {
    return findReportsAdmin();
}

// ─── Mutations ───────────────────────────────────────────────────────────────

export async function createReport(input: { placeId: string; reason: string; userId?: string }): Promise<void> {
    await insertReport(input);
}

export async function updateReportStatus(id: string, status: 'applied' | 'ignored'): Promise<void> {
    await dao_updateReportStatus(id, status);
    revalidatePath('/admin/reports');
}
