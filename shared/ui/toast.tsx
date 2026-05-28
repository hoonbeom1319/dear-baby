'use client';

import * as ToastPrimitive from '@radix-ui/react-toast';

import { useToastStore } from '@/shared/lib/toast';

export const ToastViewport = () => (
    <ToastPrimitive.Viewport className="fixed bottom-7 left-1/2 z-[1080] flex -translate-x-1/2 flex-col items-center gap-2 outline-none" />
);

export const ToastProvider = () => {
    const { toasts, remove } = useToastStore();

    return (
        <ToastPrimitive.Provider>
            {toasts.map(({ id, message }) => (
                <ToastPrimitive.Root
                    key={id}
                    duration={2400}
                    onOpenChange={(open) => !open && remove(id)}
                    className="max-w-[320px] animate-[toast-in_220ms_var(--ease-spring)] rounded-full bg-slate-900 px-[18px] py-2.5 text-center text-[13px] font-medium text-white shadow-lg data-[state=closed]:animate-[toast-out_150ms_ease-in]"
                >
                    <ToastPrimitive.Description>{message}</ToastPrimitive.Description>
                </ToastPrimitive.Root>
            ))}
            <ToastViewport />
        </ToastPrimitive.Provider>
    );
};
