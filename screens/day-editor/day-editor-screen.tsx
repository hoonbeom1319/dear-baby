'use client';

import { useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import { useAuth } from '@/application/providers';

import { DayEditor, buildRecordInput, useAnalyzePhotos, useRecordDraft, useSavedResult } from '@/features/day-editor';

import { useCreateRecordData } from '@/entities/place';

import { toast } from '@/shared/lib';

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

    // 날짜 후보 — 그룹별 방문일 + 전체 대표일에서 중복 없이 모은다.
    const dateOptions = useMemo(() => {
        const dates = [analysis?.date, ...(analysis?.groups ?? []).map((g) => g.visitedOn)].filter((d): d is string => Boolean(d));
        return [...new Set(dates)].sort();
    }, [analysis]);

    const handleSave: Parameters<typeof DayEditor>[0]['onSave'] = async (savable, date) => {
        if (saving || !date) return;
        if (!userId) {
            toast('로그인이 필요해요');
            return;
        }
        setSaving(true);
        try {
            const groups = await buildRecordInput(userId, savable, date);
            const { placeIds } = await createRecord.mutateAsync(groups);
            setSavedResult({ placeIds, placeNames: savable.map((g) => g.name.trim()), date });
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
            onBack={() => router.push('/record')}
            onSave={handleSave}
            saving={saving}
        />
    );
}
