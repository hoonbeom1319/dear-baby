'use server';

import type { Amenity, Area, Category } from '@/shared/config';

import { createSupabaseAdmin } from '../db/supabase';

export async function fetchAreas(): Promise<Area[]> {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase.from('areas').select('*').order('sort_order');
    if (error) throw new Error(error.message);
    return data as Area[];
}

export async function fetchCategories(): Promise<Category[]> {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase.from('categories').select('*').order('sort_order');
    if (error) throw new Error(error.message);
    return data as Category[];
}

export async function fetchAmenities(): Promise<Amenity[]> {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase.from('amenities').select('*').order('sort_order');
    if (error) throw new Error(error.message);
    return data as Amenity[];
}
