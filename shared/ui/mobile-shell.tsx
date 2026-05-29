import type { HTMLAttributes } from 'react';

import { cn } from '@/hbds/lib/utils';

/**
 * Mobile-web app frame. Dear Baby is mobile-first (PRD 9.3); on wider
 * viewports the column is capped and centered on a neutral backdrop.
 * The device chrome from the design canvas (notch / status bar) is dropped —
 * the browser is the device.
 */
export const MobileShell = ({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) => (
    <div className="flex min-h-dvh justify-center bg-neutral-100">
        <div className={cn('min-h-dvh w-full max-w-[480px] bg-surface', className)} {...props}>
            {children}
        </div>
    </div>
);
