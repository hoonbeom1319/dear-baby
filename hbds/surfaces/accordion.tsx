import * as React from 'react';
import { ChevronDown } from 'lucide-react';

import * as AccordionPrimitives from '../primitives/accordion';
import { cn } from '../lib/utils';

const Accordion = ({ className, ref, ...props }: React.ComponentPropsWithRef<typeof AccordionPrimitives.Accordion>) => (
    <AccordionPrimitives.Accordion ref={ref} className={cn('flex w-full flex-col', className)} {...props} />
);

const AccordionItem = ({ className, ref, ...props }: React.ComponentPropsWithRef<typeof AccordionPrimitives.AccordionItem>) => (
    <AccordionPrimitives.AccordionItem ref={ref} className={cn('border-border border-b first:border-t', className)} {...props} />
);

const AccordionHeader = ({ className, ref, ...props }: React.ComponentPropsWithRef<typeof AccordionPrimitives.AccordionHeader>) => (
    <AccordionPrimitives.AccordionHeader ref={ref} className={className} {...props} />
);

const AccordionTrigger = ({ className, children, ref, ...props }: React.ComponentPropsWithRef<typeof AccordionPrimitives.AccordionTrigger>) => (
    <AccordionPrimitives.AccordionTrigger
        ref={ref}
        className={cn(
            'text-surface-foreground flex w-full cursor-pointer items-center justify-between gap-3 py-3.5 text-left text-sm font-medium',
            'focus-visible:ring-primary-500 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            'disabled:pointer-events-none disabled:opacity-50',
            'data-[state=open]:[&>svg]:rotate-180',
            className
        )}
        {...props}
    >
        {children}
        <ChevronDown className="text-muted duration-slow h-4 w-4 shrink-0 transition-transform ease-out" aria-hidden="true" />
    </AccordionPrimitives.AccordionTrigger>
);

const AccordionContent = ({ className, ref, children, ...props }: React.ComponentPropsWithRef<typeof AccordionPrimitives.AccordionContent>) => (
    <AccordionPrimitives.AccordionContent
        ref={ref}
        className={cn('text-muted overflow-hidden text-sm leading-[1.55]', 'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down')}
        {...props}
    >
        <div className={cn('pb-3.5', className)}>{children}</div>
    </AccordionPrimitives.AccordionContent>
);

export { Accordion, AccordionItem, AccordionHeader, AccordionTrigger, AccordionContent };
