import { NextRequest, NextResponse } from 'next/server';

import { modifyVisit, removeVisit, type VisitPatch } from '@/server/controllers/visits';
import { toResponseError } from '@/server/lib/response';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const userId = request.headers.get('x-user-id')!;
        const { id } = await params;
        const patch = (await request.json()) as VisitPatch;
        await modifyVisit(userId, id, patch);
        return NextResponse.json({ ok: true });
    } catch (error) {
        return toResponseError(error);
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const userId = request.headers.get('x-user-id')!;
        const { id } = await params;
        await removeVisit(userId, id);
        return NextResponse.json({ ok: true });
    } catch (error) {
        return toResponseError(error);
    }
}
