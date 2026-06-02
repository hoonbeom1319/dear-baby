'use client';

import type { ReactNode } from 'react';

import { X } from 'lucide-react';

import { cn } from '../lib/utils';
import { Dialog, DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogTitle } from '../primitives/dialog';

type SheetProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: ReactNode;
    description?: ReactNode;
    children: ReactNode;
    className?: string;
};

const Sheet = ({ open, onOpenChange, title, description, children, className }: SheetProps) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogPortal>
            <DialogOverlay className="fixed inset-0 z-[1040] animate-[fade-in_150ms_ease-out] bg-neutral-900/45" />
            <DialogContent
                className={cn(
                    'fixed inset-x-0 bottom-0 z-[1050] mx-auto flex w-full max-w-[480px] animate-[sheet-up_240ms_var(--ease-spring)] flex-col rounded-t-[20px] bg-surface px-[18px] pt-3.5 pb-7 shadow-modal focus:outline-none',
                    className
                )}
            >
                <div className="mx-auto mb-2.5 h-1 w-9 rounded-full bg-neutral-300" />
                <div className="mb-3 flex items-center justify-between gap-2">
                    <DialogTitle className="text-[17px] font-semibold tracking-[-0.015em] text-surface-foreground">{title}</DialogTitle>
                    <DialogClose
                        aria-label="닫기"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-surface-foreground"
                    >
                        <X size={22} aria-hidden />
                    </DialogClose>
                </div>
                {description && <p className="-mt-1 mb-4 text-[13px] leading-relaxed text-muted">{description}</p>}
                {children}
            </DialogContent>
        </DialogPortal>
    </Dialog>
);

export { Sheet };
