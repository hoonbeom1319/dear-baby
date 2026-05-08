import { NextResponse } from 'next/server';

import { ApiError, InternalServerError } from './error';

export const toResponseError = (error: unknown) => {
    if (error instanceof ApiError) {
        return NextResponse.json({ success: false, error: { message: error.message, code: error.code } }, { status: error.status });
    }

    return NextResponse.json(
        { success: false, error: { message: InternalServerError.message, code: InternalServerError.code } },
        { status: InternalServerError.status }
    );
};
