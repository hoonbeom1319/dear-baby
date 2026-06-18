import { useEffect, useState } from 'react';

import { suggestPlaceCandidates } from '@/shared/kakao-map';

import { buildDayGroups } from '../lib/build-day-groups';
import type { DayAnalysis } from '../lib/types';

export type AnalyzeStatus =
    | 'idle' // 아직 사진 없음
    | 'reading' // EXIF 읽고 그룹핑 중
    | 'locating' // 그룹별 카카오 장소 후보 조회 중 (그룹은 이미 화면에 보임)
    | 'done'
    | 'error';

export type UseAnalyzePhotosResult = {
    analysis: DayAnalysis | null;
    status: AnalyzeStatus;
};

/**
 * 고른 사진들을 편집기 초기 상태로 분석한다. (A-3 진입점, PRD F-2/F-3)
 * 2단계로 노출한다: ① EXIF·그룹핑이 끝나면 후보 없이 먼저 보여주고(reading→locating),
 * ② 카카오 장소 후보가 도착하면 그룹을 채운다. 지친 부모를 빈 화면에 묶어두지 않기 위함.
 *
 * `files`는 호출부에서 메모이즈해 넘긴다(매 렌더 새 배열이면 재분석된다).
 */
export function useAnalyzePhotos(files: File[] | null): UseAnalyzePhotosResult {
    const [analysis, setAnalysis] = useState<DayAnalysis | null>(null);
    const [status, setStatus] = useState<AnalyzeStatus>('idle');

    useEffect(() => {
        if (!files || files.length === 0) return;

        let cancelled = false;
        (async () => {
            try {
                setStatus('reading');
                const base = await buildDayGroups(files);
                if (cancelled) return;
                setAnalysis(base); // 후보 붙기 전이라도 그룹·미분류를 먼저 띄운다

                setStatus('locating');
                const groups = await Promise.all(
                    base.groups.map(async (group) => ({
                        ...group,
                        candidates: await suggestPlaceCandidates(group.center).catch(() => []),
                    })),
                );
                if (cancelled) return;
                setAnalysis({ ...base, groups });
                setStatus('done');
            } catch {
                if (!cancelled) setStatus('error');
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [files]);

    // 사진이 없으면 저장된(직전) 분석을 무시하고 idle로 — 빈 입력 상태는 파생값이라 effect에서 set하지 않는다
    if (!files || files.length === 0) return { analysis: null, status: 'idle' };

    return { analysis, status };
}
