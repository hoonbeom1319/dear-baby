'use client';

import { useEffect, useState } from 'react';

import { loadKakaoSdk } from '../lib/helper';

/** Kakao Maps SDK 로드·초기화 완료 여부를 반환한다. */
export function useKakaoSdk(): boolean {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let alive = true;
        loadKakaoSdk()
            .then(() => alive && setReady(true))
            .catch((error) => console.error('[kakao-map]', error)); // 조용히 삼키지 않고 원인을 콘솔에 남긴다
        return () => {
            alive = false;
        };
    }, []);

    return ready;
}
