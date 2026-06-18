'use client';

import { useState } from 'react';

import { useParams, useRouter } from 'next/navigation';

import { useAuth } from '@/application/providers';

import { useMemoryEditor } from '@/features/memory-editor';

import { usePlaceDetailData } from '@/entities/place';


import { ConfirmSheet, DateSheet, Icon } from '@/shared/ui';

import { PinEditSheet } from './ui/pin-edit-sheet';
import { VisitCard, type VisitCardHandlers } from './ui/visit-card';

/** 뒤로(지도) + 편집 토글. 핀 탭으로 들어온 흐름이라 history back이 지도 상태를 그대로 복원한다. */
function BackBar({ onBack, editMode, onToggleEdit, canEdit }: { onBack: () => void; editMode: boolean; onToggleEdit: () => void; canEdit: boolean }) {
    return (
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#e2e8f0] bg-[rgba(248,250,252,0.95)] px-3 py-2 backdrop-blur">
            <button
                type="button"
                onClick={onBack}
                className="flex h-10 items-center gap-1 rounded-lg pl-1 pr-2 text-[15px] text-[#334155] transition-colors hover:bg-black/5"
            >
                <Icon name="back" size={22} stroke={2} />
                지도
            </button>
            {canEdit && (
                <button
                    type="button"
                    onClick={onToggleEdit}
                    className={
                        editMode
                            ? 'h-9 rounded-lg bg-primary-600 px-3.5 text-[14px] font-bold text-white'
                            : 'h-9 rounded-lg px-3.5 text-[14px] font-semibold text-primary-600 transition-colors hover:bg-primary-50'
                    }
                >
                    {editMode ? '완료' : '편집'}
                </button>
            )}
        </div>
    );
}

/**
 * B-2 장소 상세 — 방문 이력을 시간순 타임라인으로 보여주고(읽기), '편집' 토글로 이름·핀·방문·사진을 고친다.
 * 데이터·내비게이션·편집 시트 오케스트레이션은 여기서, 카드 렌더링은 ui/VisitCard가 맡는다.
 */
export function PlaceDetailScreen() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const placeId = typeof params.id === 'string' ? params.id : null;
    const userId = useAuth((s) => s.userId);

    const { place, isLoading, isError } = usePlaceDetailData(placeId);
    const editor = useMemoryEditor(userId, placeId ?? '');

    const [editMode, setEditMode] = useState(false);
    // 날짜 시트: visitId=있으면 방문 날짜 수정, null이면 새 방문 추가. current=수정 시 현재 날짜(시트 표시값).
    const [dateTarget, setDateTarget] = useState<{ visitId: string | null; current: string | null } | null>(null);
    const [pinOpen, setPinOpen] = useState(false);
    const [confirm, setConfirm] = useState<{ kind: 'place' } | { kind: 'visit'; visitId: string } | null>(null);

    const goBack = () => router.back();

    if (isLoading) {
        return (
            <div className="min-h-dvh bg-[#f8fafc]">
                <BackBar onBack={goBack} editMode={false} onToggleEdit={() => {}} canEdit={false} />
                <p className="px-5 py-16 text-center text-sm text-[#94a3b8]">불러오는 중…</p>
            </div>
        );
    }

    if (isError || !place) {
        return (
            <div className="min-h-dvh bg-[#f8fafc]">
                <BackBar onBack={goBack} editMode={false} onToggleEdit={() => {}} canEdit={false} />
                <p className="px-5 py-16 text-center text-sm text-[#475569] [word-break:keep-all]">장소를 찾을 수 없어요.</p>
            </div>
        );
    }

    const handlers: VisitCardHandlers = {
        onRequestEditDate: (visitId, current) => setDateTarget({ visitId, current }),
        onEditNote: editor.editVisitNote,
        onAddPhotos: editor.addPhotos,
        onDeletePhoto: editor.removePhoto,
        onRequestDeleteVisit: (visitId) => setConfirm({ kind: 'visit', visitId })
    };

    return (
        <div className="min-h-dvh bg-[#f8fafc]">
            <BackBar onBack={goBack} editMode={editMode} onToggleEdit={() => setEditMode((v) => !v)} canEdit={!!userId} />

            <header className="px-5 pb-2 pt-[18px]">
                {editMode ? (
                    <div className="flex flex-col gap-2.5">
                        <div className="flex items-center gap-2">
                            <span className="shrink-0 text-primary-600">
                                <Icon name="pin" size={24} />
                            </span>
                            <input
                                key={place.name}
                                defaultValue={place.name}
                                onBlur={(e) => {
                                    const name = e.target.value.trim();
                                    if (name && name !== place.name) editor.renamePlace(name);
                                }}
                                className="min-w-0 flex-1 rounded-lg border border-[#e2e8f0] bg-white px-3 py-2 text-[18px] font-extrabold text-[#0f172a] outline-none focus:border-primary-300"
                            />
                        </div>
                        <div className="flex gap-2 pl-8">
                            <button
                                type="button"
                                onClick={() => setPinOpen(true)}
                                className="flex items-center gap-1.5 rounded-lg border border-[#e2e8f0] bg-white px-3 py-2 text-[13px] font-semibold text-[#334155] transition-colors hover:bg-[#f8fafc]"
                            >
                                <Icon name="pin" size={15} />
                                핀 위치 수정
                            </button>
                            <button
                                type="button"
                                onClick={() => setConfirm({ kind: 'place' })}
                                className="flex items-center gap-1.5 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-[13px] font-semibold text-[#DC2626] transition-colors hover:bg-[#FEE2E2]"
                            >
                                <Icon name="trash" size={15} />
                                장소 삭제
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-start gap-2.5">
                        <span className="mt-0.5 shrink-0 text-primary-600">
                            <Icon name="pin" size={26} />
                        </span>
                        <div className="min-w-0">
                            <h1 className="truncate text-[22px] font-extrabold tracking-[-0.025em] text-[#0f172a]">{place.name}</h1>
                            <p className="mt-0.5 text-sm font-semibold text-primary-600">여기 {place.visits.length}번 왔어요</p>
                        </div>
                    </div>
                )}
            </header>

            <div className="px-4 pb-10 pt-2">
                {place.visits.length === 0 ? (
                    <p className="py-12 text-center text-sm text-[#94a3b8]">아직 남긴 기록이 없어요.</p>
                ) : (
                    place.visits.map((visit, i) => (
                        <VisitCard key={visit.id} visit={visit} isLast={i === place.visits.length - 1} editMode={editMode} {...handlers} />
                    ))
                )}

                {editMode && (
                    <button
                        type="button"
                        onClick={() => setDateTarget({ visitId: null, current: null })}
                        className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#cbd5e1] py-3 text-[14px] font-semibold text-[#475569] transition-colors hover:bg-white"
                    >
                        <Icon name="plus" size={18} stroke={2} />
                        방문 추가
                    </button>
                )}
            </div>

            <DateSheet
                open={dateTarget !== null}
                onOpenChange={(o) => !o && setDateTarget(null)}
                options={[]}
                value={dateTarget?.current ?? null}
                onPick={(date) => {
                    if (!dateTarget) return;
                    if (dateTarget.visitId) editor.editVisitDate(dateTarget.visitId, date);
                    else editor.addVisit(date);
                    setDateTarget(null);
                }}
            />

            <PinEditSheet open={pinOpen} onOpenChange={setPinOpen} center={{ lat: place.lat, lng: place.lng }} onSubmit={editor.movePlace} />

            <ConfirmSheet
                open={confirm !== null}
                onOpenChange={(o) => !o && setConfirm(null)}
                title={confirm?.kind === 'place' ? '이 장소를 삭제할까요?' : '이 방문을 삭제할까요?'}
                description={
                    confirm?.kind === 'place'
                        ? '장소와 모든 방문·사진이 사라져요. 되돌릴 수 없어요.'
                        : '이 방문의 사진·메모가 사라져요. 되돌릴 수 없어요.'
                }
                onConfirm={() => {
                    if (!confirm) return;
                    if (confirm.kind === 'place') editor.removePlace(() => router.back());
                    else editor.removeVisit(confirm.visitId);
                }}
            />
        </div>
    );
}
