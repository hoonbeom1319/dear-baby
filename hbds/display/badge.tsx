import { HTMLAttributes } from 'react';

import { cn } from '../lib/utils';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
type BadgeSize = 'sm' | 'md';

const variantClass: Record<BadgeVariant, string> = {
    default: 'bg-neutral-100 text-neutral-700 border-neutral-200',
    primary: 'bg-primary-50 text-primary-700 border-primary-200',
    secondary: 'bg-secondary-50 text-secondary-700 border-secondary-200',
    success: 'bg-success/10 text-success border-success/30',
    warning: 'bg-warning/10 text-warning border-warning/30',
    danger: 'bg-danger/10 text-danger border-danger/30'
};

const sizeClass: Record<BadgeSize, string> = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm'
};

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
    variant?: BadgeVariant;
    size?: BadgeSize;
};

const Badge = ({ className, variant = 'default', size = 'md', ...props }: BadgeProps) => (
    <span className={cn('inline-flex items-center rounded-full border font-medium', variantClass[variant], sizeClass[size], className)} {...props} />
);

export { Badge };
