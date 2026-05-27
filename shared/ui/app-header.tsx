import type { ReactNode } from 'react';

type AppHeaderProps = {
    /** Leading control, e.g. a back IconButton. */
    left?: ReactNode;
    /** Leading rich content that replaces the title block, e.g. the Brand. */
    lead?: ReactNode;
    title?: ReactNode;
    subtitle?: ReactNode;
    /** Trailing action cluster. */
    right?: ReactNode;
};

export const AppHeader = ({ left, lead, title, subtitle, right }: AppHeaderProps) => (
    <header className="sticky top-0 z-20 flex min-h-[52px] items-center justify-between gap-2 border-b border-border bg-surface px-4 py-2.5">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
            {left}
            {lead}
            {title && (
                <div className="min-w-0">
                    <div className="truncate text-base font-semibold leading-tight tracking-[-0.01em] text-surface-foreground">
                        {title}
                    </div>
                    {subtitle && <div className="mt-0.5 text-xs leading-tight text-muted">{subtitle}</div>}
                </div>
            )}
        </div>
        {right && <div className="flex shrink-0 items-center gap-1">{right}</div>}
    </header>
);
