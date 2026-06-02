'use client';

import type { Category, CategoryId } from '@/shared/config';
import { useDropdown } from '@/shared/hooks';
import { Icon } from '@/shared/ui';

import { cn } from '@/hbds/lib/utils';

type CategorySelectProps = {
    value: CategoryId | 'all';
    onChange: (id: CategoryId | 'all') => void;
    categories: Category[];
    className?: string;
};

export const CategorySelect = ({ value, onChange, categories, className }: CategorySelectProps) => {
    const { open, setOpen, ref } = useDropdown();

    const selected = value && value !== 'all' ? categories.find((c) => c.id === value) ?? null : null;

    const pick = (id: CategoryId | 'all') => {
        onChange(id);
        setOpen(false);
    };

    return (
        <div ref={ref} className={cn('relative inline-flex', className)}>
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
                <span className={cn('text-[12px]', selected ? 'text-white/65' : 'text-muted')}>카테고리</span>
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

            {open && (
                <div
                    className={cn(
                        'absolute top-[calc(100%+6px)] left-0 z-50 w-[196px] overflow-hidden rounded-xl border border-border bg-surface',
                        'animate-[pop-in_120ms_ease-out]',
                        'shadow-[0_12px_28px_-8px_rgba(15,23,42,0.22),_0_2px_6px_rgba(15,23,42,0.08)]'
                    )}
                >
                    <div className="p-1.5">
                        <button
                            type="button"
                            className={cn(
                                'flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors',
                                !selected ? 'bg-primary-50 font-semibold text-primary-700' : 'text-surface-foreground hover:bg-neutral-50'
                            )}
                            onClick={() => pick('all')}
                        >
                            <span className="flex-1">전체 카테고리</span>
                            <span className={cn('inline-flex text-primary-600 transition-opacity', !selected ? 'opacity-100' : 'opacity-0')}>
                                <Icon name="check" size={14} stroke={2.5} />
                            </span>
                        </button>
                        <div className="my-1.5 h-px bg-border" />
                        {categories.map((c) => (
                            <button
                                key={c.id}
                                type="button"
                                className={cn(
                                    'flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors',
                                    value === c.id
                                        ? 'bg-primary-50 font-semibold text-primary-700'
                                        : 'text-surface-foreground hover:bg-neutral-50'
                                )}
                                onClick={() => pick(c.id)}
                            >
                                <span className="flex-1">{c.name}</span>
                                <span className={cn('inline-flex text-primary-600 transition-opacity', value === c.id ? 'opacity-100' : 'opacity-0')}>
                                    <Icon name="check" size={14} stroke={2.5} />
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
