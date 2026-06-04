/** 장소명으로 네이버 블로그 후기 검색어 생성 */
export function buildNaverBlogReviewQuery(placeName: string): string {
    return `${placeName.trim()} 아기 후기`;
}
