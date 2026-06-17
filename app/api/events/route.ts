import { NextRequest, NextResponse } from 'next/server';

import { recordRecallSession } from '@/server/controllers/events';
import { BadRequestError } from '@/server/lib/error';
import { toResponseError } from '@/server/lib/response';

export async function POST(request: NextRequest) {
    try {
        const userId = request.headers.get('x-user-id')!;
        const { type } = (await request.json()) as { type: string };
        // pin_created 는 서버(RPC)가 남기므로 클라이언트는 recall_session 만 보낼 수 있다.
        if (type !== 'recall_session') {
            throw new BadRequestError('INVALID_EVENT', '허용되지 않은 이벤트입니다.');
        }
        await recordRecallSession(userId);
        return NextResponse.json({ ok: true });
    } catch (error) {
        return toResponseError(error);
    }
}
