import type { ReactNode } from 'react';

import { fetchAmenities, fetchAreas, fetchCategories, fetchRegions } from '@/server/controllers/catalog';

import { CatalogStoreProvider } from './store-provider';

export const CatalogProvider = async ({ children }: { children: ReactNode }) => {
    const [regions, areas, categories, amenities] = await Promise.all([fetchRegions(), fetchAreas(), fetchCategories(), fetchAmenities()]);

    return <CatalogStoreProvider data={{ regions, areas, categories, amenities }}>{children}</CatalogStoreProvider>;
};
