import type { HTMLAttributes } from 'react';

import { cn } from '@/hbds/lib/utils';

/** Dear Baby wordmark — black `db` monogram + name. */
export const Brand = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn('inline-flex items-center gap-2.5 text-[17px] font-bold tracking-[-0.03em] text-surface-foreground', className)}
        {...props}>
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-[11px] font-bold lowercase tracking-[-0.02em] text-white">
            db
        </span>
        Dear Baby
    </div>
);
