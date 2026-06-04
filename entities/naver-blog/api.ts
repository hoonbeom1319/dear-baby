import { FETCH } from '@/hbw/api';

import type { NaverBlogPost } from './model/types';

export type GetNaverBlogResponse = {
    items: NaverBlogPost[];
    total?: number;
    start?: number;
    display?: number;
};

export const GetNaverBlog = (query: string) => {
    const search = new URLSearchParams({ query });
    return FETCH<GetNaverBlogResponse>(`/api/naver/blog?${search}`);
};
