'use client';

import { createContext, useContext } from 'react';

import type { Amenity, Area, Category } from '@/shared/config';

export type CatalogContextValue = {
    areas: Area[];
    categories: Category[];
    amenities: Amenity[];
    getArea: (id: string) => Area | undefined;
    getCategory: (id: string) => Category | undefined;
    getAmenity: (id: string) => Amenity | undefined;
};

export const CatalogContext = createContext<CatalogContextValue | null>(null);

export const useCatalog = (): CatalogContextValue => {
    const ctx = useContext(CatalogContext);
    if (!ctx) throw new Error('useCatalog must be used within AppProvider');
    return ctx;
};
