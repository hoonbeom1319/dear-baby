import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { cn } from '../lib/utils';

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = ({ className, sideOffset = 4, children, ref, ...props }: React.ComponentPropsWithRef<typeof TooltipPrimitive.Content>) => (
    <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
            ref={ref}
            sideOffset={sideOffset}
            className={cn(
                'z-tooltip bg-neutral-900 text-white rounded-md px-2.5 py-1.5 text-xs shadow-md',
                'data-[state=delayed-open]:animate-fade-in data-[state=instant-open]:animate-fade-in data-[state=closed]:animate-fade-out',
                className
            )}
            {...props}
        >
            {children}
            <TooltipPrimitive.Arrow className="fill-neutral-900" />
        </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
);

export { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent };
