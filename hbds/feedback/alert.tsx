import { HTMLAttributes } from 'react';
import { Info, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

import { cn } from '../lib/utils';

type AlertVariant = 'default' | 'info' | 'success' | 'warning' | 'danger';

const variantClass: Record<AlertVariant, string> = {
    default: 'bg-neutral-50 text-neutral-800 border-neutral-200',
    info: 'bg-info/10 text-info border-info/30',
    success: 'bg-success/10 text-success border-success/30',
    warning: 'bg-warning/10 text-warning border-warning/30',
    danger: 'bg-danger/10 text-danger border-danger/30'
};

const variantIcon: Partial<Record<AlertVariant, React.ReactNode>> = {
    info: <Info className="h-4 w-4" aria-hidden="true" />,
    success: <CheckCircle2 className="h-4 w-4" aria-hidden="true" />,
    warning: <AlertTriangle className="h-4 w-4" aria-hidden="true" />,
    danger: <XCircle className="h-4 w-4" aria-hidden="true" />
};

type AlertProps = HTMLAttributes<HTMLDivElement> & {
    variant?: AlertVariant;
};

const Alert = ({ className, variant = 'default', children, ...props }: AlertProps) => {
    const icon = variantIcon[variant];
    return (
        <div
            role="alert"
            className={cn('relative w-full rounded-lg border p-4', icon && 'flex gap-3 items-start', variantClass[variant], className)}
            {...props}
        >
            {icon && <span className="mt-0.5 shrink-0">{icon}</span>}
            <div className="flex-1 min-w-0">{children}</div>
        </div>
    );
};

const AlertTitle = ({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
    <p className={cn('mb-1 font-semibold leading-none tracking-tight', className)} {...props} />
);

const AlertDescription = ({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
    <p className={cn('text-sm opacity-90', className)} {...props} />
);

export { Alert, AlertTitle, AlertDescription };
