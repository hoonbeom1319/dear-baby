import { deleteFavorite, findFavoritesByUser, insertFavorite } from '../dao/favorites';

export async function fetchFavorites(userId: string): Promise<string[]> {
    return findFavoritesByUser(userId);
}

export async function createFavorite(userId: string, placeId: string): Promise<void> {
    await insertFavorite(userId, placeId);
}

export async function removeFavorite(userId: string, placeId: string): Promise<void> {
    await deleteFavorite(userId, placeId);
}
