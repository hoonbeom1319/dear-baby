import { queryOptions } from '@tanstack/react-query';

import { GetNaverBlog } from './api';

export const naverBlogQueries = {
    all: () => ['naver-blog'] as const,
    search: (query: string) =>
        queryOptions({
            queryKey: [...naverBlogQueries.all(), 'search', query],
            queryFn: () => GetNaverBlog(query),
            enabled: query.trim().length > 0
        })
};
