import { buildNaverBlogReviewQuery } from '../lib/build-review-query';
import { useNaverBlogData } from './use-naver-blog-data';
import type { NaverBlogPost } from './types';

export function useNaverBlog(placeName: string | null): { posts: NaverBlogPost[]; isLoading: boolean } {
    const query = placeName ? buildNaverBlogReviewQuery(placeName) : null;
    const { data, isLoading, isFetching } = useNaverBlogData(query);

    return {
        posts: data?.items ?? [],
        isLoading: isLoading || isFetching
    };
}
