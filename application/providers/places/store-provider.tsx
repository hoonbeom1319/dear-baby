'use client';

import { createContext, useContext, useState, type PropsWithChildren } from 'react';

import { StoreApi, useStore } from 'zustand';

import { type PlacesAction, type PlacesState, createPlacesStore } from './store';

const PlacesStoreContext = createContext<StoreApi<PlacesState & PlacesAction> | null>(null);

export const PlacesStoreProvider = ({ children, data }: PropsWithChildren<{ data: PlacesState }>) => {
    const [store] = useState(() => createPlacesStore(data));

    return <PlacesStoreContext.Provider value={store}>{children}</PlacesStoreContext.Provider>;
};

export const usePlaces = <T,>(selector: (store: PlacesState & PlacesAction) => T): T => {
    const places = useContext(PlacesStoreContext);

    if (!places) throw new Error('usePlaces must be used within <PlacesProvider>');

    return useStore(places, selector);
};
