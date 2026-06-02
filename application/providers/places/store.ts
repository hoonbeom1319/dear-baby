import { createStore } from 'zustand/vanilla';

import type { Place } from '@/entities/place';

import type { AreaId } from '@/shared/config';

export type PlacesState = {
    allPlaces: Place[];
    area: AreaId;
    hydrated: boolean;
};

export type PlacesAction = {
    setArea: (area: AreaId) => void;
    getPlaceById: (id: string) => Place | undefined;
};

const AREA_STORAGE_KEY = 'dear:area';

export const createPlacesStore = (initState: PlacesState) => {
    return createStore<PlacesState & PlacesAction>()((set, get) => ({
        ...initState,
        setArea: (area: AreaId) => {
            if (typeof window !== 'undefined') localStorage.setItem(AREA_STORAGE_KEY, area);
            set({ area });
        },
        getPlaceById: (id: string) => get().allPlaces.find((p) => p.id === id)
    }));
};

export { AREA_STORAGE_KEY };
