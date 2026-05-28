import type { ReactNode } from 'react';

import { fetchAllPlaces } from '@/server/controllers/places';

import { PlacesStoreProvider } from './store-provider';

export const PlacesProvider = async ({ children }: { children: ReactNode }) => {
    const allPlaces = await fetchAllPlaces();

    return <PlacesStoreProvider data={{ allPlaces, area: 'songpa' }}>{children}</PlacesStoreProvider>;
};
