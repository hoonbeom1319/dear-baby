import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';

import { cn } from '@/shared/lib';
import { Icon, type IconName } from '@/shared/ui';

/** 관리자 필터 칩 — 활성 시 slate-900(모바일 Chip의 primary와 구분). */
export const AdChip = ({ active, className, type = 'button', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) => (
    <button
        type={type}
        className={cn(
            'inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[12.5px] font-medium transition-colors',
            active ? 'border-slate-900 bg-slate-900 text-white' : 'border-border bg-surface text-slate-700 hover:bg-slate-50',
            className
        )}
        {...props}
    />
);

export const AdField = ({ label, hint, children }: { label: ReactNode; hint?: ReactNode; children: ReactNode }) => (
    <div className="flex flex-col gap-1.5">
        <label className="flex items-baseline justify-between text-[12.5px] font-medium text-surface-foreground">
            <span>{label}</span>
            {hint && <span className="text-[11px] font-normal text-muted">{hint}</span>}
        </label>
        {children}
    </div>
);

export const AdInput = ({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) => (
    <input
        className={cn(
            'h-[38px] w-full rounded-lg border border-border bg-surface px-3 text-[13.5px] text-surface-foreground transition-colors',
            'placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/25',
            className
        )}
        {...props}
    />
);

export const AdTextarea = ({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea
        className={cn(
            'min-h-20 w-full resize-y rounded-lg border border-border bg-surface px-3 py-2.5 text-[13.5px] leading-normal text-surface-foreground transition-colors',
            'placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/25',
            className
        )}
        {...props}
    />
);

/** 정적 셀렉트 표시(데모) — 실제 드롭다운은 데이터 연동 단계에서. */
export const AdSelect = ({ value }: { value: ReactNode }) => (
    <div className="flex h-[38px] w-full cursor-pointer items-center justify-between rounded-lg border border-border bg-surface px-3 text-[13.5px] text-surface-foreground">
        <span>{value}</span>
        <Icon name="down" size={14} className="text-muted" />
    </div>
);

export const AdIconButton = ({ name, className, type = 'button', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { name: IconName }) => (
    <button
        type={type}
        className={cn(
            'inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-slate-100 hover:text-surface-foreground',
            className
        )}
        {...props}>
        <Icon name={name} size={16} />
    </button>
);
