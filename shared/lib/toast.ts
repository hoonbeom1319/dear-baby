import { create } from 'zustand';

export type ToastVariant = 'default' | 'success' | 'warning' | 'danger';

type ToastItem = {
    id: string;
    message: string;
    variant: ToastVariant;
};

type ToastStore = {
    toasts: ToastItem[];
    add: (message: string, variant?: ToastVariant) => void;
    remove: (id: string) => void;
};

export const useToastStore = create<ToastStore>()((set) => ({
    toasts: [],
    add: (message, variant = 'default') => set((s) => ({ toasts: [...s.toasts, { id: crypto.randomUUID(), message, variant }] })),
    remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
}));

export const toast = (message: string, variant?: ToastVariant) => useToastStore.getState().add(message, variant);
