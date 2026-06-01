import { createStore } from 'zustand/vanilla';

import type { Amenity, Area, Category, Region } from '@/shared/config';

export type CatalogState = {
    regions: Region[];
    areas: Area[];
    categories: Category[];
    amenities: Amenity[];
};

export type CatalogAction = {
    getRegion: (id: string) => Region | undefined;
    getArea: (id: string) => Area | undefined;
    getCategory: (id: string) => Category | undefined;
    getAmenity: (id: string) => Amenity | undefined;
};

export const createCatalogStore = (initState: CatalogState) => {
    return createStore<CatalogState & CatalogAction>()((_, get) => ({
        ...initState,
        getRegion: (id: string) => get().regions.find((r) => r.id === id),
        getArea: (id: string) => get().areas.find((a) => a.id === id),
        getCategory: (id: string) => get().categories.find((c) => c.id === id),
        getAmenity: (id: string) => get().amenities.find((a) => a.id === id)
    }));
};
