import * as React from 'react';

import { cn } from '../lib/utils';
import * as SliderPrimitive from '../primitives/slider';

type SliderProps = React.ComponentPropsWithRef<typeof SliderPrimitive.Slider>;

const Slider = ({ className, ref, ...props }: SliderProps) => (
    <SliderPrimitive.Slider ref={ref} className={cn('relative flex w-full touch-none items-center select-none', className)} {...props}>
        <SliderPrimitive.SliderTrack className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-neutral-200">
            <SliderPrimitive.SliderRange className="absolute h-full bg-primary-600" />
        </SliderPrimitive.SliderTrack>
        <SliderPrimitive.SliderThumb className="block h-4 w-4 rounded-full border-2 border-primary-600 bg-white shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50" />
    </SliderPrimitive.Slider>
);

export { Slider };
