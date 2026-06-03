import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const query = searchParams.get('query') ?? '';

    if (!query.trim()) return NextResponse.json({ items: [] });

    const url = new URL('https://openapi.naver.com/v1/search/blog.json');
    url.searchParams.set('query', query);
    url.searchParams.set('display', '5');
    url.searchParams.set('sort', 'sim');

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
