'use client';

import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';

import { StoreApi, useStore } from 'zustand';

import { AREA_STORAGE_KEY, type PlacesAction, type PlacesState, createPlacesStore } from './store';

const PlacesStoreContext = createContext<StoreApi<PlacesState & PlacesAction> | null>(null);

type ProviderData = Omit<PlacesState, 'hydrated'>;

export const PlacesStoreProvider = ({ children, data }: PropsWithChildren<{ data: ProviderData }>) => {
    const [store] = useState(() =>
        // 서버와 클라이언트 초기값을 동일하게 — localStorage는 useEffect에서 읽어 hydration mismatch 방지
        createPlacesStore({ ...data, hydrated: false })
    );

    useEffect(() => {
        const storedArea = (localStorage.getItem(AREA_STORAGE_KEY) as PlacesState['area']) ?? data.area;
        store.setState({ area: storedArea, hydrated: true });
    }, [data.area, store]);

    return <PlacesStoreContext.Provider value={store}>{children}</PlacesStoreContext.Provider>;
};

export const usePlaces = <T,>(selector: (store: PlacesState & PlacesAction) => T): T => {
    const places = useContext(PlacesStoreContext);

    if (!places) throw new Error('usePlaces must be used within <PlacesProvider>');

    return useStore(places, selector);
};
