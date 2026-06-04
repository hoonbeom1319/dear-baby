import { useQuery } from '@tanstack/react-query';

import { naverBlogQueries } from '../factory';

export function useNaverBlogData(query: string | null) {
    const trimmed = query?.trim() ?? '';
    return useQuery(naverBlogQueries.search(trimmed));
}
