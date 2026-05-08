import { RegionItem } from '@/application/types/api/regions';

import { listRegions } from '../dao/regions';
import { createSupabaseAnon } from '../db/supabase';

export const listRegionsController = async () => {
    const rows = await listRegions(createSupabaseAnon());
    const level1 = rows.filter((r) => r.level === 1);
    const subsByParent = new Map<string, typeof rows>();

    for (const row of rows) {
        if (row.level !== 2 || !row.parent_code) continue;
        const key = row.parent_code;
        const list = subsByParent.get(key) ?? [];
        list.push(row);
        subsByParent.set(key, list);
    }

    const items: RegionItem[] = level1.map((region) => ({
        code: region.code,
        displayName: region.display_name,
        sub: (subsByParent.get(region.code) ?? []).map((subRegion) => ({
            code: subRegion.code,
            displayName: subRegion.display_name
        }))
    }));

    return { items };
};
