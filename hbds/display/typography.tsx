import { HTMLAttributes } from 'react';

import { cn } from '../lib/utils';

const H1 = ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className={cn('scroll-m-20 text-4xl font-extrabold tracking-tight', className)} {...props} />
);

const H2 = ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className={cn('scroll-m-20 text-3xl font-semibold tracking-tight', className)} {...props} />
);

const H3 = ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className={cn('scroll-m-20 text-2xl font-semibold tracking-tight', className)} {...props} />
);

const H4 = ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className={cn('scroll-m-20 text-xl font-semibold tracking-tight', className)} {...props} />
);

const P = ({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
    <p className={cn('leading-7', className)} {...props} />
);

const Lead = ({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
    <p className={cn('text-xl text-muted', className)} {...props} />
);

const Muted = ({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
    <p className={cn('text-sm text-muted', className)} {...props} />
);

const Code = ({ className, ...props }: HTMLAttributes<HTMLElement>) => (
    <code className={cn('relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold', className)} {...props} />
);

export { H1, H2, H3, H4, P, Lead, Muted, Code };
