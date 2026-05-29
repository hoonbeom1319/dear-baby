import type { ButtonHTMLAttributes } from 'react';

import { cn } from '@/hbds/lib/utils';

type ButtonVariant = 'primary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

const variantClass: Record<ButtonVariant, string> = {
    primary: 'border-primary-600 bg-primary-600 text-white hover:border-primary-700 hover:bg-primary-700',
    outline: 'border-border bg-surface text-surface-foreground hover:bg-neutral-50',
    ghost: 'border-transparent bg-transparent text-surface-foreground hover:bg-neutral-100'
};

const sizeClass: Record<ButtonSize, string> = {
    sm: 'h-9 gap-1.5 rounded-lg px-3 text-[13px]',
    md: 'h-11 gap-2 rounded-[10px] px-[18px] text-[15px]',
    lg: 'h-[52px] gap-2 rounded-[10px] px-[18px] text-base'
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    block?: boolean;
};

export const Button = ({ variant = 'primary', size = 'md', block, className, type = 'button', ...props }: ButtonProps) => (
    <button
        type={type}
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
