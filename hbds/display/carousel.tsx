'use client';

import type { ComponentProps } from 'react';
import { useMemo } from 'react';
import Autoplay, { type AutoplayOptionsType } from 'embla-carousel-autoplay';
import { cn } from '@/hbds/lib/utils';
import * as CarouselPrimitive from '@/hbds/primitives/carousel';

import type { EmblaOptionsType, EmblaPluginType } from 'embla-carousel';

type CarouselProps = ComponentProps<typeof CarouselPrimitive.Carousel> & {
    'aria-label': string;
    spacing?: number;
    autoPlay?: boolean;
    autoPlayOptions?: Partial<AutoplayOptionsType>;
};
type CarouselContentProps = ComponentProps<typeof CarouselPrimitive.CarouselContent>;
type CarouselItemProps = ComponentProps<typeof CarouselPrimitive.CarouselItem> & {
    size?: 'auto' | 'full' | `${number}%`;
};
type CarouselArrowProps = ComponentProps<typeof CarouselPrimitive.CarouselNext>;

const CAROUSEL_SPACING_VAR = '--hbds-carousel-spacing' as string;

const Carousel = ({ className, spacing = 2, style, autoPlay = false, autoPlayOptions, plugins, options, ...props }: CarouselProps) => {
    const combinedPlugins = useMemo(() => {
        const autoplayPlugin = autoPlay && Autoplay({ ...(autoPlayOptions ?? {}) });
        return [...(plugins ?? []), autoplayPlugin].filter(Boolean) as EmblaPluginType[];
    }, [autoPlay, autoPlayOptions, plugins]);

    const combinedOptions = useMemo<EmblaOptionsType>(() => {
        return { align: 'start', ...(options ?? {}) };
    }, [options]);

    return (
        <CarouselPrimitive.Carousel
            {...props}
            plugins={combinedPlugins}
            options={combinedOptions}
            className={cn('w-full', className)}
            style={{ ...style, [CAROUSEL_SPACING_VAR]: `${spacing}rem` }}
        />
    );
};

const CarouselContent = ({ className, style, ...props }: CarouselContentProps) => {
    return (
        <CarouselPrimitive.CarouselContent className={cn(className)} style={{ ...style, marginLeft: `calc(var(${CAROUSEL_SPACING_VAR}) * -1)` }} {...props} />
    );
};

const CarouselItem = ({ className, size = 'auto', style, ...props }: CarouselItemProps) => {
    return (
        <CarouselPrimitive.CarouselItem
            className={cn('min-w-0 shrink-0 grow-0', size === 'auto' && 'basis-auto', size === 'full' && 'basis-full', className)}
            style={{
                ...style,
                paddingLeft: `var(${CAROUSEL_SPACING_VAR})`,
                flexBasis: size !== 'auto' && size !== 'full' ? size : undefined
            }}
            {...props}
        />
    );
};

const CarouselPrevious = ({ className, ...props }: CarouselArrowProps) => {
    return <CarouselPrimitive.CarouselPrevious className={className} {...props} />;
};

const CarouselNext = ({ className, ...props }: CarouselArrowProps) => {
    return <CarouselPrimitive.CarouselNext className={className} {...props} />;
};

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext };
