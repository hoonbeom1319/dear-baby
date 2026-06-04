export function formatNaverBlogPostDate(postdate: string): string {
    return `${postdate.slice(0, 4)}.${postdate.slice(4, 6)}.${postdate.slice(6, 8)}`;
}
