import * as React from 'react';

import { cn } from '../lib/utils';
import * as ButtonPrimitive from '../primitives/button';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

const variantClass: Record<ButtonVariant, string> = {
    primary: 'border-primary-600 bg-primary-600 text-white hover:border-primary-700 hover:bg-primary-700',
    secondary: 'border-secondary-600 bg-secondary-600 text-white hover:border-secondary-700 hover:bg-secondary-700',
    outline: 'border-border bg-surface text-surface-foreground hover:bg-neutral-50',
    ghost: 'border-transparent bg-transparent text-surface-foreground hover:bg-neutral-100',
    danger: 'border-danger bg-danger text-white hover:border-danger-600 hover:bg-danger-600'
};

const sizeClass: Record<ButtonSize, string> = {
    sm: 'h-9 gap-1.5 rounded-lg px-3 text-[13px]',
    md: 'h-11 gap-2 rounded-[10px] px-[18px] text-[15px]',
    lg: 'h-[52px] gap-2 rounded-[10px] px-[18px] text-base'
};

type ButtonProps = React.ComponentProps<typeof ButtonPrimitive.Button> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    block?: boolean;
};

const Button = ({ variant = 'primary', size = 'md', block, className, ...props }: ButtonProps) => (
    <ButtonPrimitive.Button
        className={cn(
            'inline-flex cursor-pointer items-center justify-center border font-medium whitespace-nowrap transition-colors duration-100 select-none',
            'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none',
            'disabled:pointer-events-none disabled:opacity-50',
            variantClass[variant],
            sizeClass[size],
            block && 'w-full',
            className
        )}
        {...props}
    />
);

export { Button };
