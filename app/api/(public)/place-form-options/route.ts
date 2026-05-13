import { NextResponse } from 'next/server';

import { listPlaceCatalog } from '@/server/dao/place-catalog';
import { createSupabaseAnon } from '@/server/db/supabase';

function toErrorPayload(e: unknown) {
    if (e && typeof e === 'object') {
        const anyE = e as Record<string, unknown>;
        const message = typeof anyE.message === 'string' ? anyE.message : 'Unknown error';
        const code = typeof anyE.code === 'string' ? anyE.code : undefined;
        return { message, code };
    }
    return { message: 'Unknown error' };
}

export async function GET() {
    try {
        const supabase = createSupabaseAnon();
        const { categories, amenities } = await listPlaceCatalog(supabase);

        return NextResponse.json({
            ok: true,
            categories: categories.map((c) => ({
                code: c.code,
                displayName: c.display_name,
                position: c.position
            })),
            amenities: amenities.map((a) => ({
                code: a.code,
                displayName: a.display_name,
                icon: a.icon,
                position: a.position
            }))
        });
    } catch (e) {
        return NextResponse.json({ ok: false, error: toErrorPayload(e) }, { status: 500 });
    }
}
