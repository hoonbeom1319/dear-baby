'use client';

import { Fragment, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useSavedResult } from '@/features/day-editor';

import { Icon } from '@/shared/ui';

/** YYYY-MM-DD → "10월 12일" */
function formatDay(iso: string): string {
    const [, m, d] = iso.split('-');
    return `${Number(m)}월 ${Number(d)}일`;
}

/**
 * A-4 저장 완료 — 저장 직후의 즉각적 되새김 씨앗(PRD §6.1). 방금 박은 핀들을 동선으로 보여준다.
 * "지도에서 보기" → 지도 홈에 ?new=로 넘겨 신규 핀을 펄스시킨다.
 */
export function RecordSavedScreen() {
    const router = useRouter();
    const result = useSavedResult((s) => s.result);
    const clear = useSavedResult((s) => s.clear);

    // 직접 들어오면(새로고침·딥링크) 보여줄 결과가 없으니 지도로 돌려보낸다.
    useEffect(() => {
        if (!result) router.replace('/');
    }, [result, router]);

    if (!result) return null;

    const { placeIds, placeNames, date } = result;

    const goToMap = () => {
        clear();
        router.replace(`/?new=${placeIds.join(',')}`);
    };

    return (
        <div className="flex h-dvh w-full flex-col items-center justify-center bg-white px-7 text-center">
            <span className="db-pop flex h-20 w-20 items-center justify-center rounded-full border border-[#BBE9CF] bg-[#E6F7EE] text-[#16A34A]">
                <Icon name="check" size={40} stroke={2.5} />
            </span>

            <h1 className="mt-6 text-[24px] font-extrabold tracking-[-0.02em] text-[#0F172A]">오늘 {placeNames.length}곳을 남겼어요</h1>
            <p className="mt-2.5 text-[15px] leading-[1.6] text-[#475569] [word-break:keep-all]">
                {formatDay(date)}의 동선이
                <br />
                지도에 핀으로 박혔어요.
            </p>

            {/* 동선 미리보기 — 핀들을 점선으로 잇는다 */}
            <div className="mt-8 flex max-w-full items-start justify-center overflow-x-auto px-2 pb-1">
                {placeNames.map((name, i) => (
                    <Fragment key={`${name}-${i}`}>
                        {i > 0 && <span className="mt-[15px] h-0 w-7 shrink-0 border-t-2 border-dashed border-primary-200" />}
                        <span className="flex w-16 shrink-0 flex-col items-center gap-1.5">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ filter: 'drop-shadow(0 3px 4px rgba(15,23,42,0.22))' }}>
                                <path
                                    d="M12 22s8-7.58 8-13a8 8 0 0 0-16 0c0 5.42 8 13 8 13Z"
                                    fill="oklch(64.6% 0.222 41.116)"
                                    stroke="white"
                                    strokeWidth="1.5"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <span className="line-clamp-2 text-[12px] leading-tight text-[#334155] [word-break:keep-all]">{name}</span>
                        </span>
                    </Fragment>
                ))}
            </div>

            <button
                type="button"
                onClick={goToMap}
                className="mt-10 flex h-[54px] w-full items-center justify-center rounded-[14px] bg-primary-600 text-[16px] font-bold text-white transition-colors hover:bg-primary-700"
                style={{ boxShadow: '0 10px 22px -8px oklch(64.6% 0.222 41.116 / 0.5)' }}
            >
                지도에서 보기
            </button>
        </div>
    );
}
