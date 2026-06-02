'use client';

import type { ComponentProps } from 'react';

import NextLink from 'next/link';

import { useNavigationStore } from '@/shared/model/navigation-store';

export const Link = ({ onClick, ...props }: ComponentProps<typeof NextLink>) => {
    const start = useNavigationStore((s) => s.start);

    return (
        <NextLink
            {...props}
            onClick={(e) => {
                start();
                onClick?.(e);
            }}
        />
    );
};
