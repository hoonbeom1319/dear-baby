import * as React from 'react';

import * as LabelPrimitive from '@radix-ui/react-label';

import { cn } from '../lib/utils';

type LabelProps = React.ComponentPropsWithRef<typeof LabelPrimitive.Root>;

const Label = ({ className, ref, ...props }: LabelProps) => (
    <LabelPrimitive.Root
        ref={ref}
        className={cn('text-sm leading-none font-medium text-surface-foreground', 'peer-disabled:cursor-not-allowed peer-disabled:opacity-70', className)}
        {...props}
    />
);

export { Label };
