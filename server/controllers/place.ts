import type { SupabaseClient } from '@supabase/supabase-js';

import { createPlace, getPlace, listPlaces } from '@/server/dao/place';
import type { CreatePlaceInput, PlaceId, PlaceListQuery } from '@/server/types/place';

export async function listPlacesController(client: SupabaseClient, query: PlaceListQuery) {
    return await listPlaces(client, query);
}

export async function getPlaceController(client: SupabaseClient, id: PlaceId) {
    return await getPlace(client, id);
}

export async function createPlaceController(client: SupabaseClient, input: CreatePlaceInput) {
    return await createPlace(client, input);
}
