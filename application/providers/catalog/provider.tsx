import type { ReactNode } from 'react';

import { fetchAmenities, fetchAreas, fetchCategories } from '@/server/controllers/catalog';

import { CatalogStoreProvider } from './store-provider';

export const CatalogProvider = async ({ children }: { children: ReactNode }) => {
    const [areas, categories, amenities] = await Promise.all([fetchAreas(), fetchCategories(), fetchAmenities()]);

    return <CatalogStoreProvider data={{ areas, categories, amenities }}>{children}</CatalogStoreProvider>;
};
