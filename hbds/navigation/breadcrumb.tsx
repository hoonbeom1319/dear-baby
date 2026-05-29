import * as React from 'react';

import { ChevronRight } from 'lucide-react';

import { cn } from '../lib/utils';
import * as BreadcrumbPrimitive from '../primitives/breadcrumb';

const Breadcrumb = ({ className, ...props }: React.ComponentPropsWithRef<typeof BreadcrumbPrimitive.Breadcrumb>) => (
    <BreadcrumbPrimitive.Breadcrumb className={cn('flex', className)} {...props} />
);

const BreadcrumbList = ({ className, ...props }: React.ComponentPropsWithRef<typeof BreadcrumbPrimitive.BreadcrumbList>) => (
    <BreadcrumbPrimitive.BreadcrumbList className={cn('flex flex-wrap items-center gap-1.5 text-sm text-muted', className)} {...props} />
);

const BreadcrumbItem = ({ className, ...props }: React.ComponentPropsWithRef<typeof BreadcrumbPrimitive.BreadcrumbItem>) => (
    <BreadcrumbPrimitive.BreadcrumbItem className={cn('flex items-center gap-1.5', className)} {...props} />
);

const BreadcrumbLink = ({ className, ...props }: React.ComponentPropsWithRef<typeof BreadcrumbPrimitive.BreadcrumbLink>) => (
    <BreadcrumbPrimitive.BreadcrumbLink className={cn('transition-colors hover:text-surface-foreground', className)} {...props} />
);

const BreadcrumbPage = ({ className, ...props }: React.ComponentPropsWithRef<typeof BreadcrumbPrimitive.BreadcrumbPage>) => (
    <BreadcrumbPrimitive.BreadcrumbPage className={cn('font-medium text-surface-foreground', className)} {...props} />
);

const BreadcrumbSeparator = ({ className, children, ...props }: React.ComponentPropsWithRef<typeof BreadcrumbPrimitive.BreadcrumbSeparator>) => (
    <BreadcrumbPrimitive.BreadcrumbSeparator className={cn('text-muted', className)} {...props}>
        {children ?? <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />}
    </BreadcrumbPrimitive.BreadcrumbSeparator>
);

export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator };
