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
            .catch(() => {});
        return () => {
            alive = false;
        };
    }, []);

    return ready;
}
