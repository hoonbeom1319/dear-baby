import { useEffect, useState } from 'react';

import { cn } from '@/hbds/lib/utils';

type SlideDirection = 'down' | 'left' | 'right' | 'up';

type SlideProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
    children: React.ReactNode;
    open?: boolean;
    direction?: SlideDirection;
    timeout?: number;
    keepMounted?: boolean;
};

const slideExitedDirectionClassMap: Record<SlideDirection, string> = {
    up: 'data-[state=exited]:-translate-y-full',
    down: 'data-[state=exited]:translate-y-full',
    left: 'data-[state=exited]:-translate-x-full',
    right: 'data-[state=exited]:translate-x-full',
};

const Slide = ({ children, open = false, direction = 'down', timeout = 300, keepMounted = false, className, onTransitionEnd, style, ...props }: SlideProps) => {
    const [isMounted, setIsMounted] = useState(open || keepMounted);
    const [isEntered, setIsEntered] = useState(open);

    useEffect(() => {
        if (open) {
            setIsMounted(true);
            const frame = requestAnimationFrame(() => setIsEntered(true));
            return () => cancelAnimationFrame(frame);
        }

        setIsEntered(false);
    }, [open]);

    if (!isMounted && !keepMounted) {
        return null;
    }

    return (
        <div
            className={cn(
                'transition-[transform,opacity] ease-in-out will-change-[transform,opacity]',
                'data-[state=entered]:opacity-100 data-[state=entered]:pointer-events-auto data-[state=entered]:translate-x-0 data-[state=entered]:translate-y-0',
                'data-[state=exited]:opacity-0 data-[state=exited]:pointer-events-none',
                slideExitedDirectionClassMap[direction],
                className
            )}
            data-state={isEntered ? 'entered' : 'exited'}
            style={{ transitionDuration: `${timeout}ms`, ...style }}
            onTransitionEnd={(event) => {
                if (!open && !keepMounted && event.target === event.currentTarget) {
                    setIsMounted(false);
                }
                onTransitionEnd?.(event);
            }}
            {...props}
        >
            {children}
        </div>
    );
};

export { Slide };
