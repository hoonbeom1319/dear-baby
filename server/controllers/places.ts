'use server';

import { revalidatePath } from 'next/cache';

import { deletePlace, findAllPlaces, findAllPlacesAdmin, findPlaceById, insertPlace, updatePlace, updatePlaceStatus } from '../dao/places';

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

export async function createPlace(input: Parameters<typeof insertPlace>[0]): Promise<void> {
    await insertPlace(input);
    revalidatePath('/admin/places');
    revalidatePath('/');
}

export async function modifyPlace(id: string, input: Parameters<typeof updatePlace>[1]): Promise<void> {
    await updatePlace(id, input);
    revalidatePath('/admin/places');
    revalidatePath('/');
    revalidatePath(`/place/${id}`);
}

export async function modifyPlaceStatus(id: string, status: 'public' | 'review'): Promise<void> {
    await updatePlaceStatus(id, status);
    revalidatePath('/admin/places');
    revalidatePath('/');
}

export async function removePlace(id: string): Promise<void> {
    await deletePlace(id);
    revalidatePath('/admin/places');
    revalidatePath('/');
}
