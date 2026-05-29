import * as React from 'react';

import { cn } from '../lib/utils';
import * as ProgressPrimitive from '../primitives/progress';

type ProgressProps = React.ComponentPropsWithRef<typeof ProgressPrimitive.Progress> & {
    value?: number;
};

const Progress = ({ className, value = 0, ref, ...props }: ProgressProps) => (
    <ProgressPrimitive.Progress ref={ref} value={value} className={cn('relative h-2 w-full overflow-hidden rounded-full bg-neutral-200', className)} {...props}>
        <ProgressPrimitive.ProgressIndicator
            className="h-full w-full flex-1 bg-primary-600 transition-all duration-300"
            style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
        />
    </ProgressPrimitive.Progress>
);

export { Progress };
