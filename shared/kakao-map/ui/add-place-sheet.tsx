'use client';

import { useEffect, useState } from 'react';

import { Icon } from '@/shared/ui';

import { Sheet } from '@/hbds/overlay/sheet';

import { searchPlacesByKeyword, type PickedPlace, type PlaceSearchResult } from '../lib/search-places';

import { PinPicker } from './pin-picker';

const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 };

type AddPlaceSheetProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    /** 'place' = 이름+좌표로 장소 선택(검색/수동) / 'pin' = 좌표만 수정(핀 위치 수정) */
    mode: 'place' | 'pin';
    /** 검색 거리 기준·지도 초기 중심. 없으면 서울 기본값. */
    near: { lat: number; lng: number } | null;
    onSubmitPlace: (picked: PickedPlace) => void;
    onSubmitPin: (lat: number, lng: number) => void;
};

/**
 * 장소 선택 시트 — 카카오 검색으로 고르거나(검색 모드), 지도에서 직접 찍는다(수동 모드, F-4).
 * mode='pin'이면 검색 없이 지도만 — 기존 장소의 핀 위치 수정.
 * 기록 편집기(새 장소 추가)와 장소 상세(장소 수정)가 함께 쓴다.
 * (Radix Dialog가 닫힐 때 내용을 언마운트하므로 열 때마다 내부 상태가 초기화된다.)
 */
export function AddPlaceSheet({ open, onOpenChange, title, mode, near, onSubmitPlace, onSubmitPin }: AddPlaceSheetProps) {
    const [tab, setTab] = useState<'search' | 'manual'>(mode === 'pin' ? 'manual' : 'search');
    const center = near ?? DEFAULT_CENTER;

    return (
        <Sheet open={open} onOpenChange={onOpenChange} title={title}>
            <div className="max-h-[72vh] overflow-y-auto">
                {tab === 'search' && mode === 'place' ? (
                    <SearchMode onPick={onSubmitPlace} onGoManual={() => setTab('manual')} />
                ) : (
                    <ManualMode
                        center={center}
                        withName={mode === 'place'}
                        onBack={mode === 'place' ? () => setTab('search') : undefined}
                        onSubmit={(lat, lng, name) => {
                            if (mode === 'pin') onSubmitPin(lat, lng);
                            else onSubmitPlace({ name, source: 'manual', lat, lng, kakaoPlaceId: null });
                        }}
                    />
                )}
            </div>
        </Sheet>
    );
}

function SearchMode({ onPick, onGoManual }: { onPick: (picked: PickedPlace) => void; onGoManual: () => void }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<PlaceSearchResult[]>([]);
    const [searching, setSearching] = useState(false);

    // 상태 전환은 입력 이벤트에서 처리한다(이벤트 핸들러라 effect 동기 setState 규칙에 안 걸림).
    // 입력 즉시 '검색 중'으로 두고, 결과가 도착하면 effect가 끈다. 비우면 즉시 초기화.
    const handleChange = (value: string) => {
        setQuery(value);
        const q = value.trim();
        setSearching(q.length > 0);
        if (!q) setResults([]);
    };

    useEffect(() => {
        const q = query.trim();
        if (!q) return; // 입력 핸들러가 결과를 비운다 — effect 본문 동기 setState 회피
        let cancelled = false;
        const timer = setTimeout(() => {
            searchPlacesByKeyword(q)
                .then((r) => {
                    if (cancelled) return;
                    setResults(r);
                    setSearching(false);
                })
                .catch(() => {
                    if (cancelled) return;
                    setResults([]);
                    setSearching(false);
                });
        }, 300);
        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [query]);

    const trimmed = query.trim();

    // 검색 모드는 고정 높이 컬럼: 인풋·"직접 찍기"는 고정, 결과만 스크롤한다.
    // 결과 개수에 따라 시트 전체 높이가 출렁이지 않게 하려는 의도.
    return (
        <div className="flex h-[58vh] flex-col">
            <p className="mb-3 shrink-0 text-[13px] text-[#94A3B8]">카카오맵에서 장소를 검색해 선택하세요</p>
            <div className="flex h-[46px] shrink-0 items-center gap-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3">
                <Icon name="search" size={18} className="text-[#94A3B8]" />
                <input
                    value={query}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder="장소·주소 검색 (예: 스타필드, 미사동)"
                    className="flex-1 bg-transparent text-[15px] text-[#0F172A] outline-none placeholder:text-[#94A3B8]"
                />
            </div>

            <div className="-mx-1 my-2 flex-1 overflow-y-auto px-1">
                {results.length > 0 ? (
                    results.map((place) => (
                        <button
                            key={place.kakaoPlaceId}
                            type="button"
                            onClick={() => onPick({ name: place.name, source: 'kakao', lat: place.lat, lng: place.lng, kakaoPlaceId: place.kakaoPlaceId })}
                            className="flex w-full items-start gap-2.5 border-b border-[#F1F5F9] px-2 py-3 text-left"
                        >
                            <Icon name="pin" size={18} className="mt-0.5 shrink-0 fill-primary-600 text-white" stroke={1.2} />
                            <span className="min-w-0">
                                <span className="block text-[15px] font-semibold text-[#0F172A]">{place.name}</span>
                                <span className="mt-0.5 block truncate text-[12px] text-[#94A3B8]">{place.address}</span>
                            </span>
                        </button>
                    ))
                ) : (
                    <div className="flex h-full items-center justify-center px-4 text-center text-[13px] text-[#94A3B8] [word-break:keep-all]">
                        {searching ? '검색 중…' : trimmed ? '검색 결과가 없어요' : '장소 이름이나 주소를 입력해 보세요'}
                    </div>
                )}
            </div>

            <button
                type="button"
                onClick={onGoManual}
                className="flex h-[50px] w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-primary-100 bg-primary-50 text-[14px] font-semibold text-primary-700"
            >
                <Icon name="pin" size={18} className="text-primary-600" stroke={2} />
                검색 결과에 없나요? 지도에서 직접 찍기
            </button>
        </div>
    );
}

function ManualMode({
    center,
    withName,
    onBack,
    onSubmit
}: {
    center: { lat: number; lng: number };
    withName: boolean;
    onBack?: () => void;
    onSubmit: (lat: number, lng: number, name: string) => void;
}) {
    const [coord, setCoord] = useState(center);
    const [name, setName] = useState('');
    const canSubmit = !withName || name.trim().length > 0;

    return (
        <>
            {onBack && (
                <button type="button" onClick={onBack} className="mb-2 flex items-center gap-1 text-[14px] font-medium text-[#334155]">
                    <Icon name="back" size={18} /> 검색으로
                </button>
            )}
            <p className="mb-2.5 text-[13px] text-[#94A3B8]">지도를 눌러 핀을 옮기세요</p>

            <div className="relative mb-3 h-[220px] overflow-hidden rounded-xl border border-[#E2E8F0]">
                <PinPicker center={center} onChange={(lat, lng) => setCoord({ lat, lng })} className="h-full w-full" />
                <div className="pointer-events-none absolute top-2 left-2 z-10 rounded-full bg-[rgba(15,23,42,0.78)] px-2.5 py-1.5 text-[11px] text-white tabular-nums">
                    {coord.lat.toFixed(4)}, {coord.lng.toFixed(4)}
                </div>
            </div>

            {withName && (
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="장소 이름 (예: 할머니 집)"
                    className="mb-3 h-12 w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 text-[15px] text-[#0F172A] outline-none placeholder:text-[#94A3B8]"
                />
            )}

            <button
                type="button"
                disabled={!canSubmit}
                onClick={() => onSubmit(coord.lat, coord.lng, name.trim())}
                className="h-[52px] w-full rounded-[14px] bg-primary-600 text-[16px] font-bold text-white transition-colors hover:bg-primary-700 disabled:opacity-40"
            >
                {withName ? '이 위치로 장소 추가' : '이 위치로 변경'}
            </button>
        </>
    );
}
