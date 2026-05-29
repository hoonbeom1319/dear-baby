import * as React from 'react';

import * as TabsPrimitive from '../primitives/tabs';
import { cn } from '../lib/utils';

type TabsVariant = 'line' | 'pill';

const TabsVariantCtx = React.createContext<TabsVariant>('line');

type TabsProps = React.ComponentPropsWithRef<typeof TabsPrimitive.Tabs> & {
    variant?: TabsVariant;
};

const Tabs = ({ variant = 'line', className, ref, ...props }: TabsProps) => (
    <TabsVariantCtx.Provider value={variant}>
        <TabsPrimitive.Tabs ref={ref} className={cn('w-full', className)} {...props} />
    </TabsVariantCtx.Provider>
);

const listVariant: Record<TabsVariant, string> = {
    line: 'w-full gap-0 border-b border-border',
    pill: 'gap-1 rounded-lg bg-neutral-100 p-1'
};

const TabsList = ({ className, ref, ...props }: React.ComponentPropsWithRef<typeof TabsPrimitive.TabsList>) => {
    const variant = React.useContext(TabsVariantCtx);
    return (
        <TabsPrimitive.TabsList
            ref={ref}
            className={cn('inline-flex items-center', listVariant[variant], className)}
            {...props}
        />
    );
};

const triggerVariant: Record<TabsVariant, string> = {
    line: '-mb-px border-b-2 border-transparent hover:text-surface-foreground data-[state=active]:border-primary-600 data-[state=active]:text-primary-600',
    pill: 'rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-surface-foreground'
};

const TabsTrigger = ({ className, ref, ...props }: React.ComponentPropsWithRef<typeof TabsPrimitive.TabsTrigger>) => {
    const variant = React.useContext(TabsVariantCtx);
    return (
        <TabsPrimitive.TabsTrigger
            ref={ref}
            className={cn(
                'inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium text-muted transition-colors duration-fast',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                'disabled:pointer-events-none disabled:opacity-50',
                triggerVariant[variant],
                className
            )}
            {...props}
        />
    );
};

const TabsContent = ({ className, ref, ...props }: React.ComponentPropsWithRef<typeof TabsPrimitive.TabsContent>) => (
    <TabsPrimitive.TabsContent
        ref={ref}
        className={cn(
            'mt-4',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
            className
        )}
        {...props}
    />
);

export { Tabs, TabsList, TabsTrigger, TabsContent };
export type { TabsVariant, TabsProps };
