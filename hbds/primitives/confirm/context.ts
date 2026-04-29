import { createContext, RefObject } from 'react';

const confirmContext = createContext<{ name: string; returnFocusToRef: RefObject<HTMLElement | null> | null }>({ name: '', returnFocusToRef: null });

export { confirmContext };
