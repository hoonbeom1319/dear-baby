'use client';

import { useToastStore } from '@/shared/lib/toast';

import { Snackbar, ToastProvider as HbdsToastProvider, ToastViewport as HbdsToastViewport, Description as HbdsDescription } from '@/hbds/feedback/toast';

export const ToastViewport = () => (
    <HbdsToastViewport className="pointer-events-none fixed right-0 bottom-7 left-0 z-1080 flex flex-col items-center gap-2 outline-none" />
);

export const ToastProvider = () => {
    const { toasts, remove } = useToastStore();

    return (
        <HbdsToastProvider>
            {toasts.map(({ id, message }) => (
                <Snackbar key={id} duration={1000} onOpenChange={(open) => !open && remove(id)}>
                    <HbdsDescription>{message}</HbdsDescription>
                </Snackbar>
            ))}
            <ToastViewport />
        </HbdsToastProvider>
    );
};
