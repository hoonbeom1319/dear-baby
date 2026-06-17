import { NextRequest, NextResponse } from 'next/server';

import { fetchPlaceDetail } from '@/server/controllers/places';
import { toResponseError } from '@/server/lib/response';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const userId = request.headers.get('x-user-id')!;
        const { id } = await params;
        const place = await fetchPlaceDetail(userId, id);
        return NextResponse.json({ ok: true, place });
    } catch (error) {
        return toResponseError(error);
    }
}
