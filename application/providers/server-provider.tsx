import type { ReactNode } from 'react';

import { fetchAmenities, fetchAreas, fetchCategories, fetchRegions } from '@/server/controllers/catalog';
import { fetchAllPlaces } from '@/server/controllers/places';

import { InstallPrompt } from '@/features/install-prompt';

import { NavigationProgress } from '@/shared/ui';

import { CatalogStoreProvider } from './catalog/store-provider';
import { PlacesStoreProvider } from './places/store-provider';

export const ServerProvider = async ({ children }: { children: ReactNode }) => {
    const [allPlaces, regions, areas, categories, amenities] = await Promise.all([
        fetchAllPlaces(),
        fetchRegions(),
        fetchAreas(),
        fetchCategories(),
        fetchAmenities()
    ]);

    return (
        <>
            <PlacesStoreProvider data={{ allPlaces, area: 'songpa' }}>
                <CatalogStoreProvider data={{ regions, areas, categories, amenities }}>{children}</CatalogStoreProvider>
            </PlacesStoreProvider>
            <NavigationProgress />
            <InstallPrompt />
        </>
    );
};
