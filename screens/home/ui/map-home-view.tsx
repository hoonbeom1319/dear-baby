'use client';

import { useState } from 'react';

import type { PlaceSummary } from '@/entities/place';

import { KakaoMap, toLatLng } from '@/shared/kakao-map';
import { Icon } from '@/shared/ui';

import { usePinOverlays } from '../model/use-pin-overlays';

const SEOUL = toLatLng(37.5665, 126.978)!;

type MapHomeViewProps = {
    places: PlaceSummary[];
    /** 방금 저장한 핀 — 3초 펄스 */
    newPlaceIds?: string[];
    onAddRecord: () => void;
    onPinClick: (place: PlaceSummary) => void;
    onAvatar: () => void;
};

/** A-1/B-1 지도 홈 — 핀이 박힌 전체 지도. 되새김의 메인 무대(PRD F-6). */
export function MapHomeView({ places, newPlaceIds, onAddRecord, onPinClick, onAvatar }: MapHomeViewProps) {
    const [map, setMap] = useState<kakao.maps.Map | null>(null);
    usePinOverlays(map, places, { newPlaceIds, onPinClick });

    const visitTotal = places.reduce((sum, p) => sum + p.visitCount, 0);
    const center = toLatLng(places[0]?.lat ?? SEOUL.lat, places[0]?.lng ?? SEOUL.lng) ?? SEOUL;

    return (
        <div className="relative h-dvh w-full overflow-hidden">
            {/* isolate: 카카오가 핀(CustomOverlay clickable) 레이어에 주는 높은 z-index를 이 박스 안에 가둔다.
                안 그러면 오버레이가 아래의 카드·FAB 위로 올라와 가리고 클릭을 가로챈다. */}
            <KakaoMap center={center} level={6} onReady={setMap} className="h-full w-full isolate" />

            {/* 떠있는 상단 카드 */}
            <div
                className="absolute right-3.5 left-3.5 z-10 flex items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3"
                style={{ top: 'calc(env(safe-area-inset-top) + 12px)', boxShadow: '0 8px 24px -10px rgba(15,23,42,0.28)' }}
            >
                <div className="min-w-0 flex-1">
                    <p className="text-[16px] leading-tight font-bold text-[#0F172A]">우리 가족 추억 지도</p>
                    <p className="mt-0.5 text-[13px] text-[#64748B] tabular-nums">
                        장소 {places.length}곳 · 방문 {visitTotal}번
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onAvatar}
                    aria-label="내 계정"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600 transition-colors hover:bg-primary-100"
                >
                    <Icon name="user" size={20} stroke={1.9} />
                </button>
            </div>

            {/* 힌트 알약 */}
            <div className="pointer-events-none absolute bottom-[118px] left-1/2 z-10 -translate-x-1/2">
                <span className="whitespace-nowrap rounded-full bg-[rgba(15,23,42,0.84)] px-3.5 py-2 text-[13px] font-medium text-white">
                    핀을 눌러 그날의 추억을 다시 보세요
                </span>
            </div>

            {/* FAB 기록 추가 */}
            <button
                type="button"
                onClick={onAddRecord}
                className="absolute right-5 bottom-9 z-10 flex h-14 items-center gap-2 rounded-full bg-primary-600 pr-5 pl-4 text-white transition-colors hover:bg-primary-700"
                style={{ boxShadow: '0 14px 28px -8px oklch(64.6% 0.222 41.116 / 0.6)' }}
            >
                <Icon name="plus" size={22} stroke={2} />
                <span className="text-[15px] font-bold">기록 추가</span>
            </button>
        </div>
    );
}
