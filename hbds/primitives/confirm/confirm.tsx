'use client';

import { ComponentProps, MouseEventHandler, PropsWithChildren, ReactNode, useEffect, useRef } from 'react';

import { Dialog, DialogClose, DialogContent, DialogTitle, DialogOverlay, DialogPortal } from '@radix-ui/react-dialog';

import * as ButtonPrimitive from '../button';

import { useConfirm, useConfirmContext } from './use-confirm';
import { confirmContext } from './context';

type PButtonProps = PropsWithChildren<{ className?: string; name?: string; onClick?: MouseEventHandler<HTMLButtonElement>; asChild?: boolean }>;

const Confirm = ({ name, children }: PropsWithChildren<{ name: string }>) => {
    const t = useConfirm((s) => s.node[name]);
    const close = useConfirm((s) => s.close);
    const returnFocusToRef = useRef<HTMLElement | null>(null);

    const handleOpenChange = (open: boolean) => {
        if (!open && t?.resolve) close(name);
    };

    useEffect(() => {
        if (t?.open) {
            returnFocusToRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        }
    }, [t?.open]);

    return (
        <confirmContext.Provider value={{ name, returnFocusToRef }}>
            <Dialog open={!!t?.open} onOpenChange={handleOpenChange}>
                <DialogPortal>{children}</DialogPortal>
            </Dialog>
        </confirmContext.Provider>
    );
};

const ConfirmOverlay = DialogOverlay;

const ConfirmContent = ({ className, children }: { className?: string; children: ReactNode | ((data: unknown) => ReactNode) }) => {
    const { returnFocusToRef, name } = useConfirmContext();
    const t = useConfirm((s) => s.node[name]);
    const content = typeof children === 'function' ? children(t?.data ?? {}) : children;

    const handleCloseAutoFocus = (e: Event) => {
        e.preventDefault();
        const target = returnFocusToRef?.current;
        if (!target) return;
        requestAnimationFrame(() => target.focus?.());
    };

    return (
        <DialogContent className={className} onCloseAutoFocus={handleCloseAutoFocus}>
            {content}
        </DialogContent>
    );
};

const ConfirmTitle = DialogTitle;

const ConfirmClose = ({ onClick, ...props }: ComponentProps<typeof DialogClose>) => {
    const close = useConfirm((s) => s.close);
    const contextName = useConfirmContext().name;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        close(contextName);
        onClick?.(e);
    };

    return <DialogClose onClick={handleClick} {...props} />;
};

const ConfirmButton = ({ className, name, children, onClick, asChild }: PButtonProps) => {
    const onConfirm = useConfirm((s) => s.onConfirm);
    const contextName = useConfirmContext().name;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        onConfirm(name || contextName, true);
        onClick?.(e);
    };

    return (
        <ButtonPrimitive.Button className={className} onClick={handleClick} asChild={asChild}>
            {children}
        </ButtonPrimitive.Button>
    );
};

const CancelButton = ({ className, name, children, onClick, asChild }: PButtonProps) => {
    const onConfirm = useConfirm((s) => s.onConfirm);
    const contextName = useConfirmContext().name;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        onConfirm(name || contextName, false);
        onClick?.(e);
    };

    return (
        <ButtonPrimitive.Button className={className} onClick={handleClick} asChild={asChild}>
            {children}
        </ButtonPrimitive.Button>
    );
};

export { Confirm, ConfirmOverlay, ConfirmContent, ConfirmTitle, ConfirmClose, ConfirmButton, CancelButton };
