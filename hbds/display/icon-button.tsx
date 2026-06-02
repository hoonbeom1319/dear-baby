import type { ButtonHTMLAttributes } from 'react';

import { cn } from '../lib/utils';

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    fav?: boolean;
};

const IconButton = ({ fav, className, type = 'button', ...props }: IconButtonProps) => (
    <button
        type={type}
        className={cn(
            'inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
            'hover:bg-neutral-100 hover:text-surface-foreground active:bg-neutral-200',
            fav ? 'text-amber-500' : 'text-neutral-700',
            className
        )}
        {...props}
    />
);

export { IconButton };
