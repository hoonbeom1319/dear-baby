import * as React from 'react';

import * as SliderPrimitive from '../primitives/slider';
import { cn } from '../lib/utils';

type SliderProps = React.ComponentPropsWithRef<typeof SliderPrimitive.Slider>;

const Slider = ({ className, ref, ...props }: SliderProps) => (
    <SliderPrimitive.Slider ref={ref} className={cn('relative flex w-full touch-none select-none items-center', className)} {...props}>
        <SliderPrimitive.SliderTrack className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-neutral-200">
            <SliderPrimitive.SliderRange className="absolute h-full bg-primary-600" />
        </SliderPrimitive.SliderTrack>
        <SliderPrimitive.SliderThumb className="block h-4 w-4 rounded-full border-2 border-primary-600 bg-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
    </SliderPrimitive.Slider>
);

export { Slider };
