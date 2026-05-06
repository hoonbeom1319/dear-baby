import { NextResponse } from 'next/server';
import { createSupabaseAnon } from '@/server/db/supabase';
import { listPlacesController } from '@/server/controllers/place';

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

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const regionCode = searchParams.get('regionCode') ?? undefined;
        const subRegion = searchParams.get('subRegion') ?? undefined;
        const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined;
        const cursor = searchParams.get('cursor') ?? undefined;

        const supabase = createSupabaseAnon();
        const result = await listPlacesController(supabase, { regionCode, subRegion, limit, cursor });

        return NextResponse.json({ ok: true, ...result });
    } catch (e) {
        return NextResponse.json({ ok: false, error: toErrorPayload(e) }, { status: 500 });
    }
}

