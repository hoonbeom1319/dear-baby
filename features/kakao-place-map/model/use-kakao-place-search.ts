'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { LatLng } from '@/shared/kakao-map';
import { stripHtml } from '@/shared/lib';

import { toMapCenter } from '../lib/coords';
import { searchPlacesOnMap } from '../lib/kakao-places-search';
import type { KakaoPlaceMapSearchResult, KakaoSearchPlace, MapFocusPlace } from '../lib/types';

type UseKakaoPlaceSearchParams = {
    searchQuery: string | null;
    focusPlace: MapFocusPlace | null;
    onSearchComplete?: (result: KakaoPlaceMapSearchResult) => void;
};

export type PlaceMarker = LatLng & { place: KakaoSearchPlace };

/** 현재 지도 영역 기준 장소 검색 + "이 지역 재검색" + 선택 장소 카메라 이동 */
export function useKakaoPlaceSearch(map: kakao.maps.Map | null, { searchQuery, focusPlace, onSearchComplete }: UseKakaoPlaceSearchParams) {
    const [places, setPlaces] = useState<KakaoSearchPlace[]>([]);
    const [showResearch, setShowResearch] = useState(false);

    const lastQueryRef = useRef<string | null>(null);
    const searchTokenRef = useRef(0);
    // focusPlace로 지도를 옮길 때 발생하는 idle은 "사용자 이동"이 아니므로 한 번 무시한다.
    const programmaticMoveRef = useRef(false);

    const markers = useMemo<PlaceMarker[]>(
        () =>
            places.flatMap((place) => {
                const center = toMapCenter(place);
                return center ? [{ ...center, place, label: stripHtml(place.title) }] : [];
            }),
        [places]
    );

    // 현재 지도 영역(bounds) 기준 검색. prop 변경과 "이 지역 재검색" 양쪽에서 호출하는 명령.
    const executeSearch = useCallback(
        (keyword: string) => {
            if (!map) return;
            const q = keyword.trim();
            if (!q) return;

            lastQueryRef.current = q;
            map.relayout();

            const token = ++searchTokenRef.current;
            searchPlacesOnMap(map, q)
                .then((found) => {
                    if (token !== searchTokenRef.current) return; // 더 새로운 검색이 시작됐으면 폐기
                    setPlaces(found);
                    setShowResearch(false);
                    onSearchComplete?.({ ok: true, places: found });
                })
                .catch(() => {
                    if (token !== searchTokenRef.current) return;
                    setPlaces([]);
                    setShowResearch(false);
                    onSearchComplete?.({ ok: false, reason: 'fetch_failed' });
                });
        },
        [map, onSearchComplete]
    );

    const researchHere = useCallback(() => {
        if (!lastQueryRef.current) return;
        setShowResearch(false); // 이벤트 핸들러라 즉시 버튼을 숨겨도 된다 (검색 결과는 비동기로 갱신)
        executeSearch(lastQueryRef.current);
    }, [executeSearch]);

    useEffect(() => {
        const q = searchQuery?.trim();
        if (q) executeSearch(q);
    }, [searchQuery, executeSearch]);

    // 사용자가 지도를 옮기면 "이 지역 재검색" 버튼을 노출한다. (검색을 한 번이라도 했을 때만)
    useEffect(() => {
        if (!map) return;
        const handleIdle = () => {
            if (programmaticMoveRef.current) {
                programmaticMoveRef.current = false;
                return;
            }
            if (lastQueryRef.current) setShowResearch(true);
        };
        kakao.maps.event.addListener(map, 'idle', handleIdle);
        return () => kakao.maps.event.removeListener(map, 'idle', handleIdle);
    }, [map]);

    // 선택 장소로 카메라 이동. 영역 검색이라 결과는 그대로 두고 카메라만 옮긴다.
    // 줌 레벨은 사용자가 설정한 상태를 유지한다.
    useEffect(() => {
        if (!map || !focusPlace) return;
        programmaticMoveRef.current = true;
        map.setCenter(new kakao.maps.LatLng(focusPlace.lat, focusPlace.lng));
        map.relayout();
    }, [map, focusPlace]);

    return { markers, showResearch, researchHere };
}
