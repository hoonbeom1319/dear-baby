import { NextRequest, NextResponse } from 'next/server';

import { removePhoto } from '@/server/controllers/photos';
import { toResponseError } from '@/server/lib/response';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const userId = request.headers.get('x-user-id')!;
        const { id } = await params;
        await removePhoto(userId, id);
        return NextResponse.json({ ok: true });
    } catch (error) {
        return toResponseError(error);
    }
}
