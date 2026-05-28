import { createStore } from 'zustand/vanilla';

import type { Amenity, Area, Category } from '@/shared/config';

export type CatalogState = {
    areas: Area[];
    categories: Category[];
    amenities: Amenity[];
};

export type CatalogAction = {
    getArea: (id: string) => Area | undefined;
    getCategory: (id: string) => Category | undefined;
    getAmenity: (id: string) => Amenity | undefined;
};

export const createCatalogStore = (initState: CatalogState) => {
    return createStore<CatalogState & CatalogAction>()((_, get) => ({
        ...initState,
        getArea: (id: string) => get().areas.find((a) => a.id === id),
        getCategory: (id: string) => get().categories.find((c) => c.id === id),
        getAmenity: (id: string) => get().amenities.find((a) => a.id === id)
    }));
};
