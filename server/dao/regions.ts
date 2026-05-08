import type { SupabaseClient } from '@supabase/supabase-js';

import { ApiError } from '../lib/error';

type RegionRow = {
    code: string;
    level: number;
    parent_code: string | null;
    display_name: string;
};

export const listRegions = async (client: SupabaseClient) => {
    const { data, error, status } = await client
        .from('regions')
        .select('code, level, parent_code, display_name')
        .order('level', { ascending: true })
        .order('display_name', { ascending: true });

    if (error) throw new ApiError(status, error.code, error.message);
    return (data ?? []) as RegionRow[];
};
