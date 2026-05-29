import { HTMLAttributes, PropsWithChildren } from 'react';

import { cn } from '../lib/utils';

const Timeline = ({ className, ...props }: HTMLAttributes<HTMLOListElement>) => <ol className={cn('flex flex-col', className)} {...props} />;

const TimelineItem = ({ className, ...props }: HTMLAttributes<HTMLLIElement>) => <li className={cn('relative flex gap-4', className)} {...props} />;

const TimelineDot = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('mt-1 flex h-3 w-3 shrink-0 items-center justify-center rounded-full', className)} {...props} />
);

const TimelineContent = ({ className, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => (
    <div className={cn('flex flex-col pb-6', className)} {...props} />
);

export { Timeline, TimelineItem, TimelineDot, TimelineContent };
