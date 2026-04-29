'use client';

import { useContext, useSyncExternalStore } from 'react';
import { confirmContext } from './context';
import { confirmStore, type ConfirmStore } from './store';

const useConfirm = <T>(selector: (state: ConfirmStore) => T): T =>
    useSyncExternalStore(
        confirmStore.subscribe,
        () => selector(confirmStore.getSnapshot()),
        () => selector(confirmStore.getSnapshot())
    );

const useConfirmContext = () => {
    const context = useContext(confirmContext);
    if (!context) {
        throw new Error('useConfirmContext must be used within a ConfirmProvider');
    }
    return context;
};

export { useConfirm, useConfirmContext };
