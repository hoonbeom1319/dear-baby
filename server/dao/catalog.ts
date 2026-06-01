import type { Amenity, Area, Category, Region } from '@/shared/config';

import { createSupabaseAdmin } from '../db/supabase';

type AreaRow = { id: string; name: string; region_id: string };

export async function findRegions(): Promise<Region[]> {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase.from('regions').select('id, name').order('sort_order');
    if (error) throw new Error(error.message);
    return data as Region[];
}

export async function findAreas(): Promise<Area[]> {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase.from('areas').select('id, name, region_id').order('sort_order');
    if (error) throw new Error(error.message);
    return (data as AreaRow[]).map((r) => ({ id: r.id, name: r.name, regionId: r.region_id }));
}

export async function findCategories(): Promise<Category[]> {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase.from('categories').select('*').order('sort_order');
    if (error) throw new Error(error.message);
    return data as Category[];
}

export async function findAmenities(): Promise<Amenity[]> {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase.from('amenities').select('*').order('sort_order');
    if (error) throw new Error(error.message);
    return data as Amenity[];
}
