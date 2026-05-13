import { NextResponse } from 'next/server';

import { createPlaceController, listPlacesController } from '@/server/controllers/place';
import { createSupabaseAdmin } from '@/server/db/supabase';
import type { CreatePlaceInput, PlaceMapLinks } from '@/server/types/place';

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

function isRecord(v: unknown): v is Record<string, unknown> {
    return !!v && typeof v === 'object';
}

function trimText(v: unknown): string | null {
    if (typeof v !== 'string') return null;
    const t = v.trim();
    return t.length ? t : null;
}

function nullableText(v: unknown): string | null {
    if (v === null || v === undefined) return null;
    if (typeof v !== 'string') return null;
    const t = v.trim();
    return t.length ? t : null;
}

function parseNullableNumber(v: unknown): number | null {
    if (v === null || v === undefined) return null;
    if (typeof v === 'number' && Number.isFinite(v)) return v;
    if (typeof v === 'string') {
        const t = v.trim();
        if (!t) return null;
        const n = Number(t);
        return Number.isFinite(n) ? n : null;
    }
    return null;
}

function parseMapLinks(v: unknown): PlaceMapLinks {
    if (v === null || v === undefined) return null;
    if (!isRecord(v)) return null;
    const kakao = nullableText(v.kakao);
    const naver = nullableText(v.naver);
    const tmap = nullableText(v.tmap);
    if (!kakao && !naver && !tmap) return null;
    return { ...(kakao ? { kakao } : {}), ...(naver ? { naver } : {}), ...(tmap ? { tmap } : {}) };
}

function parseImages(v: unknown): string[] | null {
    if (v === null || v === undefined) return null;
    if (Array.isArray(v) && v.every((x) => typeof x === 'string')) {
        const urls = v.map((s) => s.trim()).filter(Boolean);
        return urls.length ? urls : null;
    }
    if (typeof v === 'string') {
        const urls = v
            .split(/\r?\n|,/)
            .map((s) => s.trim())
            .filter(Boolean);
        return urls.length ? urls : null;
    }
    return null;
}

function parseAmenityCodes(v: unknown): string[] {
    if (!Array.isArray(v)) return [];
    const out = v.filter((x): x is string => typeof x === 'string').map((s) => s.trim());
    return [...new Set(out.filter(Boolean))];
}

function coerceCreatePlaceInput(body: unknown): CreatePlaceInput | null {
    if (!isRecord(body)) return null;

    const region_code = trimText(body.region_code ?? body.regionCode);
    const sub_region_code = trimText(body.sub_region_code ?? body.subRegionCode);
    const category_code = trimText(body.category_code ?? body.categoryCode);
    const name = trimText(body.name);

    if (!region_code || !sub_region_code || !category_code || !name) return null;

    const map_links = parseMapLinks(body.map_links ?? body.mapLinks);

    const lat = parseNullableNumber(body.lat);
    const lng = parseNullableNumber(body.lng);

    return {
        region_code,
        sub_region_code,
        category_code,
        name,
        subtitle: nullableText(body.subtitle),
        headline: nullableText(body.headline),
        description: nullableText(body.description),
        honey_tip: nullableText(body.honey_tip ?? body.honeyTip),
        address: nullableText(body.address),
        lat,
        lng,
        map_links,
        images: parseImages(body.images),
        amenity_codes: parseAmenityCodes(body.amenity_codes ?? body.amenityCodes)
    };
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const regionCode = searchParams.get('regionCode') ?? undefined;
        const subRegionCode = searchParams.get('subRegionCode') ?? searchParams.get('subRegion') ?? undefined;
        const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined;
        const cursor = searchParams.get('cursor') ?? undefined;

        const supabase = createSupabaseAdmin();
        const result = await listPlacesController(supabase, { regionCode, subRegionCode, limit, cursor });

        return NextResponse.json({ ok: true, ...result });
    } catch (e) {
        return NextResponse.json({ ok: false, error: toErrorPayload(e) }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = (await request.json().catch(() => null)) as unknown;
        const input = coerceCreatePlaceInput(body);
        if (!input) {
            return NextResponse.json(
                { ok: false, error: { message: 'Invalid body: regionCode, subRegionCode, categoryCode, name are required.' } },
                { status: 400 }
            );
        }

        const supabase = createSupabaseAdmin();
        const { id } = await createPlaceController(supabase, input);

        return NextResponse.json({ ok: true, id });
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Unknown error';
        return NextResponse.json({ ok: false, error: { message } }, { status: 500 });
    }
}
