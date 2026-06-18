'use client';

import { useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import { useAuth } from '@/application/providers';

import { DayEditor, buildRecordInput, useAnalyzePhotos, useRecordDraft, useSavedResult, type EditorGroup } from '@/features/day-editor';

import { useCreateRecordData } from '@/entities/place';

import { toast } from '@/shared/lib';

/** savable 그룹들의 최빈 방문일 — 저장 완료 화면에 보여줄 대표 날짜(여러 날이 섞이면 가장 많은 날). */
function representativeDate(groups: EditorGroup[]): string {
    const counts = new Map<string, number>();
    for (const g of groups) if (g.visitedOn) counts.set(g.visitedOn, (counts.get(g.visitedOn) ?? 0) + 1);
    let best = groups[0]?.visitedOn ?? '';
    let bestCount = 0;
    for (const [date, count] of counts) {
        if (count > bestCount) {
            best = date;
            bestCount = count;
        }
    }
    return best;
}

/**
 * A-3 편집기 화면 — 기록 드래프트의 사진을 분석해 편집기를 띄우고, 저장(업로드 + 기록 생성)을 처리한다.
 * 분석·편집 UI는 feature가, 데이터 핸드오프·저장·내비게이션은 여기서.
 */
export function DayEditorScreen() {
    const router = useRouter();
    const userId = useAuth((s) => s.userId);
    const files = useRecordDraft((s) => s.files);
    const resetDraft = useRecordDraft((s) => s.reset);
    const setSavedResult = useSavedResult((s) => s.setResult);
    const createRecord = useCreateRecordData(userId);
    const [saving, setSaving] = useState(false);

    const { analysis, status } = useAnalyzePhotos(files.length > 0 ? files : null);
    const hasPhotos = files.length > 0;
    // 사진이 없으면(F-5) 바로 편집 가능. 있으면 분석이 끝나거나 실패한 뒤 시드.
    const ready = !hasPhotos || status === 'done' || status === 'error';

    // 날짜 후보 — 그룹별 방문일에서 중복 없이 모아 날짜 시트에 제안한다.
    const dateOptions = useMemo(() => {
        const dates = (analysis?.groups ?? []).map((g) => g.visitedOn).filter((d): d is string => Boolean(d));
        return [...new Set(dates)].sort();
    }, [analysis]);

    const handleSave: Parameters<typeof DayEditor>[0]['onSave'] = async (savable) => {
        if (saving) return;
        if (!userId) {
            toast('로그인이 필요해요');
            return;
        }
        setSaving(true);
        try {
            const groups = await buildRecordInput(userId, savable);
            const { placeIds } = await createRecord.mutateAsync(groups);
            // 저장 완료 화면 표시용 대표 날짜 — 여러 날이 섞여 있으면 가장 많은 날.
            setSavedResult({ placeIds, placeNames: savable.map((g) => g.name.trim()), date: representativeDate(savable) });
            resetDraft();
            router.replace('/saved');
        } catch {
            toast('저장 중 문제가 생겼어요. 다시 시도해주세요', 'danger');
            setSaving(false);
        }
    };

    return (
        <DayEditor
            analysis={analysis}
            ready={ready}
            hasPhotos={hasPhotos}
            dateOptions={dateOptions}
            onBack={() => router.back()}
            onSave={handleSave}
            saving={saving}
        />
    );
}
