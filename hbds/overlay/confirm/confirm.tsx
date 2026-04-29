import { ComponentProps, PropsWithChildren } from 'react';

import { cn } from '../../lib/utils';
import * as ButtonPrimitive from '../../primitives/button';
import * as ConfirmPrimitive from '../../primitives/confirm';

const useConfirm = ConfirmPrimitive.useConfirm;

const Confirm = ({ name, children, className }: ComponentProps<typeof ConfirmPrimitive.Confirm> & { className?: string }) => {
    return (
        <ConfirmPrimitive.Confirm name={name}>
            <ConfirmPrimitive.ConfirmOverlay className="z-backdrop fixed inset-0 bg-black/50" />
            <ConfirmPrimitive.ConfirmContent
                className={cn('z-modal fixed top-1/2 left-1/2 min-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white px-4 pb-4', className)}
            >
                {children}
            </ConfirmPrimitive.ConfirmContent>
        </ConfirmPrimitive.Confirm>
    );
};

const ConfirmTitle = ({ children, hidden, hideClose, className }: ComponentProps<typeof ConfirmPrimitive.ConfirmTitle> & { hideClose?: boolean }) => {
    return (
        <div className={cn('flex w-full items-center justify-between py-4', hidden && hideClose && 'pt-0 pb-4', className)}>
            <ConfirmPrimitive.ConfirmTitle hidden={hidden}>{children}</ConfirmPrimitive.ConfirmTitle>
            {!hideClose && (
                <ConfirmPrimitive.ConfirmClose asChild>
                    <ButtonPrimitive.Button className="hb-focus-ring-primary min-h-none min-w-none ml-auto flex cursor-pointer items-center justify-center">
                        X
                    </ButtonPrimitive.Button>
                </ConfirmPrimitive.ConfirmClose>
            )}
        </div>
    );
};

const ConfirmBody = ({ children, className }: PropsWithChildren<{ className?: string }>) => <div className={cn('pb-4', className)}>{children}</div>;

const ConfirmButtonGroup = ({ children, className }: PropsWithChildren<{ className?: string }>) => (
    <div className={cn('flex justify-end gap-2', className)}>{children}</div>
);

const ConfirmButton = ({ className, name, children, onClick }: ComponentProps<typeof ConfirmPrimitive.ConfirmButton>) => {
    return (
        <ConfirmPrimitive.ConfirmButton className={className} name={name} onClick={onClick} asChild>
            {children}
        </ConfirmPrimitive.ConfirmButton>
    );
};

const CancelButton = ({ className, name, children, onClick }: ComponentProps<typeof ConfirmPrimitive.CancelButton>) => {
    return (
        <ConfirmPrimitive.CancelButton className={className} name={name} onClick={onClick} asChild>
            {children}
        </ConfirmPrimitive.CancelButton>
    );
};

export { useConfirm, Confirm, ConfirmTitle, ConfirmBody, ConfirmButtonGroup, ConfirmButton, CancelButton };
