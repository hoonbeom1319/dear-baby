'use client';

import { createContext, useContext, useState, type PropsWithChildren } from 'react';

import { StoreApi, useStore } from 'zustand';

import { type CatalogAction, type CatalogState, createCatalogStore } from './store';

const CatalogStoreContext = createContext<StoreApi<CatalogState & CatalogAction> | null>(null);

export const CatalogStoreProvider = ({ children, data }: PropsWithChildren<{ data: CatalogState }>) => {
    const [store] = useState(() => createCatalogStore(data));

    return <CatalogStoreContext.Provider value={store}>{children}</CatalogStoreContext.Provider>;
};

export const useCatalog = <T,>(selector: (store: CatalogState & CatalogAction) => T): T => {
    const catalog = useContext(CatalogStoreContext);

    if (!catalog) throw new Error('useCatalog must be used within <CatalogProvider>');

    return useStore(catalog, selector);
};
