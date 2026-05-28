'use server';

import { revalidatePath } from 'next/cache';

import { mapPlaceAdminRow, mapPlaceRow, type PlaceRow } from '@/entities/place/model/db';
import type { Place, PlaceAdmin } from '@/entities/place/model/types';
import type { AmenityId, AreaId, CategoryId } from '@/shared/config';

import { createSupabaseAdmin } from '../db/supabase';

// ─── Queries ─────────────────────────────────────────────────────────────────

const PLACE_SELECT = '*, place_amenities(amenity_id)' as const;

export async function fetchAllPlaces(): Promise<Place[]> {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
        .from('places')
        .select(PLACE_SELECT)
        .eq('status', 'public')
        .order('sort_order', { ascending: true });

    if (error) throw new Error(error.message);
    return (data as PlaceRow[]).map(mapPlaceRow);
}

export async function fetchPlaceById(id: string): Promise<Place | null> {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase.from('places').select(PLACE_SELECT).eq('id', id).maybeSingle();

    if (error || !data) return null;
    return mapPlaceRow(data as PlaceRow);
}

/** 어드민용 — 검토중 포함 전체 */
export async function fetchAllPlacesAdmin(): Promise<PlaceAdmin[]> {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase.from('places').select(PLACE_SELECT).order('sort_order', { ascending: true });

    if (error) throw new Error(error.message);
    return (data as PlaceRow[]).map(mapPlaceAdminRow);
}

// ─── Mutations ───────────────────────────────────────────────────────────────

export type CreatePlaceInput = {
    area: AreaId;
    category: CategoryId;
    name: string;
    address: string;
    phone: string;
    ageRange: string;
    description: string;
    amenities: AmenityId[];
    sortOrder: number;
};

export async function createPlace(input: CreatePlaceInput): Promise<void> {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
        .from('places')
        .insert({
            area: input.area,
            category: input.category,
            name: input.name,
            address: input.address,
            phone: input.phone,
            age_range: input.ageRange,
            description: input.description,
            sort_order: input.sortOrder,
            status: 'review',
        })
        .select('id')
        .single();

    if (error) throw new Error(error.message);

    if (input.amenities.length > 0) {
        const { error: amenityError } = await supabase
            .from('place_amenities')
            .insert(input.amenities.map((amenity_id) => ({ place_id: data.id, amenity_id })));
        if (amenityError) throw new Error(amenityError.message);
    }

    revalidatePath('/admin/places');
    revalidatePath('/');
}

export async function updatePlace(id: string, input: Partial<CreatePlaceInput>): Promise<void> {
    const supabase = createSupabaseAdmin();
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (input.area !== undefined) patch.area = input.area;
    if (input.category !== undefined) patch.category = input.category;
    if (input.name !== undefined) patch.name = input.name;
    if (input.address !== undefined) patch.address = input.address;
    if (input.phone !== undefined) patch.phone = input.phone;
    if (input.ageRange !== undefined) patch.age_range = input.ageRange;
    if (input.description !== undefined) patch.description = input.description;
    if (input.sortOrder !== undefined) patch.sort_order = input.sortOrder;

    const { error } = await supabase.from('places').update(patch).eq('id', id);
    if (error) throw new Error(error.message);

    if (input.amenities !== undefined) {
        await supabase.from('place_amenities').delete().eq('place_id', id);
        if (input.amenities.length > 0) {
            const { error: amenityError } = await supabase
                .from('place_amenities')
                .insert(input.amenities.map((amenity_id) => ({ place_id: id, amenity_id })));
            if (amenityError) throw new Error(amenityError.message);
        }
    }

    revalidatePath('/admin/places');
    revalidatePath('/');
    revalidatePath(`/place/${id}`);
}

export async function updatePlaceStatus(id: string, status: 'public' | 'review'): Promise<void> {
    const supabase = createSupabaseAdmin();
    const { error } = await supabase
        .from('places')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath('/admin/places');
    revalidatePath('/');
}

export async function deletePlace(id: string): Promise<void> {
    const supabase = createSupabaseAdmin();
    const { error } = await supabase.from('places').delete().eq('id', id);
    if (error) throw new Error(error.message);
    revalidatePath('/admin/places');
    revalidatePath('/');
}
