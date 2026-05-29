'use client';

import { useEffect } from 'react';

export function useSwRegistrar() {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(() => {});
        }
    }, []);
}
