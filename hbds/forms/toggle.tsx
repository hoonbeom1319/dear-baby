import * as React from 'react';

import { cn } from '../lib/utils';
import * as TogglePrimitive from '../primitives/toggle';

type ToggleSize = 'sm' | 'md' | 'lg';

const sizeClass: Record<ToggleSize, string> = {
    sm: 'h-8 px-2 text-xs',
    md: 'h-10 px-3 text-sm',
    lg: 'h-12 px-4 text-base'
};

type ToggleProps = React.ComponentPropsWithRef<typeof TogglePrimitive.Toggle> & {
    size?: ToggleSize;
};

const Toggle = ({ className, size = 'md', ref, ...props }: ToggleProps) => (
    <TogglePrimitive.Toggle
        ref={ref}
        className={cn(
            'inline-flex items-center justify-center gap-2 rounded-md border border-border bg-transparent font-medium',
            'transition-colors hover:bg-neutral-100',
            'data-[state=on]:border-primary-300 data-[state=on]:bg-primary-50 data-[state=on]:text-primary-700',
            'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none',
            'disabled:pointer-events-none disabled:opacity-50',
            sizeClass[size],
            className
        )}
        {...props}
    />
);

export { Toggle };
