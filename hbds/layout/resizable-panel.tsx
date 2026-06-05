'use client';

import { useState, useRef, PointerEvent } from 'react';

import { cn } from '../lib/utils';

type ResizablePanelProps = {
    defaultWidth?: number;
    minWidth?: number;
    maxWidth?: number;
    side?: 'left' | 'right';
    className?: string;
    children: React.ReactNode;
};

export function ResizablePanel({ defaultWidth = 300, minWidth = 200, maxWidth = 800, side = 'left', className, children }: ResizablePanelProps) {
    const [width, setWidth] = useState(defaultWidth);
    const drag = useRef<{ startX: number; startWidth: number } | null>(null);

    const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
        drag.current = { startX: e.clientX, startWidth: width };
        e.currentTarget.setPointerCapture(e.pointerId);
        e.preventDefault();
    };

    const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
        if (!drag.current || !e.currentTarget.hasPointerCapture(e.pointerId)) return;
        const dx = side === 'left' ? drag.current.startX - e.clientX : e.clientX - drag.current.startX;
        setWidth(Math.min(maxWidth, Math.max(minWidth, drag.current.startWidth + dx)));
    };

    const onPointerUp = () => {
        drag.current = null;
    };

    return (
        <div className={cn('relative shrink-0', className)} style={{ width }}>
            <div
                className={cn('group absolute top-0 z-10 h-full w-2 cursor-col-resize touch-none select-none', side === 'left' ? 'left-0' : 'right-0')}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
            >
                <span
                    className={cn(
                        'absolute inset-y-0 w-px bg-transparent transition-colors duration-150',
                        'group-hover:bg-primary-500/50 group-active:bg-primary-500',
                        side === 'left' ? 'left-0' : 'right-0'
                    )}
                />
            </div>
            {children}
        </div>
    );
}
