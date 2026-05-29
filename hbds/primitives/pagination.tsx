import * as React from 'react';

const Pagination = ({ ref, ...props }: React.ComponentPropsWithRef<'nav'>) => (
    <nav ref={ref} role="navigation" aria-label="pagination" {...props} />
);

const PaginationContent = ({ ref, ...props }: React.ComponentPropsWithRef<'ul'>) => (
    <ul ref={ref} {...props} />
);

const PaginationItem = ({ ref, ...props }: React.ComponentPropsWithRef<'li'>) => (
    <li ref={ref} {...props} />
);

type PaginationLinkProps = React.ComponentPropsWithRef<'a'> & {
    isActive?: boolean;
};

const PaginationLink = ({ ref, isActive, ...props }: PaginationLinkProps) => (
    <a ref={ref} aria-current={isActive ? 'page' : undefined} {...props} />
);

const PaginationPrevious = ({ ref, ...props }: React.ComponentPropsWithRef<'a'>) => (
    <a ref={ref} aria-label="Go to previous page" {...props} />
);

const PaginationNext = ({ ref, ...props }: React.ComponentPropsWithRef<'a'>) => (
    <a ref={ref} aria-label="Go to next page" {...props} />
);

const PaginationEllipsis = ({ ref, ...props }: React.ComponentPropsWithRef<'span'>) => (
    <span ref={ref} aria-hidden="true" {...props} />
);

export { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis };
export type { PaginationLinkProps };
