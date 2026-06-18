import type { PlaceSummary } from '@/entities/place';

// 디자인 핸드오프 §2 A-1/B-1: map-pin 44px, fill primary, stroke 흰 1.5, drop-shadow.
// 핀 중앙 위쪽에 방문 횟수(12/700/흰/tabular-nums). 신규 핀은 뒤에 펄스 링(db-ring).
const PIN_PRIMARY = 'oklch(64.6% 0.222 41.116)'; // primary 기본

/**
 * 카카오 CustomOverlay에 얹을 핀 DOM을 만든다.
 * 오버레이는 raw DOM이라 React/Tailwind 대신 직접 엘리먼트를 조립한다.
 * 클릭은 엘리먼트에 직접 바인딩한다(CustomOverlay clickable:true 필요).
 */
export function createPinElement(place: PlaceSummary, opts: { isNew: boolean; onClick: () => void }): HTMLElement {
    const root = document.createElement('div');
    root.style.position = 'relative';
    root.style.width = '44px';
    root.style.height = '44px';
    root.style.cursor = 'pointer';

    if (opts.isNew) {
        const ring = document.createElement('span');
        ring.className = 'db-ring';
        ring.style.cssText = [
            'position:absolute',
            'left:50%',
            'top:38%', // 핀 머리(원) 중심에 맞춤
            'width:40px',
            'height:40px',
            'border-radius:9999px',
            `background:${PIN_PRIMARY}`,
            'pointer-events:none',
            'z-index:0'
        ].join(';');
        root.appendChild(ring);
    }

    const pin = document.createElement('div');
    pin.style.position = 'relative';
    pin.style.zIndex = '1';
    pin.style.filter = 'drop-shadow(0 4px 5px rgba(15,23,42,0.28))';
    pin.innerHTML = `<svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22s8-7.58 8-13a8 8 0 0 0-16 0c0 5.42 8 13 8 13Z" fill="${PIN_PRIMARY}" stroke="white" stroke-width="1.5" stroke-linejoin="round"/></svg>`;
    root.appendChild(pin);

    const count = document.createElement('span');
    count.textContent = String(place.visitCount);
    count.style.cssText = [
        'position:absolute',
        'left:0',
        'top:11px', // 핀 머리 원의 중앙
        'width:44px',
        'text-align:center',
        'color:white',
        'font-size:12px',
        'font-weight:700',
        'font-variant-numeric:tabular-nums',
        'line-height:1',
        'pointer-events:none',
        'z-index:2'
    ].join(';');
    root.appendChild(count);

    root.addEventListener('click', opts.onClick);
    return root;
}
