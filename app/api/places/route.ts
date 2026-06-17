import { NextRequest, NextResponse } from 'next/server';

import { fetchPlacesForMap } from '@/server/controllers/places';
import { toResponseError } from '@/server/lib/response';

export async function GET(request: NextRequest) {
    try {
        const userId = request.headers.get('x-user-id')!;
        const places = await fetchPlacesForMap(userId);
        return NextResponse.json({ ok: true, places });
    } catch (error) {
        return toResponseError(error);
    }
}
