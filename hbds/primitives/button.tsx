import * as React from 'react';

import { Slot } from '@radix-ui/react-slot';

type PButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean;
};
const Button = ({ asChild = false, className, type = 'button', role, children, ...props }: PButtonProps) => {
    const Comp = asChild ? Slot : 'button';

    return (
        <Comp className={className} role={asChild ? (role ?? 'button') : undefined} type={asChild ? undefined : type} {...props}>
            {children}
        </Comp>
    );
};

export { Button };
