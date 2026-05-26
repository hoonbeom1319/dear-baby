import type { HTMLAttributes } from 'react';

import { cn } from '@/shared/lib';

type CardProps = HTMLAttributes<HTMLDivElement> & {
    /** Adds pointer + hover lift for tappable cards. */
    interactive?: boolean;
};

export const Card = ({ interactive, className, ...props }: CardProps) => (
    <div
        className={cn(
            'overflow-hidden rounded-xl border border-border bg-surface',
            interactive &&
                'cursor-pointer transition-[border-color,box-shadow,transform] duration-100 hover:border-slate-300 hover:shadow-card active:translate-y-px',
            className
        )}
        {...props}
    />
);
