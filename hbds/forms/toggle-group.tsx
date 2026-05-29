import * as React from 'react';

import { cn } from '../lib/utils';
import * as ToggleGroupPrimitive from '../primitives/toggle-group';

type ToggleGroupProps = React.ComponentPropsWithRef<typeof ToggleGroupPrimitive.ToggleGroup>;

const ToggleGroup = ({ className, ref, ...props }: ToggleGroupProps) => (
    <ToggleGroupPrimitive.ToggleGroup ref={ref} className={cn('inline-flex items-center gap-1', className)} {...props} />
);

type ToggleGroupItemProps = React.ComponentPropsWithRef<typeof ToggleGroupPrimitive.ToggleGroupItem>;

const ToggleGroupItem = ({ className, ref, ...props }: ToggleGroupItemProps) => (
    <ToggleGroupPrimitive.ToggleGroupItem
        ref={ref}
        className={cn(
            'inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-transparent px-3 text-sm font-medium',
            'transition-colors hover:bg-neutral-100',
            'data-[state=on]:border-primary-300 data-[state=on]:bg-primary-50 data-[state=on]:text-primary-700',
            'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none',
            'disabled:pointer-events-none disabled:opacity-50',
            className
        )}
        {...props}
    />
);

export { ToggleGroup, ToggleGroupItem };
