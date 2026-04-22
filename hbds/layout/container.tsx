import * as React from 'react';

import { cn } from '@/hbds/lib/utils';

type ContainerVariant = 'mobile';

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
    variant: ContainerVariant;
};

export const containerVariants = {
    mobile: 'mx-auto w-full max-w-[480px]'
};

export default function Container({ className, variant, ...props }: ContainerProps) {
    return <div className={cn(containerVariants[variant], className)} {...props} />;
}
