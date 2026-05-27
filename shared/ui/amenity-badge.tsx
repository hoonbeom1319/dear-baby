import { cn } from '@/shared/lib';

import { Icon, type IconName } from './icon';

type AmenityBadgeProps = {
    icon: IconName;
    label: string;
    /** Renders the "not available" state — struck-through, muted. */
    off?: boolean;
};

export const AmenityBadge = ({ icon, label, off }: AmenityBadgeProps) => (
    <span
        className={cn(
            'inline-flex items-center gap-1 rounded-md px-2 py-[3px] text-[11.5px] font-medium leading-none',
            off ? 'bg-transparent text-slate-400 line-through' : 'bg-slate-100 text-slate-700'
        )}>
        <Icon name={icon} size={11} stroke={2} />
        {label}
    </span>
);
