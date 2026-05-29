import { createSupabaseAdmin } from '../db/supabase';

export async function findFavoritesByUser(userId: string): Promise<string[]> {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase.from('favorites').select('place_id').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map((r) => r.place_id as string);
}

export async function insertFavorite(userId: string, placeId: string): Promise<void> {
    const supabase = createSupabaseAdmin();
    const { error } = await supabase.from('favorites').insert({ user_id: userId, place_id: placeId });
    if (error) throw new Error(error.message);
}

export async function deleteFavorite(userId: string, placeId: string): Promise<void> {
    const supabase = createSupabaseAdmin();
    const { error } = await supabase.from('favorites').delete().eq('user_id', userId).eq('place_id', placeId);
    if (error) throw new Error(error.message);
}
