import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const query = searchParams.get('query') ?? '';
    const display = searchParams.get('display') ?? '20';
    const start = searchParams.get('start') ?? '1';

    if (!query.trim()) return NextResponse.json({ items: [] });

    const url = new URL('https://openapi.naver.com/v1/search/local.json');
    url.searchParams.set('query', query);
    url.searchParams.set('display', display);
    url.searchParams.set('start', start);
    url.searchParams.set('sort', 'random');

    const res = await fetch(url, {
        headers: {
            'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID!,
            'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET!
        },
        cache: 'no-store'
    });

    if (!res.ok) return NextResponse.json({ error: 'Naver API error' }, { status: res.status });
    return NextResponse.json(await res.json());
}
