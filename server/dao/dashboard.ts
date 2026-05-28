import { createSupabaseAdmin } from '../db/supabase';

export async function findRecentReports() {
    const supabase = createSupabaseAdmin();
    const { data } = await supabase.from('reports').select('reason, created_at, user_id, places(name)').order('created_at', { ascending: false }).limit(10);
    return data ?? [];
}

export async function findRecentPlaces() {
    const supabase = createSupabaseAdmin();
    const { data } = await supabase.from('places').select('name, created_at').order('created_at', { ascending: false }).limit(10);
    return data ?? [];
}

export async function findAllPlaceAreas() {
    const supabase = createSupabaseAdmin();
    const { data } = await supabase.from('places').select('area');
    return data ?? [];
}

export async function findRecentCourses() {
    const supabase = createSupabaseAdmin();
    const { data } = await supabase.from('courses').select('title, created_at').order('created_at', { ascending: false }).limit(10);
    return data ?? [];
}

export async function countPendingReports(): Promise<number> {
    const supabase = createSupabaseAdmin();
    const { count } = await supabase.from('reports').select('id', { count: 'exact', head: true }).eq('status', 'pending');
    return count ?? 0;
}

export async function findOldestPendingReport() {
    const supabase = createSupabaseAdmin();
    const { data } = await supabase
        .from('reports')
        .select('created_at')
        .eq('status', 'pending')
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();
    return data;
}
