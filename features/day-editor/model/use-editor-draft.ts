import { useCallback, useEffect, useRef, useState } from 'react';

import type { PlaceSource } from '@/entities/place';

import type { PlaceCandidate } from '@/shared/kakao-map';

import type { DayAnalysis } from '../lib/types';

/** 편집기 안에서 다루는 사진 한 장 — 썸네일 objectURL을 들고 있다. */
export type EditorPhoto = {
    id: string;
    file: File;
    url: string;
    takenAt: Date | null;
};

/** 편집기 카드 1개 = 저장 시 Place 1 + Visit 1 후보 */
export type EditorGroup = {
    id: string;
    /** 인라인 편집되는 장소명. 비어 있으면 저장 대상에서 빠진다. */
    name: string;
    /** 좌표→장소명 후보(사용자가 고른다). 비어 있을 수 있음. */
    candidates: PlaceCandidate[];
    source: PlaceSource;
    lat: number;
    lng: number;
    kakaoPlaceId: string | null;
    /** 방문 날짜 YYYY-MM-DD. 촬영시각이 전혀 없으면 null — 저장 전 사용자가 지정해야 한다. */
    visitedOn: string | null;
    note: string;
    photos: EditorPhoto[];
};

export type EditorDraft = {
    groups: EditorGroup[];
    unassigned: EditorPhoto[];
};

/** 새 장소를 만들 때 필요한 좌표·출처 정보 (장소 추가 시트가 채운다) */
export type NewGroupSeed = {
    name: string;
    source: PlaceSource;
    lat: number;
    lng: number;
    kakaoPlaceId: string | null;
};

let photoSeq = 0;
const nextPhotoId = () => `ep${photoSeq++}`;
let groupSeq = 0;
const nextGroupId = () => `eg${groupSeq++}`;

const sourceOf = (candidate: PlaceCandidate): PlaceSource => (candidate.kind === 'poi' ? 'kakao' : 'manual');

/** 기존 그룹들의 최빈 방문일 — 새 장소를 추가할 때 같은 날 기본값으로 쓴다. */
function mostCommonVisitedOn(groups: EditorGroup[]): string | null {
    const counts = new Map<string, number>();
    for (const g of groups) if (g.visitedOn) counts.set(g.visitedOn, (counts.get(g.visitedOn) ?? 0) + 1);
    let best: string | null = null;
    let bestCount = 0;
    for (const [date, count] of counts) {
        if (count > bestCount) {
            best = date;
            bestCount = count;
        }
    }
    return best;
}

function seedFromAnalysis(analysis: DayAnalysis | null): EditorDraft {
    if (!analysis) return { groups: [], unassigned: [] };

    const toPhotos = (photos: DayAnalysis['unsorted']): EditorPhoto[] =>
        photos.map((p) => ({ id: nextPhotoId(), file: p.file, url: URL.createObjectURL(p.file), takenAt: p.takenAt }));

    const groups: EditorGroup[] = analysis.groups.map((g) => {
        const chosen = g.candidates[0] ?? null; // 첫 제안 = 상위 후보(확정 아님, 사용자가 바꿀 수 있음)
        return {
            id: nextGroupId(),
            name: chosen?.name ?? '',
            candidates: g.candidates,
            source: chosen ? sourceOf(chosen) : 'manual',
            lat: chosen?.lat ?? g.center.lat,
            lng: chosen?.lng ?? g.center.lng,
            kakaoPlaceId: chosen?.kakaoPlaceId ?? null,
            visitedOn: g.visitedOn,
            note: '',
            photos: toPhotos(g.photos)
        };
    });

    return { groups, unassigned: toPhotos(analysis.unsorted) };
}

/**
 * A-3 편집기의 편집 상태 — 자동 분석 결과를 "이미 채워진 상태"로 받아 그 위에서 편집한다(PRD F-4).
 * `ready`가 처음 true가 될 때 한 번 시드한다(분석이 끝났거나, 사진 없는 F-5 진입).
 * 시드 이후 분석 변동은 무시한다 — 사용자가 편집을 시작했을 수 있으므로.
 */
export function useEditorDraft(analysis: DayAnalysis | null, ready: boolean) {
    const [draft, setDraft] = useState<EditorDraft>({ groups: [], unassigned: [] });
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const seeded = useRef(false);

    useEffect(() => {
        if (seeded.current || !ready) return;
        seeded.current = true;
        // 분석이 끝난 뒤(비동기 도착) 단 한 번 시드한다. 시드는 objectURL을 만드는 부수효과라
        // 렌더가 아닌 effect(커밋 단계)에 두는 게 맞다 — 가드로 1회만 실행돼 cascading도 없다.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDraft(seedFromAnalysis(analysis));
    }, [ready, analysis]);

    // 언마운트 시 모든 썸네일 objectURL 해제
    const draftRef = useRef(draft);
    useEffect(() => {
        draftRef.current = draft;
    }, [draft]);
    useEffect(
        () => () => {
            const d = draftRef.current;
            [...d.groups.flatMap((g) => g.photos), ...d.unassigned].forEach((p) => URL.revokeObjectURL(p.url));
        },
        []
    );

    // ── 사진 선택 ─────────────────────────────────────────────
    const togglePhoto = useCallback((id: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }, []);

    const clearSelection = useCallback(() => setSelected(new Set()), []);

    /** 선택된 사진을 모든 컨테이너(미분류+그룹들)에서 빼낸다. */
    const pullSelected = useCallback((d: EditorDraft, ids: Set<string>) => {
        const pulled: EditorPhoto[] = [];
        const keep = (p: EditorPhoto) => {
            if (ids.has(p.id)) {
                pulled.push(p);
                return false;
            }
            return true;
        };
        const groups = d.groups.map((g) => ({ ...g, photos: g.photos.filter(keep) }));
        const unassigned = d.unassigned.filter(keep);
        return { pulled, groups, unassigned };
    }, []);

    const moveSelectedTo = useCallback(
        (groupId: string) => {
            setDraft((d) => {
                const { pulled, groups, unassigned } = pullSelected(d, selected);
                return { ...d, unassigned, groups: groups.map((g) => (g.id === groupId ? { ...g, photos: [...g.photos, ...pulled] } : g)) };
            });
            clearSelection();
        },
        [selected, pullSelected, clearSelection]
    );

    const unassignSelected = useCallback(() => {
        setDraft((d) => {
            const { pulled, groups, unassigned } = pullSelected(d, selected);
            return { ...d, groups, unassigned: [...unassigned, ...pulled] };
        });
        clearSelection();
    }, [selected, pullSelected, clearSelection]);

    /** 새 그룹 생성. pullCurrentSelection=true면 선택된 사진을 끌어와 담는다(이동 시트 "새 장소"). */
    const addGroup = useCallback(
        (seed: NewGroupSeed, pullCurrentSelection = false) => {
            setDraft((d) => {
                const base = pullCurrentSelection ? pullSelected(d, selected) : { pulled: [], groups: d.groups, unassigned: d.unassigned };
                const group: EditorGroup = {
                    id: nextGroupId(),
                    name: seed.name,
                    candidates: [],
                    source: seed.source,
                    lat: seed.lat,
                    lng: seed.lng,
                    kakaoPlaceId: seed.kakaoPlaceId,
                    visitedOn: mostCommonVisitedOn(d.groups), // 새 장소는 그날 기본값으로 — 다르면 카드에서 바꾼다
                    note: '',
                    photos: base.pulled
                };
                return { ...d, groups: [...base.groups, group], unassigned: base.unassigned };
            });
            clearSelection();
        },
        [selected, pullSelected, clearSelection]
    );

    const deleteGroup = useCallback((groupId: string) => {
        setDraft((d) => {
            const target = d.groups.find((g) => g.id === groupId);
            return {
                ...d,
                groups: d.groups.filter((g) => g.id !== groupId),
                unassigned: target ? [...d.unassigned, ...target.photos] : d.unassigned // 삭제된 장소의 사진은 미분류로
            };
        });
    }, []);

    /** 후보 선택 — 이름·출처·좌표·kakaoId를 후보에서 채운다. */
    const chooseCandidate = useCallback((groupId: string, candidate: PlaceCandidate) => {
        setDraft((d) => ({
            ...d,
            groups: d.groups.map((g) =>
                g.id === groupId
                    ? { ...g, name: candidate.name, source: sourceOf(candidate), lat: candidate.lat, lng: candidate.lng, kakaoPlaceId: candidate.kakaoPlaceId }
                    : g
            )
        }));
    }, []);

    /** 자유 입력 이름. 후보와 어긋나면 kakao 연결을 끊고 'manual'로 본다(사용자가 붙인 라벨). */
    const renameGroup = useCallback((groupId: string, name: string) => {
        setDraft((d) => ({
            ...d,
            groups: d.groups.map((g) => {
                if (g.id !== groupId) return g;
                const matchesChosen = g.candidates.some((c) => c.name === name && c.kakaoPlaceId === g.kakaoPlaceId);
                return matchesChosen ? { ...g, name } : { ...g, name, source: 'manual', kakaoPlaceId: null };
            })
        }));
    }, []);

    const setNote = useCallback((groupId: string, note: string) => {
        setDraft((d) => ({ ...d, groups: d.groups.map((g) => (g.id === groupId ? { ...g, note } : g)) }));
    }, []);

    const setGroupCoord = useCallback((groupId: string, lat: number, lng: number) => {
        setDraft((d) => ({
            ...d,
            groups: d.groups.map((g) => (g.id === groupId ? { ...g, lat, lng, source: 'manual', kakaoPlaceId: null } : g))
        }));
    }, []);

    const setGroupDate = useCallback((groupId: string, visitedOn: string) => {
        setDraft((d) => ({ ...d, groups: d.groups.map((g) => (g.id === groupId ? { ...g, visitedOn } : g)) }));
    }, []);

    return {
        draft,
        selected,
        togglePhoto,
        clearSelection,
        moveSelectedTo,
        unassignSelected,
        addGroup,
        deleteGroup,
        chooseCandidate,
        renameGroup,
        setNote,
        setGroupCoord,
        setGroupDate
    };
}
