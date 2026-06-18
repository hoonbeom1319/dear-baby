import { haversineMeters, type GeoPoint } from './distance';

/**
 * 좌표 근접 단일연결(single-linkage) 클러스터링.
 * 반경 radiusM 안에서 서로 이어지는 점들을 한 그룹으로 묶는다(전이적).
 * 같은 장소의 사진은 빽빽이 모이고 다른 장소는 멀리 떨어지므로, 장소 그룹핑에 적합하다.
 * 입력 순서를 보존한 그룹들의 배열을 돌려준다.
 */
export function clusterByProximity<T extends GeoPoint>(points: T[], radiusM: number): T[][] {
    const n = points.length;
    const parent = Array.from({ length: n }, (_, i) => i);

    const find = (x: number): number => {
        let root = x;
        while (parent[root] !== root) root = parent[root];
        while (parent[x] !== root) {
            const next = parent[x];
            parent[x] = root;
            x = next;
        }
        return root;
    };
    const union = (a: number, b: number): void => {
        const ra = find(a);
        const rb = find(b);
        if (ra !== rb) parent[ra] = rb;
    };

    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            if (haversineMeters(points[i], points[j]) <= radiusM) union(i, j);
        }
    }

    const groups = new Map<number, T[]>();
    for (let i = 0; i < n; i++) {
        const root = find(i);
        const g = groups.get(root);
        if (g) g.push(points[i]);
        else groups.set(root, [points[i]]);
    }
    return [...groups.values()];
}
