import { NextRequest, NextResponse } from 'next/server';

import { createVisit } from '@/server/controllers/visits';
import { BadRequestError } from '@/server/lib/error';
import { toResponseError } from '@/server/lib/response';

/** 기존 장소에 새 방문 추가 (다른 날 방문). 사진은 이후 /api/visits/[id]/photos로. */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const userId = request.headers.get('x-user-id')!;
        const { id } = await params; // placeId
        const { visitedOn, note } = (await request.json()) as { visitedOn?: string; note?: string | null };
        if (!visitedOn) {
            throw new BadRequestError('MISSING_DATE', '방문 날짜가 필요합니다.');
        }
        const visitId = await createVisit(userId, id, visitedOn, note ?? null);
        return NextResponse.json({ ok: true, visitId });
    } catch (error) {
        return toResponseError(error);
    }
}
