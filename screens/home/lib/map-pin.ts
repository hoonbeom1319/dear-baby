import type { PlaceSummary } from '@/entities/place';

// 디자인 핸드오프(Family Memory Map): 큰 물방울 핀 → 작은 원형 도트 마커 + 방문 강도 히트맵.
// 강도 t = 방문수 / maxVisits(하한 2). 도트·히트 블롭 모두 t로 색·크기가 커진다.

/** t에 따른 도트 배경색 (방문 많을수록 진한 적색). */
function dotFill(t: number): string {
    if (t > 0.62) return 'oklch(52% 0.2 34)';
    if (t > 0.3) return 'oklch(60% 0.21 40)';
    return 'oklch(68% 0.2 47)';
}

/**
 * 카카오 CustomOverlay에 얹을 도트 마커 DOM. 좌표 중앙 정렬(xAnchor/yAnchor 0.5).
 * 방문 횟수를 흰 숫자로 표시하고, 신규 저장 핀은 뒤에 펄스 링을 단다.
 */
export function createDotElement(place: PlaceSummary, opts: { t: number; isNew: boolean; onClick: () => void }): HTMLElement {
    const size = Math.round(24 + opts.t * 9); // 24~33px
    const fontSize = Math.round(11 + opts.t * 2); // 11~13px

    const root = document.createElement('div');
    root.style.cssText = 'position:relative;display:flex;align-items:center;justify-content:center;cursor:pointer;';

    if (opts.isNew) {
        const ring = document.createElement('span');
        ring.className = 'db-ring';
        ring.style.cssText = [
            'position:absolute',
            'left:50%',
            'top:50%',
            'width:36px',
            'height:36px',
            'border-radius:9999px',
            'background:oklch(70.5% 0.213 47.604)',
            'pointer-events:none',
            'z-index:0'
        ].join(';');
        root.appendChild(ring);
    }

    const dot = document.createElement('div');
    dot.style.cssText = [
        'position:relative',
        'z-index:1',
        `width:${size}px`,
        `height:${size}px`,
        'border-radius:9999px',
        `background:${dotFill(opts.t)}`,
        'box-shadow:0 2px 5px rgba(15,23,42,0.3), 0 0 0 2px #fff',
        'display:flex',
        'align-items:center',
        'justify-content:center'
    ].join(';');

    const count = document.createElement('span');
    count.textContent = String(place.visitCount);
    count.style.cssText = [
        'color:white',
        `font-size:${fontSize}px`,
        'font-weight:700',
        'font-variant-numeric:tabular-nums',
        'line-height:1'
    ].join(';');
    dot.appendChild(count);
    root.appendChild(dot);

    root.addEventListener('click', opts.onClick);
    return root;
}

/**
 * 히트맵 블롭 DOM — 마커 아래 레이어. mix-blend-mode:multiply라 겹치는 글로우가 곱연산으로 짙어진다
 * ("자주 가는 동네"가 드러남). 크기·중심 불투명도가 방문수(t)에 비례한다.
 */
export function createHeatBlob(t: number): HTMLElement {
    const size = Math.round(92 + t * 138); // 92~230px
    const i = 0.55 + t * 0.45;
    const bg = `radial-gradient(circle, oklch(60% 0.21 38 / ${(0.32 * i).toFixed(3)}) 0%, oklch(68% 0.2 46 / ${(0.18 * i).toFixed(3)}) 42%, oklch(74% 0.17 52 / 0) 72%)`;

    const el = document.createElement('div');
    el.style.cssText = `width:${size}px;height:${size}px;border-radius:9999px;background:${bg};mix-blend-mode:multiply;pointer-events:none;`;
    return el;
}
