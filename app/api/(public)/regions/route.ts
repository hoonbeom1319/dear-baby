import { NextResponse } from 'next/server';

import { createSupabaseAnon } from '@/server/db/supabase';

type RegionRow = {
    code: string;
    level: number;
    parent_code: string | null;
    display_name: string;
};

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

export async function GET() {
    try {
        const supabase = createSupabaseAnon();

        const { data, error } = await supabase
            .from('regions')
            .select('code, level, parent_code, display_name')
            .order('level', { ascending: true })
            .order('display_name', { ascending: true });

        if (error) {
            return NextResponse.json({ ok: false, error: { message: error.message, code: error.code } }, { status: 500 });
        }

        const rows = (data ?? []) as RegionRow[];
        const level1 = rows.filter((r) => r.level === 1);
        const subsByParent = new Map<string, RegionRow[]>();

        for (const r of rows) {
            if (r.level !== 2 || !r.parent_code) continue;
            const key = r.parent_code;
            const list = subsByParent.get(key) ?? [];
            list.push(r);
            subsByParent.set(key, list);
        }

        const regions = level1.map((r) => ({
            code: r.code,
            displayName: r.display_name,
            sub: (subsByParent.get(r.code) ?? []).map((s) => ({
                code: s.code,
                displayName: s.display_name
            }))
        }));

        return NextResponse.json({ ok: true, regions });
    } catch (e) {
        return NextResponse.json({ ok: false, error: toErrorPayload(e) }, { status: 500 });
    }
}

