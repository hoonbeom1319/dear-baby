'use client';

import { Toast } from 'radix-ui';

import { useToastStore } from '@/shared/lib/toast';

export const ToastViewport = () => (
    <Toast.Viewport className="pointer-events-none fixed right-0 bottom-7 left-0 z-1080 flex flex-col items-center gap-2 outline-none" />
);

export const ToastProvider = () => {
    const { toasts, remove } = useToastStore();

    return (
        <Toast.Provider>
            {toasts.map(({ id, message }) => (
                <Toast.Root
                    key={id}
                    duration={1000}
                    onOpenChange={(open) => !open && remove(id)}
                    className="animate-[toast-in_220ms_var(--ease-spring)] rounded-full bg-neutral-900 px-[18px] py-2.5 text-center text-[13px] font-medium text-white shadow-lg data-[state=closed]:animate-[toast-out_150ms_ease-in]"
                >
                    <Toast.Description>{message}</Toast.Description>
                </Toast.Root>
            ))}
            <ToastViewport />
        </Toast.Provider>
    );
};
