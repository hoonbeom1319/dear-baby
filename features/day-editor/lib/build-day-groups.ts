import { centroid, clusterByProximity, readExif } from '@/shared/lib';

import type { AnalyzedPhoto, DayAnalysis, DayPlaceGroup } from './types';

// 같은 '장소'로 볼 근접 반경. EXIF GPS 오차(±수십m)와 한 장소 내 이동을 흡수하되,
// 인접한 다른 장소(옆 건물)와는 갈라질 만한 값. 셀프 베타에서 조정 여지.
const PROXIMITY_RADIUS_M = 150;

/**
 * 고른 사진 파일들을 읽어 편집기 초기 상태(장소 그룹 + 미분류)를 만든다. (PRD F-2/F-3)
 * 네트워크(카카오 후보)는 여기서 붙이지 않는다 — 순수 분석만. 후보는 use-analyze-photos가 붙인다.
 */
export async function buildDayGroups(files: File[]): Promise<DayAnalysis> {
    const analyzed: AnalyzedPhoto[] = await Promise.all(
        files.map(async (file) => {
            const { gps, takenAt } = await readExif(file);
            return { file, gps, takenAt };
        }),
    );

    const located = analyzed.filter((p) => p.gps !== null);
    const unsorted = analyzed.filter((p) => p.gps === null);

    // 클러스터링은 좌표만 보므로 사진을 함께 실어 보낸다(묶인 뒤 원본 사진 복원용).
    const clusters = clusterByProximity(
        located.map((p) => ({ lat: p.gps!.lat, lng: p.gps!.lng, photo: p })),
        PROXIMITY_RADIUS_M,
    );

    const groups: DayPlaceGroup[] = clusters.map((cluster, i) => {
        const photos = cluster.map((c) => c.photo);
        return {
            id: `g${i}`,
            photos: sortByTime(photos),
            center: centroid(cluster),
            visitedOn: representativeDate(photos),
            candidates: [],
        };
    });

    // 동선 순서 — 가장 이른 촬영시각 기준. 시각 없는 그룹은 뒤로.
    groups.sort((a, b) => earliestTime(a.photos) - earliestTime(b.photos));

    return {
        groups,
        unsorted: sortByTime(unsorted),
        date: mostCommon(groups.map((g) => g.visitedOn)),
    };
}

const time = (p: AnalyzedPhoto): number => p.takenAt?.getTime() ?? Number.POSITIVE_INFINITY;

const sortByTime = (photos: AnalyzedPhoto[]): AnalyzedPhoto[] => [...photos].sort((a, b) => time(a) - time(b));

const earliestTime = (photos: AnalyzedPhoto[]): number => Math.min(...photos.map(time));

const pad = (n: number): string => String(n).padStart(2, '0');

/** 로컬 타임존 기준 YYYY-MM-DD (방문 날짜는 사용자가 사는 곳의 '그 날'이어야 함) */
const toLocalDate = (d: Date): string => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** 그룹 내 사진 촬영일의 최빈값 — 자정 전후로 날짜가 갈리는 경우 다수결로 '그 날'을 정한다 */
function representativeDate(photos: AnalyzedPhoto[]): string | null {
    return mostCommon(photos.map((p) => (p.takenAt ? toLocalDate(p.takenAt) : null)));
}

/** null 제외 최빈값. 동률이면 먼저 등장한 값. 전부 null이면 null */
function mostCommon(values: (string | null)[]): string | null {
    const counts = new Map<string, number>();
    for (const v of values) {
        if (v === null) continue;
        counts.set(v, (counts.get(v) ?? 0) + 1);
    }
    let best: string | null = null;
    let bestCount = 0;
    for (const [value, count] of counts) {
        if (count > bestCount) {
            best = value;
            bestCount = count;
        }
    }
    return best;
}
