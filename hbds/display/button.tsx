import * as React from 'react';

import { cn } from '../lib/utils';
import * as ButtonPrimitive from '../primitives/button';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

const variantClass: Record<ButtonVariant, string> = {
    primary: 'bg-primary-600 text-white border border-primary-600 hover:bg-primary-700 hover:border-primary-700',
    secondary: 'bg-secondary-600 text-white border border-secondary-600 hover:bg-secondary-700 hover:border-secondary-700',
    outline: 'bg-transparent text-surface-foreground border border-border hover:bg-neutral-50',
    ghost: 'bg-transparent text-surface-foreground border border-transparent hover:bg-neutral-100',
    danger: 'bg-danger text-white border border-danger hover:bg-danger-600 hover:border-danger-600'
};

const sizeClass: Record<ButtonSize, string> = {
    sm: 'h-8 px-3 text-xs rounded',
    md: 'h-10 px-4 text-sm rounded-md',
    lg: 'h-12 px-6 text-base rounded-md'
};

type ButtonProps = React.ComponentProps<typeof ButtonPrimitive.Button> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
};

const Button = ({ variant = 'primary', size = 'md', className, ...props }: ButtonProps) => (
    <ButtonPrimitive.Button
        className={cn(
            'inline-flex cursor-pointer items-center justify-center gap-2 font-medium whitespace-nowrap',
            'transition-colors duration-150',
            'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none',
            'disabled:pointer-events-none disabled:opacity-50',
            variantClass[variant],
            sizeClass[size],
            className
        )}
        {...props}
    />
);

export { Button };
