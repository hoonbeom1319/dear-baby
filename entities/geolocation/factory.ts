import { queryOptions } from '@tanstack/react-query';

export const geolocationQueries = {
    all: () => ['geolocation'] as const,
    list: () =>
        queryOptions({
            queryKey: [...geolocationQueries.all(), 'list'],
            queryFn: () => {}
        })
};
