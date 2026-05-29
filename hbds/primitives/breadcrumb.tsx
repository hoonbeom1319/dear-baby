import { ComponentPropsWithRef } from 'react';

import { Slot } from '@radix-ui/react-slot';

const Breadcrumb = ({ ref, ...props }: ComponentPropsWithRef<'nav'>) => <nav ref={ref} aria-label="breadcrumb" {...props} />;

const BreadcrumbList = ({ ref, ...props }: ComponentPropsWithRef<'ol'>) => <ol ref={ref} {...props} />;

const BreadcrumbItem = ({ ref, ...props }: ComponentPropsWithRef<'li'>) => <li ref={ref} {...props} />;

const BreadcrumbLink = ({ ref, asChild = false, ...props }: ComponentPropsWithRef<'a'> & { asChild?: boolean }) => {
    const Comp = asChild ? Slot : 'a';
    return <Comp ref={ref} {...props} />;
};

const BreadcrumbPage = ({ ref, ...props }: ComponentPropsWithRef<'span'>) => <span ref={ref} aria-current="page" {...props} />;

const BreadcrumbSeparator = ({ ref, ...props }: ComponentPropsWithRef<'span'>) => <span ref={ref} role="presentation" aria-hidden="true" {...props} />;

export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator };
