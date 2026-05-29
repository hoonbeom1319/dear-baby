import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';

import { cn } from '../lib/utils';

type CheckboxProps = React.ComponentPropsWithRef<typeof CheckboxPrimitive.Root>;

const Checkbox = ({ className, ref, ...props }: CheckboxProps) => (
    <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
            'border-border bg-surface peer inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border',
            'focus-visible:ring-primary-500 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600 data-[state=checked]:text-white',
            'data-[state=indeterminate]:bg-primary-600 data-[state=indeterminate]:border-primary-600 data-[state=indeterminate]:text-white',
            className
        )}
        {...props}
    >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3 w-3"
                aria-hidden="true"
            >
                {props.checked === 'indeterminate' ? <line x1="5" y1="12" x2="19" y2="12" /> : <polyline points="20 6 9 17 4 12" />}
            </svg>
        </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
);

export { Checkbox };