import { createSupabaseAdmin } from '../db/supabase';

export type ReportRow = {
    id: string;
    place_id: string;
    reason: string;
    user_id: string | null;
    status: 'pending' | 'applied' | 'ignored';
    created_at: string;
    places: { name: string } | null;
};

// ─── Queries ─────────────────────────────────────────────────────────────────

export async function findPendingReportsCount(): Promise<number> {
    const supabase = createSupabaseAdmin();
    const { count, error } = await supabase.from('reports').select('id', { count: 'exact', head: true }).eq('status', 'pending');
    if (error) return 0;
    return count ?? 0;
}

export async function findReportsAdmin(): Promise<ReportRow[]> {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase.from('reports').select('*, places(name)').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data as ReportRow[];
}

// ─── Mutations ───────────────────────────────────────────────────────────────

export async function insertReport(input: { placeId: string; reason: string; userId?: string }): Promise<void> {
    const supabase = createSupabaseAdmin();
    const { error } = await supabase.from('reports').insert({
        place_id: input.placeId,
        reason: input.reason,
        user_id: input.userId ?? null
    });
    if (error) throw new Error(error.message);
}

export async function updateReportStatus(id: string, status: 'applied' | 'ignored'): Promise<void> {
    const supabase = createSupabaseAdmin();
    const { error } = await supabase.from('reports').update({ status }).eq('id', id);
    if (error) throw new Error(error.message);
}
