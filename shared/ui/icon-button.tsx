import type { ButtonHTMLAttributes } from 'react';

import { cn } from '@/hbds/lib/utils';

import { Icon, type IconName } from './icon';

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    name: IconName;
    size?: number;
    iconStroke?: number;
    /** Filled-star / favorite affordance — paints the glyph amber. */
    fav?: boolean;
};

export const IconButton = ({ name, size = 22, iconStroke, fav, className, type = 'button', ...props }: IconButtonProps) => (
    <button
        type={type}
        className={cn(
            'inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
            'hover:bg-neutral-100 hover:text-surface-foreground active:bg-neutral-200',
            fav ? 'text-amber-500' : 'text-neutral-700',
            className
        )}
        {...props}
    >
        <Icon name={name} size={size} stroke={iconStroke} />
    </button>
);
