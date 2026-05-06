import { createClient } from '@supabase/supabase-js';

const mustGetEnv = (name: string): string => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing env: ${name}`);
    }
    return value;
};

export function createSupabaseAdmin() {
    const url = mustGetEnv('NEXT_PUBLIC_SUPABASE_URL');
    const serviceRoleKey = mustGetEnv('SUPABASE_SERVICE_ROLE_KEY');
    return createClient(url, serviceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false }
    });
}

export function createSupabaseAnon() {
    const url = mustGetEnv('NEXT_PUBLIC_SUPABASE_URL');
    const anonKey = mustGetEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
    return createClient(url, anonKey, {
        auth: { persistSession: false, autoRefreshToken: false }
    });
}
