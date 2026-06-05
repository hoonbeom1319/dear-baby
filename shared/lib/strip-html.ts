/** HTML 태그 제거 — 네이버/카카오 검색 API가 매칭어 강조용으로 끼워 넣는 <b> 등을 걷어낸다. */
export function stripHtml(html: string): string {
    return html.replace(/<[^>]+>/g, '');
}
