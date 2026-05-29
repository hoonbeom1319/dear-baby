import * as React from 'react';

import { ChevronDown } from 'lucide-react';

import { cn } from '../lib/utils';
import * as AccordionPrimitives from '../primitives/accordion';

const Accordion = ({ className, ref, ...props }: React.ComponentPropsWithRef<typeof AccordionPrimitives.Accordion>) => (
    <AccordionPrimitives.Accordion ref={ref} className={cn('flex w-full flex-col', className)} {...props} />
);

const AccordionItem = ({ className, ref, ...props }: React.ComponentPropsWithRef<typeof AccordionPrimitives.AccordionItem>) => (
    <AccordionPrimitives.AccordionItem ref={ref} className={cn('border-b border-border first:border-t', className)} {...props} />
);

const AccordionHeader = ({ className, ref, ...props }: React.ComponentPropsWithRef<typeof AccordionPrimitives.AccordionHeader>) => (
    <AccordionPrimitives.AccordionHeader ref={ref} className={className} {...props} />
);

const AccordionTrigger = ({ className, children, ref, ...props }: React.ComponentPropsWithRef<typeof AccordionPrimitives.AccordionTrigger>) => (
    <AccordionPrimitives.AccordionTrigger
        ref={ref}
        className={cn(
            'flex w-full cursor-pointer items-center justify-between gap-3 py-3.5 text-left text-sm font-medium text-surface-foreground',
            'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none',
            'disabled:pointer-events-none disabled:opacity-50',
            'data-[state=open]:[&>svg]:rotate-180',
            className
        )}
        {...props}
    >
        {children}
        <ChevronDown className="duration-slow h-4 w-4 shrink-0 text-muted transition-transform ease-out" aria-hidden="true" />
    </AccordionPrimitives.AccordionTrigger>
);

const AccordionContent = ({ className, ref, children, ...props }: React.ComponentPropsWithRef<typeof AccordionPrimitives.AccordionContent>) => (
    <AccordionPrimitives.AccordionContent
        ref={ref}
        className={cn('overflow-hidden text-sm leading-[1.55] text-muted', 'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down')}
        {...props}
    >
        <div className={cn('pb-3.5', className)}>{children}</div>
    </AccordionPrimitives.AccordionContent>
);

export { Accordion, AccordionItem, AccordionHeader, AccordionTrigger, AccordionContent };
