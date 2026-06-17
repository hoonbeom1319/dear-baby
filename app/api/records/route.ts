import { NextRequest, NextResponse } from 'next/server';

import { createRecord, type RecordGroupInput } from '@/server/controllers/records';
import { BadRequestError } from '@/server/lib/error';
import { toResponseError } from '@/server/lib/response';

export async function POST(request: NextRequest) {
    try {
        const userId = request.headers.get('x-user-id')!;
        const { groups } = (await request.json()) as { groups: RecordGroupInput[] };
        if (!Array.isArray(groups) || groups.length === 0) {
            throw new BadRequestError('EMPTY_RECORD', '기록할 장소가 없습니다.');
        }
        const placeIds = await createRecord(userId, groups);
        return NextResponse.json({ ok: true, placeIds });
    } catch (error) {
        return toResponseError(error);
    }
}
