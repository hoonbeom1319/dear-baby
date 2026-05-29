import * as React from 'react';

import { Check, ChevronRight } from 'lucide-react';

import { cn } from '../lib/utils';
import * as DropdownMenuPrimitive from '../primitives/dropdown-menu';

const DropdownMenuContent = ({ className, sideOffset = 4, ref, ...props }: React.ComponentPropsWithRef<typeof DropdownMenuPrimitive.DropdownMenuContent>) => (
    <DropdownMenuPrimitive.DropdownMenuPortal>
        <DropdownMenuPrimitive.DropdownMenuContent
            ref={ref}
            sideOffset={sideOffset}
            className={cn(
                'z-dropdown min-w-32 overflow-hidden rounded-md border border-border bg-surface p-1 shadow-md',
                'data-[state=open]:animate-in data-[state=closed]:animate-out',
                'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
                'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
                'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
                className
            )}
            {...props}
        />
    </DropdownMenuPrimitive.DropdownMenuPortal>
);

const DropdownMenuItem = ({ className, ref, ...props }: React.ComponentPropsWithRef<typeof DropdownMenuPrimitive.DropdownMenuItem>) => (
    <DropdownMenuPrimitive.DropdownMenuItem
        ref={ref}
        className={cn(
            'relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors outline-none select-none',
            'hover:bg-neutral-100 focus:bg-neutral-100',
            'data-disabled:pointer-events-none data-disabled:opacity-50',
            className
        )}
        {...props}
    />
);

const DropdownMenuCheckboxItem = ({
    className,
    children,
    checked,
    ref,
    ...props
}: React.ComponentPropsWithRef<typeof DropdownMenuPrimitive.DropdownMenuCheckboxItem>) => (
    <DropdownMenuPrimitive.DropdownMenuCheckboxItem
        ref={ref}
        checked={checked}
        className={cn(
            'relative flex cursor-pointer items-center rounded-sm py-1.5 pr-2 pl-8 text-sm transition-colors outline-none select-none',
            'hover:bg-neutral-100 focus:bg-neutral-100',
            'data-disabled:pointer-events-none data-disabled:opacity-50',
            className
        )}
        {...props}
    >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            <DropdownMenuPrimitive.DropdownMenuItemIndicator>
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
            </DropdownMenuPrimitive.DropdownMenuItemIndicator>
        </span>
        {children}
    </DropdownMenuPrimitive.DropdownMenuCheckboxItem>
);

const DropdownMenuRadioItem = ({ className, children, ref, ...props }: React.ComponentPropsWithRef<typeof DropdownMenuPrimitive.DropdownMenuRadioItem>) => (
    <DropdownMenuPrimitive.DropdownMenuRadioItem
        ref={ref}
        className={cn(
            'relative flex cursor-pointer items-center rounded-sm py-1.5 pr-2 pl-8 text-sm transition-colors outline-none select-none',
            'hover:bg-neutral-100 focus:bg-neutral-100',
            'data-disabled:pointer-events-none data-disabled:opacity-50',
            className
        )}
        {...props}
    >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            <DropdownMenuPrimitive.DropdownMenuItemIndicator>
                <span className="block h-2 w-2 rounded-full bg-current" />
            </DropdownMenuPrimitive.DropdownMenuItemIndicator>
        </span>
        {children}
    </DropdownMenuPrimitive.DropdownMenuRadioItem>
);

const DropdownMenuLabel = ({ className, ref, ...props }: React.ComponentPropsWithRef<typeof DropdownMenuPrimitive.DropdownMenuLabel>) => (
    <DropdownMenuPrimitive.DropdownMenuLabel ref={ref} className={cn('px-2 py-1.5 text-xs font-semibold text-muted', className)} {...props} />
);

const DropdownMenuSeparator = ({ className, ref, ...props }: React.ComponentPropsWithRef<typeof DropdownMenuPrimitive.DropdownMenuSeparator>) => (
    <DropdownMenuPrimitive.DropdownMenuSeparator ref={ref} className={cn('-mx-1 my-1 h-px bg-border', className)} {...props} />
);

const DropdownMenuSubTrigger = ({ className, children, ref, ...props }: React.ComponentPropsWithRef<typeof DropdownMenuPrimitive.DropdownMenuSubTrigger>) => (
    <DropdownMenuPrimitive.DropdownMenuSubTrigger
        ref={ref}
        className={cn(
            'flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none',
            'focus:bg-neutral-100 data-[state=open]:bg-neutral-100',
            className
        )}
        {...props}
    >
        {children}
        <ChevronRight className="ml-auto h-3.5 w-3.5 text-muted" aria-hidden="true" />
    </DropdownMenuPrimitive.DropdownMenuSubTrigger>
);

const DropdownMenuSubContent = ({ className, ref, ...props }: React.ComponentPropsWithRef<typeof DropdownMenuPrimitive.DropdownMenuSubContent>) => (
    <DropdownMenuPrimitive.DropdownMenuSubContent
        ref={ref}
        className={cn(
            'z-dropdown min-w-32 overflow-hidden rounded-md border border-border bg-surface p-1 shadow-md',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            className
        )}
        {...props}
    />
);

const DropdownMenu = DropdownMenuPrimitive.DropdownMenu;
const DropdownMenuTrigger = DropdownMenuPrimitive.DropdownMenuTrigger;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.DropdownMenuRadioGroup;
const DropdownMenuSub = DropdownMenuPrimitive.DropdownMenuSub;

export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent
};
