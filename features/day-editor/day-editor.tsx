'use client';

import { useState } from 'react';

import { AddPlaceSheet } from '@/shared/kakao-map';
import { toast } from '@/shared/lib';
import { DateSheet, Icon } from '@/shared/ui';

import type { DayAnalysis } from './lib/types';
import { useEditorDraft, type EditorGroup } from './model/use-editor-draft';
import { AnalyzingState } from './ui/analyzing-state';
import { MoveSheet } from './ui/move-sheet';
import { PlaceGroupCard } from './ui/place-group-card';
import { SaveBar } from './ui/save-bar';
import { SelectionBar } from './ui/selection-bar';
import { UnassignedCard } from './ui/unassigned-card';

/** 장소 추가/핀 수정 시트의 호출 맥락 */
type AddSheetState = {
    open: boolean;
    mode: 'place' | 'pin';
    title: string;
    /** 열 때 선택돼 있던 사진을 새 그룹으로 끌어올지 (이동 시트 "새 장소") */
    pull: boolean;
    /** 핀 위치 수정 대상 그룹 id (mode='pin') */
    editId: string | null;
    near: { lat: number; lng: number } | null;
};

const CLOSED_ADD_SHEET: AddSheetState = { open: false, mode: 'place', title: '', pull: false, editId: null, near: null };

const INTRO_WITH_PHOTOS = '사진을 분석해 장소별로 미리 묶어 두었어요. 사진을 눌러 다른 장소로 옮기거나, 장소를 추가·수정할 수 있어요.';
const INTRO_NO_PHOTOS = '사진 없이 장소만 남길 수 있어요. 아래 "장소 추가"에서 지도를 검색해 장소를 더하세요.';

type DayEditorProps = {
    analysis: DayAnalysis | null;
    /** 분석이 끝나(또는 사진이 없어) 편집기를 시드할 수 있는 상태 */
    ready: boolean;
    hasPhotos: boolean;
    /** EXIF에서 뽑은 후보 날짜들 (YYYY-MM-DD) */
    dateOptions: string[];
    onBack: () => void;
    /** 이름 있는 장소 그룹들을 저장한다 (그룹별 visitedOn 사용 — 사진 업로드·기록 생성은 호출부 몫) */
    onSave: (savable: EditorGroup[]) => void;
    /** 저장(업로드) 진행 중 — 저장 바 비활성·문구 변경 */
    saving?: boolean;
};

/**
 * A-3 하루치 편집기 — 자동 분석 결과 위에서 장소·사진을 편집하고 저장(PRD F-4, 가장 중요한 화면).
 * 자동 채우기와 수동 편집은 하나의 편집기다. 저장은 "빈 칸"이 아니라 "이미 채워진 상태"에서 시작한다.
 */
export function DayEditor({ analysis, ready, hasPhotos, dateOptions, onBack, onSave, saving = false }: DayEditorProps) {
    const [menuId, setMenuId] = useState<string | null>(null);
    // 날짜 시트를 연 그룹 id (그룹별 방문 날짜 — null이면 닫힘)
    const [dateForGroup, setDateForGroup] = useState<string | null>(null);
    const [moveOpen, setMoveOpen] = useState(false);
    const [addSheet, setAddSheet] = useState<AddSheetState>(CLOSED_ADD_SHEET);

    const editor = useEditorDraft(analysis, ready);
    const { draft, selected } = editor;

    const savable = draft.groups.filter((g) => g.name.trim());
    const dateGroup = draft.groups.find((g) => g.id === dateForGroup) ?? null;
    // 검색 거리 기준·지도 초기 중심 — 그날 첫 장소 근처(없으면 시트가 서울 기본값을 쓴다).
    const dayCenter = draft.groups[0] ? { lat: draft.groups[0].lat, lng: draft.groups[0].lng } : null;
    const closeAddSheet = () => setAddSheet(CLOSED_ADD_SHEET);

    const requireDatesThenSave = () => {
        // 이름은 있는데 날짜가 비어 있는 그룹이 있으면 그 카드의 날짜 시트를 연다.
        const missing = savable.find((g) => !g.visitedOn);
        if (missing) {
            toast('날짜를 정하지 않은 장소가 있어요');
            setDateForGroup(missing.id);
            return;
        }
        onSave(savable);
    };

    return (
        <div className="relative flex h-dvh flex-col overflow-hidden bg-[#F1F5F9]">
            {/* 헤더 */}
            <header className="shrink-0 border-b border-[#E2E8F0] bg-white px-2.5 pt-2 pb-3" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 8px)' }}>
                <div className="flex items-center gap-1">
                    <button type="button" onClick={onBack} aria-label="뒤로" className="flex h-10 w-10 items-center justify-center rounded-full text-[#0F172A] hover:bg-neutral-100">
                        <Icon name="back" size={24} stroke={2} />
                    </button>
                    <div className="text-[18px] font-bold text-[#0F172A]">기록 정리</div>
                </div>
            </header>

            {!ready ? (
                <AnalyzingState />
            ) : (
                <main className="flex-1 overflow-y-auto px-3.5 pt-3.5 pb-[132px]">
                    <p className="mb-3.5 px-1 text-[13px] leading-[1.6] text-[#64748B] [word-break:keep-all]">{hasPhotos ? INTRO_WITH_PHOTOS : INTRO_NO_PHOTOS}</p>

                    {draft.unassigned.length > 0 && <UnassignedCard photos={draft.unassigned} selected={selected} onTapPhoto={editor.togglePhoto} />}

                    <div className="flex flex-col gap-3.5">
                        {draft.groups.map((group) => (
                            <PlaceGroupCard
                                key={group.id}
                                group={group}
                                selected={selected}
                                menuOpen={menuId === group.id}
                                onTapPhoto={editor.togglePhoto}
                                onRename={(name) => editor.renameGroup(group.id, name)}
                                onChoosePlace={(p) => editor.choosePlace(group.id, p)}
                                onToggleMenu={() => setMenuId((id) => (id === group.id ? null : group.id))}
                                onPinEdit={() => {
                                    setMenuId(null);
                                    setAddSheet({ open: true, mode: 'pin', title: '핀 위치 수정', pull: false, editId: group.id, near: { lat: group.lat, lng: group.lng } });
                                }}
                                onDelete={() => {
                                    setMenuId(null);
                                    editor.deleteGroup(group.id);
                                }}
                                onNote={(note) => editor.setNote(group.id, note)}
                                onEditDate={() => setDateForGroup(group.id)}
                            />
                        ))}

                        <button
                            type="button"
                            onClick={() => setAddSheet({ open: true, mode: 'place', title: '장소 추가', pull: false, editId: null, near: dayCenter })}
                            className="flex h-[54px] items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#CBD5E1] text-[15px] font-semibold text-[#64748B]"
                        >
                            <Icon name="plus" size={20} stroke={2} />
                            장소 추가 · 지도에서 검색
                        </button>
                    </div>
                </main>
            )}

            {ready &&
                (selected.size > 0 ? (
                    <SelectionBar count={selected.size} onUnassign={editor.unassignSelected} onMove={() => setMoveOpen(true)} onClear={editor.clearSelection} />
                ) : (
                    <SaveBar count={savable.length} disabled={savable.length === 0} saving={saving} onSave={requireDatesThenSave} />
                ))}

            <DateSheet
                open={dateForGroup !== null}
                onOpenChange={(open) => !open && setDateForGroup(null)}
                options={dateOptions}
                value={dateGroup?.visitedOn ?? null}
                onPick={(date) => {
                    if (dateForGroup) editor.setGroupDate(dateForGroup, date);
                    setDateForGroup(null);
                }}
            />

            <MoveSheet
                open={moveOpen}
                onOpenChange={setMoveOpen}
                count={selected.size}
                groups={draft.groups}
                onPick={(groupId) => {
                    editor.moveSelectedTo(groupId);
                    setMoveOpen(false);
                }}
                onPickNew={() => {
                    setMoveOpen(false);
                    setAddSheet({ open: true, mode: 'place', title: '새 장소 만들기', pull: true, editId: null, near: dayCenter });
                }}
            />

            <AddPlaceSheet
                open={addSheet.open}
                onOpenChange={(open) => !open && closeAddSheet()}
                title={addSheet.title}
                mode={addSheet.mode}
                near={addSheet.near}
                onSubmitPlace={(seed) => {
                    editor.addGroup(seed, addSheet.pull);
                    closeAddSheet();
                }}
                onSubmitPin={(lat, lng) => {
                    if (addSheet.editId) editor.setGroupCoord(addSheet.editId, lat, lng);
                    closeAddSheet();
                }}
            />
        </div>
    );
}
