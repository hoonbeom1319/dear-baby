import type { Amenity, Area, Category } from '@/shared/config';

import { createSupabaseAdmin } from '../db/supabase';

export async function findAreas(): Promise<Area[]> {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase.from('areas').select('*').order('sort_order');
    if (error) throw new Error(error.message);
    return data as Area[];
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
