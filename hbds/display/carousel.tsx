'use client';

import type { ComponentProps } from 'react';
import { useMemo } from 'react';

import type { EmblaOptionsType, EmblaPluginType } from 'embla-carousel';
import Autoplay, { type AutoplayOptionsType } from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '../lib/utils';
import * as CarouselPrimitive from '../primitives/carousel';
import type { CarouselNavigationOverlap } from '../primitives/carousel';

type CarouselProps = ComponentProps<typeof CarouselPrimitive.Carousel> & {
    'aria-label': string;
    spacing?: number;
    autoPlay?: boolean;
    autoPlayOptions?: Partial<AutoplayOptionsType>;
    /** 슬라이드와 화살표 겹침. `overlay`(기본) | `outside`(캐러셀 바깥) */
    navigationOverlap?: CarouselNavigationOverlap;
    /** 하단 도트 인디케이터 표시 (기본: false). W3C APG Basic 패턴에서는 필수 아님 */
    showDots?: boolean;
    /** showDots일 때 각 도트 버튼 접근 가능 이름 */
    dotSlideLabels?: string[];
};
type CarouselContentProps = ComponentProps<typeof CarouselPrimitive.CarouselContent>;
type CarouselItemProps = ComponentProps<typeof CarouselPrimitive.CarouselItem> & {
    size?: 'auto' | 'full' | `${number}%`;
};
type CarouselArrowProps = ComponentProps<typeof CarouselPrimitive.CarouselNext>;
type CarouselDotsProps = ComponentProps<'div'> & {
    /** 각 도트 버튼 접근 가능 이름. 미지정 시 "N번째 슬라이드로 이동" */
    slideLabels?: string[];
};

const CAROUSEL_SPACING_VAR = '--hbds-carousel-spacing' as string;

const Carousel = ({
    className,
    spacing = 2,
    style,
    autoPlay = false,
    autoPlayOptions,
    plugins,
    options,
    navigationOverlap = 'overlay',
    showDots = false,
    dotSlideLabels,
    children,
    ...props
}: CarouselProps) => {
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
            navigationOverlap={navigationOverlap}
            plugins={combinedPlugins}
            options={combinedOptions}
            className={cn('w-full', className)}
            style={{ ...style, [CAROUSEL_SPACING_VAR]: `${spacing}rem` }}
        >
            <div className={cn('relative w-full', navigationOverlap === 'outside' && 'px-10')}>{children}</div>
            {showDots ? <CarouselDots slideLabels={dotSlideLabels} /> : null}
        </CarouselPrimitive.Carousel>
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

const CarouselPrevious = ({ className, children, ...props }: CarouselArrowProps) => {
    const { navigationOverlap } = CarouselPrimitive.useCarousel();

    return (
        <CarouselPrimitive.CarouselPrevious
            aria-label="이전 슬라이드"
            className={cn(
                'absolute top-1/2 z-10 inline-flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
                navigationOverlap === 'outside' ? 'left-0 -translate-x-full' : 'left-2',
                className
            )}
            {...props}
        >
            {children ?? <ChevronLeft className="h-4 w-4" aria-hidden="true" />}
        </CarouselPrimitive.CarouselPrevious>
    );
};

const CarouselNext = ({ className, children, ...props }: CarouselArrowProps) => {
    const { navigationOverlap } = CarouselPrimitive.useCarousel();

    return (
        <CarouselPrimitive.CarouselNext
            aria-label="다음 슬라이드"
            className={cn(
                'absolute top-1/2 z-10 inline-flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
                navigationOverlap === 'outside' ? 'right-0 translate-x-full' : 'right-2',
                className
            )}
            {...props}
        >
            {children ?? <ChevronRight className="h-4 w-4" aria-hidden="true" />}
        </CarouselPrimitive.CarouselNext>
    );
};

const CarouselDots = ({ className, slideLabels, ...props }: CarouselDotsProps) => {
    const { selectedIndex, slideCount, scrollTo } = CarouselPrimitive.useCarousel();

    if (slideCount <= 1) return null;

    return (
        <div role="group" aria-label="슬라이드 선택" className={cn('mt-3 flex justify-center gap-2', className)} {...props}>
            {Array.from({ length: slideCount }, (_, index) => {
                const isActive = index === selectedIndex;
                const label = slideLabels?.[index] ?? `${index + 1}번째 슬라이드로 이동`;

                return (
                    <button
                        key={index}
                        type="button"
                        aria-label={label}
                        aria-current={isActive ? 'true' : undefined}
                        onClick={() => scrollTo(index)}
                        className={cn(
                            'h-2 w-2 shrink-0 cursor-pointer rounded-full border-2 transition-colors focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none',
                            isActive ? 'border-neutral-800 bg-neutral-800' : 'border-neutral-300 bg-neutral-300 hover:border-neutral-500'
                        )}
                    />
                );
            })}
        </div>
    );
};

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, CarouselDots };
export type { CarouselNavigationOverlap, CarouselProps, CarouselDotsProps };
