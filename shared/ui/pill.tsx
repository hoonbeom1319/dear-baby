import type { HTMLAttributes } from 'react';

import { cn } from '@/shared/lib';

type PillTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger';

const toneClass: Record<PillTone, string> = {
    neutral: 'bg-slate-100 text-slate-700',
    primary: 'bg-primary-50 text-primary-700',
    success: 'bg-emerald-50 text-success',
    warning: 'bg-amber-50 text-warning',
    danger: 'bg-rose-50 text-danger'
};

/** 상태 뱃지(테이블 셀 등). 상태색은 Tailwind 톤트 배경 + 500 텍스트. */
export const Pill = ({ tone = 'neutral', className, ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: PillTone }) => (
    <span
        className={cn(
            'inline-flex h-[22px] items-center gap-1 rounded-full px-2 text-[11.5px] font-medium leading-none',
            toneClass[tone],
            className
        )}
        {...props}
    />
);
