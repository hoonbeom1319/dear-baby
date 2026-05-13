import type { SupabaseClient } from '@supabase/supabase-js';

export type CategoryRow = { code: string; display_name: string; position: number };
export type AmenityRow = { code: string; display_name: string; icon: string; position: number };

export async function listPlaceCatalog(client: SupabaseClient) {
    const [cat, am] = await Promise.all([
        client.from('categories').select('code, display_name, position').order('position', { ascending: true }),
        client.from('amenities').select('code, display_name, icon, position').order('position', { ascending: true })
    ]);

    if (cat.error) throw cat.error;
    if (am.error) throw am.error;

    return {
        categories: (cat.data ?? []) as CategoryRow[],
        amenities: (am.data ?? []) as AmenityRow[]
    };
}
