import { HTMLAttributes } from 'react';

import { cn } from '../lib/utils';

const Card = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('rounded-lg border', className)} {...props} />
);

const CardHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
);

const CardTitle = ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className={cn('font-semibold leading-none tracking-tight', className)} {...props} />
);

const CardDescription = ({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
    <p className={cn('text-sm', className)} {...props} />
);

const CardBody = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('p-6 pt-0', className)} {...props} />
);

const CardFooter = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('flex items-center p-6 pt-0', className)} {...props} />
);

export { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter };
