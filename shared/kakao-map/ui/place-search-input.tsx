'use client';

import { useEffect, useState, type ReactNode } from 'react';

import { Icon } from '@/shared/ui';

import { searchPlacesByKeyword, type PickedPlace, type PlaceSearchResult } from '../lib/search-places';

type PlaceSearchInputProps = {
    /** 입력값 = 자유 라벨 + 카카오 검색어 (controlled). */
    value: string;
    /** 매 입력마다 호출 (자유 라벨 갱신·검색어). */
    onChange: (value: string) => void;
    /** 입력 blur 시 한 번 호출 — 서버 반영처럼 비싼 확정을 여기서. (선택) */
    onCommit?: (value: string) => void;
    /** 카카오 검색 결과를 고르면 호출. */
    onPick: (picked: PickedPlace) => void;
    /** 결과에 없을 때의 대안(지도에서 직접 찍기 등). 있으면 드롭다운에 폴백 버튼이 뜬다. */
    onManual?: () => void;
    placeholder?: string;
    inputClassName?: string;
    /** 입력 아래·드롭다운 위에 끼워 넣을 콘텐츠 (예: 배지 줄). */
    children?: ReactNode;
};

/**
 * 인라인 장소 검색 입력 — 입력 박스에 타이핑하면 카카오 장소를 검색해 드롭다운으로 고른다.
 * 기록 편집기(장소 등록 카드)와 장소 상세 편집이 같이 쓴다. 시트가 아니라 그 자리에서 바로 검색.
 * 거리순이 아니라 정확도순(searchPlacesByKeyword)이라 좌표 근처 입점 매장이 대표 장소를 밀지 않는다.
 */
export function PlaceSearchInput({ value, onChange, onCommit, onPick, onManual, placeholder, inputClassName, children }: PlaceSearchInputProps) {
    const [focused, setFocused] = useState(false);
    const [results, setResults] = useState<PlaceSearchResult[]>([]);
    const [searching, setSearching] = useState(false);

    // 상태 전환은 입력 이벤트에서(effect 본문 동기 setState 회피). 비우면 즉시 초기화.
    const handleChange = (next: string) => {
        onChange(next);
        setSearching(next.trim().length > 0);
        if (!next.trim()) setResults([]);
    };

    // 포커스 중 값이 바뀌면 카카오 검색(디바운스 300ms).
    useEffect(() => {
        if (!focused) return;
        const q = value.trim();
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
    }, [focused, value]);

    const trimmed = value.trim();
    const open = focused && (searching || results.length > 0 || (!!onManual && trimmed.length > 0));

    return (
        <div className="relative min-w-0 flex-1">
            <input
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                onFocus={() => setFocused(true)}
                // onMouseDown(preventDefault)로 잡은 항목 선택은 blur보다 먼저라 onCommit이 안 묻힌다.
                onBlur={(e) => {
                    onCommit?.(e.target.value);
                    setTimeout(() => setFocused(false), 150);
                }}
                placeholder={placeholder}
                className={inputClassName}
            />

            {children}

            {open && (
                <div className="absolute top-full left-0 z-30 mt-1.5 max-h-[230px] w-full overflow-y-auto rounded-xl border border-[#E2E8F0] bg-white shadow-[0_10px_24px_-6px_rgba(15,23,42,0.22)]">
                    <p className="px-3 pt-2.5 pb-1 text-[11px] font-semibold text-[#94A3B8]">카카오맵 검색</p>
                    {results.length === 0 ? (
                        <p className="px-3 pb-3 text-[13px] text-[#94A3B8]">{searching ? '검색 중…' : '검색 결과가 없어요'}</p>
                    ) : (
                        results.map((place) => (
                            <button
                                key={place.kakaoPlaceId}
                                type="button"
                                // onMouseDown: input blur보다 먼저 잡아 선택이 닫힘에 묻히지 않게
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    onPick({ name: place.name, source: 'kakao', lat: place.lat, lng: place.lng, kakaoPlaceId: place.kakaoPlaceId });
                                    setResults([]);
                                    setFocused(false);
                                }}
                                className="flex w-full items-start gap-2 px-3 py-2.5 text-left hover:bg-neutral-50"
                            >
                                <Icon name="pin" size={15} className="mt-0.5 shrink-0 fill-primary-600 text-white" stroke={1.2} />
                                <span className="min-w-0 flex-1">
                                    <span className="block truncate text-[14px] font-medium text-[#334155]">{place.name}</span>
                                    <span className="block truncate text-[12px] text-[#94A3B8]">{place.address}</span>
                                </span>
                            </button>
                        ))
                    )}
                    {onManual && (
                        <button
                            type="button"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                onManual();
                                setResults([]);
                                setFocused(false);
                            }}
                            className="flex w-full items-center gap-2 border-t border-[#F1F5F9] px-3 py-2.5 text-left text-[13px] font-semibold text-primary-700 hover:bg-neutral-50"
                        >
                            <Icon name="pin" size={15} className="text-primary-600" stroke={2} />
                            검색 결과에 없나요? 지도에서 직접 찍기
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
