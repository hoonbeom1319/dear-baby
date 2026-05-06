import { NextResponse } from 'next/server';
import { createSupabaseAnon } from '@/server/db/supabase';
import { getPlaceController } from '@/server/controllers/place';

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

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await ctx.params;
        const supabase = createSupabaseAnon();

        const place = await getPlaceController(supabase, id);
        if (!place) {
            return NextResponse.json({ ok: false, error: { message: 'Not found' } }, { status: 404 });
        }

        return NextResponse.json({ ok: true, place });
    } catch (e) {
        return NextResponse.json({ ok: false, error: toErrorPayload(e) }, { status: 500 });
    }
}

