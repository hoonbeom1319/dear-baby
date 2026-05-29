import { useCallback, useState } from 'react';

type Options = {
    storage?: 'local' | 'session';
};

export function useStorageState<T>(
    key: string,
    initialValue: T,
    options: Options = {}
): [T, React.Dispatch<React.SetStateAction<T>>] {
    const { storage: storageType = 'local' } = options;

    const [state, setStateRaw] = useState<T>(() => {
        if (typeof window === 'undefined') return initialValue;
        const storage = storageType === 'session' ? sessionStorage : localStorage;
        const stored = storage.getItem(key);
        if (stored === null) return initialValue;
        try {
            return JSON.parse(stored) as T;
        } catch {
            return initialValue;
        }
    });

    const setState: React.Dispatch<React.SetStateAction<T>> = useCallback(
        (value) => {
            setStateRaw((prev) => {
                const next = typeof value === 'function' ? (value as (prev: T) => T)(prev) : value;
                if (typeof window !== 'undefined') {
                    const storage = storageType === 'session' ? sessionStorage : localStorage;
                    storage.setItem(key, JSON.stringify(next));
                }
                return next;
            });
        },
        [key, storageType]
    );

    return [state, setState];
}
