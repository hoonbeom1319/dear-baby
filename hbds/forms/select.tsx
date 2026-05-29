import * as React from 'react';

import * as SelectPrimitive from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';

import { cn } from '../lib/utils';

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = ({ className, children, ref, ...props }: React.ComponentPropsWithRef<typeof SelectPrimitive.Trigger>) => (
    <SelectPrimitive.Trigger
        ref={ref}
        className={cn(
            'flex h-10 w-full items-center justify-between rounded-md border border-border bg-surface px-3 py-2 text-sm text-surface-foreground',
            'placeholder:text-muted',
            'focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-0 focus-visible:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'data-placeholder:text-muted',
            'aria-invalid:border-danger aria-invalid:focus-visible:ring-danger',
            className
        )}
        {...props}
    >
        {children}
        <SelectPrimitive.Icon asChild>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
        </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
);

const SelectContent = ({
    className,
    children,
    position = 'popper',
    sideOffset = 4,
    ref,
    ...props
}: React.ComponentPropsWithRef<typeof SelectPrimitive.Content>) => (
    <SelectPrimitive.Portal>
        <SelectPrimitive.Content
            ref={ref}
            position={position}
            sideOffset={sideOffset}
            className={cn(
                'z-dropdown relative max-h-96 min-w-32 overflow-hidden rounded-md border border-border bg-surface text-surface-foreground shadow-md',
                'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
                position === 'popper' && 'w-full min-w-(--radix-select-trigger-width)',
                className
            )}
            {...props}
        >
            <SelectPrimitive.Viewport className={cn('p-1', position === 'popper' && 'h-(--radix-select-trigger-height) w-full')}>
                {children}
            </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
);

const SelectLabel = ({ className, ref, ...props }: React.ComponentPropsWithRef<typeof SelectPrimitive.Label>) => (
    <SelectPrimitive.Label ref={ref} className={cn('px-2 py-1.5 text-xs font-medium text-muted', className)} {...props} />
);

const SelectItem = ({ className, children, ref, ...props }: React.ComponentPropsWithRef<typeof SelectPrimitive.Item>) => (
    <SelectPrimitive.Item
        ref={ref}
        className={cn(
            'relative flex w-full cursor-default items-center rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none select-none',
            'focus:bg-neutral-100',
            'data-disabled:pointer-events-none data-disabled:opacity-50',
            className
        )}
        {...props}
    >
        <span className="absolute right-2 flex h-4 w-4 items-center justify-center">
            <SelectPrimitive.ItemIndicator>
                <Check className="h-4 w-4 text-primary-600" aria-hidden="true" />
            </SelectPrimitive.ItemIndicator>
        </span>
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
);

const SelectSeparator = ({ className, ref, ...props }: React.ComponentPropsWithRef<typeof SelectPrimitive.Separator>) => (
    <SelectPrimitive.Separator ref={ref} className={cn('-mx-1 my-1 h-px bg-border', className)} {...props} />
);

export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectSeparator };
