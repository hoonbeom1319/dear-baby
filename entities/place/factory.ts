import { queryOptions } from '@tanstack/react-query';

export const placeQueries = {
    all: () => ['place'] as const,
    list: () =>
        queryOptions({
            queryKey: [...placeQueries.all(), 'list'],
            queryFn: () => {}
        })
};
