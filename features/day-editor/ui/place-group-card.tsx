'use client';

import { useEffect, useState } from 'react';

import { searchPlacesByKeyword, type PickedPlace, type PlaceSearchResult } from '@/shared/kakao-map';
import { formatVisitDateShort } from '@/shared/lib';
import { Icon } from '@/shared/ui';

import type { EditorGroup } from '../model/use-editor-draft';

import { EditorPhotoTile } from './editor-photo-tile';

type PlaceGroupCardProps = {
    group: EditorGroup;
    selected: Set<string>;
    menuOpen: boolean;
    onTapPhoto: (id: string) => void;
    onRename: (name: string) => void;
    onChoosePlace: (picked: PickedPlace) => void;
    onToggleMenu: () => void;
    onPinEdit: () => void;
    onDelete: () => void;
    onNote: (note: string) => void;
    onEditDate: () => void;
};

/**
 * 장소 그룹 카드 — 저장 시 Place 1 + Visit 1이 된다.
 * 장소명은 자동 분석(역지오코딩 첫 제안)으로 채워두되, 입력을 고치면 그 텍스트로 **카카오 장소를 검색**해
 * 결과에서 고를 수 있다(그룹 좌표 거리순). 검색 없이 자유 라벨("할머니 집")로 둬도 된다.
 */
export function PlaceGroupCard({
    group,
    selected,
    menuOpen,
    onTapPhoto,
    onRename,
    onChoosePlace,
    onToggleMenu,
    onPinEdit,
    onDelete,
    onNote,
    onEditDate
}: PlaceGroupCardProps) {
    const [focused, setFocused] = useState(false);
    const [results, setResults] = useState<PlaceSearchResult[]>([]);
    const [searching, setSearching] = useState(false);
    const isKakao = group.source === 'kakao';

    // 입력 = 자유 라벨 + 카카오 검색어. 상태 전환은 이벤트에서(effect 동기 setState 회피).
    const handleChange = (value: string) => {
        onRename(value);
        setSearching(value.trim().length > 0);
        if (!value.trim()) setResults([]);
    };

    // 포커스 중 이름이 바뀌면 그룹 좌표 근처로 카카오 검색(디바운스).
    useEffect(() => {
        if (!focused) return;
        const q = group.name.trim();
        if (!q) return;
        let cancelled = false;
        const timer = setTimeout(() => {
            searchPlacesByKeyword(q, { lat: group.lat, lng: group.lng })
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
    }, [focused, group.name, group.lat, group.lng]);

    return (
        <div className="relative rounded-2xl border border-[#E2E8F0] bg-white p-3.5 shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
            <div className="mb-3 flex items-start gap-2">
                <Icon name="pin" size={20} className="mt-[3px] shrink-0 fill-primary-600 text-white" stroke={1.2} />

                <div className="relative min-w-0 flex-1">
                    <input
                        value={group.name}
                        onChange={(e) => handleChange(e.target.value)}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setTimeout(() => setFocused(false), 150)}
                        placeholder="장소 이름 (검색하거나 직접 입력)"
                        className="w-full border-none bg-transparent p-0 text-[16px] font-bold text-[#0F172A] outline-none placeholder:text-[#94A3B8]"
                    />
                    <div className="mt-[3px] flex flex-wrap items-center gap-1.5">
                        <span
                            className={
                                isKakao
                                    ? 'inline-flex h-5 items-center rounded-full bg-[oklch(95.1%_0.026_236.824)] px-[7px] text-[11px] font-semibold text-[oklch(50%_0.134_242.749)]'
                                    : 'inline-flex h-5 items-center rounded-full bg-neutral-100 px-[7px] text-[11px] font-semibold text-neutral-600'
                            }
                        >
                            {isKakao ? '카카오맵' : '직접 추가'}
                        </span>
                        {/* 그룹별 방문 날짜 — 날짜 미정이면 강조해 지정을 유도한다 */}
                        <button
                            type="button"
                            onClick={onEditDate}
                            className={
                                group.visitedOn
                                    ? 'inline-flex h-5 items-center gap-1 rounded-full bg-neutral-100 px-[7px] text-[11px] font-semibold text-neutral-600 tabular-nums'
                                    : 'inline-flex h-5 items-center gap-1 rounded-full bg-primary-50 px-[7px] text-[11px] font-semibold text-primary-600'
                            }
                        >
                            <Icon name="clock" size={11} stroke={2} />
                            {formatVisitDateShort(group.visitedOn)}
                        </button>
                        <span className="text-[12px] text-[#94A3B8]">사진 {group.photos.length}장</span>
                    </div>

                    {focused && (results.length > 0 || searching) && (
                        <div className="absolute top-[58px] left-0 z-30 max-h-[230px] w-full overflow-y-auto rounded-xl border border-[#E2E8F0] bg-white shadow-[0_10px_24px_-6px_rgba(15,23,42,0.22)]">
                            <p className="px-3 pt-2.5 pb-1 text-[11px] font-semibold text-[#94A3B8]">카카오맵 검색</p>
                            {results.length === 0 ? (
                                <p className="px-3 pb-3 text-[13px] text-[#94A3B8]">검색 중…</p>
                            ) : (
                                results.map((place) => (
                                    <button
                                        key={place.kakaoPlaceId}
                                        type="button"
                                        // onMouseDown: input blur보다 먼저 잡아 선택이 닫힘에 묻히지 않게
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            onChoosePlace({ name: place.name, source: 'kakao', lat: place.lat, lng: place.lng, kakaoPlaceId: place.kakaoPlaceId });
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
                        </div>
                    )}
                </div>

                <button type="button" onClick={onToggleMenu} aria-label="장소 메뉴" className="flex h-8 w-8 items-center justify-center rounded-lg text-[#94A3B8] hover:bg-neutral-100">
                    <Icon name="more" size={20} />
                </button>

                {menuOpen && (
                    <div className="absolute top-[46px] right-3 z-30 w-40 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[0_10px_24px_-6px_rgba(15,23,42,0.22)]">
                        <button type="button" onClick={onPinEdit} className="w-full px-3.5 py-3 text-left text-[14px] text-[#334155] hover:bg-neutral-50">
                            핀 위치 수정
                        </button>
                        <button type="button" onClick={onDelete} className="w-full border-t border-[#F1F5F9] px-3.5 py-3 text-left text-[14px] text-danger hover:bg-neutral-50">
                            장소 삭제
                        </button>
                    </div>
                )}
            </div>

            {group.photos.length > 0 && (
                <div className="grid grid-cols-4 gap-1.5">
                    {group.photos.map((photo) => (
                        <EditorPhotoTile key={photo.id} photo={photo} selected={selected.has(photo.id)} onTap={onTapPhoto} />
                    ))}
                </div>
            )}

            <textarea
                value={group.note}
                onChange={(e) => onNote(e.target.value)}
                placeholder="이날의 한마디 (선택)"
                className="mt-2.5 min-h-[44px] w-full resize-none rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5 text-[14px] leading-[1.5] text-[#334155] outline-none placeholder:text-[#94A3B8]"
            />
        </div>
    );
}
