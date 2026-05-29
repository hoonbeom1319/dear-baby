import * as React from 'react';

import * as AvatarPrimitive from '../primitives/avatar';
import { cn } from '../lib/utils';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

const sizeClass: Record<AvatarSize, string> = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg'
};

type AvatarProps = React.ComponentPropsWithRef<typeof AvatarPrimitive.Avatar> & {
    size?: AvatarSize;
};

const Avatar = ({ className, size = 'md', ref, ...props }: AvatarProps) => (
    <AvatarPrimitive.Avatar ref={ref} className={cn('relative flex shrink-0 overflow-hidden rounded-full', sizeClass[size], className)} {...props} />
);

const AvatarImage = ({ className, ref, ...props }: React.ComponentPropsWithRef<typeof AvatarPrimitive.AvatarImage>) => (
    <AvatarPrimitive.AvatarImage ref={ref} className={cn('aspect-square h-full w-full object-cover', className)} {...props} />
);

const AvatarFallback = ({ className, ref, ...props }: React.ComponentPropsWithRef<typeof AvatarPrimitive.AvatarFallback>) => (
    <AvatarPrimitive.AvatarFallback
        ref={ref}
        className={cn('flex h-full w-full items-center justify-center rounded-full bg-neutral-100 font-medium text-neutral-600', className)}
        {...props}
    />
);

export { Avatar, AvatarImage, AvatarFallback };
