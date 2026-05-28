import { createStore } from 'zustand/vanilla';

import type { Place } from '@/entities/place';

import type { AreaId } from '@/shared/config';

export type PlacesState = {
    allPlaces: Place[];
    area: AreaId;
};

export type PlacesAction = {
    setArea: (area: AreaId) => void;
    getPlaceById: (id: string) => Place | undefined;
};

export const createPlacesStore = (initState: PlacesState) => {
    return createStore<PlacesState & PlacesAction>()((set, get) => ({
        ...initState,
        setArea: (area: AreaId) => set({ area }),
        getPlaceById: (id: string) => get().allPlaces.find((p) => p.id === id)
    }));
};
