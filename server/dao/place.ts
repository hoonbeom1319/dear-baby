import type { SupabaseClient } from '@supabase/supabase-js';
import type { Place, PlaceId, PlaceListQuery } from '@/server/types/place';

type PlaceRow = {
    id: string;
    region_code: string;
    sub_region: string;
    kind: string;
    name: string;
    short_description: string;
    honey_tip: string | null;
    address: string | null;
    lat: number | null;
    lng: number | null;
    map_links: Record<string, unknown> | null;
    images: string[] | null;
    created_at: string;
    updated_at: string;
};

function toPlace(row: PlaceRow): Place {
    return {
        id: row.id,
        regionCode: row.region_code,
        subRegion: row.sub_region,
        kind: row.kind,
        name: row.name,
        shortDescription: row.short_description,
        honeyTip: row.honey_tip,
        address: row.address,
        lat: row.lat,
        lng: row.lng,
        mapLinks: (row.map_links as Place['mapLinks']) ?? null,
        images: row.images ?? null,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
}

export async function listPlaces(client: SupabaseClient, query: PlaceListQuery) {
    const limit = Math.min(Math.max(query.limit ?? 30, 1), 100);

    let q = client
        .from('places')
        .select(
            'id, region_code, sub_region, kind, name, short_description, honey_tip, address, lat, lng, map_links, images, created_at, updated_at'
        )
        .order('created_at', { ascending: false })
        .limit(limit);

    if (query.regionCode) q = q.eq('region_code', query.regionCode);
    if (query.subRegion) q = q.eq('sub_region', query.subRegion);
    if (query.cursor) q = q.lt('created_at', query.cursor);

    const { data, error } = await q;
    if (error) throw error;

    const rows = (data ?? []) as PlaceRow[];
    const items = rows.map(toPlace);
    const nextCursor = rows.length === limit ? rows[rows.length - 1]?.created_at : null;

    return { items, nextCursor };
}

export async function getPlace(client: SupabaseClient, id: PlaceId) {
    const { data, error } = await client
        .from('places')
        .select(
            'id, region_code, sub_region, kind, name, short_description, honey_tip, address, lat, lng, map_links, images, created_at, updated_at'
        )
        .eq('id', id)
        .maybeSingle();

    if (error) throw error;
    if (!data) return null;
    return toPlace(data as PlaceRow);
}

