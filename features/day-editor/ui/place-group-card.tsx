'use client';

import { useState } from 'react';

import type { PlaceCandidate } from '@/shared/kakao-map';
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
    onChooseCandidate: (candidate: PlaceCandidate) => void;
    onToggleMenu: () => void;
    onPinEdit: () => void;
    onDelete: () => void;
    onNote: (note: string) => void;
    onEditDate: () => void;
};

/**
 * 장소 그룹 카드 — 저장 시 Place 1 + Visit 1이 된다.
 * 장소명은 상위 후보로 채워두되(첫 제안), 입력 포커스 시 다른 후보를 고를 수 있다
 * (자동 top1 확정 금지 — 실내·대형건물 약점, [[verify-kakao-reverse-geocoding]]).
 */
export function PlaceGroupCard({
    group,
    selected,
    menuOpen,
    onTapPhoto,
    onRename,
    onChooseCandidate,
    onToggleMenu,
    onPinEdit,
    onDelete,
    onNote,
    onEditDate
}: PlaceGroupCardProps) {
    const [candidatesOpen, setCandidatesOpen] = useState(false);
    const isKakao = group.source === 'kakao';

    // 현재 이름과 다른 후보만 제안 목록에 남긴다.
    const otherCandidates = group.candidates.filter((c) => c.name !== group.name);

    return (
        <div className="relative rounded-2xl border border-[#E2E8F0] bg-white p-3.5 shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
            <div className="mb-3 flex items-start gap-2">
                <Icon name="pin" size={20} className="mt-[3px] shrink-0 fill-primary-600 text-white" stroke={1.2} />

                <div className="relative min-w-0 flex-1">
                    <input
                        value={group.name}
                        onChange={(e) => onRename(e.target.value)}
                        onFocus={() => setCandidatesOpen(true)}
                        onBlur={() => setTimeout(() => setCandidatesOpen(false), 120)}
                        placeholder="장소 이름"
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

                    {candidatesOpen && otherCandidates.length > 0 && (
                        <div className="absolute top-[58px] left-0 z-30 w-full overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[0_10px_24px_-6px_rgba(15,23,42,0.22)]">
                            <p className="px-3 pt-2.5 pb-1 text-[11px] font-semibold text-[#94A3B8]">다른 후보</p>
                            {otherCandidates.map((candidate, i) => (
                                <button
                                    key={`${candidate.kakaoPlaceId ?? candidate.name}-${i}`}
                                    type="button"
                                    // onMouseDown: input blur보다 먼저 잡아 선택이 닫힘에 묻히지 않게
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        onChooseCandidate(candidate);
                                        setCandidatesOpen(false);
                                    }}
                                    className="flex w-full items-center gap-2 px-3 py-2.5 text-left hover:bg-neutral-50"
                                >
                                    <Icon name="pin" size={15} className="shrink-0 fill-primary-600 text-white" stroke={1.2} />
                                    <span className="flex-1 truncate text-[14px] text-[#334155]">{candidate.name}</span>
                                    {candidate.distanceM != null && <span className="text-[11px] text-[#94A3B8] tabular-nums">{candidate.distanceM}m</span>}
                                </button>
                            ))}
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
