'use client';

import { createContext, useContext, useEffect, useCallback, useState, PropsWithChildren, HTMLAttributes, KeyboardEvent, ComponentProps } from 'react';

import type { EmblaCarouselType, EmblaOptionsType, EmblaPluginType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';

import * as ButtonPrimitive from './button';
import { cn } from '../lib/utils';

type CarouselContextValue = {
    carouselRef: ReturnType<typeof useEmblaCarousel>[0];
    emblaApi: EmblaCarouselType | undefined;
    scrollPrev: () => void;
    scrollNext: () => void;
    canScrollPrev: boolean;
    canScrollNext: boolean;
};

const CarouselContext = createContext<CarouselContextValue | null>(null);

const useCarousel = () => {
    const ctx = useContext(CarouselContext);
    if (!ctx) throw new Error('Carousel components must be used within <Carousel />');
    return ctx;
};

type CarouselProps = HTMLAttributes<HTMLDivElement> &
    PropsWithChildren<{
        className?: string;
        'aria-label': string;
        options?: EmblaOptionsType;
        plugins?: EmblaPluginType[];
        setApi?: (api: EmblaCarouselType) => void;
    }>;

const Carousel = ({ className, children, options, plugins, setApi, onKeyDown, ...props }: CarouselProps) => {
    const [carouselRef, emblaApi] = useEmblaCarousel(options, plugins);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    const sync = useCallback(() => {
        if (!emblaApi) return;
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
    }, [emblaApi]);

    const handleKeyDown = useCallback(
        (event: KeyboardEvent<HTMLDivElement>) => {
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                scrollPrev();
            } else if (event.key === 'ArrowRight') {
                event.preventDefault();
                scrollNext();
            }
        },
        [scrollPrev, scrollNext]
    );

    useEffect(() => {
        if (!emblaApi) return;
        sync();
        emblaApi.on('reInit', sync);
        emblaApi.on('select', sync);
        return () => {
            emblaApi.off('reInit', sync);
            emblaApi.off('select', sync);
        };
    }, [emblaApi, sync]);

    useEffect(() => {
        if (!emblaApi || !setApi) return;
        setApi(emblaApi);
    }, [emblaApi, setApi]);

    return (
        <CarouselContext.Provider
            value={{
                carouselRef,
                emblaApi,
                scrollPrev,
                scrollNext,
                canScrollPrev,
                canScrollNext
            }}
        >
            <div className={className} role="region" aria-roledescription="carousel" onKeyDownCapture={handleKeyDown} {...props}>
                {children}
            </div>
        </CarouselContext.Provider>
    );
};

const CarouselContent = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
    const { carouselRef } = useCarousel();
    return (
        <div ref={carouselRef} className="overflow-hidden">
            <div className={cn('flex', className)} {...props} />
        </div>
    );
};

const CarouselItem = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
    return <div role="group" aria-roledescription="slide" className={className} {...props} />;
};

const CarouselPrevious = ({ disabled, ...props }: ComponentProps<typeof ButtonPrimitive.Button>) => {
    const { scrollPrev, canScrollPrev } = useCarousel();
    return (
        <ButtonPrimitive.Button
            aria-label="이전 슬라이드"
            onClick={(e) => {
                props.onClick?.(e);
                scrollPrev();
            }}
            disabled={disabled ?? !canScrollPrev}
            {...props}
        />
    );
};

const CarouselNext = ({ disabled, ...props }: ComponentProps<typeof ButtonPrimitive.Button>) => {
    const { scrollNext, canScrollNext } = useCarousel();
    return (
        <ButtonPrimitive.Button
            aria-label="다음 슬라이드"
            onClick={(e) => {
                props.onClick?.(e);
                scrollNext();
            }}
            disabled={disabled ?? !canScrollNext}
            {...props}
        />
    );
};

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, useCarousel };
