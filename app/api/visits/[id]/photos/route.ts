import { NextRequest, NextResponse } from 'next/server';

import { addPhotos, type RecordPhotoInput } from '@/server/controllers/photos';
import { BadRequestError } from '@/server/lib/error';
import { toResponseError } from '@/server/lib/response';

/** 기존 방문에 사진 추가. 브라우저가 Storage 업로드를 마친 경로(storagePath)만 받는다. */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const userId = request.headers.get('x-user-id')!;
        const { id } = await params; // visitId
        const { photos } = (await request.json()) as { photos: RecordPhotoInput[] };
        if (!Array.isArray(photos) || photos.length === 0) {
            throw new BadRequestError('EMPTY_PHOTOS', '추가할 사진이 없습니다.');
        }
        await addPhotos(userId, id, photos);
        return NextResponse.json({ ok: true });
    } catch (error) {
        return toResponseError(error);
    }
}
