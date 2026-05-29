import { SVGAttributes } from 'react';

import { cn } from '../lib/utils';

type SpinnerSize = 'sm' | 'md' | 'lg';

const sizeClass: Record<SpinnerSize, string> = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
};

type SpinnerProps = SVGAttributes<SVGSVGElement> & {
    size?: SpinnerSize;
};

const Spinner = ({ className, size = 'md', ...props }: SpinnerProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        role="status"
        aria-label="Loading"
        className={cn('animate-spin text-primary-600', sizeClass[size], className)}
        {...props}
    >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
);

export { Spinner };
