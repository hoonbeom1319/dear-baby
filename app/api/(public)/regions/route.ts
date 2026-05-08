import { NextResponse } from 'next/server';

import { GetRegionsResponse } from '@/application/types/api/regions';

import { listRegionsController } from '@/server/controllers/regions';
import { toResponseError } from '@/server/lib/response';

export async function GET() {
    try {
        const data = await listRegionsController();
        const payload = { success: true, data } satisfies GetRegionsResponse;
        return NextResponse.json(payload);
    } catch (e) {
        return toResponseError(e);
    }
}
