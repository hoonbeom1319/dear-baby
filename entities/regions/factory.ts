import { queryOptions } from '@tanstack/react-query';

import { GetRegions } from './api';

export const regionsQueries = {
    all: () => ['regions'] as const,
    list: () => queryOptions({ queryKey: [...regionsQueries.all(), 'list'], queryFn: () => GetRegions() })
};
