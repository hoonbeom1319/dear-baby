import * as React from 'react';

import { cn } from '../lib/utils';

type InputProps = React.ComponentPropsWithRef<'input'> & {
    invalid?: boolean;
};

const Input = ({ className, type = 'text', invalid, ref, ...props }: InputProps) => (
    <input
        ref={ref}
        type={type}
        aria-invalid={invalid || undefined}
        className={cn(
            'flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-surface-foreground',
            'placeholder:text-muted',
            'focus-visible:border-primary-500 focus-visible:ring-1 focus-visible:ring-primary-500 focus-visible:ring-offset-0 focus-visible:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'aria-invalid:border-danger aria-invalid:focus-visible:ring-danger',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium',
            className
        )}
        {...props}
    />
);

export { Input };
