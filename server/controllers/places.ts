'use server';

import { revalidatePath } from 'next/cache';

import {
    deletePlace as dao_deletePlace,
    findAllPlaces,
    findAllPlacesAdmin,
    findPlaceById,
    insertPlace,
    updatePlace as dao_updatePlace,
    updatePlaceStatus as dao_updatePlaceStatus
} from '../dao/places';
import type { CreatePlaceInput } from '../dao/places';

export type { CreatePlaceInput } from '../dao/places';

// ─── Queries ─────────────────────────────────────────────────────────────────

export async function fetchAllPlaces() {
    return findAllPlaces();
}

export async function fetchPlaceById(id: string) {
    return findPlaceById(id);
}

export async function fetchAllPlacesAdmin() {
    return findAllPlacesAdmin();
}

// ─── Mutations ───────────────────────────────────────────────────────────────

export async function createPlace(input: CreatePlaceInput): Promise<void> {
    await insertPlace(input);
    revalidatePath('/admin/places');
    revalidatePath('/');
}

export async function updatePlace(id: string, input: Partial<CreatePlaceInput>): Promise<void> {
    await dao_updatePlace(id, input);
    revalidatePath('/admin/places');
    revalidatePath('/');
    revalidatePath(`/place/${id}`);
}

export async function updatePlaceStatus(id: string, status: 'public' | 'review'): Promise<void> {
    await dao_updatePlaceStatus(id, status);
    revalidatePath('/admin/places');
    revalidatePath('/');
}

export async function deletePlace(id: string): Promise<void> {
    await dao_deletePlace(id);
    revalidatePath('/admin/places');
    revalidatePath('/');
}
