'use client';

import type { ComponentProps } from 'react';
import { cn } from '@/hbds/lib/utils';
import * as CarouselPrimitive from '@/hbds/primitives/carousel';

type CarouselProps = ComponentProps<typeof CarouselPrimitive.Carousel> & {
    spacing?: number;
};
type CarouselContentProps = ComponentProps<typeof CarouselPrimitive.CarouselContent>;
type CarouselItemProps = ComponentProps<typeof CarouselPrimitive.CarouselItem>;
type CarouselArrowProps = ComponentProps<typeof CarouselPrimitive.CarouselNext>;

const CAROUSEL_SPACING_VAR = '--hbds-carousel-spacing' as string;

const Carousel = ({ className, spacing = 2, style, ...props }: CarouselProps) => {
    return <CarouselPrimitive.Carousel {...props} className={cn('w-full', className)} style={{ ...style, [CAROUSEL_SPACING_VAR]: `${spacing * 4}px` }} />;
};

const CarouselContent = ({ className, ...props }: CarouselContentProps) => {
    return <CarouselPrimitive.CarouselContent className={cn(`-ml-[var(${CAROUSEL_SPACING_VAR})]`, className)} {...props} />;
};

const CarouselItem = ({ className, ...props }: CarouselItemProps) => {
    return <CarouselPrimitive.CarouselItem className={cn('min-w-0 shrink-0 grow-0 basis-full', `pl-[var(${CAROUSEL_SPACING_VAR})]`, className)} {...props} />;
};

const CarouselPrevious = ({ className, ...props }: CarouselArrowProps) => {
    return <CarouselPrimitive.CarouselPrevious className={className} {...props} />;
};

const CarouselNext = ({ className, ...props }: CarouselArrowProps) => {
    return <CarouselPrimitive.CarouselNext className={className} {...props} />;
};

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext };
