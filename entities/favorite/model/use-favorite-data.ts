import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { favoriteMutations, favoriteQueries } from '../factory';

export function useFavoriteData(userId: string | null) {
    const queryClient = useQueryClient();

    const query = useQuery(favoriteQueries.byUser(userId));
    const add = useMutation(favoriteMutations.add(userId, queryClient));
    const remove = useMutation(favoriteMutations.remove(userId, queryClient));

    return {
        favoriteIds: query.data?.ids ?? [],
        add,
        remove
    };
}
