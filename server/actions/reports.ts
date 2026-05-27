'use server';

import { revalidatePath } from 'next/cache';

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

export async function createReport(input: { placeId: string; reason: string; userId?: string }): Promise<void> {
    const supabase = createSupabaseAdmin();
    const { error } = await supabase.from('reports').insert({
        place_id: input.placeId,
        reason: input.reason,
        user_id: input.userId ?? null,
    });
    if (error) throw new Error(error.message);
}

export async function fetchReportsAdmin(): Promise<ReportRow[]> {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
        .from('reports')
        .select('*, places(name)')
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data as ReportRow[];
}

export async function updateReportStatus(id: string, status: 'applied' | 'ignored'): Promise<void> {
    const supabase = createSupabaseAdmin();
    const { error } = await supabase.from('reports').update({ status }).eq('id', id);
    if (error) throw new Error(error.message);
    revalidatePath('/admin/reports');
}
