const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

/**
 * "YYYY-MM-DD"의 요일. ISO 문자열을 직접 Date 파싱하면 UTC로 해석돼 요일이 밀릴 수 있어,
 * 연·월·일을 분해해 로컬 기준으로 계산한다.
 */
function weekdayOf(iso: string): string | null {
    const [y, m, d] = iso.split('-').map(Number);
    if (!y || !m || !d) return null;
    return WEEKDAYS[new Date(y, m - 1, d).getDay()];
}

/** "10/12 · 토요일" — 날짜 칩·날짜 시트(짧은 형식). null이면 "날짜 선택". */
export function formatVisitDateShort(iso: string | null): string {
    if (!iso) return '날짜 선택';
    const weekday = weekdayOf(iso);
    if (!weekday) return '날짜 선택';
    const [, m, d] = iso.split('-').map(Number);
    return `${m}/${d} · ${weekday}요일`;
}

/** "2025-10-12 · 토요일" — 장소 상세 타임라인(전체 형식). */
export function formatVisitDateLong(iso: string): string {
    const weekday = weekdayOf(iso);
    if (!weekday) return iso;
    return `${iso} · ${weekday}요일`;
}
