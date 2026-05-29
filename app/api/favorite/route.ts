import { NextRequest, NextResponse } from 'next/server';

import { createFavorite, fetchFavorites, removeFavorite } from '@/server/controllers/favorites';

export async function GET(request: NextRequest) {
    const userId = request.headers.get('x-user-id')!;
    const ids = await fetchFavorites(userId);
    return NextResponse.json({ ok: true, ids });
}

export async function POST(request: NextRequest) {
    const userId = request.headers.get('x-user-id')!;
    const { placeId } = (await request.json()) as { placeId: string };
    await createFavorite(userId, placeId);
    return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
    const userId = request.headers.get('x-user-id')!;
    const { placeId } = (await request.json()) as { placeId: string };
    await removeFavorite(userId, placeId);
    return NextResponse.json({ ok: true });
}
