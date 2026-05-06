import { NextResponse } from 'next/server';

import { listPlacesController } from '@/server/controllers/place';
import { createSupabaseAdmin } from '@/server/db/supabase';

function toErrorPayload(e: unknown) {
    if (e && typeof e === 'object') {
        const anyE = e as Record<string, unknown>;
        const message = typeof anyE.message === 'string' ? anyE.message : 'Unknown error';
        const code = typeof anyE.code === 'string' ? anyE.code : undefined;
        const hint = typeof anyE.hint === 'string' ? anyE.hint : undefined;
        const details = typeof anyE.details === 'string' ? anyE.details : undefined;
        return { message, code, hint, details };
    }
    return { message: 'Unknown error' };
}

type PlaceInsertRow = {
    region_code: string;
    sub_region: string;
    kind: string;
    name: string;
    short_description: string;
    honey_tip?: string | null;
    address?: string | null;
    lat?: number | null;
    lng?: number | null;
    map_links?: { kakao?: string; naver?: string; tmap?: string } | null;
    images?: string[] | null;
};

function isRecord(v: unknown): v is Record<string, unknown> {
    return !!v && typeof v === 'object';
}

function coercePlaceInsertRow(body: unknown): PlaceInsertRow | null {
    if (!isRecord(body)) return null;

    // Accept either snake_case (DB row) or camelCase (app type) payloads.
    const region_code = (body.region_code ?? body.regionCode) as unknown;
    const sub_region = (body.sub_region ?? body.subRegion) as unknown;
    const kind = body.kind as unknown;
    const name = body.name as unknown;
    const short_description = (body.short_description ?? body.shortDescription) as unknown;

    if (
        typeof region_code !== 'string' ||
        typeof sub_region !== 'string' ||
        typeof kind !== 'string' ||
        typeof name !== 'string' ||
        typeof short_description !== 'string'
    ) {
        return null;
    }

    const row: PlaceInsertRow = {
        region_code,
        sub_region,
        kind,
        name,
        short_description
    };

    const honey_tip = (body.honey_tip ?? body.honeyTip) as unknown;
    if (honey_tip === null || typeof honey_tip === 'string') row.honey_tip = honey_tip;

    const address = body.address as unknown;
    if (address === null || typeof address === 'string') row.address = address;

    const lat = body.lat as unknown;
    if (lat === null || typeof lat === 'number') row.lat = lat;

    const lng = body.lng as unknown;
    if (lng === null || typeof lng === 'number') row.lng = lng;

    const map_links = (body.map_links ?? body.mapLinks) as unknown;
    if (map_links === null || isRecord(map_links)) row.map_links = map_links as PlaceInsertRow['map_links'];

    const images = body.images as unknown;
    if (images === null || (Array.isArray(images) && images.every((x) => typeof x === 'string'))) {
        row.images = images as PlaceInsertRow['images'];
    }

    return row;
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const regionCode = searchParams.get('regionCode') ?? undefined;
        const subRegion = searchParams.get('subRegion') ?? undefined;
        const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined;
        const cursor = searchParams.get('cursor') ?? undefined;

        const supabase = createSupabaseAdmin();
        const result = await listPlacesController(supabase, { regionCode, subRegion, limit, cursor });

        return NextResponse.json({ ok: true, ...result });
    } catch (e) {
        return NextResponse.json({ ok: false, error: toErrorPayload(e) }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = (await request.json().catch(() => null)) as unknown;
        const row = coercePlaceInsertRow(body);
        if (!row) {
            return NextResponse.json({ ok: false, error: { message: 'Invalid body' } }, { status: 400 });
        }

        const supabase = createSupabaseAdmin();
        const { data, error } = await supabase.from('places').insert(row).select('id').single();
        if (error) {
            return NextResponse.json({ ok: false, error: { message: error.message, code: error.code } }, { status: 500 });
        }

        return NextResponse.json({ ok: true, id: data.id });
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Unknown error';
        return NextResponse.json({ ok: false, error: { message } }, { status: 500 });
    }
}

