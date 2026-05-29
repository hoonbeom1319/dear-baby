import * as React from 'react';

import { cn } from '../lib/utils';

type TextareaProps = React.ComponentPropsWithRef<'textarea'> & {
    invalid?: boolean;
};

const Textarea = ({ className, invalid, rows = 4, ref, ...props }: TextareaProps) => (
    <textarea
        ref={ref}
        rows={rows}
        aria-invalid={invalid || undefined}
        className={cn(
            'flex w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-surface-foreground',
            'placeholder:text-muted',
            'focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-0 focus-visible:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'aria-invalid:border-danger aria-invalid:focus-visible:ring-danger',
            'resize-y',
            className
        )}
        {...props}
    />
);

export { Textarea };
