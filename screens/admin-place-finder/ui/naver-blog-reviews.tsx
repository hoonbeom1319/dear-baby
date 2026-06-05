import { formatNaverBlogPostDate, type NaverBlogPost } from '@/entities/naver-blog';

import { stripHtml } from '@/shared/lib';

export function NaverBlogReviews({ posts, loading }: { posts: NaverBlogPost[]; loading: boolean }) {
    return (
        <div className="border-b border-border">
            <div className="px-4 py-2 text-[11.5px] font-semibold tracking-widest text-muted uppercase">네이버 블로그 후기</div>
            {loading ? (
                <div className="px-4 pb-4 text-[12.5px] text-muted">불러오는 중…</div>
            ) : posts.length === 0 ? (
                <div className="px-4 pb-4 text-[12.5px] text-muted">후기를 찾을 수 없어요</div>
            ) : (
                <div className="flex flex-col">
                    {posts.map((post, i) => (
                        <a
                            key={i}
                            href={post.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col gap-1 border-b border-border px-4 py-3 transition-colors hover:bg-neutral-50"
                        >
                            <span className="line-clamp-1 text-[13px] font-medium text-surface-foreground">{stripHtml(post.title)}</span>
                            <span className="line-clamp-2 text-[11.5px] text-muted">{stripHtml(post.description)}</span>
                            <span className="text-[11px] text-muted">
                                {post.bloggername} · {formatNaverBlogPostDate(post.postdate)}
                            </span>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
