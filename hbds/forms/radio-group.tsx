import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';

import { cn } from '../lib/utils';

type RadioGroupProps = React.ComponentPropsWithRef<typeof RadioGroupPrimitive.Root>;
type RadioGroupItemProps = React.ComponentPropsWithRef<typeof RadioGroupPrimitive.Item>;

const RadioGroup = ({ className, ref, ...props }: RadioGroupProps) => (
    <RadioGroupPrimitive.Root ref={ref} className={cn('flex flex-col gap-2', className)} {...props} />
);

const RadioGroupItem = ({ className, ref, ...props }: RadioGroupItemProps) => (
    <RadioGroupPrimitive.Item
        ref={ref}
        className={cn(
            'border-border bg-surface aspect-square h-4 w-4 rounded-full border',
            'focus-visible:ring-primary-500 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'data-[state=checked]:border-primary-600',
            className
        )}
        {...props}
    >
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center after:block after:h-2 after:w-2 after:rounded-full after:bg-primary-600" />
    </RadioGroupPrimitive.Item>
);

export { RadioGroup, RadioGroupItem };