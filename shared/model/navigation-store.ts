import { create } from 'zustand';

type NavigationStore = {
    isNavigating: boolean;
    start: () => void;
    done: () => void;
};

export const useNavigationStore = create<NavigationStore>((set) => ({
    isNavigating: false,
    start: () => set({ isNavigating: true }),
    done: () => set({ isNavigating: false }),
}));
