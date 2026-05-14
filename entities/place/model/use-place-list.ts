import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import { GetPlacesParams } from '../api';
import { placeQueries } from '../factory';

type UsePlaceListOptions = {
    enabled?: boolean;
};

export const usePlaceList = (params: GetPlacesParams = {}, options: UsePlaceListOptions = {}) => {
    const { data, isPending, isError, error } = useQuery({
        ...placeQueries.list(params),
        enabled: options.enabled ?? true
    });

    const list = useMemo(() => data?.items ?? [], [data?.items]);
    const nextCursor = data?.nextCursor ?? null;

    return { list, nextCursor, isPending, isError, error };
};
