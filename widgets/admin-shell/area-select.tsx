'use client';

import { useState } from 'react';

import type { Area, AreaId, Region } from '@/shared/config';
import { useDropdown } from '@/shared/hooks';
import { Icon } from '@/shared/ui';

import { cn } from '@/hbds/lib/utils';

type AreaSelectProps = {
    value: AreaId | 'all';
    onChange: (id: AreaId | 'all') => void;
    areas: Area[];
    regions: Region[];
    counts?: Record<string, number>;
    variant?: 'chip' | 'field';
    allowAll?: boolean;
    keyLabel?: string;
    allLabel?: string;
    placeholder?: string;
    className?: string;
};

export const AreaSelect = ({
    value,
    onChange,
    areas,
    regions,
    counts,
    variant = 'chip',
    allowAll = true,
    keyLabel = '동네',
    allLabel = '전체 동네',
    placeholder = '동네를 선택하세요',
    className,
}: AreaSelectProps) => {
    const { open, setOpen, ref } = useDropdown();
    const [q, setQ] = useState('');

    const selected = value && value !== 'all' ? areas.find((a) => a.id === value) ?? null : null;

    const matches = areas.filter((a) => !q || a.name.includes(q));
    const grouped = regions
        .map((r) => ({ region: r, items: matches.filter((a) => a.regionId === r.id) }))
        .filter((g) => g.items.length > 0);

    const pick = (id: AreaId | 'all') => {
        onChange(id);
        setOpen(false);
        setQ('');
    };

    const isField = variant === 'field';

    return (
        <div ref={ref} className={cn('relative', isField ? 'w-full' : 'inline-flex', className)}>
            {isField ? (
                <div
                    role="button"
                    tabIndex={0}
                    className={cn(
                        'flex h-[38px] w-full cursor-pointer items-center justify-between rounded-lg border border-border bg-surface px-3 text-[13.5px] transition-[border-color,box-shadow] duration-[120ms] select-none',
                        open && 'border-primary-500 outline-none ring-[3px] ring-primary-500/[22%]',
                        !selected && 'text-neutral-400'
                    )}
                    onClick={() => setOpen((o) => !o)}
                    onKeyDown={(e) => e.key === 'Enter' && setOpen((o) => !o)}
                >
                    <span className={selected ? 'text-surface-foreground' : ''}>{selected ? selected.name : placeholder}</span>
                    <Icon
                        name="down"
                        size={14}
                        className={cn('text-muted transition-transform duration-[140ms]', open && 'rotate-180')}
                    />
                </div>
            ) : (
                <button
                    type="button"
                    className={cn(
                        'inline-flex h-8 items-center gap-1.5 rounded-full border pl-3 pr-2.5 text-[12.5px] font-medium transition-[background-color,color,border-color,box-shadow] duration-[120ms] select-none',
                        selected
                            ? 'border-neutral-900 bg-neutral-900 text-white'
                            : 'border-border bg-surface text-surface-foreground hover:bg-neutral-50',
                        open && 'border-primary-500 ring-[3px] ring-primary-500/[22%]'
                    )}
                    onClick={() => setOpen((o) => !o)}
                >
                    <span className={cn('text-[12px]', selected ? 'text-white/65' : 'text-muted')}>{keyLabel}</span>
                    <span>{selected ? selected.name : '전체'}</span>
                    {selected ? (
                        <span
                            role="button"
                            aria-label="필터 해제"
                            className="inline-flex rounded-full p-px hover:bg-white/20"
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange('all');
                            }}
                        >
                            <Icon name="x" size={12} />
                        </span>
                    ) : (
                        <span className={cn('inline-flex transition-transform duration-[140ms]', open && 'rotate-180')}>
                            <Icon name="down" size={13} className="text-muted" />
                        </span>
                    )}
                </button>
            )}

            {open && (
                <div
                    className={cn(
                        'absolute top-[calc(100%+6px)] left-0 z-50 flex flex-col overflow-hidden rounded-xl border border-border bg-surface',
                        'animate-[pop-in_120ms_ease-out]',
                        'shadow-[0_12px_28px_-8px_rgba(15,23,42,0.22),_0_2px_6px_rgba(15,23,42,0.08)]',
                        isField ? 'w-full' : 'w-[264px]'
                    )}
                >
                    <div className="border-b border-border p-2.5">
                        <div className="relative flex items-center">
                            <span className="pointer-events-none absolute left-2.5 text-muted">
                                <Icon name="search" size={13} />
                            </span>
                            <input
                                autoFocus
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="동네 검색"
                                className="h-[34px] w-full rounded-lg border border-border bg-surface pl-8 pr-3 text-[13px] text-surface-foreground placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/25"
                            />
                        </div>
                    </div>

                    <div className="max-h-[290px] overflow-y-auto p-1.5">
                        {allowAll && (
                            <button
                                type="button"
                                className={cn(
                                    'flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors',
                                    !selected ? 'bg-primary-50 font-semibold text-primary-700' : 'text-surface-foreground hover:bg-neutral-50'
                                )}
                                onClick={() => pick('all')}
                            >
                                <span className="flex-1">{allLabel}</span>
                                <span className={cn('inline-flex text-primary-600 transition-opacity', !selected ? 'opacity-100' : 'opacity-0')}>
                                    <Icon name="check" size={14} stroke={2.5} />
                                </span>
                            </button>
                        )}

                        {grouped.length === 0 && (
                            <div className="py-7 text-center text-[12.5px] text-muted">검색 결과가 없어요</div>
                        )}

                        {grouped.map((g) => (
                            <div key={g.region.id}>
                                <div className="px-2.5 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.04em] text-muted">
                                    {g.region.name}
                                </div>
                                {g.items.map((a) => (
                                    <button
                                        key={a.id}
                                        type="button"
                                        className={cn(
                                            'flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors',
                                            value === a.id
                                                ? 'bg-primary-50 font-semibold text-primary-700'
                                                : 'text-surface-foreground hover:bg-neutral-50'
                                        )}
                                        onClick={() => pick(a.id)}
                                    >
                                        <span className="flex-1">{a.name}</span>
                                        {counts && (
                                            <span className="text-[11.5px] tabular-nums text-muted">{counts[a.id] ?? 0}</span>
                                        )}
                                        <span className={cn('inline-flex text-primary-600 transition-opacity', value === a.id ? 'opacity-100' : 'opacity-0')}>
                                            <Icon name="check" size={14} stroke={2.5} />
                                        </span>
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
