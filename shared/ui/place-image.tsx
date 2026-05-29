import type { HTMLAttributes } from 'react';

import { cn } from '@/shared/lib';

import { Icon } from './icon';

type PlaceImageProps = HTMLAttributes<HTMLDivElement> & {
    iconSize?: number;
};

/**
 * Photo placeholder. Per PRD F-5 we never lay down a default image —
 * an empty slot is a clean neutral block with a soft icon.
 */
export const PlaceImage = ({ iconSize = 28, className, ...props }: PlaceImageProps) => (
    <div className={cn('flex items-center justify-center bg-neutral-100 text-neutral-300', className)} {...props}>
        <Icon name="image" size={iconSize} stroke={1.4} />
    </div>
);
