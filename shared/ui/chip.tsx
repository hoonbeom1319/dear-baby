import type { ButtonHTMLAttributes, HTMLAttributes } from 'react';

import { cn } from '@/shared/lib';

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    active?: boolean;
};

export const Chip = ({ active, className, type = 'button', ...props }: ChipProps) => (
    <button
        type={type}
        className={cn(
            'inline-flex h-[34px] shrink-0 cursor-pointer select-none items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-medium transition-colors',
            active
                ? 'border-primary-600 bg-primary-600 text-white'
                : 'border-border bg-surface text-neutral-700 hover:bg-neutral-50',
            className
        )}
        {...props}
    />
);

/** Horizontally scrollable chip track with hidden scrollbar. */
export const ChipRow = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn('flex gap-1.5 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden', className)}
        {...props}
    />
);
