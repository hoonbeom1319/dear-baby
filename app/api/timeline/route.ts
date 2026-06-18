import { NextRequest, NextResponse } from 'next/server';

import { fetchVisitFeed } from '@/server/controllers/visits';
import { toResponseError } from '@/server/lib/response';

export async function GET(request: NextRequest) {
    try {
        const userId = request.headers.get('x-user-id')!;
        const visits = await fetchVisitFeed(userId);
        return NextResponse.json({ ok: true, visits });
    } catch (error) {
        return toResponseError(error);
    }
}
