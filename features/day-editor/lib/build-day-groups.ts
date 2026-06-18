import { centroid, clusterByProximity, readExif } from '@/shared/lib';

import type { AnalyzedPhoto, DayAnalysis, DayPlaceGroup } from './types';

// 같은 '장소'로 볼 근접 반경. EXIF GPS 오차(±수십m)와 한 장소 내 이동을 흡수하되,
// 인접한 다른 장소(옆 건물)와는 갈라질 만한 값. 셀프 베타에서 조정 여지.
const PROXIMITY_RADIUS_M = 150;

// 하루치로 수백 장을 고를 수 있어, EXIF 파싱을 한꺼번에 띄우지 않고 배치로 제한한다(메인 스레드·메모리 스파이크 방지).
const EXIF_CONCURRENCY = 8;

/**
 * 고른 사진 파일들을 읽어 편집기 초기 상태(장소 그룹 + 미분류)를 만든다. (PRD F-2/F-3)
 * 위치(GPS)로 묶은 뒤 **날짜별로 다시 쪼갠다** — 같은 장소라도 다른 날 방문이면 별도 그룹(=별도 방문).
 * 네트워크(카카오 후보)는 여기서 붙이지 않는다 — 순수 분석만. 후보는 use-analyze-photos가 붙인다.
 */
export async function buildDayGroups(files: File[]): Promise<DayAnalysis> {
    // 입력 순서를 유지하며 EXIF_CONCURRENCY개씩 끊어 파싱한다(아래 클러스터링은 순서 무관하지만 sortByTime이 안정적이도록).
    const analyzed: AnalyzedPhoto[] = [];
    for (let i = 0; i < files.length; i += EXIF_CONCURRENCY) {
        const batch = await Promise.all(
            files.slice(i, i + EXIF_CONCURRENCY).map(async (file) => {
                const { gps, takenAt } = await readExif(file);
                return { file, gps, takenAt };
            })
        );
        analyzed.push(...batch);
    }

    const located = analyzed.filter((p) => p.gps !== null);
    const unsorted = analyzed.filter((p) => p.gps === null);

    // 클러스터링은 좌표만 보므로 사진을 함께 실어 보낸다(묶인 뒤 원본 사진 복원용).
    const clusters = clusterByProximity(
        located.map((p) => ({ lat: p.gps!.lat, lng: p.gps!.lng, photo: p })),
        PROXIMITY_RADIUS_M
    );

    const groups: DayPlaceGroup[] = [];
    for (const cluster of clusters) {
        const center = centroid(cluster);
        const photos = cluster.map((c) => c.photo);

        // 같은 위치를 촬영일(로컬)별로 분리한다.
        const byDate = new Map<string, AnalyzedPhoto[]>();
        const undated: AnalyzedPhoto[] = [];
        for (const p of photos) {
            const date = p.takenAt ? toLocalDate(p.takenAt) : null;
            if (!date) {
                undated.push(p);
                continue;
            }
            const bucket = byDate.get(date);
            if (bucket) bucket.push(p);
            else byDate.set(date, [p]);
        }
        // 촬영시각 없는 사진: 이 위치에 날짜 그룹이 하나뿐이면 그 날로 흡수, 여러 날이면 '날짜 미정' 그룹으로 둔다.
        if (undated.length > 0 && byDate.size === 1) {
            const [only] = [...byDate.values()];
            only.push(...undated);
            undated.length = 0;
        }
        for (const [date, ps] of byDate) {
            groups.push({ id: '', photos: sortByTime(ps), center, visitedOn: date, candidates: [] });
        }
        if (undated.length > 0) {
            groups.push({ id: '', photos: sortByTime(undated), center, visitedOn: null, candidates: [] });
        }
    }

    // 동선 순서 — 가장 이른 촬영시각 기준. 시각 없는 그룹은 뒤로. id는 정렬 후 부여한다.
    groups.sort((a, b) => earliestTime(a.photos) - earliestTime(b.photos));
    groups.forEach((g, i) => {
        g.id = `g${i}`;
    });

    return { groups, unsorted: sortByTime(unsorted) };
}

const time = (p: AnalyzedPhoto): number => p.takenAt?.getTime() ?? Number.POSITIVE_INFINITY;

const sortByTime = (photos: AnalyzedPhoto[]): AnalyzedPhoto[] => [...photos].sort((a, b) => time(a) - time(b));

const earliestTime = (photos: AnalyzedPhoto[]): number => Math.min(...photos.map(time));

const pad = (n: number): string => String(n).padStart(2, '0');

/** 로컬 타임존 기준 YYYY-MM-DD (방문 날짜는 사용자가 사는 곳의 '그 날'이어야 함) */
const toLocalDate = (d: Date): string => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
