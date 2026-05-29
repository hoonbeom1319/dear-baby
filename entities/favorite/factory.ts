import { mutationOptions, queryOptions, type QueryClient } from '@tanstack/react-query';

import { AddFavorite, GetFavorites, RemoveFavorite, type GetFavoritesResponse } from './api';

export const favoriteQueries = {
    all: () => ['favorite'] as const,
    byUser: (userId: string | null) =>
        queryOptions({
            queryKey: [...favoriteQueries.all(), userId],
            queryFn: GetFavorites,
            enabled: !!userId
        })
};

export const favoriteMutations = {
    add: (userId: string | null, queryClient: QueryClient) =>
        mutationOptions({
            mutationFn: AddFavorite,
            onMutate: async (placeId: string) => {
                const { queryKey } = favoriteQueries.byUser(userId);
                await queryClient.cancelQueries({ queryKey });
                const previous = queryClient.getQueryData<GetFavoritesResponse>(queryKey);
                queryClient.setQueryData<GetFavoritesResponse>(queryKey, (old) => ({
                    ok: true,
                    ids: [placeId, ...(old?.ids ?? [])]
                }));
                return { previous };
            },
            onError: (_err, _placeId, context) => {
                const { queryKey } = favoriteQueries.byUser(userId);
                if (context?.previous !== undefined) {
                    queryClient.setQueryData(queryKey, context.previous);
                }
            },
            onSettled: () => {
                queryClient.invalidateQueries({ queryKey: favoriteQueries.byUser(userId).queryKey });
            }
        }),

    remove: (userId: string | null, queryClient: QueryClient) =>
        mutationOptions({
            mutationFn: RemoveFavorite,
            onMutate: async (placeId: string) => {
                const { queryKey } = favoriteQueries.byUser(userId);
                await queryClient.cancelQueries({ queryKey });
                const previous = queryClient.getQueryData<GetFavoritesResponse>(queryKey);
                queryClient.setQueryData<GetFavoritesResponse>(queryKey, (old) => ({
                    ok: true,
                    ids: (old?.ids ?? []).filter((id) => id !== placeId)
                }));
                return { previous };
            },
            onError: (_err, _placeId, context) => {
                const { queryKey } = favoriteQueries.byUser(userId);
                if (context?.previous !== undefined) {
                    queryClient.setQueryData(queryKey, context.previous);
                }
            },
            onSettled: () => {
                queryClient.invalidateQueries({ queryKey: favoriteQueries.byUser(userId).queryKey });
            }
        })
};
