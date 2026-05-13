import type { SupabaseClient } from '@supabase/supabase-js';

import type { CreatePlaceInput, Place, PlaceId, PlaceListQuery } from '@/server/types/place';

type PlaceAmenityRow = { amenity_code: string };

type PlaceRow = {
    id: string;
    region_code: string;
    sub_region_code: string;
    category_code: string;
    name: string;
    subtitle: string | null;
    headline: string | null;
    description: string | null;
    honey_tip: string | null;
    address: string | null;
    lat: number | null;
    lng: number | null;
    map_links: Record<string, unknown> | null;
    images: string[] | null;
    created_at: string;
    updated_at: string;
    place_amenities?: PlaceAmenityRow[] | null;
};

const placeSelect = `
  id,
  region_code,
  sub_region_code,
  category_code,
  name,
  subtitle,
  headline,
  description,
  honey_tip,
  address,
  lat,
  lng,
  map_links,
  images,
  created_at,
  updated_at,
  place_amenities(amenity_code)
`;

function toPlace(row: PlaceRow): Place {
    const amenityCodes = (row.place_amenities ?? []).map((a) => a.amenity_code);
    return {
        id: row.id,
        regionCode: row.region_code.trim(),
        subRegionCode: row.sub_region_code.trim(),
        categoryCode: row.category_code,
        name: row.name,
        subtitle: row.subtitle,
        headline: row.headline,
        description: row.description,
        honeyTip: row.honey_tip,
        address: row.address,
        lat: row.lat,
        lng: row.lng,
        mapLinks: (row.map_links as Place['mapLinks']) ?? null,
        images: row.images ?? null,
        amenityCodes,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
}

export async function listPlaces(client: SupabaseClient, query: PlaceListQuery) {
    const limit = Math.min(Math.max(query.limit ?? 30, 1), 100);

    let q = client
        .from('places')
        .select(placeSelect)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (query.regionCode) q = q.eq('region_code', query.regionCode);
    if (query.subRegionCode) q = q.eq('sub_region_code', query.subRegionCode);
    if (query.cursor) q = q.lt('created_at', query.cursor);

    const { data, error } = await q;
    if (error) throw error;

    const rows = (data ?? []) as PlaceRow[];
    const items = rows.map(toPlace);
    const nextCursor = rows.length === limit ? rows[rows.length - 1]?.created_at : null;

    return { items, nextCursor };
}

export async function getPlace(client: SupabaseClient, id: PlaceId) {
    const { data, error } = await client.from('places').select(placeSelect).eq('id', id).maybeSingle();

    if (error) throw error;
    if (!data) return null;
    return toPlace(data as PlaceRow);
}

export async function createPlace(client: SupabaseClient, input: CreatePlaceInput): Promise<{ id: string }> {
    const { amenity_codes, ...placeRow } = input;

    const { data, error } = await client
        .from('places')
        .insert({
            region_code: placeRow.region_code,
            sub_region_code: placeRow.sub_region_code,
            category_code: placeRow.category_code,
            name: placeRow.name,
            subtitle: placeRow.subtitle,
            headline: placeRow.headline,
            description: placeRow.description,
            honey_tip: placeRow.honey_tip,
            address: placeRow.address,
            lat: placeRow.lat,
            lng: placeRow.lng,
            map_links: placeRow.map_links,
            images: placeRow.images
        })
        .select('id')
        .single();

    if (error) throw error;
    const id = data.id as string;

    if (amenity_codes.length > 0) {
        const rows = amenity_codes.map((amenity_code) => ({ place_id: id, amenity_code }));
        const { error: e2 } = await client.from('place_amenities').insert(rows);
        if (e2) throw e2;
    }

    return { id };
}
