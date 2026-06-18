'use client';

import { useRef, useState } from 'react';

import type { Photo, Visit } from '@/entities/place';

import { formatVisitDateLong } from '@/shared/lib';
import { Icon } from '@/shared/ui';

/** url이 만료/누락된 사진은 중성 그라데이션으로 자리만 채운다. */
function PhotoFill({ photo, className }: { photo: Photo; className?: string }) {
    if (!photo.url) {
        return <div className={`bg-gradient-to-br from-neutral-100 to-neutral-200 ${className ?? ''}`} />;
    }
    return <img src={photo.url} alt="" className={`h-full w-full object-cover ${className ?? ''}`} />;
}

export type VisitCardHandlers = {
    onRequestEditDate: (visitId: string, current: string) => void;
    onEditNote: (visitId: string, note: string) => void;
    onAddPhotos: (visitId: string, files: File[]) => void;
    onDeletePhoto: (photoId: string) => void;
    onRequestDeleteVisit: (visitId: string) => void;
};

type VisitCardProps = { visit: Visit; isLast: boolean; editMode?: boolean } & Partial<VisitCardHandlers>;

/**
 * 타임라인 한 칸 = 한 번의 방문. 읽기 모드는 대표 1장↔그리드 토글, 편집 모드는 날짜·메모·사진·삭제를 인라인 편집.
 * 레일(점+연결선)은 공통, 카드 본문만 모드에 따라 갈린다.
 */
export function VisitCard({ visit, isLast, editMode = false, ...handlers }: VisitCardProps) {
    return (
        <div className="relative pb-[22px] pl-7">
            <span className="absolute left-[5px] top-1.5 h-[11px] w-[11px] rounded-full border-2 border-[#f8fafc] bg-primary-600" />
            {!isLast && <span className="absolute bottom-0 left-[10px] top-[18px] w-0.5 bg-[#e2e8f0]" />}

            <div className="rounded-2xl border border-[#e2e8f0] bg-white p-3.5 shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
                {editMode ? <EditBody visit={visit} {...(handlers as VisitCardHandlers)} /> : <ReadBody visit={visit} />}
            </div>
        </div>
    );
}

function ReadBody({ visit }: { visit: Visit }) {
    const [expanded, setExpanded] = useState(false);

    const photos = visit.photos;
    const photoCount = photos.length;
    const cover = photos[0] ?? null;
    const canExpand = photoCount > 1;

    return (
        <>
            <div className="mb-2.5 flex items-center justify-between">
                <span className="whitespace-nowrap text-sm font-bold tabular-nums text-[#0f172a]">{formatVisitDateLong(visit.visitedOn)}</span>
                <span className="whitespace-nowrap text-xs text-[#94a3b8]">사진 {photoCount}장</span>
            </div>

            {expanded ? (
                <div className="mb-2.5">
                    <div className="grid grid-cols-3 gap-1.5">
                        {photos.map((p) => (
                            <PhotoFill key={p.id} photo={p} className="aspect-square rounded-[10px] shadow-[inset_0_0_0_1px_rgba(15,23,42,0.04)]" />
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={() => setExpanded(false)}
                        className="mt-2 text-xs font-semibold text-[#94a3b8] transition-colors hover:text-[#475569]"
                    >
                        접기
                    </button>
                </div>
            ) : (
                cover && (
                    <button
                        type="button"
                        onClick={canExpand ? () => setExpanded(true) : undefined}
                        disabled={!canExpand}
                        className="relative mb-2.5 block aspect-[16/10] w-full overflow-hidden rounded-xl shadow-[inset_0_0_0_1px_rgba(15,23,42,0.04)] disabled:cursor-default"
                    >
                        <PhotoFill photo={cover} className="absolute inset-0 h-full w-full" />
                        {canExpand && (
                            <span className="absolute bottom-2 right-2 rounded-full bg-[rgba(15,23,42,0.7)] px-2.5 py-1 text-xs font-semibold text-white">
                                +{photoCount - 1}장 더보기
                            </span>
                        )}
                    </button>
                )
            )}

            {visit.note && <p className="text-sm leading-relaxed text-[#475569] [word-break:keep-all]">{visit.note}</p>}
        </>
    );
}

function EditBody({ visit, onRequestEditDate, onEditNote, onAddPhotos, onDeletePhoto, onRequestDeleteVisit }: { visit: Visit } & VisitCardHandlers) {
    const fileRef = useRef<HTMLInputElement>(null);

    return (
        <>
            <div className="mb-2.5 flex items-center justify-between gap-2">
                <button
                    type="button"
                    onClick={() => onRequestEditDate(visit.id, visit.visitedOn)}
                    className="flex items-center gap-1 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-2.5 py-1.5 text-sm font-bold tabular-nums text-[#0f172a]"
                >
                    {formatVisitDateLong(visit.visitedOn)}
                    <Icon name="down" size={14} className="text-[#94a3b8]" />
                </button>
                <button
                    type="button"
                    onClick={() => onRequestDeleteVisit(visit.id)}
                    aria-label="방문 삭제"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[#94a3b8] transition-colors hover:bg-[#FEE2E2] hover:text-[#DC2626]"
                >
                    <Icon name="trash" size={18} />
                </button>
            </div>

            <div className="mb-2.5 grid grid-cols-3 gap-1.5">
                {visit.photos.map((p) => (
                    <div key={p.id} className="relative aspect-square">
                        <PhotoFill photo={p} className="h-full w-full rounded-[10px] shadow-[inset_0_0_0_1px_rgba(15,23,42,0.04)]" />
                        <button
                            type="button"
                            onClick={() => onDeletePhoto(p.id)}
                            aria-label="사진 삭제"
                            className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#DC2626] text-white shadow"
                        >
                            <Icon name="x" size={13} stroke={2.5} />
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex aspect-square flex-col items-center justify-center gap-1 rounded-[10px] border border-dashed border-[#cbd5e1] text-[#94a3b8] transition-colors hover:bg-[#f8fafc]"
                >
                    <Icon name="plus" size={20} stroke={2} />
                    <span className="text-[11px] font-medium">사진 추가</span>
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) onAddPhotos(visit.id, Array.from(e.target.files));
                            e.target.value = '';
                        }}
                    />
                </button>
            </div>

            <textarea
                key={visit.note ?? ''}
                defaultValue={visit.note ?? ''}
                onBlur={(e) => onEditNote(visit.id, e.target.value)}
                placeholder="이 날의 메모"
                rows={2}
                className="w-full resize-none rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-3 py-2 text-sm leading-relaxed text-[#475569] outline-none placeholder:text-[#94a3b8]"
            />
        </>
    );
}
