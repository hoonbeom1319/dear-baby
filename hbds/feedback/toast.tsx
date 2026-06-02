import * as React from 'react';

import * as ToastPrimitive from '@radix-ui/react-toast';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

import { cn } from '../lib/utils';

const ToastProvider = ToastPrimitive.Provider;
const Description = ToastPrimitive.Description;

const ToastViewport = ({ className, ref, ...props }: React.ComponentPropsWithRef<typeof ToastPrimitive.Viewport>) => {
    if (typeof document === 'undefined') return null;
    return createPortal(
        <ToastPrimitive.Viewport
            ref={ref}
            className={cn('z-toast fixed right-0 bottom-0 flex max-h-screen w-full flex-col-reverse gap-2 p-4 md:max-w-[420px]', className)}
            {...props}
        />,
        document.body
    );
};

type ToastVariant = 'default' | 'success' | 'warning' | 'danger';

const variantClass: Record<ToastVariant, string> = {
    default: 'bg-surface text-surface-foreground border-border',
    success: 'bg-success/10 text-success border-success/30',
    warning: 'bg-warning/10 text-warning border-warning/30',
    danger: 'bg-danger/10 text-danger border-danger/30'
};

type ToastProps = React.ComponentPropsWithRef<typeof ToastPrimitive.Root> & {
    variant?: ToastVariant;
};

const Toast = ({ className, variant = 'default', ref, ...props }: ToastProps) => (
    <ToastPrimitive.Root
        ref={ref}
        className={cn(
            'pointer-events-auto relative flex w-full shrink-0 items-center justify-between gap-3 overflow-hidden rounded-md border p-4 pr-6 shadow-lg',
            'data-[state=open]:animate-toast-in data-[state=closed]:animate-toast-out',
            'data-[swipe=move]:translate-x-(--radix-toast-swipe-move-x) data-[swipe=move]:transition-none',
            'data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out]',
            'data-[swipe=end]:translate-x-(--radix-toast-swipe-end-x) data-[swipe=end]:opacity-0 data-[swipe=end]:transition-[transform_100ms_ease-in,opacity_100ms_ease-in]',
            variantClass[variant],
            className
        )}
        {...props}
    />
);

const ToastTitle = ({ className, ref, ...props }: React.ComponentPropsWithRef<typeof ToastPrimitive.Title>) => (
    <ToastPrimitive.Title ref={ref} className={cn('text-sm font-semibold', className)} {...props} />
);

const ToastDescription = ({ className, ref, ...props }: React.ComponentPropsWithRef<typeof ToastPrimitive.Description>) => (
    <ToastPrimitive.Description ref={ref} className={cn('text-sm opacity-90', className)} {...props} />
);

const ToastAction = ({ className, ref, ...props }: React.ComponentPropsWithRef<typeof ToastPrimitive.Action>) => (
    <ToastPrimitive.Action
        ref={ref}
        type="button"
        className={cn(
            'inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-border bg-transparent px-3 text-sm font-medium hover:bg-neutral-100',
            'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none',
            'disabled:pointer-events-none disabled:opacity-50',
            className
        )}
        {...props}
    />
);

const ToastClose = ({ className, ref, ...props }: React.ComponentPropsWithRef<typeof ToastPrimitive.Close>) => (
    <ToastPrimitive.Close
        ref={ref}
        type="button"
        aria-label="Close"
        className={cn(
            'absolute top-2 right-2 rounded-md p-1 text-muted opacity-70 transition-opacity hover:text-surface-foreground hover:opacity-100',
            'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none',
            className
        )}
        toast-close=""
        {...props}
    >
        <X className="h-4 w-4" aria-hidden="true" />
    </ToastPrimitive.Close>
);

type SnackbarProps = React.ComponentPropsWithRef<typeof ToastPrimitive.Root>;

const Snackbar = ({ className, ref, ...props }: SnackbarProps) => (
    <ToastPrimitive.Root
        ref={ref}
        className={cn(
            'animate-[toast-in_220ms_var(--ease-spring)] rounded-full bg-neutral-900 px-[18px] py-2.5 text-center text-[13px] font-medium text-white shadow-lg',
            'data-[state=closed]:animate-[toast-out_150ms_ease-in]',
            className
        )}
        {...props}
    />
);

export { ToastProvider, Description, ToastViewport, Toast, ToastTitle, ToastDescription, ToastAction, ToastClose, Snackbar };
