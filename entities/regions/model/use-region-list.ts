import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import { regionsQueries } from '../factory';

export const useRegionList = () => {
    const { data, isPending, isError, error } = useQuery(regionsQueries.list());

    const list = useMemo(() => data?.data?.items ?? [], [data?.data?.items]);

    return { list, isPending, isError, error };
};
