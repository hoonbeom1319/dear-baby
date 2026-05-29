import * as React from 'react';
import { AlertCircle } from 'lucide-react';

import { cn } from '../lib/utils';
import { Label } from './label';

type FieldContextValue = {
    id: string;
    descriptionId: string;
    errorId: string;
    invalid: boolean;
};

const FieldContext = React.createContext<FieldContextValue | null>(null);

const useFieldContext = () => React.useContext(FieldContext);

type FormFieldProps = React.HTMLAttributes<HTMLDivElement> & {
    id?: string;
    invalid?: boolean;
};

const FormField = ({ id: idProp, invalid = false, className, children, ...props }: FormFieldProps) => {
    const reactId = React.useId();
    const id = idProp ?? reactId;

    const value = React.useMemo<FieldContextValue>(
        () => ({
            id,
            descriptionId: `${id}-description`,
            errorId: `${id}-error`,
            invalid
        }),
        [id, invalid]
    );

    return (
        <FieldContext.Provider value={value}>
            <div className={cn('flex flex-col gap-1.5', className)} {...props}>
                {children}
            </div>
        </FieldContext.Provider>
    );
};

const FormLabel = ({ ref, ...props }: React.ComponentPropsWithRef<typeof Label>) => {
    const ctx = useFieldContext();
    return <Label ref={ref} htmlFor={ctx?.id} {...props} />;
};

const FormControl = ({ children }: { children: React.ReactElement }) => {
    const ctx = useFieldContext();
    if (!ctx) return children;

    const describedBy = [ctx.descriptionId, ctx.invalid ? ctx.errorId : null].filter(Boolean).join(' ') || undefined;

    return React.cloneElement(children, {
        id: ctx.id,
        'aria-describedby': describedBy,
        'aria-invalid': ctx.invalid || undefined
    } as Record<string, unknown>);
};

const FormDescription = ({ className, ref, ...props }: React.ComponentPropsWithRef<'p'>) => {
    const ctx = useFieldContext();
    return <p ref={ref} id={ctx?.descriptionId} className={cn('text-muted text-xs', className)} {...props} />;
};

const FormError = ({ className, children, ref, ...props }: React.ComponentPropsWithRef<'p'>) => {
    const ctx = useFieldContext();
    if (!ctx?.invalid || !children) return null;
    return (
        <p ref={ref} id={ctx.errorId} className={cn('text-danger flex items-center gap-1 text-xs', className)} {...props}>
            <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {children}
        </p>
    );
};

export { FormField, FormLabel, FormControl, FormDescription, FormError, useFieldContext };