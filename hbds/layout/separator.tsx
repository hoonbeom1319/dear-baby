import * as React from 'react';

import { cn } from '../lib/utils';
import * as SeparatorPrimitive from '../primitives/separator';

type SeparatorProps = React.ComponentPropsWithRef<typeof SeparatorPrimitive.Separator>;

const Separator = ({ className, orientation = 'horizontal', decorative = true, ref, ...props }: SeparatorProps) => (
    <SeparatorPrimitive.Separator
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        className={cn('shrink-0 bg-border', orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px', className)}
        {...props}
    />
);

export { Separator };
