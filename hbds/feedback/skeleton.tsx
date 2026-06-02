import { HTMLAttributes } from 'react';

import { cn } from '../lib/utils';

type SkeletonProps = HTMLAttributes<HTMLDivElement>;

const Skeleton = ({ className, ...props }: SkeletonProps) => <div className={cn('animate-pulse rounded bg-neutral-200', className)} {...props} />;

export { Skeleton };
