'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

import { DEFAULT_MAP_CENTER, DEFAULT_MAP_LEVEL, FOCUS_PLACE_LEVEL } from '../config/defaults';
import { toLatLng } from '../lib/coords';
import { searchPlacesOnMap } from '../lib/kakao-places-search';
import type { KakaoPlaceMapSearchResult, KakaoSearchPlace, MapFocusPlace } from '../lib/types';

type UseKakaoPlaceMapParams = {
    mapContainerRef: RefObject<HTMLDivElement | null>;
    searchQuery: string | null;
    focusPlace: MapFocusPlace | null;
    onMarkerClick?: (place: KakaoSearchPlace) => void;
    onSearchComplete?: (result: KakaoPlaceMapSearchResult) => void;
};

export function useKakaoPlaceMap({ mapContainerRef, searchQuery, focusPlace, onMarkerClick, onSearchComplete }: UseKakaoPlaceMapParams) {
    const [map, setMap] = useState<kakao.maps.Map | null>(null);
    const [searchPlaces, setSearchPlaces] = useState<KakaoSearchPlace[]>([]);
    const [showResearch, setShowResearch] = useState(false);

    const markersRef = useRef<kakao.maps.Marker[]>([]);
    const createdRef = useRef(false);
    const lastQueryRef = useRef<string | null>(null);
    const searchTokenRef = useRef(0);
    // focusPlace로 지도를 옮길 때 발생하는 idle은 "사용자 이동"이 아니므로 한 번 무시한다.
    const programmaticMoveRef = useRef(false);

    const clearMarkers = useCallback(() => {
        markersRef.current.forEach((m) => m.setMap(null));
        markersRef.current = [];
    }, []);

    const onSdkLoad = () => {
        kakao.maps.load(() => {
            const container = mapContainerRef.current;
            // 맵 생성은 부수효과라 setMap updater가 아니라 ref 가드로 막는다.
            // (StrictMode는 updater를 두 번 호출 → updater 안에서 생성하면 맵이 중복으로 그려진다)
            if (!container || createdRef.current) return;
            createdRef.current = true;
            setMap(
                new kakao.maps.Map(container, {
                    center: new kakao.maps.LatLng(DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng),
                    level: DEFAULT_MAP_LEVEL
                })
            );
        });
    };

    // 현재 지도 영역(bounds) 기준 검색. prop 변경과 "이 지역 재검색" 양쪽에서 호출하는 명령.
    const executeSearch = useCallback(
        (keyword: string) => {
            if (!map) return;
            const q = keyword.trim();
            if (!q) return;

            lastQueryRef.current = q;
            clearMarkers();
            map.relayout();

            const token = ++searchTokenRef.current;
            searchPlacesOnMap(map, q)
                .then((places) => {
                    if (token !== searchTokenRef.current) return; // 더 새로운 검색이 시작됐으면 폐기
                    setSearchPlaces(places);
                    setShowResearch(false);
                    onSearchComplete?.({ ok: true, places });
                })
                .catch(() => {
                    if (token !== searchTokenRef.current) return;
                    setSearchPlaces([]);
                    setShowResearch(false);
                    onSearchComplete?.({ ok: false, reason: 'fetch_failed' });
                });
        },
        [map, clearMarkers, onSearchComplete]
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

    // 영역 검색이라 결과는 이미 현재 화면 안에 있다. 지도는 그대로 두고 마커만 표시한다.
    useEffect(() => {
        if (!map) return;
        clearMarkers();

        searchPlaces.forEach((place) => {
            const coords = toLatLng(place.mapx, place.mapy);
            if (!coords) return;
            const [lat, lng] = coords;
            const position = new kakao.maps.LatLng(lat, lng);

            const marker = new kakao.maps.Marker({ position, map });
            kakao.maps.event.addListener(marker, 'click', () => onMarkerClick?.(place));
            markersRef.current.push(marker);
        });
    }, [map, searchPlaces, onMarkerClick, clearMarkers]);

    useEffect(() => {
        if (!map || !focusPlace) return;

        programmaticMoveRef.current = true;
        const position = new kakao.maps.LatLng(focusPlace.lat, focusPlace.lng);
        map.setCenter(position);
        map.setLevel(FOCUS_PLACE_LEVEL);
        map.relayout();
    }, [map, focusPlace]);

    return {
        mapReady: map !== null,
        onSdkLoad,
        showResearch,
        researchHere
    };
}
