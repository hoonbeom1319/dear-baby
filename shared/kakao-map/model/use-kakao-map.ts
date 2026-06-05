'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';

import type { LatLng } from '../lib/type';

type UseKakaoMapParams = {
    containerRef: RefObject<HTMLElement | null>;
    /** SDK 로드 완료 여부 */
    ready: boolean;
    /** 최초 생성 시 중심/레벨 — 이후 변경은 map 메서드로 제어한다 */
    center: LatLng;
    level?: number;
};

/** 컨테이너에 Kakao Map 인스턴스를 한 번 생성해 반환한다. */
export function useKakaoMap({ containerRef, ready, center, level = 5 }: UseKakaoMapParams) {
    const [map, setMap] = useState<kakao.maps.Map | null>(null);
    const createdRef = useRef(false);
    const initialRef = useRef({ center, level });

    useEffect(() => {
        const container = containerRef.current;

        if (!ready || !container || createdRef.current) return;
        createdRef.current = true;

        const { center, level } = initialRef.current;
        setMap(
            new kakao.maps.Map(container, {
                center: new kakao.maps.LatLng(center.lat, center.lng),
                level
            })
        );
    }, [ready, containerRef]);

    return map;
}
