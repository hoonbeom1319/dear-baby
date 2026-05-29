import { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';

import { cn } from '../lib/utils';

const Table = ({ className, ...props }: HTMLAttributes<HTMLTableElement>) => (
    <div className="w-full overflow-auto">
        <table className={cn('w-full caption-bottom text-sm', className)} {...props} />
    </div>
);

const TableHeader = ({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className={cn(className)} {...props} />
);

const TableBody = ({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody className={cn(className)} {...props} />
);

const TableFooter = ({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) => (
    <tfoot className={cn(className)} {...props} />
);

const TableRow = ({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) => (
    <tr className={cn(className)} {...props} />
);

const TableHead = ({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) => (
    <th className={cn('h-10 px-2 text-left align-middle font-medium', className)} {...props} />
);

const TableCell = ({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) => (
    <td className={cn('p-2 align-middle', className)} {...props} />
);

const TableCaption = ({ className, ...props }: HTMLAttributes<HTMLTableCaptionElement>) => (
    <caption className={cn('mt-4 text-sm', className)} {...props} />
);

export { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption };
