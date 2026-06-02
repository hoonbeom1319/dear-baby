'use client';

import { Suspense, useEffect, useRef, useState } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';

import { useNavigationStore } from '@/shared/model/navigation-store';

const NavigationProgressBar = () => {
    const isNavigating = useNavigationStore((s) => s.isNavigating);
    const done = useNavigationStore((s) => s.done);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [active, setActive] = useState(false);
    const [width, setWidth] = useState(0);
    const [completing, setCompleting] = useState(false);
    const urlRef = useRef(`${pathname}?${searchParams}`);
    const cleanupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!isNavigating) return;
        if (cleanupTimerRef.current) {
            clearTimeout(cleanupTimerRef.current);
            cleanupTimerRef.current = null;
        }
        setActive(true);
        setCompleting(false);
        setWidth(0);
        const raf = requestAnimationFrame(() => requestAnimationFrame(() => setWidth(75)));
        return () => cancelAnimationFrame(raf);
    }, [isNavigating]);

    useEffect(() => {
        const currentUrl = `${pathname}?${searchParams}`;
        const prev = urlRef.current;
        urlRef.current = currentUrl;

        if (prev === currentUrl || !active) return;

        done();
        setCompleting(true);
        setWidth(100);
        const t = setTimeout(() => {
            setActive(false);
            setWidth(0);
            setCompleting(false);
            cleanupTimerRef.current = null;
        }, 500);
        cleanupTimerRef.current = t;
        return () => clearTimeout(t);
    }, [pathname, searchParams]);

    if (!active) return null;

    return (
        <div
            className="fixed top-0 left-0 z-[200] h-[3px] bg-primary-500"
            style={{
                width: `${width}%`,
                opacity: completing ? 0 : 1,
                transition: completing
                    ? 'width 200ms ease-in, opacity 300ms ease-out 150ms'
                    : 'width 700ms cubic-bezier(0.1, 0.4, 0.3, 1)',
            }}
        />
    );
};

// useSearchParams는 Suspense 경계가 필요
export const NavigationProgress = () => (
    <Suspense>
        <NavigationProgressBar />
    </Suspense>
);
