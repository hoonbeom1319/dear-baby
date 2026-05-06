import type { SupabaseClient } from '@supabase/supabase-js';
import { getPlace, listPlaces } from '@/server/dao/place';
import type { PlaceId, PlaceListQuery } from '@/server/types/place';

export async function listPlacesController(client: SupabaseClient, query: PlaceListQuery) {
    return await listPlaces(client, query);
}

export async function getPlaceController(client: SupabaseClient, id: PlaceId) {
    return await getPlace(client, id);
}

