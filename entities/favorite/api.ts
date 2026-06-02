import { getAuthHeaders } from '@/shared/api';

import { FETCH } from '@/hbw/api';

export type GetFavoritesResponse = { ok: true; ids: string[] };
export type MutateFavoriteResponse = { ok: true };

export const GetFavorites = async (): Promise<GetFavoritesResponse> => {
    const headers = await getAuthHeaders();
    return FETCH<GetFavoritesResponse>('/api/favorite', { headers });
};

export const AddFavorite = async (placeId: string): Promise<MutateFavoriteResponse> => {
    const headers = await getAuthHeaders();
    return FETCH<MutateFavoriteResponse>('/api/favorite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ placeId })
    });
};

export const RemoveFavorite = async (placeId: string): Promise<MutateFavoriteResponse> => {
    const headers = await getAuthHeaders();
    return FETCH<MutateFavoriteResponse>('/api/favorite', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ placeId })
    });
};
