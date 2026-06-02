import { HTMLAttributes } from 'react';

import { cn } from '../lib/utils';

type CardProps = HTMLAttributes<HTMLDivElement> & {
    interactive?: boolean;
};

const Card = ({ interactive, className, ...props }: CardProps) => (
    <div
        className={cn(
            'overflow-hidden rounded-xl border border-border bg-surface',
            interactive &&
                'cursor-pointer transition-[border-color,box-shadow,transform] duration-100 hover:border-neutral-300 hover:shadow-card active:translate-y-px',
            className
        )}
        {...props}
    />
);

const CardHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />;

const CardTitle = ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className={cn('leading-none font-semibold tracking-tight', className)} {...props} />
);

const CardDescription = ({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) => <p className={cn('text-sm', className)} {...props} />;

const CardBody = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => <div className={cn('p-6 pt-0', className)} {...props} />;

const CardFooter = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => <div className={cn('flex items-center p-6 pt-0', className)} {...props} />;

export { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter };
